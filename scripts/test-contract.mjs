import test from "node:test";
import assert from "node:assert/strict";
import validate from "../src/generated/validate-response.js";
import validateEvent from "../src/generated/validate-event.js";
test("vault response exposes presence only", () => {
  const response = {
    protocol_version: 1,
    request_id: "vault",
    ok: true,
    result: { connection_id: "one", has_key: true },
  };
  assert.equal(validate(response), true);
  assert.equal(
    validate({
      ...response,
      result: { ...response.result, secret: "forbidden" },
    }),
    false,
  );
});
test("orchestration and workspace responses are closed", () => {
  const history = {
    protocol_version: 1,
    request_id: "team",
    ok: true,
    result: {
      runs: [{
        run_id: "run", objective: "decide", agent_ids: ["a", "b"], rounds: 1,
        routing_mode: "manual", route_reason: "Manuel sıra korundu.",
        max_model_calls: 5, max_output_tokens: 512, used_model_calls: 3,
        max_cost_microusd: 5000000, estimated_max_cost_microusd: 0,
        actual_cost_microusd: 0, input_tokens: 0, output_tokens: 0,
        price_catalog_version: "2026-09-09",
        workspace_id: null, context_paths: [], enabled_tools: [], knowledge_collection_ids: [],
        tool_action: null,
        status: "completed", error: "", messages: [
          { sequence: 1, agent_id: "a", phase: "analysis", content: "view" },
        ],
      }],
    },
  };
  assert.equal(validate(history), true);
  assert.equal(validate({ ...history, result: { ...history.result, secret: "forbidden" } }), false);
  const file = { protocol_version: 1, request_id: "read", ok: true,
    result: { workspace_id: "w", path: "README.md", content: "text", size: 4 } };
  assert.equal(validate(file), true);
});

test("pricing catalog response is typed and closed", () => {
  const response = {
    protocol_version: 1,
    request_id: "prices",
    ok: true,
    result: {
      version: "2026-09-09",
      currency: "USD",
      sources: { gemini: "https://ai.google.dev/gemini-api/docs/pricing" },
      entries: [{ provider: "gemini", model_pattern: "gemini-2-5-flash",
        input_per_million_usd: 0.3, output_per_million_usd: 2.5 }],
    },
  };
  assert.equal(validate(response), true);
  assert.equal(validate({ ...response, result: { ...response.result, secret: "x" } }), false);
});

test("knowledge snapshot is typed and closed", () => {
  const response = {
    protocol_version: 1, request_id: "knowledge", ok: true,
    result: {
      collections: [{ id: "c", name: "Docs", embedding_provider: "ollama",
        embedding_model: "nomic-embed-text:latest", dimensions: 768,
        source_count: 0, chunk_count: 0 }],
      embedding_models: [{ name: "nomic-embed-text:latest", size: 100 }],
      embedding_error: "",
    },
  };
  assert.equal(validate(response), true);
  assert.equal(validate({ ...response, result: { ...response.result, vector: [1, 2] } }), false);
});

test("knowledge ingestion result is typed and closed", () => {
  const response = {
    protocol_version: 1, request_id: "ingest", ok: true,
    result: {
      collection_id: "c", workspace_id: "w", path: "docs/guide.md",
      status: "indexed", chunk_count: 3, embedded_count: 2, reused_count: 1,
    },
  };
  assert.equal(validate(response), true);
  assert.equal(validate({ ...response, result: { ...response.result, status: "running" } }), false);
  assert.equal(validate({ ...response, result: { ...response.result, content: "secret" } }), false);
});

test("knowledge search result preserves closed citation metadata", () => {
  const response = {
    protocol_version: 1, request_id: "search", ok: true,
    result: { collection_id: "c", query: "IPC güvenliği", hits: [{
      chunk_id: "chunk", collection_id: "c", collection_name: "Docs",
      workspace_id: "w", source_path: "docs/guide.md", ordinal: 0,
      start_line: 4, end_line: 8, content: "kanıt", rrf_score: 0.032,
      fts_rank: 1, vector_rank: 1, cosine_similarity: 0.98,
    }] },
  };
  assert.equal(validate(response), true);
  assert.equal(validate({ ...response, result: { ...response.result,
    hits: [{ ...response.result.hits[0], instruction: "forbidden" }] } }), false);
});

