"""SQLite repository; schema changes are applied transactionally."""
from __future__ import annotations
from pathlib import Path
import hashlib
import json
import math
import sqlite3
import struct
from uuid import uuid4
from .models import (Agent, AgentInput, Connection, ConnectionInput, SkillPackage,
                     SkillPackageInput, Snapshot, WorkflowSlotInput, WorkflowTemplate,
                     WorkflowTemplateInput, Workspace, WorkspaceInput)

SCHEMA_VERSION = 15


class Store:
    def __init__(self, path: Path):
        self.path = path
        path.parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(path, timeout=5)
        self.db.row_factory = sqlite3.Row
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.execute("PRAGMA journal_mode=WAL")
        current = self.db.execute("PRAGMA user_version").fetchone()[0]
        if current > SCHEMA_VERSION:
            self.db.close()
            raise RuntimeError("Database belongs to a newer version of ZeroCost")
        if current == 0:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE connections (
                    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE,
                    provider TEXT NOT NULL CHECK(provider IN ('ollama','lmstudio','anthropic','gemini','openai')),
                    model_id TEXT NOT NULL
                );
                CREATE TABLE agents (
                    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, role TEXT NOT NULL,
                    connection_id TEXT NOT NULL REFERENCES connections(id) ON DELETE RESTRICT,
                    instructions TEXT NOT NULL
                );
                CREATE INDEX agents_connection ON agents(connection_id);
                CREATE TABLE workspaces (
                    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, path TEXT NOT NULL UNIQUE
                );
                PRAGMA user_version=1;
                COMMIT;
            """)

        if current < 2:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE chat_runs (
                    run_id TEXT PRIMARY KEY,
                    agent_id TEXT NOT NULL REFERENCES agents(id),
                    prompt TEXT NOT NULL, content TEXT NOT NULL DEFAULT '',
                    status TEXT NOT NULL CHECK(status IN ('running','completed','cancelled','failed','interrupted')),
                    error TEXT NOT NULL DEFAULT ''
                );
                CREATE INDEX chat_agent ON chat_runs(agent_id);
                PRAGMA user_version=2;
                COMMIT;
            """)

        if current < 3:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE agent_permissions (
                    agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
                    permission TEXT NOT NULL CHECK(permission IN ('workspace.read')),
                    PRIMARY KEY(agent_id, permission)
                );
                PRAGMA user_version=3;
                COMMIT;
            """)

        if current < 4:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE orchestration_runs (
                    run_id TEXT PRIMARY KEY,
                    objective TEXT NOT NULL,
                    rounds INTEGER NOT NULL CHECK(rounds BETWEEN 1 AND 3),
                    status TEXT NOT NULL CHECK(status IN ('running','completed','cancelled','failed','interrupted')),
                    error TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE orchestration_participants (
                    run_id TEXT NOT NULL REFERENCES orchestration_runs(run_id) ON DELETE CASCADE,
                    agent_id TEXT NOT NULL REFERENCES agents(id), position INTEGER NOT NULL,
                    PRIMARY KEY(run_id, agent_id), UNIQUE(run_id, position)
                );
                CREATE TABLE orchestration_messages (
                    run_id TEXT NOT NULL REFERENCES orchestration_runs(run_id) ON DELETE CASCADE,
                    sequence INTEGER NOT NULL, agent_id TEXT NOT NULL REFERENCES agents(id),
                    phase TEXT NOT NULL CHECK(phase IN ('analysis','review','synthesis')),
                    content TEXT NOT NULL,
                    PRIMARY KEY(run_id, sequence)
                );
                CREATE INDEX orchestration_created ON orchestration_runs(created_at);
                PRAGMA user_version=4;
                COMMIT;
            """)

        if current < 5:
            self.db.execute("PRAGMA foreign_keys=OFF")
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE orchestration_runs_v5 (
                    run_id TEXT PRIMARY KEY,
                    objective TEXT NOT NULL,
                    rounds INTEGER NOT NULL CHECK(rounds BETWEEN 1 AND 3),
                    status TEXT NOT NULL CHECK(status IN ('running','waiting_approval','completed','cancelled','failed','interrupted')),
                    error TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    routing_mode TEXT NOT NULL DEFAULT 'manual' CHECK(routing_mode IN ('manual','auto')),
                    route_reason TEXT NOT NULL DEFAULT '',
                    max_model_calls INTEGER NOT NULL DEFAULT 5 CHECK(max_model_calls BETWEEN 3 AND 13),
                    max_output_tokens INTEGER NOT NULL DEFAULT 512 CHECK(max_output_tokens BETWEEN 128 AND 4096),
                    used_model_calls INTEGER NOT NULL DEFAULT 0,
                    workspace_id TEXT REFERENCES workspaces(id),
                    context_paths TEXT NOT NULL DEFAULT '[]'
                );
                INSERT INTO orchestration_runs_v5
                    (run_id,objective,rounds,status,error,created_at)
                    SELECT run_id,objective,rounds,status,error,created_at FROM orchestration_runs;
                DROP TABLE orchestration_runs;
                ALTER TABLE orchestration_runs_v5 RENAME TO orchestration_runs;
                CREATE INDEX orchestration_created ON orchestration_runs(created_at);
                PRAGMA user_version=5;
                COMMIT;
            """)
            self.db.execute("PRAGMA foreign_keys=ON")

        if current < 6:
            with self.db:
                self.db.execute("ALTER TABLE orchestration_runs ADD COLUMN max_cost_microusd INTEGER NOT NULL DEFAULT 5000000")
                self.db.execute("ALTER TABLE orchestration_runs ADD COLUMN estimated_max_cost_microusd INTEGER NOT NULL DEFAULT 0")
                self.db.execute("ALTER TABLE orchestration_runs ADD COLUMN actual_cost_microusd INTEGER NOT NULL DEFAULT 0")
                self.db.execute("ALTER TABLE orchestration_runs ADD COLUMN input_tokens INTEGER NOT NULL DEFAULT 0")
                self.db.execute("ALTER TABLE orchestration_runs ADD COLUMN output_tokens INTEGER NOT NULL DEFAULT 0")
                self.db.execute("ALTER TABLE orchestration_runs ADD COLUMN price_catalog_version TEXT NOT NULL DEFAULT '2026-09-09'")
                self.db.execute("PRAGMA user_version=6")

        if current < 7:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE agent_permissions_v7 (
                    agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
                    permission TEXT NOT NULL CHECK(permission IN ('workspace.read','workspace.write','terminal.execute')),
                    PRIMARY KEY(agent_id, permission)
                );
                INSERT INTO agent_permissions_v7 SELECT * FROM agent_permissions;
                DROP TABLE agent_permissions;
                ALTER TABLE agent_permissions_v7 RENAME TO agent_permissions;
                ALTER TABLE orchestration_runs ADD COLUMN enabled_tools TEXT NOT NULL DEFAULT '[]';
                ALTER TABLE orchestration_runs ADD COLUMN tool_name TEXT NOT NULL DEFAULT '';
                ALTER TABLE orchestration_runs ADD COLUMN tool_request TEXT NOT NULL DEFAULT '{}';
                ALTER TABLE orchestration_runs ADD COLUMN tool_preview TEXT NOT NULL DEFAULT '';
                ALTER TABLE orchestration_runs ADD COLUMN tool_risk TEXT NOT NULL DEFAULT '';
                ALTER TABLE orchestration_runs ADD COLUMN tool_status TEXT NOT NULL DEFAULT '';
                ALTER TABLE orchestration_runs ADD COLUMN tool_result TEXT NOT NULL DEFAULT '';
                ALTER TABLE orchestration_runs ADD COLUMN event_sequence INTEGER NOT NULL DEFAULT 0;
                PRAGMA user_version=7;
                COMMIT;
            """)

        if current < 8:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE knowledge_collections (
                    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE,
                    embedding_provider TEXT NOT NULL CHECK(embedding_provider IN ('ollama')),
                    embedding_model TEXT NOT NULL,
                    dimensions INTEGER NOT NULL CHECK(dimensions BETWEEN 1 AND 8192),
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE knowledge_sources (
                    id TEXT PRIMARY KEY,
                    collection_id TEXT NOT NULL REFERENCES knowledge_collections(id) ON DELETE CASCADE,
                    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
                    path TEXT NOT NULL, content_hash TEXT NOT NULL,
                    status TEXT NOT NULL CHECK(status IN ('ready','failed')),
                    error TEXT NOT NULL DEFAULT '', indexed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(collection_id, workspace_id, path)
                );
                CREATE TABLE knowledge_chunks (
                    id TEXT PRIMARY KEY,
                    source_id TEXT NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
                    ordinal INTEGER NOT NULL, start_line INTEGER NOT NULL, end_line INTEGER NOT NULL,
                    content TEXT NOT NULL, embedding BLOB NOT NULL,
                    UNIQUE(source_id, ordinal)
                );
                CREATE INDEX knowledge_sources_collection ON knowledge_sources(collection_id);
                CREATE INDEX knowledge_chunks_source ON knowledge_chunks(source_id);
                CREATE VIRTUAL TABLE knowledge_chunks_fts USING fts5(
                    chunk_id UNINDEXED, collection_id UNINDEXED, source_path UNINDEXED,
                    content, tokenize='unicode61 remove_diacritics 2'
                );
                PRAGMA user_version=8;
                COMMIT;
            """)

        if current < 9:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                ALTER TABLE knowledge_chunks ADD COLUMN content_hash TEXT NOT NULL DEFAULT '';
                ALTER TABLE knowledge_sources ADD COLUMN index_version TEXT NOT NULL DEFAULT 'legacy-v8';
                CREATE INDEX knowledge_chunks_content_hash ON knowledge_chunks(content_hash);
                PRAGMA user_version=9;
                COMMIT;
            """)

        if current < 10:
            with self.db:
                columns = {row['name'] for row in self.db.execute(
                    "PRAGMA table_info(orchestration_runs)")}
                if 'knowledge_collection_ids' not in columns:
                    self.db.execute("""ALTER TABLE orchestration_runs ADD COLUMN
                        knowledge_collection_ids TEXT NOT NULL DEFAULT '[]'""")
                self.db.execute("PRAGMA user_version=10")

        if current < 11:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE skills (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    version TEXT NOT NULL,
                    description TEXT NOT NULL,
                    instructions TEXT NOT NULL DEFAULT '',
                    required_tools TEXT NOT NULL DEFAULT '[]',
                    required_permissions TEXT NOT NULL DEFAULT '[]',
                    provider_hint TEXT,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(name, version)
                );
                CREATE TABLE skill_assignments (
                    agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
                    skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
                    PRIMARY KEY(agent_id, skill_id)
                );
                CREATE INDEX skill_assignments_skill ON skill_assignments(skill_id);
                PRAGMA user_version=11;
                COMMIT;
            """)

        if current < 12:
            self.db.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE workflows (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    version TEXT NOT NULL,
                    description TEXT NOT NULL,
                    objective_prefix TEXT NOT NULL DEFAULT '',
                    agent_slots TEXT NOT NULL,
                    required_tools TEXT NOT NULL DEFAULT '[]',
                    rounds INTEGER NOT NULL CHECK(rounds BETWEEN 1 AND 3),
                    max_model_calls INTEGER NOT NULL CHECK(max_model_calls BETWEEN 3 AND 14),
                    max_output_tokens INTEGER NOT NULL CHECK(max_output_tokens BETWEEN 128 AND 4096),
                    max_cost_microusd INTEGER NOT NULL CHECK(max_cost_microusd BETWEEN 0 AND 1000000000),
                    archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(name, version)
                );
                ALTER TABLE orchestration_runs ADD COLUMN workflow_id TEXT
                    REFERENCES workflows(id) ON DELETE RESTRICT;
                ALTER TABLE orchestration_runs ADD COLUMN workflow_version TEXT;
                CREATE INDEX workflows_name ON workflows(name,archived,created_at);
                CREATE INDEX orchestration_workflow ON orchestration_runs(workflow_id);
                PRAGMA user_version=12;
                COMMIT;
            """)

        if current < 13:
            self.db.execute("PRAGMA foreign_keys=OFF")
            self.db.execute("PRAGMA legacy_alter_table=ON")
            self.db.executescript("""
                BEGIN IMMEDIATE;
                ALTER TABLE orchestration_runs RENAME TO orchestration_runs_v12;
                CREATE TABLE orchestration_runs (
                    run_id TEXT PRIMARY KEY, objective TEXT NOT NULL,
                    rounds INTEGER NOT NULL CHECK(rounds BETWEEN 1 AND 3),
                    status TEXT NOT NULL CHECK(status IN ('running','waiting_approval','completed','cancelled','failed','interrupted')),
                    error TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    routing_mode TEXT NOT NULL DEFAULT 'manual' CHECK(routing_mode IN ('manual','auto')),
                    route_reason TEXT NOT NULL DEFAULT '',
                    max_model_calls INTEGER NOT NULL DEFAULT 5 CHECK(max_model_calls BETWEEN 3 AND 14),
                    max_output_tokens INTEGER NOT NULL DEFAULT 512 CHECK(max_output_tokens BETWEEN 128 AND 4096),
                    used_model_calls INTEGER NOT NULL DEFAULT 0,
                    workspace_id TEXT REFERENCES workspaces(id), context_paths TEXT NOT NULL DEFAULT '[]',
                    max_cost_microusd INTEGER NOT NULL DEFAULT 5000000,
                    estimated_max_cost_microusd INTEGER NOT NULL DEFAULT 0,
                    actual_cost_microusd INTEGER NOT NULL DEFAULT 0,
                    input_tokens INTEGER NOT NULL DEFAULT 0, output_tokens INTEGER NOT NULL DEFAULT 0,
                    price_catalog_version TEXT NOT NULL DEFAULT '2026-09-09',
                    enabled_tools TEXT NOT NULL DEFAULT '[]', tool_name TEXT NOT NULL DEFAULT '',
                    tool_request TEXT NOT NULL DEFAULT '{}', tool_preview TEXT NOT NULL DEFAULT '',
                    tool_risk TEXT NOT NULL DEFAULT '', tool_status TEXT NOT NULL DEFAULT '',
                    tool_result TEXT NOT NULL DEFAULT '', event_sequence INTEGER NOT NULL DEFAULT 0,
                    knowledge_collection_ids TEXT NOT NULL DEFAULT '[]',
                    workflow_id TEXT REFERENCES workflows(id) ON DELETE RESTRICT,
                    workflow_version TEXT, attempt INTEGER NOT NULL DEFAULT 1,
                    parent_run_id TEXT
                    REFERENCES orchestration_runs(run_id) ON DELETE RESTRICT,
                    resumed_from_node TEXT NOT NULL DEFAULT '', failed_node TEXT NOT NULL DEFAULT '',
                    error_class TEXT NOT NULL DEFAULT '', tool_args_hash TEXT NOT NULL DEFAULT '',
                    tool_content_hash TEXT NOT NULL DEFAULT ''
                );
                INSERT INTO orchestration_runs
                    (run_id,objective,rounds,status,error,created_at,routing_mode,route_reason,
                     max_model_calls,max_output_tokens,used_model_calls,workspace_id,context_paths,
                     max_cost_microusd,estimated_max_cost_microusd,actual_cost_microusd,input_tokens,
                     output_tokens,price_catalog_version,enabled_tools,tool_name,tool_request,
                     tool_preview,tool_risk,tool_status,tool_result,event_sequence,
                     knowledge_collection_ids,workflow_id,workflow_version)
                    SELECT run_id,objective,rounds,status,error,created_at,routing_mode,route_reason,
                     max_model_calls,max_output_tokens,used_model_calls,workspace_id,context_paths,
                     max_cost_microusd,estimated_max_cost_microusd,actual_cost_microusd,input_tokens,
                     output_tokens,price_catalog_version,enabled_tools,tool_name,tool_request,
                     tool_preview,tool_risk,tool_status,tool_result,event_sequence,
                     knowledge_collection_ids,workflow_id,workflow_version
                    FROM orchestration_runs_v12;
                DROP TABLE orchestration_runs_v12;
                CREATE INDEX orchestration_created ON orchestration_runs(created_at);
                CREATE INDEX orchestration_workflow ON orchestration_runs(workflow_id);
                CREATE INDEX orchestration_parent ON orchestration_runs(parent_run_id,attempt);
                PRAGMA user_version=13;
                COMMIT;
            """)
            self.db.execute("PRAGMA legacy_alter_table=OFF")
            self.db.execute("PRAGMA foreign_keys=ON")

        if current < 14:
            with self.db:
                agent_columns = {row['name'] for row in self.db.execute(
                    "PRAGMA table_info(agents)")}
                if 'fallback_connection_ids' not in agent_columns:
                    self.db.execute("""ALTER TABLE agents ADD COLUMN
                        fallback_connection_ids TEXT NOT NULL DEFAULT '[]'""")
                run_columns = {row['name'] for row in self.db.execute(
                    "PRAGMA table_info(orchestration_runs)")}
                if 'fallback_chain' not in run_columns:
                    self.db.execute("""ALTER TABLE orchestration_runs ADD COLUMN
                        fallback_chain TEXT NOT NULL DEFAULT '[]'""")
                self.db.execute("""CREATE TABLE IF NOT EXISTS model_call_attempts (
                    id TEXT PRIMARY KEY,
                    run_id TEXT NOT NULL REFERENCES orchestration_runs(run_id) ON DELETE CASCADE,
                    node_name TEXT NOT NULL,
                    connection_id TEXT NOT NULL REFERENCES connections(id) ON DELETE RESTRICT,
                    attempt INTEGER NOT NULL CHECK(attempt BETWEEN 1 AND 64),
                    outcome TEXT NOT NULL CHECK(outcome IN
                        ('success','retryable','permanent','budget_exceeded','skipped')),
                    error_message TEXT NOT NULL DEFAULT '',
                    input_tokens INTEGER NOT NULL DEFAULT 0,
                    output_tokens INTEGER NOT NULL DEFAULT 0,
                    cost_microusd INTEGER NOT NULL DEFAULT 0,
                    started_at TEXT NOT NULL,
                    duration_ms INTEGER NOT NULL DEFAULT 0
                )""")
                self.db.execute("""CREATE INDEX IF NOT EXISTS model_call_attempts_run
                    ON model_call_attempts(run_id,node_name,attempt)""")
                self.db.execute("PRAGMA user_version=14")

        if current < 15:
            self.db.execute("PRAGMA foreign_keys=OFF")
            self.db.execute("PRAGMA legacy_alter_table=ON")
            self.db.executescript("""
                BEGIN IMMEDIATE;
                ALTER TABLE orchestration_runs RENAME TO orchestration_runs_v14;
                CREATE TABLE orchestration_runs (
                    run_id TEXT PRIMARY KEY, objective TEXT NOT NULL,
                    rounds INTEGER NOT NULL CHECK(rounds BETWEEN 1 AND 3),
                    status TEXT NOT NULL CHECK(status IN
                        ('queued','running','paused','waiting_approval','completed','cancelled','failed','interrupted')),
                    error TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    routing_mode TEXT NOT NULL DEFAULT 'manual' CHECK(routing_mode IN ('manual','auto')),
                    route_reason TEXT NOT NULL DEFAULT '',
                    max_model_calls INTEGER NOT NULL DEFAULT 5 CHECK(max_model_calls BETWEEN 3 AND 14),
                    max_output_tokens INTEGER NOT NULL DEFAULT 512 CHECK(max_output_tokens BETWEEN 128 AND 4096),
                    used_model_calls INTEGER NOT NULL DEFAULT 0,
                    workspace_id TEXT REFERENCES workspaces(id), context_paths TEXT NOT NULL DEFAULT '[]',
                    max_cost_microusd INTEGER NOT NULL DEFAULT 5000000,
                    estimated_max_cost_microusd INTEGER NOT NULL DEFAULT 0,
                    actual_cost_microusd INTEGER NOT NULL DEFAULT 0,
                    input_tokens INTEGER NOT NULL DEFAULT 0, output_tokens INTEGER NOT NULL DEFAULT 0,
                    price_catalog_version TEXT NOT NULL DEFAULT '2026-09-09',
                    enabled_tools TEXT NOT NULL DEFAULT '[]', tool_name TEXT NOT NULL DEFAULT '',
                    tool_request TEXT NOT NULL DEFAULT '{}', tool_preview TEXT NOT NULL DEFAULT '',
                    tool_risk TEXT NOT NULL DEFAULT '', tool_status TEXT NOT NULL DEFAULT '',
                    tool_result TEXT NOT NULL DEFAULT '', event_sequence INTEGER NOT NULL DEFAULT 0,
                    knowledge_collection_ids TEXT NOT NULL DEFAULT '[]',
                    workflow_id TEXT REFERENCES workflows(id) ON DELETE RESTRICT,
                    workflow_version TEXT, attempt INTEGER NOT NULL DEFAULT 1,
                    parent_run_id TEXT REFERENCES orchestration_runs(run_id) ON DELETE RESTRICT,
                    resumed_from_node TEXT NOT NULL DEFAULT '', failed_node TEXT NOT NULL DEFAULT '',
                    error_class TEXT NOT NULL DEFAULT '', tool_args_hash TEXT NOT NULL DEFAULT '',
                    tool_content_hash TEXT NOT NULL DEFAULT '', fallback_chain TEXT NOT NULL DEFAULT '[]',
                    queue_sequence INTEGER NOT NULL,
                    worker_id TEXT NOT NULL DEFAULT '', queued_at TEXT NOT NULL,
                    started_at TEXT, resumed_at TEXT, finished_at TEXT
                );
                INSERT INTO orchestration_runs
                    (run_id,objective,rounds,status,error,created_at,routing_mode,route_reason,
                     max_model_calls,max_output_tokens,used_model_calls,workspace_id,context_paths,
                     max_cost_microusd,estimated_max_cost_microusd,actual_cost_microusd,input_tokens,
                     output_tokens,price_catalog_version,enabled_tools,tool_name,tool_request,
                     tool_preview,tool_risk,tool_status,tool_result,event_sequence,
                     knowledge_collection_ids,workflow_id,workflow_version,attempt,parent_run_id,
                     resumed_from_node,failed_node,error_class,tool_args_hash,tool_content_hash,
                     fallback_chain,queue_sequence,queued_at,started_at,finished_at)
                    SELECT run_id,objective,rounds,status,error,created_at,routing_mode,route_reason,
                     max_model_calls,max_output_tokens,used_model_calls,workspace_id,context_paths,
                     max_cost_microusd,estimated_max_cost_microusd,actual_cost_microusd,input_tokens,
                     output_tokens,price_catalog_version,enabled_tools,tool_name,tool_request,
                     tool_preview,tool_risk,tool_status,tool_result,event_sequence,
                     knowledge_collection_ids,workflow_id,workflow_version,attempt,parent_run_id,
                     resumed_from_node,failed_node,error_class,tool_args_hash,tool_content_hash,
                     fallback_chain,rowid,created_at,created_at,
                     CASE WHEN status IN ('completed','cancelled','failed','interrupted')
                          THEN created_at ELSE NULL END
                    FROM orchestration_runs_v14;
                DROP TABLE orchestration_runs_v14;
                CREATE INDEX orchestration_created ON orchestration_runs(created_at);
                CREATE INDEX orchestration_workflow ON orchestration_runs(workflow_id);
                CREATE INDEX orchestration_parent ON orchestration_runs(parent_run_id,attempt);
                CREATE INDEX orchestration_queue ON orchestration_runs(status,resumed_at,queue_sequence);
                PRAGMA user_version=15;
                COMMIT;
            """)
            self.db.execute("PRAGMA legacy_alter_table=OFF")
            self.db.execute("PRAGMA foreign_keys=ON")

    def close(self):
        self.db.close()

    def snapshot(self) -> Snapshot:
        return Snapshot(
            database_version=self.db.execute("PRAGMA user_version").fetchone()[0],
            connections=[Connection(**dict(row)) for row in self.db.execute("SELECT * FROM connections ORDER BY rowid")],
            agents=[Agent(**{**dict(row), 'fallback_connection_ids': json.loads(
                row['fallback_connection_ids'])}, permissions=[p[0] for p in self.db.execute(
                "SELECT permission FROM agent_permissions WHERE agent_id=? ORDER BY permission", (row["id"],))],
                skill_ids=self.agent_skill_ids(row["id"]))
                    for row in self.db.execute("SELECT * FROM agents ORDER BY rowid")],
            workspaces=[Workspace(**dict(row)) for row in self.db.execute("SELECT * FROM workspaces ORDER BY rowid")],
            skills=self.all_skills(),
            workflows=self.all_workflows(),
        )

    def create_connection(self, value: ConnectionInput):
        with self.db:
            self.db.execute("INSERT INTO connections VALUES (?, ?, ?, ?)",
                            (str(uuid4()), value.name, value.provider, value.model_id))

    def create_agent(self, value: AgentInput):
        with self.db:
            self.db.execute("""INSERT INTO agents
                (id,name,role,connection_id,instructions) VALUES (?, ?, ?, ?, ?)""",
                            (str(uuid4()), value.name, value.role, value.connection_id, value.instructions))

    def set_agent_fallbacks(self, agent_id: str, connection_ids: list[str]):
        agent = self.db.execute(
            "SELECT connection_id FROM agents WHERE id=?", (agent_id,)).fetchone()
        if agent is None:
            raise ValueError("Ajan bulunamadı.")
        if agent['connection_id'] in connection_ids:
            raise ValueError("Birincil bağlantı fallback zincirinde tekrarlanamaz.")
        found = self.db.execute(
            f"SELECT id,provider FROM connections WHERE id IN ({','.join('?' for _ in connection_ids)})",
            connection_ids).fetchall() if connection_ids else []
        if len(found) != len(connection_ids):
            raise ValueError("Fallback bağlantılarından biri bulunamadı.")
        if any(item['provider'] not in ('ollama', 'anthropic', 'gemini') for item in found):
            raise ValueError("Fallback için sohbet adaptörü hazır bir bağlantı seçin.")
        with self.db:
            self.db.execute("UPDATE agents SET fallback_connection_ids=? WHERE id=?",
                            (json.dumps(connection_ids), agent_id))

    def create_workspace(self, value: WorkspaceInput):
        raw = Path(value.path).expanduser()
        if not raw.is_absolute():
            raise ValueError("Çalışma alanı için mutlak bir klasör yolu girin.")
        path = raw.resolve(strict=True)
        if not path.is_dir():
            raise ValueError("Çalışma alanı mevcut bir klasör olmalı.")
        with self.db:
            self.db.execute("INSERT INTO workspaces VALUES (?, ?, ?)", (str(uuid4()), value.name, str(path)))

    def set_agent_permissions(self, agent_id: str, permissions: list[str]):
        if not self.db.execute("SELECT 1 FROM agents WHERE id=?", (agent_id,)).fetchone():
            raise ValueError("Ajan bulunamadı.")
        with self.db:
            self.db.execute("DELETE FROM agent_permissions WHERE agent_id=?", (agent_id,))
            self.db.executemany("INSERT INTO agent_permissions VALUES (?,?)",
                                [(agent_id, permission) for permission in permissions])

    def create_skill(self, value: SkillPackageInput) -> str:
        identifier = str(uuid4())
        with self.db:
            self.db.execute("""INSERT INTO skills
                (id,name,version,description,instructions,required_tools,required_permissions,provider_hint)
                VALUES (?,?,?,?,?,?,?,?)""",
                (identifier, value.name, value.version, value.description, value.instructions,
                 json.dumps(value.required_tools), json.dumps(value.required_permissions),
                 value.provider_hint))
        return identifier

    def assign_skill(self, agent_id: str, skill_id: str):
        if not self.db.execute("SELECT 1 FROM agents WHERE id=?", (agent_id,)).fetchone():
            raise ValueError("Ajan bulunamadı.")
        skill = self.db.execute("SELECT name FROM skills WHERE id=?", (skill_id,)).fetchone()
        if not skill:
            raise ValueError("Skill paketi bulunamadı.")
        with self.db:
            current = self.db.execute("""SELECT s.id,s.name,length(s.instructions) AS instruction_size
                FROM skill_assignments sa JOIN skills s ON s.id=sa.skill_id
                WHERE sa.agent_id=?""", (agent_id,)).fetchall()
            replacing = [row['id'] for row in current if row['name'] == skill['name']]
            remaining = [row for row in current if row['id'] not in replacing]
            target_size = self.db.execute(
                "SELECT length(instructions) FROM skills WHERE id=?", (skill_id,)).fetchone()[0]
            if len(remaining) >= 8:
                raise ValueError("Bir ajana en fazla 8 skill paketi atanabilir.")
            if sum(row['instruction_size'] for row in remaining) + target_size > 24000:
                raise ValueError("Atanan skill talimatları toplam 24.000 karakter sınırını aşıyor.")
            if replacing:
                self.db.executemany(
                    "DELETE FROM skill_assignments WHERE agent_id=? AND skill_id=?",
                    [(agent_id, item) for item in replacing])
            self.db.execute("INSERT OR IGNORE INTO skill_assignments VALUES (?,?)",
                            (agent_id, skill_id))

    def unassign_skill(self, agent_id: str, skill_id: str):
        if not self.db.execute("SELECT 1 FROM agents WHERE id=?", (agent_id,)).fetchone():
            raise ValueError("Ajan bulunamadı.")
        if not self.db.execute("SELECT 1 FROM skills WHERE id=?", (skill_id,)).fetchone():
            raise ValueError("Skill paketi bulunamadı.")
        with self.db:
            self.db.execute("DELETE FROM skill_assignments WHERE agent_id=? AND skill_id=?",
                            (agent_id, skill_id))

    def agent_skill_ids(self, agent_id: str) -> list[str]:
        return [row[0] for row in self.db.execute(
            """SELECT s.id FROM skill_assignments sa JOIN skills s ON s.id=sa.skill_id
               WHERE sa.agent_id=? ORDER BY s.name,s.version,s.rowid""",
            (agent_id,))]

    def skill(self, skill_id: str) -> SkillPackage | None:
        row = self.db.execute("SELECT * FROM skills WHERE id=?", (skill_id,)).fetchone()
        if row is None:
            return None
        return SkillPackage(id=row['id'], name=row['name'], version=row['version'],
                            description=row['description'], instructions=row['instructions'],
                            required_tools=json.loads(row['required_tools']),
                            required_permissions=json.loads(row['required_permissions']),
                            provider_hint=row['provider_hint'])

    def all_skills(self) -> list[SkillPackage]:
        return [SkillPackage(id=row['id'], name=row['name'], version=row['version'],
                             description=row['description'], instructions=row['instructions'],
                             required_tools=json.loads(row['required_tools']),
                             required_permissions=json.loads(row['required_permissions']),
                             provider_hint=row['provider_hint'])
                for row in self.db.execute("SELECT * FROM skills ORDER BY created_at,rowid")]

    @staticmethod
    def _workflow_from_row(row) -> WorkflowTemplate:
        return WorkflowTemplate(
            id=row['id'], name=row['name'], version=row['version'],
            description=row['description'], objective_prefix=row['objective_prefix'],
            agent_slots=[WorkflowSlotInput(**slot) for slot in json.loads(row['agent_slots'])],
            required_tools=json.loads(row['required_tools']), rounds=row['rounds'],
            max_model_calls=row['max_model_calls'], max_output_tokens=row['max_output_tokens'],
            max_cost_microusd=row['max_cost_microusd'], archived=bool(row['archived']))

    def create_workflow(self, value: WorkflowTemplateInput) -> str:
        skill_ids = {skill_id for slot in value.agent_slots for skill_id in slot.required_skill_ids}
        if skill_ids:
            found = {row[0] for row in self.db.execute(
                f"SELECT id FROM skills WHERE id IN ({','.join('?' for _ in skill_ids)})", tuple(skill_ids))}
            if found != skill_ids:
                raise ValueError("Workflow bilinmeyen bir skill paketi içeriyor.")
        identifier = str(uuid4())
        slots = [slot.model_dump(mode='json') for slot in value.agent_slots]
        with self.db:
            self.db.execute("UPDATE workflows SET archived=1 WHERE name=?", (value.name,))
            self.db.execute("""INSERT INTO workflows
                (id,name,version,description,objective_prefix,agent_slots,required_tools,
                 rounds,max_model_calls,max_output_tokens,max_cost_microusd)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                (identifier, value.name, value.version, value.description,
                 value.objective_prefix, json.dumps(slots), json.dumps(value.required_tools),
                 value.rounds, value.max_model_calls, value.max_output_tokens,
                 value.max_cost_microusd))
        return identifier

    def archive_workflow(self, workflow_id: str):
        if not self.db.execute("SELECT 1 FROM workflows WHERE id=?", (workflow_id,)).fetchone():
            raise ValueError("Workflow bulunamadı.")
        with self.db:
            self.db.execute("UPDATE workflows SET archived=1 WHERE id=?", (workflow_id,))

    def workflow(self, workflow_id: str) -> WorkflowTemplate | None:
        row = self.db.execute("SELECT * FROM workflows WHERE id=?", (workflow_id,)).fetchone()
        return self._workflow_from_row(row) if row else None

    def all_workflows(self) -> list[WorkflowTemplate]:
        return [self._workflow_from_row(row) for row in self.db.execute(
            "SELECT * FROM workflows ORDER BY archived,name,created_at DESC,rowid DESC")]

    def agent(self, agent_id: str) -> Agent | None:
        return next((agent for agent in self.snapshot().agents if agent.id == agent_id), None)

    def workspace(self, workspace_id: str) -> Workspace | None:
        return next((workspace for workspace in self.snapshot().workspaces if workspace.id == workspace_id), None)

    def create_knowledge_collection(self, value, dimensions: int):
        identifier = str(uuid4())
        with self.db:
            self.db.execute("""INSERT INTO knowledge_collections
                (id,name,embedding_provider,embedding_model,dimensions) VALUES (?,?,?,?,?)""",
                (identifier, value.name, value.embedding_provider, value.embedding_model, dimensions))
        return identifier

    def knowledge_collection(self, collection_id: str):
        row = self.db.execute("""SELECT id,name,embedding_provider,embedding_model,dimensions
            FROM knowledge_collections WHERE id=?""", (collection_id,)).fetchone()
        return dict(row) if row else None

    def knowledge_source_hash(self, collection_id: str, workspace_id: str, path: str):
        row = self.db.execute("""SELECT content_hash,status,index_version FROM knowledge_sources
            WHERE collection_id=? AND workspace_id=? AND path=?""",
            (collection_id, workspace_id, path)).fetchone()
        return dict(row) if row else None

    def cached_chunk_embeddings(self, collection_id: str, content_hashes: list[str]):
        unique = list(dict.fromkeys(value for value in content_hashes if value))
        cached = {}
        for offset in range(0, len(unique), 500):
            batch = unique[offset:offset + 500]
            placeholders = ','.join('?' for _ in batch)
            rows = self.db.execute(f"""SELECT k.content_hash,k.embedding,c.dimensions
                FROM knowledge_chunks k
                JOIN knowledge_sources s ON s.id=k.source_id
                JOIN knowledge_collections c ON c.id=s.collection_id
                WHERE s.collection_id=? AND k.content_hash IN ({placeholders})""",
                (collection_id, *batch))
            for row in rows:
                if row['content_hash'] not in cached:
                    cached[row['content_hash']] = list(struct.unpack(
                        f"<{row['dimensions']}f", row['embedding']))
        return cached

    def knowledge_snapshot(self, embedding_models=None):
        from .models import EmbeddingModel, KnowledgeCollection, KnowledgeSnapshot
        collections = []
        for row in self.db.execute("""SELECT c.id,c.name,c.embedding_provider,
                c.embedding_model,c.dimensions,
                COUNT(DISTINCT s.id) AS source_count, COUNT(k.id) AS chunk_count
            FROM knowledge_collections c
            LEFT JOIN knowledge_sources s ON s.collection_id=c.id
            LEFT JOIN knowledge_chunks k ON k.source_id=s.id
            GROUP BY c.id ORDER BY c.created_at,c.rowid"""):
            collections.append(KnowledgeCollection(**dict(row)))
        return KnowledgeSnapshot(collections=collections,
            embedding_models=[EmbeddingModel(**item) for item in (embedding_models or [])])

    def replace_knowledge_source(self, collection_id: str, workspace_id: str, path: str,
                                 content_hash: str, chunks: list[dict],
                                 index_version: str = 'zerocost-chunk-v1'):
        collection = self.db.execute("SELECT dimensions FROM knowledge_collections WHERE id=?",
                                     (collection_id,)).fetchone()
        if collection is None or self.workspace(workspace_id) is None:
            raise ValueError('Bilgi koleksiyonu veya çalışma alanı bulunamadı.')
        dimensions = collection['dimensions']
        source_id = str(uuid4())
        prepared = []
        for ordinal, chunk in enumerate(chunks):
            vector = chunk['embedding']
            if (len(vector) != dimensions or
                    any(not math.isfinite(float(value)) for value in vector)):
                raise ValueError('Embedding boyutu koleksiyonla uyuşmuyor.')
            chunk_hash = chunk.get('content_hash') or hashlib.sha256(
                chunk['content'].encode('utf-8')).hexdigest()
            prepared.append((str(uuid4()), source_id, ordinal, int(chunk['start_line']),
                             int(chunk['end_line']), chunk['content'],
                             struct.pack(f'<{dimensions}f', *vector), chunk_hash))
        with self.db:
            old = self.db.execute("""SELECT id FROM knowledge_sources
                WHERE collection_id=? AND workspace_id=? AND path=?""",
                (collection_id, workspace_id, path)).fetchone()
            if old:
                chunk_ids = [row[0] for row in self.db.execute(
                    "SELECT id FROM knowledge_chunks WHERE source_id=?", (old['id'],))]
                self.db.executemany("DELETE FROM knowledge_chunks_fts WHERE chunk_id=?",
                                    [(identifier,) for identifier in chunk_ids])
                self.db.execute("DELETE FROM knowledge_sources WHERE id=?", (old['id'],))
            self.db.execute("""INSERT INTO knowledge_sources
                (id,collection_id,workspace_id,path,content_hash,status,index_version)
                VALUES (?,?,?,?,?,'ready',?)""",
                (source_id, collection_id, workspace_id, path, content_hash, index_version))
            self.db.executemany("""INSERT INTO knowledge_chunks
                (id,source_id,ordinal,start_line,end_line,content,embedding,content_hash)
                VALUES (?,?,?,?,?,?,?,?)""", prepared)
            self.db.executemany("""INSERT INTO knowledge_chunks_fts
                (chunk_id,collection_id,source_path,content) VALUES (?,?,?,?)""",
                [(item[0], collection_id, path, item[5]) for item in prepared])
        return source_id

    def search_knowledge_fts(self, collection_id: str, query: str, limit: int = 10):
        return [dict(row) for row in self.db.execute("""SELECT f.chunk_id,f.source_path,f.content,
                k.ordinal,k.start_line,k.end_line,s.workspace_id,c.name AS collection_name,
                bm25(knowledge_chunks_fts) AS score
            FROM knowledge_chunks_fts AS f
            JOIN knowledge_chunks AS k ON k.id=f.chunk_id
            JOIN knowledge_sources AS s ON s.id=k.source_id
            JOIN knowledge_collections AS c ON c.id=s.collection_id
            WHERE knowledge_chunks_fts MATCH ? AND f.collection_id=? ORDER BY score,f.chunk_id LIMIT ?""",
            (query, collection_id, min(max(limit, 1), 20)))]

    def knowledge_vector_rows(self, collection_id: str, maximum: int = 50_000):
        collection = self.knowledge_collection(collection_id)
        if collection is None:
            raise ValueError('Bilgi koleksiyonu bulunamadı.')
        count = self.db.execute("""SELECT COUNT(*) FROM knowledge_chunks k
            JOIN knowledge_sources s ON s.id=k.source_id WHERE s.collection_id=?""",
            (collection_id,)).fetchone()[0]
        if count > maximum:
            raise ValueError('Koleksiyon yerel vektör arama sınırını aşıyor.')
        rows = self.db.execute("""SELECT k.id AS chunk_id,k.ordinal,k.start_line,k.end_line,
                k.content,k.embedding,s.workspace_id,s.path AS source_path,c.name AS collection_name
            FROM knowledge_chunks k JOIN knowledge_sources s ON s.id=k.source_id
            JOIN knowledge_collections c ON c.id=s.collection_id
            WHERE s.collection_id=? ORDER BY k.id""", (collection_id,))
        return collection, rows

    def history(self, agent_id: str):
        from .models import ChatHistory, ChatTurn
        rows = self.db.execute("SELECT * FROM (SELECT rowid AS position, * FROM chat_runs WHERE agent_id=? ORDER BY rowid DESC LIMIT 50) ORDER BY position", (agent_id,))
        return ChatHistory(turns=[ChatTurn(**{k: row[k] for k in row.keys() if k != "position"}) for row in rows])

    def start_run(self, run_id: str, agent_id: str, prompt: str):
        with self.db:
            self.db.execute("INSERT INTO chat_runs(run_id,agent_id,prompt,status) VALUES (?,?,?,'running')", (run_id, agent_id, prompt))

    def update_run(self, run_id: str, content: str, status: str, error: str = ""):
        with self.db:
            self.db.execute("UPDATE chat_runs SET content=?,status=?,error=? WHERE run_id=?", (content, status, error, run_id))

    def recover_runs(self):
        from .workspace_tools import current_write_hash
        for row in self.db.execute("""SELECT run_id,tool_request,tool_content_hash
                FROM orchestration_runs WHERE status IN ('running','queued') AND
                tool_status='executing' AND tool_name='workspace.write'""").fetchall():
            try:
                applied = current_write_hash(self, json.loads(row['tool_request'])) == row['tool_content_hash']
            except (ValueError, KeyError, json.JSONDecodeError):
                applied = False
            if applied:
                with self.db:
                    self.db.execute("""UPDATE orchestration_runs SET status='waiting_approval',
                        tool_status='completed',error_class='uncertain_tool',
                        tool_result='Hedef içerik hash ile doğrulandı; yazma yeniden uygulanmadı.',
                        error='Yazma tamamlandı; görev checkpoint üzerinden sürdürülebilir.'
                        WHERE run_id=?""", (row['run_id'],))
        with self.db:
            self.db.execute("UPDATE chat_runs SET status='interrupted',error='Uygulama bağlantısı kesildi.' WHERE status='running'")
            self.db.execute("""UPDATE orchestration_runs SET status='waiting_approval',
                tool_status='uncertain',error_class='uncertain_tool',
                error='Araç çalıştırılırken bağlantı kesildi; sonuç belirsiz.'
                WHERE status IN ('running','queued') AND tool_status='executing'""")
            self.db.execute("""UPDATE orchestration_runs SET status='paused',worker_id='',
                error='Uygulama kapandı; görev kullanıcı tarafından sürdürülebilir.'
                WHERE status IN ('running','queued')""")

    def start_orchestration(self, run_id: str, objective: str, rounds: int, agent_ids: list[str],
                            *, routing_mode: str = 'manual', route_reason: str = '',
                            max_model_calls: int = 5, max_output_tokens: int = 512,
                            max_cost_microusd: int = 5_000_000,
                            estimated_max_cost_microusd: int = 0,
                            price_catalog_version: str = '2026-09-09', workspace_id: str | None = None,
                            context_paths: list[str] | None = None,
                            enabled_tools: list[str] | None = None,
                            knowledge_collection_ids: list[str] | None = None,
                            workflow_id: str | None = None,
                            workflow_version: str | None = None,
                            attempt: int = 1, parent_run_id: str | None = None,
                            resumed_from_node: str = '',
                            fallback_chain: list[list[str]] | None = None):
        with self.db:
            queue_sequence = self.db.execute(
                "SELECT COALESCE(MAX(queue_sequence),0)+1 FROM orchestration_runs").fetchone()[0]
            self.db.execute("""INSERT INTO orchestration_runs
                (run_id,objective,rounds,status,routing_mode,route_reason,max_model_calls,
                 max_output_tokens,workspace_id,context_paths,max_cost_microusd,
                 estimated_max_cost_microusd,price_catalog_version,enabled_tools,
                 knowledge_collection_ids,workflow_id,workflow_version,attempt,parent_run_id,
                 resumed_from_node,fallback_chain,queue_sequence,queued_at)
                VALUES (?,?,?,'queued',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)""",
                (run_id, objective, rounds, routing_mode, route_reason, max_model_calls,
                 max_output_tokens, workspace_id, json.dumps(context_paths or []), max_cost_microusd,
                 estimated_max_cost_microusd, price_catalog_version, json.dumps(enabled_tools or []),
                 json.dumps(knowledge_collection_ids or []), workflow_id, workflow_version,
                 attempt, parent_run_id, resumed_from_node, json.dumps(fallback_chain or []),
                 queue_sequence))
            self.db.executemany("INSERT INTO orchestration_participants VALUES (?,?,?)",
                                [(run_id, agent_id, position) for position, agent_id in enumerate(agent_ids)])

    def append_orchestration_message(self, run_id: str, sequence: int, agent_id: str,
                                     phase: str, content: str):
        with self.db:
            self.db.execute("INSERT INTO orchestration_messages VALUES (?,?,?,?,?)",
                            (run_id, sequence, agent_id, phase, content))

    def finish_orchestration(self, run_id: str, status: str, error: str = "",
                             error_class: str = '', failed_node: str = ''):
        with self.db:
            self.db.execute("""UPDATE orchestration_runs SET status=?,error=?,
                error_class=?,failed_node=?,worker_id='',finished_at=CURRENT_TIMESTAMP
                WHERE run_id=?""",
                (status, error, error_class, failed_node, run_id))

    def set_orchestration_status(self, run_id: str, status: str, error: str = ""):
        if status in ('completed', 'cancelled', 'failed', 'interrupted'):
            self.finish_orchestration(run_id, status, error)
            return
        with self.db:
            self.db.execute("""UPDATE orchestration_runs SET status=?,error=?,
                error_class='',failed_node='',worker_id=CASE WHEN ?='running' THEN worker_id ELSE '' END
                WHERE run_id=?""", (status, error, status, run_id))

    def enqueue_orchestration(self, run_id: str, *, resumed: bool = False):
        spec = self.orchestration_spec(run_id)
        if spec is None or spec['status'] not in ('queued', 'paused', 'waiting_approval'):
            raise ValueError('Bu görev kuyruğa alınamaz.')
        with self.db:
            self.db.execute("""UPDATE orchestration_runs SET status='queued',worker_id='',
                resumed_at=CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE resumed_at END,
                error='' WHERE run_id=?""", (1 if resumed else 0, run_id))
        return self.queue_position(run_id)

    def queue_position(self, run_id: str):
        ids = [row['run_id'] for row in self.db.execute("""SELECT run_id
            FROM orchestration_runs WHERE status='queued'
            ORDER BY CASE WHEN resumed_at IS NOT NULL THEN 0 ELSE 1 END,queue_sequence""")]
        return ids.index(run_id) + 1 if run_id in ids else None

    def queue_depth(self):
        return self.db.execute("""SELECT COUNT(*) FROM orchestration_runs
            WHERE status IN ('queued','running')""").fetchone()[0]

    def claim_next_orchestration(self, worker_id: str):
        with self.db:
            row = self.db.execute("""SELECT run_id FROM orchestration_runs
                WHERE status='queued'
                ORDER BY CASE WHEN resumed_at IS NOT NULL THEN 0 ELSE 1 END,queue_sequence
                LIMIT 1""").fetchone()
            if row is None:
                return None
            self.db.execute("""UPDATE orchestration_runs SET status='running',worker_id=?,
                started_at=COALESCE(started_at,CURRENT_TIMESTAMP) WHERE run_id=?""",
                (worker_id, row['run_id']))
        return self.orchestration_spec(row['run_id'])

    def pause_orchestrations(self, run_ids: list[str] | None = None, *, shutdown=False):
        statuses = "'queued','running','cancelled'" if shutdown else "'queued','running'"
        clauses = f"status IN ({statuses})"
        values: list[str] = []
        if run_ids is not None:
            if not run_ids:
                return
            clauses += f" AND run_id IN ({','.join('?' for _ in run_ids)})"
            values.extend(run_ids)
        with self.db:
            self.db.execute(f"""UPDATE orchestration_runs SET status='paused',worker_id='',
                error='Uygulama kapandı; görev kullanıcı tarafından sürdürülebilir.'
                WHERE {clauses}""", values)

    def increment_model_calls(self, run_id: str):
        spec = self.orchestration_spec(run_id)
        root = spec['parent_run_id'] or run_id
        used = self.db.execute("""SELECT COALESCE(SUM(used_model_calls),0) FROM orchestration_runs
            WHERE run_id=? OR parent_run_id=?""", (root, root)).fetchone()[0]
        if used >= spec['max_model_calls']:
            raise ValueError('Model çağrısı aile bütçesi tükendi.')
        with self.db:
            self.db.execute("UPDATE orchestration_runs SET used_model_calls=used_model_calls+1 WHERE run_id=?",
                            (run_id,))

    def record_usage(self, run_id: str, input_tokens: int, output_tokens: int, cost: int):
        with self.db:
            self.db.execute("""UPDATE orchestration_runs SET
                input_tokens=input_tokens+?, output_tokens=output_tokens+?,
                actual_cost_microusd=actual_cost_microusd+? WHERE run_id=?""",
                (input_tokens, output_tokens, cost, run_id))
        spec = self.orchestration_spec(run_id)
        root = spec['parent_run_id'] or run_id
        row = self.db.execute("""SELECT COALESCE(SUM(input_tokens),0) AS input_tokens,
            COALESCE(SUM(output_tokens),0) AS output_tokens,
            COALESCE(SUM(actual_cost_microusd),0) AS actual_cost_microusd
            FROM orchestration_runs WHERE run_id=? OR parent_run_id=?""", (root, root)).fetchone()
        return dict(row)

    def family_usage(self, run_id: str):
        spec = self.orchestration_spec(run_id)
        root = spec['parent_run_id'] or run_id
        row = self.db.execute("""SELECT COALESCE(SUM(used_model_calls),0) AS calls,
            COALESCE(SUM(actual_cost_microusd),0) AS cost,
            COALESCE(SUM(input_tokens),0) AS input_tokens,
            COALESCE(SUM(output_tokens),0) AS output_tokens FROM orchestration_runs
            WHERE run_id=? OR parent_run_id=?""", (root, root)).fetchone()
        return dict(row)

    def record_model_call(self, run_id: str, node_name: str, connection_id: str,
                          attempt: int, outcome: str, error_message: str,
                          input_tokens: int, output_tokens: int, cost: int,
                          started_at: str, duration_ms: int):
        with self.db:
            self.db.execute("""INSERT INTO model_call_attempts
                (id,run_id,node_name,connection_id,attempt,outcome,error_message,
                 input_tokens,output_tokens,cost_microusd,started_at,duration_ms)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (str(uuid4()), run_id, node_name, connection_id, attempt, outcome,
                 error_message[:1000], input_tokens, output_tokens, cost,
                 started_at, max(0, duration_ms)))
            if input_tokens or output_tokens or cost:
                self.db.execute("""UPDATE orchestration_runs SET
                    input_tokens=input_tokens+?, output_tokens=output_tokens+?,
                    actual_cost_microusd=actual_cost_microusd+? WHERE run_id=?""",
                    (input_tokens, output_tokens, cost, run_id))
        family = self.family_usage(run_id)
        return {'input_tokens': family['input_tokens'],
                'output_tokens': family['output_tokens'],
                'actual_cost_microusd': family['cost']}

    def set_tool_action(self, run_id: str, proposal: dict, status: str = 'waiting', result: str = ''):
        public = {key: proposal.get(key) for key in (
            'tool', 'path', 'command', 'cwd', 'workspace_id', 'agent_id',
            'collection_id', 'query', 'limit')}
        canonical = json.dumps(public, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
        args_hash = hashlib.sha256(canonical.encode('utf-8')).hexdigest()
        content_hash = (hashlib.sha256(proposal['content'].encode('utf-8')).hexdigest()
                        if proposal['tool'] == 'workspace.write' else '')
        with self.db:
            self.db.execute("""UPDATE orchestration_runs SET tool_name=?,tool_request=?,
                tool_preview=?,tool_risk=?,tool_status=?,tool_result=?,tool_args_hash=?,
                tool_content_hash=? WHERE run_id=?""",
                (proposal['tool'], json.dumps(public), proposal['preview'], proposal['risk'],
                 status, result, args_hash, content_hash, run_id))

    def update_tool_action(self, run_id: str, status: str, result: str = ''):
        with self.db:
            self.db.execute("UPDATE orchestration_runs SET tool_status=?,tool_result=? WHERE run_id=?",
                            (status, result[:65536], run_id))

    def tool_status(self, run_id: str):
        row = self.db.execute("""SELECT tool_status,tool_result,tool_content_hash
            FROM orchestration_runs WHERE run_id=?""", (run_id,)).fetchone()
        return dict(row) if row else None

    def retry_source(self, run_id: str):
        spec = self.orchestration_spec(run_id)
        if spec is None or spec['status'] != 'failed' or spec['error_class'] != 'retryable':
            raise ValueError('Yalnız yeniden denenebilir başarısız görev sürdürülebilir.')
        return spec

    def create_retry(self, source_run_id: str, new_run_id: str):
        source = self.retry_source(source_run_id)
        root = source['parent_run_id'] or source_run_id
        family = self.db.execute("""SELECT COALESCE(SUM(used_model_calls),0) AS calls,
            COALESCE(SUM(actual_cost_microusd),0) AS cost FROM orchestration_runs
            WHERE run_id=? OR parent_run_id=?""", (root, root)).fetchone()
        if family['calls'] >= source['max_model_calls']:
            raise ValueError('Model çağrısı aile bütçesi tükendi.')
        if family['cost'] >= source['max_cost_microusd']:
            raise ValueError('Maliyet aile bütçesi tükendi.')
        attempt = self.db.execute("""SELECT COALESCE(MAX(attempt),0)+1 FROM orchestration_runs
            WHERE run_id=? OR parent_run_id=?""", (root, root)).fetchone()[0]
        self.start_orchestration(
            new_run_id, source['objective'], source['rounds'], source['agent_ids'],
            routing_mode=source['routing_mode'], route_reason='Checkpoint üzerinden kullanıcı yeniden denemesi.',
            max_model_calls=source['max_model_calls'], max_output_tokens=source['max_output_tokens'],
            max_cost_microusd=source['max_cost_microusd'],
            estimated_max_cost_microusd=source['estimated_max_cost_microusd'],
            price_catalog_version=source['price_catalog_version'], workspace_id=source['workspace_id'],
            context_paths=source['context_paths'], enabled_tools=source['enabled_tools'],
            knowledge_collection_ids=source['knowledge_collection_ids'],
            workflow_id=source['workflow_id'], workflow_version=source['workflow_version'],
            attempt=attempt, parent_run_id=root, resumed_from_node=source['failed_node'],
            fallback_chain=source['fallback_chain'])
        return self.orchestration_spec(new_run_id), root

    def set_event_sequence(self, run_id: str, sequence: int):
        with self.db:
            self.db.execute("UPDATE orchestration_runs SET event_sequence=? WHERE run_id=?",
                            (sequence, run_id))

    def orchestration_spec(self, run_id: str):
        row = self.db.execute("SELECT * FROM orchestration_runs WHERE run_id=?", (run_id,)).fetchone()
        if row is None:
            return None
        agent_ids = [item[0] for item in self.db.execute(
            "SELECT agent_id FROM orchestration_participants WHERE run_id=? ORDER BY position", (run_id,))]
        return {**dict(row), 'agent_ids': agent_ids, 'context_paths': json.loads(row['context_paths']),
                'enabled_tools': json.loads(row['enabled_tools']),
                'knowledge_collection_ids': json.loads(row['knowledge_collection_ids']),
                'fallback_chain': json.loads(row['fallback_chain'])}

    def waiting_orchestration(self):
        row = self.db.execute("""SELECT run_id FROM orchestration_runs
            WHERE status='waiting_approval' ORDER BY created_at DESC,rowid DESC LIMIT 1""").fetchone()
        return row['run_id'] if row else None

    def orchestration_history(self):
        from .models import (ModelCallAttempt, OrchestrationHistory, OrchestrationMessage,
                             OrchestrationRun, ToolAction)
        runs = []
        rows = self.db.execute("SELECT * FROM orchestration_runs ORDER BY created_at DESC,rowid DESC LIMIT 100")
        for row in rows:
            agent_ids = [item[0] for item in self.db.execute(
                "SELECT agent_id FROM orchestration_participants WHERE run_id=? ORDER BY position", (row['run_id'],))]
            messages = [OrchestrationMessage(**dict(item)) for item in self.db.execute(
                "SELECT sequence,agent_id,phase,content FROM orchestration_messages WHERE run_id=? ORDER BY sequence",
                (row['run_id'],))]
            tool_action = None
            if row['tool_name']:
                request = json.loads(row['tool_request'])
                tool_action = ToolAction(tool=row['tool_name'], path=request.get('path') or '',
                    command=request.get('command') or [], preview=row['tool_preview'],
                    collection_id=request.get('collection_id') or '', query=request.get('query') or '',
                    limit=request.get('limit') or 5, risk=row['tool_risk'],
                    status=row['tool_status'], result=row['tool_result'],
                    args_hash=row['tool_args_hash'], content_hash=row['tool_content_hash'])
            root = row['parent_run_id'] or row['run_id']
            cumulative = self.db.execute("""SELECT COALESCE(SUM(used_model_calls),0),
                COALESCE(SUM(actual_cost_microusd),0) FROM orchestration_runs
                WHERE run_id=? OR parent_run_id=?""", (root, root)).fetchone()
            attempts = [ModelCallAttempt(**dict(item)) for item in self.db.execute(
                """SELECT * FROM model_call_attempts WHERE run_id=?
                ORDER BY started_at,rowid""", (row['run_id'],))]
            queue_position = self.queue_position(row['run_id'])
            runs.append(OrchestrationRun(run_id=row['run_id'], objective=row['objective'], rounds=row['rounds'],
                                         status=row['status'], error=row['error'], agent_ids=agent_ids,
                                         routing_mode=row['routing_mode'], route_reason=row['route_reason'],
                                         max_model_calls=row['max_model_calls'],
                                         max_output_tokens=row['max_output_tokens'],
                                         used_model_calls=row['used_model_calls'],
                                         max_cost_microusd=row['max_cost_microusd'],
                                         estimated_max_cost_microusd=row['estimated_max_cost_microusd'],
                                         actual_cost_microusd=row['actual_cost_microusd'],
                                         input_tokens=row['input_tokens'], output_tokens=row['output_tokens'],
                                         price_catalog_version=row['price_catalog_version'],
                                         workspace_id=row['workspace_id'],
                                         context_paths=json.loads(row['context_paths']),
                                         enabled_tools=json.loads(row['enabled_tools']),
                                         knowledge_collection_ids=json.loads(row['knowledge_collection_ids']),
                                         workflow_id=row['workflow_id'],
                                         workflow_version=row['workflow_version'],
                                         attempt=row['attempt'], parent_run_id=row['parent_run_id'],
                                         resumed_from_node=row['resumed_from_node'],
                                         failed_node=row['failed_node'], error_class=row['error_class'],
                                         cumulative_model_calls=cumulative[0],
                                         cumulative_cost_microusd=cumulative[1],
                                         fallback_chain=json.loads(row['fallback_chain']),
                                         model_call_attempts=attempts,
                                         queue_sequence=row['queue_sequence'],
                                         queue_position=queue_position,
                                         worker_id=row['worker_id'], queued_at=row['queued_at'],
                                         started_at=row['started_at'], resumed_at=row['resumed_at'],
                                         finished_at=row['finished_at'],
                                         tool_action=tool_action, messages=messages))
        return OrchestrationHistory(runs=runs)
