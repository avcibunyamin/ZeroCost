"""SQLite repository; schema changes are applied transactionally."""
from __future__ import annotations
from pathlib import Path
import hashlib
import json
import math
import sqlite3
import struct
from uuid import uuid4
from .models import Agent, AgentInput, Connection, ConnectionInput, Snapshot, Workspace, WorkspaceInput

SCHEMA_VERSION = 9


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

    def close(self):
        self.db.close()

    def snapshot(self) -> Snapshot:
        return Snapshot(
            database_version=self.db.execute("PRAGMA user_version").fetchone()[0],
            connections=[Connection(**dict(row)) for row in self.db.execute("SELECT * FROM connections ORDER BY rowid")],
            agents=[Agent(**dict(row), permissions=[p[0] for p in self.db.execute(
                "SELECT permission FROM agent_permissions WHERE agent_id=? ORDER BY permission", (row["id"],))])
                    for row in self.db.execute("SELECT * FROM agents ORDER BY rowid")],
            workspaces=[Workspace(**dict(row)) for row in self.db.execute("SELECT * FROM workspaces ORDER BY rowid")],
        )

    def create_connection(self, value: ConnectionInput):
        with self.db:
            self.db.execute("INSERT INTO connections VALUES (?, ?, ?, ?)",
                            (str(uuid4()), value.name, value.provider, value.model_id))

    def create_agent(self, value: AgentInput):
        with self.db:
            self.db.execute("INSERT INTO agents VALUES (?, ?, ?, ?, ?)",
                            (str(uuid4()), value.name, value.role, value.connection_id, value.instructions))

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
        return [dict(row) for row in self.db.execute("""SELECT chunk_id,source_path,content,
                bm25(knowledge_chunks_fts) AS score FROM knowledge_chunks_fts
            WHERE knowledge_chunks_fts MATCH ? AND collection_id=? ORDER BY score LIMIT ?""",
            (query, collection_id, min(max(limit, 1), 20)))]

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
        with self.db:
            self.db.execute("UPDATE chat_runs SET status='interrupted',error='Uygulama bağlantısı kesildi.' WHERE status='running'")
            self.db.execute("UPDATE orchestration_runs SET status='interrupted',error='Uygulama bağlantısı kesildi.' WHERE status='running'")

    def start_orchestration(self, run_id: str, objective: str, rounds: int, agent_ids: list[str],
                            *, routing_mode: str = 'manual', route_reason: str = '',
                            max_model_calls: int = 5, max_output_tokens: int = 512,
                            max_cost_microusd: int = 5_000_000,
                            estimated_max_cost_microusd: int = 0,
                            price_catalog_version: str = '2026-09-09', workspace_id: str | None = None,
                            context_paths: list[str] | None = None,
                            enabled_tools: list[str] | None = None):
        with self.db:
            self.db.execute("""INSERT INTO orchestration_runs
                (run_id,objective,rounds,status,routing_mode,route_reason,max_model_calls,
                 max_output_tokens,workspace_id,context_paths,max_cost_microusd,
                 estimated_max_cost_microusd,price_catalog_version,enabled_tools)
                VALUES (?,?,?,'running',?,?,?,?,?,?,?,?,?,?)""",
                (run_id, objective, rounds, routing_mode, route_reason, max_model_calls,
                 max_output_tokens, workspace_id, json.dumps(context_paths or []), max_cost_microusd,
                 estimated_max_cost_microusd, price_catalog_version, json.dumps(enabled_tools or [])))
            self.db.executemany("INSERT INTO orchestration_participants VALUES (?,?,?)",
                                [(run_id, agent_id, position) for position, agent_id in enumerate(agent_ids)])

    def append_orchestration_message(self, run_id: str, sequence: int, agent_id: str,
                                     phase: str, content: str):
        with self.db:
            self.db.execute("INSERT INTO orchestration_messages VALUES (?,?,?,?,?)",
                            (run_id, sequence, agent_id, phase, content))

    def finish_orchestration(self, run_id: str, status: str, error: str = ""):
        with self.db:
            self.db.execute("UPDATE orchestration_runs SET status=?,error=? WHERE run_id=?",
                            (status, error, run_id))

    def set_orchestration_status(self, run_id: str, status: str, error: str = ""):
        self.finish_orchestration(run_id, status, error)

    def increment_model_calls(self, run_id: str):
        with self.db:
            self.db.execute("UPDATE orchestration_runs SET used_model_calls=used_model_calls+1 WHERE run_id=?",
                            (run_id,))

    def record_usage(self, run_id: str, input_tokens: int, output_tokens: int, cost: int):
        with self.db:
            self.db.execute("""UPDATE orchestration_runs SET
                input_tokens=input_tokens+?, output_tokens=output_tokens+?,
                actual_cost_microusd=actual_cost_microusd+? WHERE run_id=?""",
                (input_tokens, output_tokens, cost, run_id))
        row = self.db.execute("""SELECT input_tokens,output_tokens,actual_cost_microusd
            FROM orchestration_runs WHERE run_id=?""", (run_id,)).fetchone()
        return dict(row)

    def set_tool_action(self, run_id: str, proposal: dict, status: str = 'waiting', result: str = ''):
        public = {key: proposal.get(key) for key in ('tool', 'path', 'command', 'cwd', 'workspace_id', 'agent_id')}
        with self.db:
            self.db.execute("""UPDATE orchestration_runs SET tool_name=?,tool_request=?,
                tool_preview=?,tool_risk=?,tool_status=?,tool_result=? WHERE run_id=?""",
                (proposal['tool'], json.dumps(public), proposal['preview'], proposal['risk'],
                 status, result, run_id))

    def update_tool_action(self, run_id: str, status: str, result: str = ''):
        with self.db:
            self.db.execute("UPDATE orchestration_runs SET tool_status=?,tool_result=? WHERE run_id=?",
                            (status, result[:65536], run_id))

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
                'enabled_tools': json.loads(row['enabled_tools'])}

    def waiting_orchestration(self):
        row = self.db.execute("""SELECT run_id FROM orchestration_runs
            WHERE status='waiting_approval' ORDER BY created_at DESC,rowid DESC LIMIT 1""").fetchone()
        return row['run_id'] if row else None

    def orchestration_history(self):
        from .models import OrchestrationHistory, OrchestrationMessage, OrchestrationRun, ToolAction
        runs = []
        rows = self.db.execute("SELECT * FROM orchestration_runs ORDER BY created_at DESC,rowid DESC LIMIT 20")
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
                    risk=row['tool_risk'], status=row['tool_status'], result=row['tool_result'])
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
                                         tool_action=tool_action, messages=messages))
        return OrchestrationHistory(runs=runs)