test("orchestration stream attributes every chunk", () => {
  const chunk = { protocol_version: 1, type: "orchestration_chunk", run_id: "run",
    sequence: 1, agent_id: "a", phase: "analysis", token: "x", is_final: false };
  assert.equal(validateEvent(chunk), true);
  const { agent_id: _removed, ...invalid } = chunk;
  assert.equal(validateEvent(invalid), false);
  assert.equal(validateEvent({ protocol_version: 1, type: "orchestration_end", run_id: "run",
    sequence: 2, status: "completed", is_final: true }), true);
  assert.equal(validateEvent({ protocol_version: 1, type: "orchestration_approval_required",
    run_id: "run", sequence: 2, permission: "workspace.read", workspace_id: "w",
    paths: ["README.md"], tool: null, path: "", command: [], preview: "", risk: null,
    is_final: false }), true);
  assert.equal(validateEvent({ protocol_version: 1, type: "orchestration_tool_result",
    run_id: "run", sequence: 3, tool: "workspace.write", status: "completed",
    result: "written", is_final: false }), true);
});

test("knowledge progress is correlated, bounded and closed", () => {
  const progress = {
    protocol_version: 1, type: "knowledge_ingestion_progress",
    request_id: "ingest", sequence: 4, collection_id: "c", workspace_id: "w",
    path: "docs/guide.md", stage: "embedding", completed_units: 12,
    total_units: 20, progress_percent: 70, message: "12/20 yeni parça embed edildi.",
    is_final: false,
  };
  assert.equal(validateEvent(progress), true);
  assert.equal(validateEvent({ ...progress, progress_percent: 101 }), false);
  assert.equal(validateEvent({ ...progress, completed_units: -1 }), false);
  assert.equal(validateEvent({ ...progress, secret: "forbidden" }), false);
});
const valid = {
  protocol_version: 1,
  request_id: "test",
  ok: true,
  result: {
    app_version: "0.1.0",
    protocol_version: 1,
    database_version: 1,
    connections: [],
    agents: [],
    workspaces: [],
    skills: [],
  },
};
test("generated validator accepts complete responses", () =>
  assert.equal(validate(valid), true));
test("skill manifests and assignments are typed and closed", () => {
  const response = {
    ...valid,
    result: {
      ...valid.result,
      connections: [{ id: "c", name: "Local", provider: "ollama",
        model_id: "qwen", status: "unconfigured" }],
      agents: [{ id: "a", name: "Reviewer", role: "review", connection_id: "c",
        instructions: "", permissions: ["workspace.read"], skill_ids: ["s"] }],
      skills: [{ id: "s", name: "Code review", version: "1.2.0",
        description: "Review changes", instructions: "Check correctness.",
        required_tools: ["knowledge.search"],
        required_permissions: ["workspace.read"], provider_hint: "ollama" }],
    },
  };
  assert.equal(validate(response), true);
  assert.equal(validate({ ...response, result: { ...response.result,
    skills: [{ ...response.result.skills[0], secret: "forbidden" }] } }), false);
});
test("generated validator rejects missing discriminant and incorrect payloads", () => {
  const { ok, ...missing } = valid;
  assert.equal(validate(missing), false);
  assert.equal(validate({ ...valid, protocol_version: 2 }), false);
  assert.equal(
    validate({ ...valid, result: { ...valid.result, agents: "invalid" } }),
    false,
  );
  assert.equal(validate({ ...valid, secret: "must not be reflected" }), false);
});
test("error response is structured and closed", () => {
  assert.equal(
    validate({
      protocol_version: 1,
      request_id: "test",
      ok: false,
      code: "invalid_request",
      message: "Bad request",
    }),
    true,
  );
  assert.equal(
    validate({
      protocol_version: 1,
      request_id: "test",
      ok: false,
      code: "unknown",
      message: "Bad request",
    }),
    false,
  );
});
test("stream envelopes enforce sequence and terminal fields", () => {
  assert.equal(
    validateEvent({
      protocol_version: 1,
      type: "stream_chunk",
      run_id: "r",
      sequence: 1,
      token: "mer",
      is_final: false,
    }),
    true,
  );
  assert.equal(
    validateEvent({
      protocol_version: 1,
      type: "stream_end",
      run_id: "r",
      sequence: 2,
      full_content: "mer",
      status: "completed",
      is_final: true,
    }),
    true,
  );
  assert.equal(
    validateEvent({
      protocol_version: 1,
      type: "stream_chunk",
      run_id: "r",
      sequence: 1,
      token: "mer",
      is_final: true,
    }),
    false,
  );
  assert.equal(
    validateEvent({
      protocol_version: 1,
      type: "stream_end",
      run_id: "r",
      sequence: 2,
      token: "wrong",
      is_final: true,
    }),
    false,
  );
});
