var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// validate-event.js
var validate = validate10;
var validate_event_default = validate10;
var schema13 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "stream_end", "default": "stream_end", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "full_content": { "title": "Full Content", "type": "string" }, "status": { "enum": ["completed", "cancelled"], "title": "Status", "type": "string" }, "is_final": { "const": true, "default": true, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "full_content", "status", "is_final"], "title": "StreamEnd", "type": "object" };
var schema16 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_chunk", "default": "orchestration_chunk", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "token": { "title": "Token", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_id", "phase", "token", "is_final"], "title": "OrchestrationChunk", "type": "object" };
var schema17 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_message_end", "default": "orchestration_message_end", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "full_content": { "title": "Full Content", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_id", "phase", "full_content", "is_final"], "title": "OrchestrationMessageEnd", "type": "object" };
var schema18 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_end", "default": "orchestration_end", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "status": { "enum": ["completed", "cancelled"], "title": "Status", "type": "string" }, "is_final": { "const": true, "default": true, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "status", "is_final"], "title": "OrchestrationEnd", "type": "object" };
var schema19 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_error", "default": "orchestration_error", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "message": { "title": "Message", "type": "string" }, "error_class": { "default": "permanent", "enum": ["retryable", "permanent"], "title": "Error Class", "type": "string" }, "failed_node": { "default": "", "title": "Failed Node", "type": "string" }, "is_final": { "const": true, "default": true, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "message", "error_class", "failed_node", "is_final"], "title": "OrchestrationError", "type": "object" };
var schema20 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_route", "default": "orchestration_route", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_ids": { "items": { "type": "string" }, "title": "Agent Ids", "type": "array" }, "reason": { "title": "Reason", "type": "string" }, "planned_model_calls": { "title": "Planned Model Calls", "type": "integer" }, "max_model_calls": { "title": "Max Model Calls", "type": "integer" }, "max_output_tokens": { "title": "Max Output Tokens", "type": "integer" }, "estimated_max_cost_microusd": { "title": "Estimated Max Cost Microusd", "type": "integer" }, "max_cost_microusd": { "title": "Max Cost Microusd", "type": "integer" }, "price_catalog_version": { "title": "Price Catalog Version", "type": "string" }, "pricing_warning": { "default": "", "title": "Pricing Warning", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_ids", "reason", "planned_model_calls", "max_model_calls", "max_output_tokens", "estimated_max_cost_microusd", "max_cost_microusd", "price_catalog_version", "pricing_warning", "is_final"], "title": "OrchestrationRoute", "type": "object" };
var schema21 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_approval_required", "default": "orchestration_approval_required", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "permission": { "enum": ["workspace.read", "workspace.write", "terminal.execute"], "title": "Permission", "type": "string" }, "workspace_id": { "title": "Workspace Id", "type": "string" }, "paths": { "items": { "type": "string" }, "title": "Paths", "type": "array" }, "tool": { "anyOf": [{ "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "type": "string" }, { "type": "null" }], "default": null, "title": "Tool" }, "path": { "default": "", "title": "Path", "type": "string" }, "command": { "items": { "type": "string" }, "title": "Command", "type": "array" }, "preview": { "default": "", "title": "Preview", "type": "string" }, "risk": { "anyOf": [{ "enum": ["medium", "high"], "type": "string" }, { "type": "null" }], "default": null, "title": "Risk" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "permission", "workspace_id", "paths", "tool", "path", "command", "preview", "risk", "is_final"], "title": "OrchestrationApprovalRequired", "type": "object" };
var schema23 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_tool_result", "default": "orchestration_tool_result", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "tool": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "title": "Tool", "type": "string" }, "status": { "enum": ["completed", "failed"], "title": "Status", "type": "string" }, "result": { "title": "Result", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "tool", "status", "result", "is_final"], "title": "OrchestrationToolResult", "type": "object" };
var schema24 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_retrying", "default": "orchestration_retrying", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "attempt": { "maximum": 3, "minimum": 2, "title": "Attempt", "type": "integer" }, "message": { "title": "Message", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_id", "phase", "attempt", "message", "is_final"], "title": "OrchestrationRetrying", "type": "object" };
var schema25 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_fallback", "default": "orchestration_fallback", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "from_connection_id": { "title": "From Connection Id", "type": "string" }, "to_connection_id": { "title": "To Connection Id", "type": "string" }, "message": { "title": "Message", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_id", "phase", "from_connection_id", "to_connection_id", "message", "is_final"], "title": "OrchestrationFallback", "type": "object" };
var schema29 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "knowledge_ingestion_progress", "default": "knowledge_ingestion_progress", "title": "Type", "type": "string" }, "request_id": { "maxLength": 128, "minLength": 1, "title": "Request Id", "type": "string" }, "sequence": { "minimum": 1, "title": "Sequence", "type": "integer" }, "collection_id": { "title": "Collection Id", "type": "string" }, "workspace_id": { "title": "Workspace Id", "type": "string" }, "path": { "maxLength": 4096, "title": "Path", "type": "string" }, "stage": { "enum": ["reading", "parsing", "chunking", "embedding", "committing", "completed"], "title": "Stage", "type": "string" }, "completed_units": { "minimum": 0, "title": "Completed Units", "type": "integer" }, "total_units": { "minimum": 0, "title": "Total Units", "type": "integer" }, "progress_percent": { "maximum": 100, "minimum": 0, "title": "Progress Percent", "type": "integer" }, "message": { "maxLength": 240, "minLength": 1, "title": "Message", "type": "string" }, "is_final": { "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "request_id", "sequence", "collection_id", "workspace_id", "path", "stage", "completed_units", "total_units", "progress_percent", "message", "is_final"], "title": "KnowledgeIngestionProgress", "type": "object" };
var func2 = Object.prototype.hasOwnProperty;
var func7 = require_ucs2length().default;
function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  const _errs1 = errors;
  const _errs2 = errors;
  if (errors === _errs2) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.protocol_version === void 0 && (missing0 = "protocol_version") || data.type === void 0 && (missing0 = "type") || data.run_id === void 0 && (missing0 = "run_id") || data.sequence === void 0 && (missing0 = "sequence") || data.token === void 0 && (missing0 = "token") || data.is_final === void 0 && (missing0 = "is_final")) {
        const err0 = { instancePath, schemaPath: "#/$defs/StreamChunk/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        const _errs4 = errors;
        for (const key0 in data) {
          if (!(key0 === "protocol_version" || key0 === "type" || key0 === "run_id" || key0 === "sequence" || key0 === "token" || key0 === "is_final")) {
            const err1 = { instancePath, schemaPath: "#/$defs/StreamChunk/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
            break;
          }
        }
        if (_errs4 === errors) {
          if (data.protocol_version !== void 0) {
            let data0 = data.protocol_version;
            const _errs5 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)))) {
              const err2 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/StreamChunk/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            if (1 !== data0) {
              const err3 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/StreamChunk/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
              if (vErrors === null) {
                vErrors = [err3];
              } else {
                vErrors.push(err3);
              }
              errors++;
            }
            var valid2 = _errs5 === errors;
          } else {
            var valid2 = true;
          }
          if (valid2) {
            if (data.type !== void 0) {
              let data1 = data.type;
              const _errs7 = errors;
              if (typeof data1 !== "string") {
                const err4 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/StreamChunk/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err4];
                } else {
                  vErrors.push(err4);
                }
                errors++;
              }
              if ("stream_chunk" !== data1) {
                const err5 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/StreamChunk/properties/type/const", keyword: "const", params: { allowedValue: "stream_chunk" }, message: "must be equal to constant" };
                if (vErrors === null) {
                  vErrors = [err5];
                } else {
                  vErrors.push(err5);
                }
                errors++;
              }
              var valid2 = _errs7 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.run_id !== void 0) {
                const _errs9 = errors;
                if (typeof data.run_id !== "string") {
                  const err6 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/StreamChunk/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                  if (vErrors === null) {
                    vErrors = [err6];
                  } else {
                    vErrors.push(err6);
                  }
                  errors++;
                }
                var valid2 = _errs9 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.sequence !== void 0) {
                  let data3 = data.sequence;
                  const _errs11 = errors;
                  if (!(typeof data3 == "number" && (!(data3 % 1) && !isNaN(data3)))) {
                    const err7 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/StreamChunk/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                    if (vErrors === null) {
                      vErrors = [err7];
                    } else {
                      vErrors.push(err7);
                    }
                    errors++;
                  }
                  var valid2 = _errs11 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.token !== void 0) {
                    const _errs13 = errors;
                    if (typeof data.token !== "string") {
                      const err8 = { instancePath: instancePath + "/token", schemaPath: "#/$defs/StreamChunk/properties/token/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err8];
                      } else {
                        vErrors.push(err8);
                      }
                      errors++;
                    }
                    var valid2 = _errs13 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.is_final !== void 0) {
                      let data5 = data.is_final;
                      const _errs15 = errors;
                      if (typeof data5 !== "boolean") {
                        const err9 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/StreamChunk/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err9];
                        } else {
                          vErrors.push(err9);
                        }
                        errors++;
                      }
                      if (false !== data5) {
                        const err10 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/StreamChunk/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err10];
                        } else {
                          vErrors.push(err10);
                        }
                        errors++;
                      }
                      var valid2 = _errs15 === errors;
                    } else {
                      var valid2 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      const err11 = { instancePath, schemaPath: "#/$defs/StreamChunk/type", keyword: "type", params: { type: "object" }, message: "must be object" };
      if (vErrors === null) {
        vErrors = [err11];
      } else {
        vErrors.push(err11);
      }
      errors++;
    }
  }
  var _valid0 = _errs1 === errors;
  valid0 = valid0 || _valid0;
  if (!valid0) {
    const _errs17 = errors;
    const _errs18 = errors;
    if (errors === _errs18) {
      if (data && typeof data == "object" && !Array.isArray(data)) {
        let missing1;
        if (data.protocol_version === void 0 && (missing1 = "protocol_version") || data.type === void 0 && (missing1 = "type") || data.run_id === void 0 && (missing1 = "run_id") || data.sequence === void 0 && (missing1 = "sequence") || data.full_content === void 0 && (missing1 = "full_content") || data.status === void 0 && (missing1 = "status") || data.is_final === void 0 && (missing1 = "is_final")) {
          const err12 = { instancePath, schemaPath: "#/$defs/StreamEnd/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" };
          if (vErrors === null) {
            vErrors = [err12];
          } else {
            vErrors.push(err12);
          }
          errors++;
        } else {
          const _errs20 = errors;
          for (const key1 in data) {
            if (!(key1 === "protocol_version" || key1 === "type" || key1 === "run_id" || key1 === "sequence" || key1 === "full_content" || key1 === "status" || key1 === "is_final")) {
              const err13 = { instancePath, schemaPath: "#/$defs/StreamEnd/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" };
              if (vErrors === null) {
                vErrors = [err13];
              } else {
                vErrors.push(err13);
              }
              errors++;
              break;
            }
          }
          if (_errs20 === errors) {
            if (data.protocol_version !== void 0) {
              let data6 = data.protocol_version;
              const _errs21 = errors;
              if (!(typeof data6 == "number" && (!(data6 % 1) && !isNaN(data6)))) {
                const err14 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/StreamEnd/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                if (vErrors === null) {
                  vErrors = [err14];
                } else {
                  vErrors.push(err14);
                }
                errors++;
              }
              if (1 !== data6) {
                const err15 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/StreamEnd/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                if (vErrors === null) {
                  vErrors = [err15];
                } else {
                  vErrors.push(err15);
                }
                errors++;
              }
              var valid4 = _errs21 === errors;
            } else {
              var valid4 = true;
            }
            if (valid4) {
              if (data.type !== void 0) {
                let data7 = data.type;
                const _errs23 = errors;
                if (typeof data7 !== "string") {
                  const err16 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/StreamEnd/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                  if (vErrors === null) {
                    vErrors = [err16];
                  } else {
                    vErrors.push(err16);
                  }
                  errors++;
                }
                if ("stream_end" !== data7) {
                  const err17 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/StreamEnd/properties/type/const", keyword: "const", params: { allowedValue: "stream_end" }, message: "must be equal to constant" };
                  if (vErrors === null) {
                    vErrors = [err17];
                  } else {
                    vErrors.push(err17);
                  }
                  errors++;
                }
                var valid4 = _errs23 === errors;
              } else {
                var valid4 = true;
              }
              if (valid4) {
                if (data.run_id !== void 0) {
                  const _errs25 = errors;
                  if (typeof data.run_id !== "string") {
                    const err18 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/StreamEnd/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err18];
                    } else {
                      vErrors.push(err18);
                    }
                    errors++;
                  }
                  var valid4 = _errs25 === errors;
                } else {
                  var valid4 = true;
                }
                if (valid4) {
                  if (data.sequence !== void 0) {
                    let data9 = data.sequence;
                    const _errs27 = errors;
                    if (!(typeof data9 == "number" && (!(data9 % 1) && !isNaN(data9)))) {
                      const err19 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/StreamEnd/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                      if (vErrors === null) {
                        vErrors = [err19];
                      } else {
                        vErrors.push(err19);
                      }
                      errors++;
                    }
                    var valid4 = _errs27 === errors;
                  } else {
                    var valid4 = true;
                  }
                  if (valid4) {
                    if (data.full_content !== void 0) {
                      const _errs29 = errors;
                      if (typeof data.full_content !== "string") {
                        const err20 = { instancePath: instancePath + "/full_content", schemaPath: "#/$defs/StreamEnd/properties/full_content/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err20];
                        } else {
                          vErrors.push(err20);
                        }
                        errors++;
                      }
                      var valid4 = _errs29 === errors;
                    } else {
                      var valid4 = true;
                    }
                    if (valid4) {
                      if (data.status !== void 0) {
                        let data11 = data.status;
                        const _errs31 = errors;
                        if (typeof data11 !== "string") {
                          const err21 = { instancePath: instancePath + "/status", schemaPath: "#/$defs/StreamEnd/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err21];
                          } else {
                            vErrors.push(err21);
                          }
                          errors++;
                        }
                        if (!(data11 === "completed" || data11 === "cancelled")) {
                          const err22 = { instancePath: instancePath + "/status", schemaPath: "#/$defs/StreamEnd/properties/status/enum", keyword: "enum", params: { allowedValues: schema13.properties.status.enum }, message: "must be equal to one of the allowed values" };
                          if (vErrors === null) {
                            vErrors = [err22];
                          } else {
                            vErrors.push(err22);
                          }
                          errors++;
                        }
                        var valid4 = _errs31 === errors;
                      } else {
                        var valid4 = true;
                      }
                      if (valid4) {
                        if (data.is_final !== void 0) {
                          let data12 = data.is_final;
                          const _errs33 = errors;
                          if (typeof data12 !== "boolean") {
                            const err23 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/StreamEnd/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err23];
                            } else {
                              vErrors.push(err23);
                            }
                            errors++;
                          }
                          if (true !== data12) {
                            const err24 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/StreamEnd/properties/is_final/const", keyword: "const", params: { allowedValue: true }, message: "must be equal to constant" };
                            if (vErrors === null) {
                              vErrors = [err24];
                            } else {
                              vErrors.push(err24);
                            }
                            errors++;
                          }
                          var valid4 = _errs33 === errors;
                        } else {
                          var valid4 = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        const err25 = { instancePath, schemaPath: "#/$defs/StreamEnd/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
          vErrors = [err25];
        } else {
          vErrors.push(err25);
        }
        errors++;
      }
    }
    var _valid0 = _errs17 === errors;
    valid0 = valid0 || _valid0;
    if (!valid0) {
      const _errs35 = errors;
      const _errs36 = errors;
      if (errors === _errs36) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
          let missing2;
          if (data.protocol_version === void 0 && (missing2 = "protocol_version") || data.type === void 0 && (missing2 = "type") || data.run_id === void 0 && (missing2 = "run_id") || data.sequence === void 0 && (missing2 = "sequence") || data.full_content === void 0 && (missing2 = "full_content") || data.message === void 0 && (missing2 = "message") || data.is_final === void 0 && (missing2 = "is_final")) {
            const err26 = { instancePath, schemaPath: "#/$defs/StreamError/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" };
            if (vErrors === null) {
              vErrors = [err26];
            } else {
              vErrors.push(err26);
            }
            errors++;
          } else {
            const _errs38 = errors;
            for (const key2 in data) {
              if (!(key2 === "protocol_version" || key2 === "type" || key2 === "run_id" || key2 === "sequence" || key2 === "full_content" || key2 === "message" || key2 === "is_final")) {
                const err27 = { instancePath, schemaPath: "#/$defs/StreamError/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err27];
                } else {
                  vErrors.push(err27);
                }
                errors++;
                break;
              }
            }
            if (_errs38 === errors) {
              if (data.protocol_version !== void 0) {
                let data13 = data.protocol_version;
                const _errs39 = errors;
                if (!(typeof data13 == "number" && (!(data13 % 1) && !isNaN(data13)))) {
                  const err28 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/StreamError/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                  if (vErrors === null) {
                    vErrors = [err28];
                  } else {
                    vErrors.push(err28);
                  }
                  errors++;
                }
                if (1 !== data13) {
                  const err29 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/StreamError/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                  if (vErrors === null) {
                    vErrors = [err29];
                  } else {
                    vErrors.push(err29);
                  }
                  errors++;
                }
                var valid6 = _errs39 === errors;
              } else {
                var valid6 = true;
              }
              if (valid6) {
                if (data.type !== void 0) {
                  let data14 = data.type;
                  const _errs41 = errors;
                  if (typeof data14 !== "string") {
                    const err30 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/StreamError/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err30];
                    } else {
                      vErrors.push(err30);
                    }
                    errors++;
                  }
                  if ("stream_error" !== data14) {
                    const err31 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/StreamError/properties/type/const", keyword: "const", params: { allowedValue: "stream_error" }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err31];
                    } else {
                      vErrors.push(err31);
                    }
                    errors++;
                  }
                  var valid6 = _errs41 === errors;
                } else {
                  var valid6 = true;
                }
                if (valid6) {
                  if (data.run_id !== void 0) {
                    const _errs43 = errors;
                    if (typeof data.run_id !== "string") {
                      const err32 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/StreamError/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err32];
                      } else {
                        vErrors.push(err32);
                      }
                      errors++;
                    }
                    var valid6 = _errs43 === errors;
                  } else {
                    var valid6 = true;
                  }
                  if (valid6) {
                    if (data.sequence !== void 0) {
                      let data16 = data.sequence;
                      const _errs45 = errors;
                      if (!(typeof data16 == "number" && (!(data16 % 1) && !isNaN(data16)))) {
                        const err33 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/StreamError/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                        if (vErrors === null) {
                          vErrors = [err33];
                        } else {
                          vErrors.push(err33);
                        }
                        errors++;
                      }
                      var valid6 = _errs45 === errors;
                    } else {
                      var valid6 = true;
                    }
                    if (valid6) {
                      if (data.full_content !== void 0) {
                        const _errs47 = errors;
                        if (typeof data.full_content !== "string") {
                          const err34 = { instancePath: instancePath + "/full_content", schemaPath: "#/$defs/StreamError/properties/full_content/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err34];
                          } else {
                            vErrors.push(err34);
                          }
                          errors++;
                        }
                        var valid6 = _errs47 === errors;
                      } else {
                        var valid6 = true;
                      }
                      if (valid6) {
                        if (data.message !== void 0) {
                          const _errs49 = errors;
                          if (typeof data.message !== "string") {
                            const err35 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/StreamError/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err35];
                            } else {
                              vErrors.push(err35);
                            }
                            errors++;
                          }
                          var valid6 = _errs49 === errors;
                        } else {
                          var valid6 = true;
                        }
                        if (valid6) {
                          if (data.is_final !== void 0) {
                            let data19 = data.is_final;
                            const _errs51 = errors;
                            if (typeof data19 !== "boolean") {
                              const err36 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/StreamError/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err36];
                              } else {
                                vErrors.push(err36);
                              }
                              errors++;
                            }
                            if (true !== data19) {
                              const err37 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/StreamError/properties/is_final/const", keyword: "const", params: { allowedValue: true }, message: "must be equal to constant" };
                              if (vErrors === null) {
                                vErrors = [err37];
                              } else {
                                vErrors.push(err37);
                              }
                              errors++;
                            }
                            var valid6 = _errs51 === errors;
                          } else {
                            var valid6 = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          const err38 = { instancePath, schemaPath: "#/$defs/StreamError/type", keyword: "type", params: { type: "object" }, message: "must be object" };
          if (vErrors === null) {
            vErrors = [err38];
          } else {
            vErrors.push(err38);
          }
          errors++;
        }
      }
      var _valid0 = _errs35 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs53 = errors;
        const _errs54 = errors;
        if (errors === _errs54) {
          if (data && typeof data == "object" && !Array.isArray(data)) {
            let missing3;
            if (data.protocol_version === void 0 && (missing3 = "protocol_version") || data.type === void 0 && (missing3 = "type") || data.message === void 0 && (missing3 = "message")) {
              const err39 = { instancePath, schemaPath: "#/$defs/TransportError/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" };
              if (vErrors === null) {
                vErrors = [err39];
              } else {
                vErrors.push(err39);
              }
              errors++;
            } else {
              const _errs56 = errors;
              for (const key3 in data) {
                if (!(key3 === "protocol_version" || key3 === "type" || key3 === "message")) {
                  const err40 = { instancePath, schemaPath: "#/$defs/TransportError/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" };
                  if (vErrors === null) {
                    vErrors = [err40];
                  } else {
                    vErrors.push(err40);
                  }
                  errors++;
                  break;
                }
              }
              if (_errs56 === errors) {
                if (data.protocol_version !== void 0) {
                  let data20 = data.protocol_version;
                  const _errs57 = errors;
                  if (!(typeof data20 == "number" && (!(data20 % 1) && !isNaN(data20)))) {
                    const err41 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/TransportError/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                    if (vErrors === null) {
                      vErrors = [err41];
                    } else {
                      vErrors.push(err41);
                    }
                    errors++;
                  }
                  if (1 !== data20) {
                    const err42 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/TransportError/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err42];
                    } else {
                      vErrors.push(err42);
                    }
                    errors++;
                  }
                  var valid8 = _errs57 === errors;
                } else {
                  var valid8 = true;
                }
                if (valid8) {
                  if (data.type !== void 0) {
                    let data21 = data.type;
                    const _errs59 = errors;
                    if (typeof data21 !== "string") {
                      const err43 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/TransportError/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err43];
                      } else {
                        vErrors.push(err43);
                      }
                      errors++;
                    }
                    if ("transport_error" !== data21) {
                      const err44 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/TransportError/properties/type/const", keyword: "const", params: { allowedValue: "transport_error" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err44];
                      } else {
                        vErrors.push(err44);
                      }
                      errors++;
                    }
                    var valid8 = _errs59 === errors;
                  } else {
                    var valid8 = true;
                  }
                  if (valid8) {
                    if (data.message !== void 0) {
                      const _errs61 = errors;
                      if (typeof data.message !== "string") {
                        const err45 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/TransportError/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err45];
                        } else {
                          vErrors.push(err45);
                        }
                        errors++;
                      }
                      var valid8 = _errs61 === errors;
                    } else {
                      var valid8 = true;
                    }
                  }
                }
              }
            }
          } else {
            const err46 = { instancePath, schemaPath: "#/$defs/TransportError/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err46];
            } else {
              vErrors.push(err46);
            }
            errors++;
          }
        }
        var _valid0 = _errs53 === errors;
        valid0 = valid0 || _valid0;
        if (!valid0) {
          const _errs63 = errors;
          const _errs64 = errors;
          if (errors === _errs64) {
            if (data && typeof data == "object" && !Array.isArray(data)) {
              let missing4;
              if (data.protocol_version === void 0 && (missing4 = "protocol_version") || data.type === void 0 && (missing4 = "type") || data.run_id === void 0 && (missing4 = "run_id") || data.sequence === void 0 && (missing4 = "sequence") || data.agent_id === void 0 && (missing4 = "agent_id") || data.phase === void 0 && (missing4 = "phase") || data.token === void 0 && (missing4 = "token") || data.is_final === void 0 && (missing4 = "is_final")) {
                const err47 = { instancePath, schemaPath: "#/$defs/OrchestrationChunk/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" };
                if (vErrors === null) {
                  vErrors = [err47];
                } else {
                  vErrors.push(err47);
                }
                errors++;
              } else {
                const _errs66 = errors;
                for (const key4 in data) {
                  if (!(key4 === "protocol_version" || key4 === "type" || key4 === "run_id" || key4 === "sequence" || key4 === "agent_id" || key4 === "phase" || key4 === "token" || key4 === "is_final")) {
                    const err48 = { instancePath, schemaPath: "#/$defs/OrchestrationChunk/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                    if (vErrors === null) {
                      vErrors = [err48];
                    } else {
                      vErrors.push(err48);
                    }
                    errors++;
                    break;
                  }
                }
                if (_errs66 === errors) {
                  if (data.protocol_version !== void 0) {
                    let data23 = data.protocol_version;
                    const _errs67 = errors;
                    if (!(typeof data23 == "number" && (!(data23 % 1) && !isNaN(data23)))) {
                      const err49 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationChunk/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                      if (vErrors === null) {
                        vErrors = [err49];
                      } else {
                        vErrors.push(err49);
                      }
                      errors++;
                    }
                    if (1 !== data23) {
                      const err50 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationChunk/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err50];
                      } else {
                        vErrors.push(err50);
                      }
                      errors++;
                    }
                    var valid10 = _errs67 === errors;
                  } else {
                    var valid10 = true;
                  }
                  if (valid10) {
                    if (data.type !== void 0) {
                      let data24 = data.type;
                      const _errs69 = errors;
                      if (typeof data24 !== "string") {
                        const err51 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationChunk/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err51];
                        } else {
                          vErrors.push(err51);
                        }
                        errors++;
                      }
                      if ("orchestration_chunk" !== data24) {
                        const err52 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationChunk/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_chunk" }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err52];
                        } else {
                          vErrors.push(err52);
                        }
                        errors++;
                      }
                      var valid10 = _errs69 === errors;
                    } else {
                      var valid10 = true;
                    }
                    if (valid10) {
                      if (data.run_id !== void 0) {
                        const _errs71 = errors;
                        if (typeof data.run_id !== "string") {
                          const err53 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationChunk/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err53];
                          } else {
                            vErrors.push(err53);
                          }
                          errors++;
                        }
                        var valid10 = _errs71 === errors;
                      } else {
                        var valid10 = true;
                      }
                      if (valid10) {
                        if (data.sequence !== void 0) {
                          let data26 = data.sequence;
                          const _errs73 = errors;
                          if (!(typeof data26 == "number" && (!(data26 % 1) && !isNaN(data26)))) {
                            const err54 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationChunk/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                            if (vErrors === null) {
                              vErrors = [err54];
                            } else {
                              vErrors.push(err54);
                            }
                            errors++;
                          }
                          var valid10 = _errs73 === errors;
                        } else {
                          var valid10 = true;
                        }
                        if (valid10) {
                          if (data.agent_id !== void 0) {
                            const _errs75 = errors;
                            if (typeof data.agent_id !== "string") {
                              const err55 = { instancePath: instancePath + "/agent_id", schemaPath: "#/$defs/OrchestrationChunk/properties/agent_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err55];
                              } else {
                                vErrors.push(err55);
                              }
                              errors++;
                            }
                            var valid10 = _errs75 === errors;
                          } else {
                            var valid10 = true;
                          }
                          if (valid10) {
                            if (data.phase !== void 0) {
                              let data28 = data.phase;
                              const _errs77 = errors;
                              if (typeof data28 !== "string") {
                                const err56 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationChunk/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err56];
                                } else {
                                  vErrors.push(err56);
                                }
                                errors++;
                              }
                              if (!(data28 === "analysis" || data28 === "review" || data28 === "synthesis")) {
                                const err57 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationChunk/properties/phase/enum", keyword: "enum", params: { allowedValues: schema16.properties.phase.enum }, message: "must be equal to one of the allowed values" };
                                if (vErrors === null) {
                                  vErrors = [err57];
                                } else {
                                  vErrors.push(err57);
                                }
                                errors++;
                              }
                              var valid10 = _errs77 === errors;
                            } else {
                              var valid10 = true;
                            }
                            if (valid10) {
                              if (data.token !== void 0) {
                                const _errs79 = errors;
                                if (typeof data.token !== "string") {
                                  const err58 = { instancePath: instancePath + "/token", schemaPath: "#/$defs/OrchestrationChunk/properties/token/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err58];
                                  } else {
                                    vErrors.push(err58);
                                  }
                                  errors++;
                                }
                                var valid10 = _errs79 === errors;
                              } else {
                                var valid10 = true;
                              }
                              if (valid10) {
                                if (data.is_final !== void 0) {
                                  let data30 = data.is_final;
                                  const _errs81 = errors;
                                  if (typeof data30 !== "boolean") {
                                    const err59 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationChunk/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                    if (vErrors === null) {
                                      vErrors = [err59];
                                    } else {
                                      vErrors.push(err59);
                                    }
                                    errors++;
                                  }
                                  if (false !== data30) {
                                    const err60 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationChunk/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                    if (vErrors === null) {
                                      vErrors = [err60];
                                    } else {
                                      vErrors.push(err60);
                                    }
                                    errors++;
                                  }
                                  var valid10 = _errs81 === errors;
                                } else {
                                  var valid10 = true;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              const err61 = { instancePath, schemaPath: "#/$defs/OrchestrationChunk/type", keyword: "type", params: { type: "object" }, message: "must be object" };
              if (vErrors === null) {
                vErrors = [err61];
              } else {
                vErrors.push(err61);
              }
              errors++;
            }
          }
          var _valid0 = _errs63 === errors;
          valid0 = valid0 || _valid0;
          if (!valid0) {
            const _errs83 = errors;
            const _errs84 = errors;
            if (errors === _errs84) {
              if (data && typeof data == "object" && !Array.isArray(data)) {
                let missing5;
                if (data.protocol_version === void 0 && (missing5 = "protocol_version") || data.type === void 0 && (missing5 = "type") || data.run_id === void 0 && (missing5 = "run_id") || data.sequence === void 0 && (missing5 = "sequence") || data.agent_id === void 0 && (missing5 = "agent_id") || data.phase === void 0 && (missing5 = "phase") || data.full_content === void 0 && (missing5 = "full_content") || data.is_final === void 0 && (missing5 = "is_final")) {
                  const err62 = { instancePath, schemaPath: "#/$defs/OrchestrationMessageEnd/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" };
                  if (vErrors === null) {
                    vErrors = [err62];
                  } else {
                    vErrors.push(err62);
                  }
                  errors++;
                } else {
                  const _errs86 = errors;
                  for (const key5 in data) {
                    if (!(key5 === "protocol_version" || key5 === "type" || key5 === "run_id" || key5 === "sequence" || key5 === "agent_id" || key5 === "phase" || key5 === "full_content" || key5 === "is_final")) {
                      const err63 = { instancePath, schemaPath: "#/$defs/OrchestrationMessageEnd/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" };
                      if (vErrors === null) {
                        vErrors = [err63];
                      } else {
                        vErrors.push(err63);
                      }
                      errors++;
                      break;
                    }
                  }
                  if (_errs86 === errors) {
                    if (data.protocol_version !== void 0) {
                      let data31 = data.protocol_version;
                      const _errs87 = errors;
                      if (!(typeof data31 == "number" && (!(data31 % 1) && !isNaN(data31)))) {
                        const err64 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                        if (vErrors === null) {
                          vErrors = [err64];
                        } else {
                          vErrors.push(err64);
                        }
                        errors++;
                      }
                      if (1 !== data31) {
                        const err65 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err65];
                        } else {
                          vErrors.push(err65);
                        }
                        errors++;
                      }
                      var valid12 = _errs87 === errors;
                    } else {
                      var valid12 = true;
                    }
                    if (valid12) {
                      if (data.type !== void 0) {
                        let data32 = data.type;
                        const _errs89 = errors;
                        if (typeof data32 !== "string") {
                          const err66 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err66];
                          } else {
                            vErrors.push(err66);
                          }
                          errors++;
                        }
                        if ("orchestration_message_end" !== data32) {
                          const err67 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_message_end" }, message: "must be equal to constant" };
                          if (vErrors === null) {
                            vErrors = [err67];
                          } else {
                            vErrors.push(err67);
                          }
                          errors++;
                        }
                        var valid12 = _errs89 === errors;
                      } else {
                        var valid12 = true;
                      }
                      if (valid12) {
                        if (data.run_id !== void 0) {
                          const _errs91 = errors;
                          if (typeof data.run_id !== "string") {
                            const err68 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err68];
                            } else {
                              vErrors.push(err68);
                            }
                            errors++;
                          }
                          var valid12 = _errs91 === errors;
                        } else {
                          var valid12 = true;
                        }
                        if (valid12) {
                          if (data.sequence !== void 0) {
                            let data34 = data.sequence;
                            const _errs93 = errors;
                            if (!(typeof data34 == "number" && (!(data34 % 1) && !isNaN(data34)))) {
                              const err69 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                              if (vErrors === null) {
                                vErrors = [err69];
                              } else {
                                vErrors.push(err69);
                              }
                              errors++;
                            }
                            var valid12 = _errs93 === errors;
                          } else {
                            var valid12 = true;
                          }
                          if (valid12) {
                            if (data.agent_id !== void 0) {
                              const _errs95 = errors;
                              if (typeof data.agent_id !== "string") {
                                const err70 = { instancePath: instancePath + "/agent_id", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/agent_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err70];
                                } else {
                                  vErrors.push(err70);
                                }
                                errors++;
                              }
                              var valid12 = _errs95 === errors;
                            } else {
                              var valid12 = true;
                            }
                            if (valid12) {
                              if (data.phase !== void 0) {
                                let data36 = data.phase;
                                const _errs97 = errors;
                                if (typeof data36 !== "string") {
                                  const err71 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err71];
                                  } else {
                                    vErrors.push(err71);
                                  }
                                  errors++;
                                }
                                if (!(data36 === "analysis" || data36 === "review" || data36 === "synthesis")) {
                                  const err72 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/phase/enum", keyword: "enum", params: { allowedValues: schema17.properties.phase.enum }, message: "must be equal to one of the allowed values" };
                                  if (vErrors === null) {
                                    vErrors = [err72];
                                  } else {
                                    vErrors.push(err72);
                                  }
                                  errors++;
                                }
                                var valid12 = _errs97 === errors;
                              } else {
                                var valid12 = true;
                              }
                              if (valid12) {
                                if (data.full_content !== void 0) {
                                  const _errs99 = errors;
                                  if (typeof data.full_content !== "string") {
                                    const err73 = { instancePath: instancePath + "/full_content", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/full_content/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err73];
                                    } else {
                                      vErrors.push(err73);
                                    }
                                    errors++;
                                  }
                                  var valid12 = _errs99 === errors;
                                } else {
                                  var valid12 = true;
                                }
                                if (valid12) {
                                  if (data.is_final !== void 0) {
                                    let data38 = data.is_final;
                                    const _errs101 = errors;
                                    if (typeof data38 !== "boolean") {
                                      const err74 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                      if (vErrors === null) {
                                        vErrors = [err74];
                                      } else {
                                        vErrors.push(err74);
                                      }
                                      errors++;
                                    }
                                    if (false !== data38) {
                                      const err75 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationMessageEnd/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                      if (vErrors === null) {
                                        vErrors = [err75];
                                      } else {
                                        vErrors.push(err75);
                                      }
                                      errors++;
                                    }
                                    var valid12 = _errs101 === errors;
                                  } else {
                                    var valid12 = true;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                const err76 = { instancePath, schemaPath: "#/$defs/OrchestrationMessageEnd/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                if (vErrors === null) {
                  vErrors = [err76];
                } else {
                  vErrors.push(err76);
                }
                errors++;
              }
            }
            var _valid0 = _errs83 === errors;
            valid0 = valid0 || _valid0;
            if (!valid0) {
              const _errs103 = errors;
              const _errs104 = errors;
              if (errors === _errs104) {
                if (data && typeof data == "object" && !Array.isArray(data)) {
                  let missing6;
                  if (data.protocol_version === void 0 && (missing6 = "protocol_version") || data.type === void 0 && (missing6 = "type") || data.run_id === void 0 && (missing6 = "run_id") || data.sequence === void 0 && (missing6 = "sequence") || data.status === void 0 && (missing6 = "status") || data.is_final === void 0 && (missing6 = "is_final")) {
                    const err77 = { instancePath, schemaPath: "#/$defs/OrchestrationEnd/required", keyword: "required", params: { missingProperty: missing6 }, message: "must have required property '" + missing6 + "'" };
                    if (vErrors === null) {
                      vErrors = [err77];
                    } else {
                      vErrors.push(err77);
                    }
                    errors++;
                  } else {
                    const _errs106 = errors;
                    for (const key6 in data) {
                      if (!(key6 === "protocol_version" || key6 === "type" || key6 === "run_id" || key6 === "sequence" || key6 === "status" || key6 === "is_final")) {
                        const err78 = { instancePath, schemaPath: "#/$defs/OrchestrationEnd/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err78];
                        } else {
                          vErrors.push(err78);
                        }
                        errors++;
                        break;
                      }
                    }
                    if (_errs106 === errors) {
                      if (data.protocol_version !== void 0) {
                        let data39 = data.protocol_version;
                        const _errs107 = errors;
                        if (!(typeof data39 == "number" && (!(data39 % 1) && !isNaN(data39)))) {
                          const err79 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationEnd/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                          if (vErrors === null) {
                            vErrors = [err79];
                          } else {
                            vErrors.push(err79);
                          }
                          errors++;
                        }
                        if (1 !== data39) {
                          const err80 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationEnd/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                          if (vErrors === null) {
                            vErrors = [err80];
                          } else {
                            vErrors.push(err80);
                          }
                          errors++;
                        }
                        var valid14 = _errs107 === errors;
                      } else {
                        var valid14 = true;
                      }
                      if (valid14) {
                        if (data.type !== void 0) {
                          let data40 = data.type;
                          const _errs109 = errors;
                          if (typeof data40 !== "string") {
                            const err81 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationEnd/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err81];
                            } else {
                              vErrors.push(err81);
                            }
                            errors++;
                          }
                          if ("orchestration_end" !== data40) {
                            const err82 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationEnd/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_end" }, message: "must be equal to constant" };
                            if (vErrors === null) {
                              vErrors = [err82];
                            } else {
                              vErrors.push(err82);
                            }
                            errors++;
                          }
                          var valid14 = _errs109 === errors;
                        } else {
                          var valid14 = true;
                        }
                        if (valid14) {
                          if (data.run_id !== void 0) {
                            const _errs111 = errors;
                            if (typeof data.run_id !== "string") {
                              const err83 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationEnd/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err83];
                              } else {
                                vErrors.push(err83);
                              }
                              errors++;
                            }
                            var valid14 = _errs111 === errors;
                          } else {
                            var valid14 = true;
                          }
                          if (valid14) {
                            if (data.sequence !== void 0) {
                              let data42 = data.sequence;
                              const _errs113 = errors;
                              if (!(typeof data42 == "number" && (!(data42 % 1) && !isNaN(data42)))) {
                                const err84 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationEnd/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                if (vErrors === null) {
                                  vErrors = [err84];
                                } else {
                                  vErrors.push(err84);
                                }
                                errors++;
                              }
                              var valid14 = _errs113 === errors;
                            } else {
                              var valid14 = true;
                            }
                            if (valid14) {
                              if (data.status !== void 0) {
                                let data43 = data.status;
                                const _errs115 = errors;
                                if (typeof data43 !== "string") {
                                  const err85 = { instancePath: instancePath + "/status", schemaPath: "#/$defs/OrchestrationEnd/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err85];
                                  } else {
                                    vErrors.push(err85);
                                  }
                                  errors++;
                                }
                                if (!(data43 === "completed" || data43 === "cancelled")) {
                                  const err86 = { instancePath: instancePath + "/status", schemaPath: "#/$defs/OrchestrationEnd/properties/status/enum", keyword: "enum", params: { allowedValues: schema18.properties.status.enum }, message: "must be equal to one of the allowed values" };
                                  if (vErrors === null) {
                                    vErrors = [err86];
                                  } else {
                                    vErrors.push(err86);
                                  }
                                  errors++;
                                }
                                var valid14 = _errs115 === errors;
                              } else {
                                var valid14 = true;
                              }
                              if (valid14) {
                                if (data.is_final !== void 0) {
                                  let data44 = data.is_final;
                                  const _errs117 = errors;
                                  if (typeof data44 !== "boolean") {
                                    const err87 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationEnd/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                    if (vErrors === null) {
                                      vErrors = [err87];
                                    } else {
                                      vErrors.push(err87);
                                    }
                                    errors++;
                                  }
                                  if (true !== data44) {
                                    const err88 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationEnd/properties/is_final/const", keyword: "const", params: { allowedValue: true }, message: "must be equal to constant" };
                                    if (vErrors === null) {
                                      vErrors = [err88];
                                    } else {
                                      vErrors.push(err88);
                                    }
                                    errors++;
                                  }
                                  var valid14 = _errs117 === errors;
                                } else {
                                  var valid14 = true;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  const err89 = { instancePath, schemaPath: "#/$defs/OrchestrationEnd/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                  if (vErrors === null) {
                    vErrors = [err89];
                  } else {
                    vErrors.push(err89);
                  }
                  errors++;
                }
              }
              var _valid0 = _errs103 === errors;
              valid0 = valid0 || _valid0;
              if (!valid0) {
                const _errs119 = errors;
                const _errs120 = errors;
                if (errors === _errs120) {
                  if (data && typeof data == "object" && !Array.isArray(data)) {
                    let missing7;
                    if (data.protocol_version === void 0 && (missing7 = "protocol_version") || data.type === void 0 && (missing7 = "type") || data.run_id === void 0 && (missing7 = "run_id") || data.sequence === void 0 && (missing7 = "sequence") || data.message === void 0 && (missing7 = "message") || data.error_class === void 0 && (missing7 = "error_class") || data.failed_node === void 0 && (missing7 = "failed_node") || data.is_final === void 0 && (missing7 = "is_final")) {
                      const err90 = { instancePath, schemaPath: "#/$defs/OrchestrationError/required", keyword: "required", params: { missingProperty: missing7 }, message: "must have required property '" + missing7 + "'" };
                      if (vErrors === null) {
                        vErrors = [err90];
                      } else {
                        vErrors.push(err90);
                      }
                      errors++;
                    } else {
                      const _errs122 = errors;
                      for (const key7 in data) {
                        if (!(key7 === "protocol_version" || key7 === "type" || key7 === "run_id" || key7 === "sequence" || key7 === "message" || key7 === "error_class" || key7 === "failed_node" || key7 === "is_final")) {
                          const err91 = { instancePath, schemaPath: "#/$defs/OrchestrationError/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" };
                          if (vErrors === null) {
                            vErrors = [err91];
                          } else {
                            vErrors.push(err91);
                          }
                          errors++;
                          break;
                        }
                      }
                      if (_errs122 === errors) {
                        if (data.protocol_version !== void 0) {
                          let data45 = data.protocol_version;
                          const _errs123 = errors;
                          if (!(typeof data45 == "number" && (!(data45 % 1) && !isNaN(data45)))) {
                            const err92 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationError/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                            if (vErrors === null) {
                              vErrors = [err92];
                            } else {
                              vErrors.push(err92);
                            }
                            errors++;
                          }
                          if (1 !== data45) {
                            const err93 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationError/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                            if (vErrors === null) {
                              vErrors = [err93];
                            } else {
                              vErrors.push(err93);
                            }
                            errors++;
                          }
                          var valid16 = _errs123 === errors;
                        } else {
                          var valid16 = true;
                        }
                        if (valid16) {
                          if (data.type !== void 0) {
                            let data46 = data.type;
                            const _errs125 = errors;
                            if (typeof data46 !== "string") {
                              const err94 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationError/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err94];
                              } else {
                                vErrors.push(err94);
                              }
                              errors++;
                            }
                            if ("orchestration_error" !== data46) {
                              const err95 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationError/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_error" }, message: "must be equal to constant" };
                              if (vErrors === null) {
                                vErrors = [err95];
                              } else {
                                vErrors.push(err95);
                              }
                              errors++;
                            }
                            var valid16 = _errs125 === errors;
                          } else {
                            var valid16 = true;
                          }
                          if (valid16) {
                            if (data.run_id !== void 0) {
                              const _errs127 = errors;
                              if (typeof data.run_id !== "string") {
                                const err96 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationError/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err96];
                                } else {
                                  vErrors.push(err96);
                                }
                                errors++;
                              }
                              var valid16 = _errs127 === errors;
                            } else {
                              var valid16 = true;
                            }
                            if (valid16) {
                              if (data.sequence !== void 0) {
                                let data48 = data.sequence;
                                const _errs129 = errors;
                                if (!(typeof data48 == "number" && (!(data48 % 1) && !isNaN(data48)))) {
                                  const err97 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationError/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                  if (vErrors === null) {
                                    vErrors = [err97];
                                  } else {
                                    vErrors.push(err97);
                                  }
                                  errors++;
                                }
                                var valid16 = _errs129 === errors;
                              } else {
                                var valid16 = true;
                              }
                              if (valid16) {
                                if (data.message !== void 0) {
                                  const _errs131 = errors;
                                  if (typeof data.message !== "string") {
                                    const err98 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/OrchestrationError/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err98];
                                    } else {
                                      vErrors.push(err98);
                                    }
                                    errors++;
                                  }
                                  var valid16 = _errs131 === errors;
                                } else {
                                  var valid16 = true;
                                }
                                if (valid16) {
                                  if (data.error_class !== void 0) {
                                    let data50 = data.error_class;
                                    const _errs133 = errors;
                                    if (typeof data50 !== "string") {
                                      const err99 = { instancePath: instancePath + "/error_class", schemaPath: "#/$defs/OrchestrationError/properties/error_class/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err99];
                                      } else {
                                        vErrors.push(err99);
                                      }
                                      errors++;
                                    }
                                    if (!(data50 === "retryable" || data50 === "permanent")) {
                                      const err100 = { instancePath: instancePath + "/error_class", schemaPath: "#/$defs/OrchestrationError/properties/error_class/enum", keyword: "enum", params: { allowedValues: schema19.properties.error_class.enum }, message: "must be equal to one of the allowed values" };
                                      if (vErrors === null) {
                                        vErrors = [err100];
                                      } else {
                                        vErrors.push(err100);
                                      }
                                      errors++;
                                    }
                                    var valid16 = _errs133 === errors;
                                  } else {
                                    var valid16 = true;
                                  }
                                  if (valid16) {
                                    if (data.failed_node !== void 0) {
                                      const _errs135 = errors;
                                      if (typeof data.failed_node !== "string") {
                                        const err101 = { instancePath: instancePath + "/failed_node", schemaPath: "#/$defs/OrchestrationError/properties/failed_node/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err101];
                                        } else {
                                          vErrors.push(err101);
                                        }
                                        errors++;
                                      }
                                      var valid16 = _errs135 === errors;
                                    } else {
                                      var valid16 = true;
                                    }
                                    if (valid16) {
                                      if (data.is_final !== void 0) {
                                        let data52 = data.is_final;
                                        const _errs137 = errors;
                                        if (typeof data52 !== "boolean") {
                                          const err102 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationError/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                          if (vErrors === null) {
                                            vErrors = [err102];
                                          } else {
                                            vErrors.push(err102);
                                          }
                                          errors++;
                                        }
                                        if (true !== data52) {
                                          const err103 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationError/properties/is_final/const", keyword: "const", params: { allowedValue: true }, message: "must be equal to constant" };
                                          if (vErrors === null) {
                                            vErrors = [err103];
                                          } else {
                                            vErrors.push(err103);
                                          }
                                          errors++;
                                        }
                                        var valid16 = _errs137 === errors;
                                      } else {
                                        var valid16 = true;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } else {
                    const err104 = { instancePath, schemaPath: "#/$defs/OrchestrationError/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err104];
                    } else {
                      vErrors.push(err104);
                    }
                    errors++;
                  }
                }
                var _valid0 = _errs119 === errors;
                valid0 = valid0 || _valid0;
                if (!valid0) {
                  const _errs139 = errors;
                  const _errs140 = errors;
                  if (errors === _errs140) {
                    if (data && typeof data == "object" && !Array.isArray(data)) {
                      let missing8;
                      if (data.protocol_version === void 0 && (missing8 = "protocol_version") || data.type === void 0 && (missing8 = "type") || data.run_id === void 0 && (missing8 = "run_id") || data.sequence === void 0 && (missing8 = "sequence") || data.agent_ids === void 0 && (missing8 = "agent_ids") || data.reason === void 0 && (missing8 = "reason") || data.planned_model_calls === void 0 && (missing8 = "planned_model_calls") || data.max_model_calls === void 0 && (missing8 = "max_model_calls") || data.max_output_tokens === void 0 && (missing8 = "max_output_tokens") || data.estimated_max_cost_microusd === void 0 && (missing8 = "estimated_max_cost_microusd") || data.max_cost_microusd === void 0 && (missing8 = "max_cost_microusd") || data.price_catalog_version === void 0 && (missing8 = "price_catalog_version") || data.pricing_warning === void 0 && (missing8 = "pricing_warning") || data.is_final === void 0 && (missing8 = "is_final")) {
                        const err105 = { instancePath, schemaPath: "#/$defs/OrchestrationRoute/required", keyword: "required", params: { missingProperty: missing8 }, message: "must have required property '" + missing8 + "'" };
                        if (vErrors === null) {
                          vErrors = [err105];
                        } else {
                          vErrors.push(err105);
                        }
                        errors++;
                      } else {
                        const _errs142 = errors;
                        for (const key8 in data) {
                          if (!func2.call(schema20.properties, key8)) {
                            const err106 = { instancePath, schemaPath: "#/$defs/OrchestrationRoute/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key8 }, message: "must NOT have additional properties" };
                            if (vErrors === null) {
                              vErrors = [err106];
                            } else {
                              vErrors.push(err106);
                            }
                            errors++;
                            break;
                          }
                        }
                        if (_errs142 === errors) {
                          if (data.protocol_version !== void 0) {
                            let data53 = data.protocol_version;
                            const _errs143 = errors;
                            if (!(typeof data53 == "number" && (!(data53 % 1) && !isNaN(data53)))) {
                              const err107 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationRoute/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                              if (vErrors === null) {
                                vErrors = [err107];
                              } else {
                                vErrors.push(err107);
                              }
                              errors++;
                            }
                            if (1 !== data53) {
                              const err108 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationRoute/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                              if (vErrors === null) {
                                vErrors = [err108];
                              } else {
                                vErrors.push(err108);
                              }
                              errors++;
                            }
                            var valid18 = _errs143 === errors;
                          } else {
                            var valid18 = true;
                          }
                          if (valid18) {
                            if (data.type !== void 0) {
                              let data54 = data.type;
                              const _errs145 = errors;
                              if (typeof data54 !== "string") {
                                const err109 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationRoute/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err109];
                                } else {
                                  vErrors.push(err109);
                                }
                                errors++;
                              }
                              if ("orchestration_route" !== data54) {
                                const err110 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationRoute/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_route" }, message: "must be equal to constant" };
                                if (vErrors === null) {
                                  vErrors = [err110];
                                } else {
                                  vErrors.push(err110);
                                }
                                errors++;
                              }
                              var valid18 = _errs145 === errors;
                            } else {
                              var valid18 = true;
                            }
                            if (valid18) {
                              if (data.run_id !== void 0) {
                                const _errs147 = errors;
                                if (typeof data.run_id !== "string") {
                                  const err111 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationRoute/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err111];
                                  } else {
                                    vErrors.push(err111);
                                  }
                                  errors++;
                                }
                                var valid18 = _errs147 === errors;
                              } else {
                                var valid18 = true;
                              }
                              if (valid18) {
                                if (data.sequence !== void 0) {
                                  let data56 = data.sequence;
                                  const _errs149 = errors;
                                  if (!(typeof data56 == "number" && (!(data56 % 1) && !isNaN(data56)))) {
                                    const err112 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationRoute/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                    if (vErrors === null) {
                                      vErrors = [err112];
                                    } else {
                                      vErrors.push(err112);
                                    }
                                    errors++;
                                  }
                                  var valid18 = _errs149 === errors;
                                } else {
                                  var valid18 = true;
                                }
                                if (valid18) {
                                  if (data.agent_ids !== void 0) {
                                    let data57 = data.agent_ids;
                                    const _errs151 = errors;
                                    if (errors === _errs151) {
                                      if (Array.isArray(data57)) {
                                        var valid19 = true;
                                        const len0 = data57.length;
                                        for (let i0 = 0; i0 < len0; i0++) {
                                          const _errs153 = errors;
                                          if (typeof data57[i0] !== "string") {
                                            const err113 = { instancePath: instancePath + "/agent_ids/" + i0, schemaPath: "#/$defs/OrchestrationRoute/properties/agent_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err113];
                                            } else {
                                              vErrors.push(err113);
                                            }
                                            errors++;
                                          }
                                          var valid19 = _errs153 === errors;
                                          if (!valid19) {
                                            break;
                                          }
                                        }
                                      } else {
                                        const err114 = { instancePath: instancePath + "/agent_ids", schemaPath: "#/$defs/OrchestrationRoute/properties/agent_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                        if (vErrors === null) {
                                          vErrors = [err114];
                                        } else {
                                          vErrors.push(err114);
                                        }
                                        errors++;
                                      }
                                    }
                                    var valid18 = _errs151 === errors;
                                  } else {
                                    var valid18 = true;
                                  }
                                  if (valid18) {
                                    if (data.reason !== void 0) {
                                      const _errs155 = errors;
                                      if (typeof data.reason !== "string") {
                                        const err115 = { instancePath: instancePath + "/reason", schemaPath: "#/$defs/OrchestrationRoute/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err115];
                                        } else {
                                          vErrors.push(err115);
                                        }
                                        errors++;
                                      }
                                      var valid18 = _errs155 === errors;
                                    } else {
                                      var valid18 = true;
                                    }
                                    if (valid18) {
                                      if (data.planned_model_calls !== void 0) {
                                        let data60 = data.planned_model_calls;
                                        const _errs157 = errors;
                                        if (!(typeof data60 == "number" && (!(data60 % 1) && !isNaN(data60)))) {
                                          const err116 = { instancePath: instancePath + "/planned_model_calls", schemaPath: "#/$defs/OrchestrationRoute/properties/planned_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                          if (vErrors === null) {
                                            vErrors = [err116];
                                          } else {
                                            vErrors.push(err116);
                                          }
                                          errors++;
                                        }
                                        var valid18 = _errs157 === errors;
                                      } else {
                                        var valid18 = true;
                                      }
                                      if (valid18) {
                                        if (data.max_model_calls !== void 0) {
                                          let data61 = data.max_model_calls;
                                          const _errs159 = errors;
                                          if (!(typeof data61 == "number" && (!(data61 % 1) && !isNaN(data61)))) {
                                            const err117 = { instancePath: instancePath + "/max_model_calls", schemaPath: "#/$defs/OrchestrationRoute/properties/max_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                            if (vErrors === null) {
                                              vErrors = [err117];
                                            } else {
                                              vErrors.push(err117);
                                            }
                                            errors++;
                                          }
                                          var valid18 = _errs159 === errors;
                                        } else {
                                          var valid18 = true;
                                        }
                                        if (valid18) {
                                          if (data.max_output_tokens !== void 0) {
                                            let data62 = data.max_output_tokens;
                                            const _errs161 = errors;
                                            if (!(typeof data62 == "number" && (!(data62 % 1) && !isNaN(data62)))) {
                                              const err118 = { instancePath: instancePath + "/max_output_tokens", schemaPath: "#/$defs/OrchestrationRoute/properties/max_output_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                              if (vErrors === null) {
                                                vErrors = [err118];
                                              } else {
                                                vErrors.push(err118);
                                              }
                                              errors++;
                                            }
                                            var valid18 = _errs161 === errors;
                                          } else {
                                            var valid18 = true;
                                          }
                                          if (valid18) {
                                            if (data.estimated_max_cost_microusd !== void 0) {
                                              let data63 = data.estimated_max_cost_microusd;
                                              const _errs163 = errors;
                                              if (!(typeof data63 == "number" && (!(data63 % 1) && !isNaN(data63)))) {
                                                const err119 = { instancePath: instancePath + "/estimated_max_cost_microusd", schemaPath: "#/$defs/OrchestrationRoute/properties/estimated_max_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                if (vErrors === null) {
                                                  vErrors = [err119];
                                                } else {
                                                  vErrors.push(err119);
                                                }
                                                errors++;
                                              }
                                              var valid18 = _errs163 === errors;
                                            } else {
                                              var valid18 = true;
                                            }
                                            if (valid18) {
                                              if (data.max_cost_microusd !== void 0) {
                                                let data64 = data.max_cost_microusd;
                                                const _errs165 = errors;
                                                if (!(typeof data64 == "number" && (!(data64 % 1) && !isNaN(data64)))) {
                                                  const err120 = { instancePath: instancePath + "/max_cost_microusd", schemaPath: "#/$defs/OrchestrationRoute/properties/max_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                  if (vErrors === null) {
                                                    vErrors = [err120];
                                                  } else {
                                                    vErrors.push(err120);
                                                  }
                                                  errors++;
                                                }
                                                var valid18 = _errs165 === errors;
                                              } else {
                                                var valid18 = true;
                                              }
                                              if (valid18) {
                                                if (data.price_catalog_version !== void 0) {
                                                  const _errs167 = errors;
                                                  if (typeof data.price_catalog_version !== "string") {
                                                    const err121 = { instancePath: instancePath + "/price_catalog_version", schemaPath: "#/$defs/OrchestrationRoute/properties/price_catalog_version/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err121];
                                                    } else {
                                                      vErrors.push(err121);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid18 = _errs167 === errors;
                                                } else {
                                                  var valid18 = true;
                                                }
                                                if (valid18) {
                                                  if (data.pricing_warning !== void 0) {
                                                    const _errs169 = errors;
                                                    if (typeof data.pricing_warning !== "string") {
                                                      const err122 = { instancePath: instancePath + "/pricing_warning", schemaPath: "#/$defs/OrchestrationRoute/properties/pricing_warning/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err122];
                                                      } else {
                                                        vErrors.push(err122);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid18 = _errs169 === errors;
                                                  } else {
                                                    var valid18 = true;
                                                  }
                                                  if (valid18) {
                                                    if (data.is_final !== void 0) {
                                                      let data67 = data.is_final;
                                                      const _errs171 = errors;
                                                      if (typeof data67 !== "boolean") {
                                                        const err123 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationRoute/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                        if (vErrors === null) {
                                                          vErrors = [err123];
                                                        } else {
                                                          vErrors.push(err123);
                                                        }
                                                        errors++;
                                                      }
                                                      if (false !== data67) {
                                                        const err124 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationRoute/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                        if (vErrors === null) {
                                                          vErrors = [err124];
                                                        } else {
                                                          vErrors.push(err124);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid18 = _errs171 === errors;
                                                    } else {
                                                      var valid18 = true;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      const err125 = { instancePath, schemaPath: "#/$defs/OrchestrationRoute/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                      if (vErrors === null) {
                        vErrors = [err125];
                      } else {
                        vErrors.push(err125);
                      }
                      errors++;
                    }
                  }
                  var _valid0 = _errs139 === errors;
                  valid0 = valid0 || _valid0;
                  if (!valid0) {
                    const _errs173 = errors;
                    const _errs174 = errors;
                    if (errors === _errs174) {
                      if (data && typeof data == "object" && !Array.isArray(data)) {
                        let missing9;
                        if (data.protocol_version === void 0 && (missing9 = "protocol_version") || data.type === void 0 && (missing9 = "type") || data.run_id === void 0 && (missing9 = "run_id") || data.sequence === void 0 && (missing9 = "sequence") || data.permission === void 0 && (missing9 = "permission") || data.workspace_id === void 0 && (missing9 = "workspace_id") || data.paths === void 0 && (missing9 = "paths") || data.tool === void 0 && (missing9 = "tool") || data.path === void 0 && (missing9 = "path") || data.command === void 0 && (missing9 = "command") || data.preview === void 0 && (missing9 = "preview") || data.risk === void 0 && (missing9 = "risk") || data.is_final === void 0 && (missing9 = "is_final")) {
                          const err126 = { instancePath, schemaPath: "#/$defs/OrchestrationApprovalRequired/required", keyword: "required", params: { missingProperty: missing9 }, message: "must have required property '" + missing9 + "'" };
                          if (vErrors === null) {
                            vErrors = [err126];
                          } else {
                            vErrors.push(err126);
                          }
                          errors++;
                        } else {
                          const _errs176 = errors;
                          for (const key9 in data) {
                            if (!func2.call(schema21.properties, key9)) {
                              const err127 = { instancePath, schemaPath: "#/$defs/OrchestrationApprovalRequired/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key9 }, message: "must NOT have additional properties" };
                              if (vErrors === null) {
                                vErrors = [err127];
                              } else {
                                vErrors.push(err127);
                              }
                              errors++;
                              break;
                            }
                          }
                          if (_errs176 === errors) {
                            if (data.protocol_version !== void 0) {
                              let data68 = data.protocol_version;
                              const _errs177 = errors;
                              if (!(typeof data68 == "number" && (!(data68 % 1) && !isNaN(data68)))) {
                                const err128 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                if (vErrors === null) {
                                  vErrors = [err128];
                                } else {
                                  vErrors.push(err128);
                                }
                                errors++;
                              }
                              if (1 !== data68) {
                                const err129 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                if (vErrors === null) {
                                  vErrors = [err129];
                                } else {
                                  vErrors.push(err129);
                                }
                                errors++;
                              }
                              var valid21 = _errs177 === errors;
                            } else {
                              var valid21 = true;
                            }
                            if (valid21) {
                              if (data.type !== void 0) {
                                let data69 = data.type;
                                const _errs179 = errors;
                                if (typeof data69 !== "string") {
                                  const err130 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err130];
                                  } else {
                                    vErrors.push(err130);
                                  }
                                  errors++;
                                }
                                if ("orchestration_approval_required" !== data69) {
                                  const err131 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_approval_required" }, message: "must be equal to constant" };
                                  if (vErrors === null) {
                                    vErrors = [err131];
                                  } else {
                                    vErrors.push(err131);
                                  }
                                  errors++;
                                }
                                var valid21 = _errs179 === errors;
                              } else {
                                var valid21 = true;
                              }
                              if (valid21) {
                                if (data.run_id !== void 0) {
                                  const _errs181 = errors;
                                  if (typeof data.run_id !== "string") {
                                    const err132 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err132];
                                    } else {
                                      vErrors.push(err132);
                                    }
                                    errors++;
                                  }
                                  var valid21 = _errs181 === errors;
                                } else {
                                  var valid21 = true;
                                }
                                if (valid21) {
                                  if (data.sequence !== void 0) {
                                    let data71 = data.sequence;
                                    const _errs183 = errors;
                                    if (!(typeof data71 == "number" && (!(data71 % 1) && !isNaN(data71)))) {
                                      const err133 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                      if (vErrors === null) {
                                        vErrors = [err133];
                                      } else {
                                        vErrors.push(err133);
                                      }
                                      errors++;
                                    }
                                    var valid21 = _errs183 === errors;
                                  } else {
                                    var valid21 = true;
                                  }
                                  if (valid21) {
                                    if (data.permission !== void 0) {
                                      let data72 = data.permission;
                                      const _errs185 = errors;
                                      if (typeof data72 !== "string") {
                                        const err134 = { instancePath: instancePath + "/permission", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/permission/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err134];
                                        } else {
                                          vErrors.push(err134);
                                        }
                                        errors++;
                                      }
                                      if (!(data72 === "workspace.read" || data72 === "workspace.write" || data72 === "terminal.execute")) {
                                        const err135 = { instancePath: instancePath + "/permission", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/permission/enum", keyword: "enum", params: { allowedValues: schema21.properties.permission.enum }, message: "must be equal to one of the allowed values" };
                                        if (vErrors === null) {
                                          vErrors = [err135];
                                        } else {
                                          vErrors.push(err135);
                                        }
                                        errors++;
                                      }
                                      var valid21 = _errs185 === errors;
                                    } else {
                                      var valid21 = true;
                                    }
                                    if (valid21) {
                                      if (data.workspace_id !== void 0) {
                                        const _errs187 = errors;
                                        if (typeof data.workspace_id !== "string") {
                                          const err136 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                          if (vErrors === null) {
                                            vErrors = [err136];
                                          } else {
                                            vErrors.push(err136);
                                          }
                                          errors++;
                                        }
                                        var valid21 = _errs187 === errors;
                                      } else {
                                        var valid21 = true;
                                      }
                                      if (valid21) {
                                        if (data.paths !== void 0) {
                                          let data74 = data.paths;
                                          const _errs189 = errors;
                                          if (errors === _errs189) {
                                            if (Array.isArray(data74)) {
                                              var valid22 = true;
                                              const len1 = data74.length;
                                              for (let i1 = 0; i1 < len1; i1++) {
                                                const _errs191 = errors;
                                                if (typeof data74[i1] !== "string") {
                                                  const err137 = { instancePath: instancePath + "/paths/" + i1, schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/paths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err137];
                                                  } else {
                                                    vErrors.push(err137);
                                                  }
                                                  errors++;
                                                }
                                                var valid22 = _errs191 === errors;
                                                if (!valid22) {
                                                  break;
                                                }
                                              }
                                            } else {
                                              const err138 = { instancePath: instancePath + "/paths", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/paths/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                              if (vErrors === null) {
                                                vErrors = [err138];
                                              } else {
                                                vErrors.push(err138);
                                              }
                                              errors++;
                                            }
                                          }
                                          var valid21 = _errs189 === errors;
                                        } else {
                                          var valid21 = true;
                                        }
                                        if (valid21) {
                                          if (data.tool !== void 0) {
                                            let data76 = data.tool;
                                            const _errs193 = errors;
                                            const _errs194 = errors;
                                            let valid23 = false;
                                            const _errs195 = errors;
                                            if (typeof data76 !== "string") {
                                              const err139 = { instancePath: instancePath + "/tool", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/tool/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err139];
                                              } else {
                                                vErrors.push(err139);
                                              }
                                              errors++;
                                            }
                                            if (!(data76 === "workspace.write" || data76 === "terminal.execute" || data76 === "knowledge.search")) {
                                              const err140 = { instancePath: instancePath + "/tool", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/tool/anyOf/0/enum", keyword: "enum", params: { allowedValues: schema21.properties.tool.anyOf[0].enum }, message: "must be equal to one of the allowed values" };
                                              if (vErrors === null) {
                                                vErrors = [err140];
                                              } else {
                                                vErrors.push(err140);
                                              }
                                              errors++;
                                            }
                                            var _valid1 = _errs195 === errors;
                                            valid23 = valid23 || _valid1;
                                            if (!valid23) {
                                              const _errs197 = errors;
                                              if (data76 !== null) {
                                                const err141 = { instancePath: instancePath + "/tool", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/tool/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                if (vErrors === null) {
                                                  vErrors = [err141];
                                                } else {
                                                  vErrors.push(err141);
                                                }
                                                errors++;
                                              }
                                              var _valid1 = _errs197 === errors;
                                              valid23 = valid23 || _valid1;
                                            }
                                            if (!valid23) {
                                              const err142 = { instancePath: instancePath + "/tool", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/tool/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                              if (vErrors === null) {
                                                vErrors = [err142];
                                              } else {
                                                vErrors.push(err142);
                                              }
                                              errors++;
                                            } else {
                                              errors = _errs194;
                                              if (vErrors !== null) {
                                                if (_errs194) {
                                                  vErrors.length = _errs194;
                                                } else {
                                                  vErrors = null;
                                                }
                                              }
                                            }
                                            var valid21 = _errs193 === errors;
                                          } else {
                                            var valid21 = true;
                                          }
                                          if (valid21) {
                                            if (data.path !== void 0) {
                                              const _errs199 = errors;
                                              if (typeof data.path !== "string") {
                                                const err143 = { instancePath: instancePath + "/path", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err143];
                                                } else {
                                                  vErrors.push(err143);
                                                }
                                                errors++;
                                              }
                                              var valid21 = _errs199 === errors;
                                            } else {
                                              var valid21 = true;
                                            }
                                            if (valid21) {
                                              if (data.command !== void 0) {
                                                let data78 = data.command;
                                                const _errs201 = errors;
                                                if (errors === _errs201) {
                                                  if (Array.isArray(data78)) {
                                                    var valid24 = true;
                                                    const len2 = data78.length;
                                                    for (let i2 = 0; i2 < len2; i2++) {
                                                      const _errs203 = errors;
                                                      if (typeof data78[i2] !== "string") {
                                                        const err144 = { instancePath: instancePath + "/command/" + i2, schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/command/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err144];
                                                        } else {
                                                          vErrors.push(err144);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid24 = _errs203 === errors;
                                                      if (!valid24) {
                                                        break;
                                                      }
                                                    }
                                                  } else {
                                                    const err145 = { instancePath: instancePath + "/command", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/command/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                    if (vErrors === null) {
                                                      vErrors = [err145];
                                                    } else {
                                                      vErrors.push(err145);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                                var valid21 = _errs201 === errors;
                                              } else {
                                                var valid21 = true;
                                              }
                                              if (valid21) {
                                                if (data.preview !== void 0) {
                                                  const _errs205 = errors;
                                                  if (typeof data.preview !== "string") {
                                                    const err146 = { instancePath: instancePath + "/preview", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/preview/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err146];
                                                    } else {
                                                      vErrors.push(err146);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid21 = _errs205 === errors;
                                                } else {
                                                  var valid21 = true;
                                                }
                                                if (valid21) {
                                                  if (data.risk !== void 0) {
                                                    let data81 = data.risk;
                                                    const _errs207 = errors;
                                                    const _errs208 = errors;
                                                    let valid25 = false;
                                                    const _errs209 = errors;
                                                    if (typeof data81 !== "string") {
                                                      const err147 = { instancePath: instancePath + "/risk", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/risk/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err147];
                                                      } else {
                                                        vErrors.push(err147);
                                                      }
                                                      errors++;
                                                    }
                                                    if (!(data81 === "medium" || data81 === "high")) {
                                                      const err148 = { instancePath: instancePath + "/risk", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/risk/anyOf/0/enum", keyword: "enum", params: { allowedValues: schema21.properties.risk.anyOf[0].enum }, message: "must be equal to one of the allowed values" };
                                                      if (vErrors === null) {
                                                        vErrors = [err148];
                                                      } else {
                                                        vErrors.push(err148);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid2 = _errs209 === errors;
                                                    valid25 = valid25 || _valid2;
                                                    if (!valid25) {
                                                      const _errs211 = errors;
                                                      if (data81 !== null) {
                                                        const err149 = { instancePath: instancePath + "/risk", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/risk/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err149];
                                                        } else {
                                                          vErrors.push(err149);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid2 = _errs211 === errors;
                                                      valid25 = valid25 || _valid2;
                                                    }
                                                    if (!valid25) {
                                                      const err150 = { instancePath: instancePath + "/risk", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/risk/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                      if (vErrors === null) {
                                                        vErrors = [err150];
                                                      } else {
                                                        vErrors.push(err150);
                                                      }
                                                      errors++;
                                                    } else {
                                                      errors = _errs208;
                                                      if (vErrors !== null) {
                                                        if (_errs208) {
                                                          vErrors.length = _errs208;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid21 = _errs207 === errors;
                                                  } else {
                                                    var valid21 = true;
                                                  }
                                                  if (valid21) {
                                                    if (data.is_final !== void 0) {
                                                      let data82 = data.is_final;
                                                      const _errs213 = errors;
                                                      if (typeof data82 !== "boolean") {
                                                        const err151 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                        if (vErrors === null) {
                                                          vErrors = [err151];
                                                        } else {
                                                          vErrors.push(err151);
                                                        }
                                                        errors++;
                                                      }
                                                      if (false !== data82) {
                                                        const err152 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                        if (vErrors === null) {
                                                          vErrors = [err152];
                                                        } else {
                                                          vErrors.push(err152);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid21 = _errs213 === errors;
                                                    } else {
                                                      var valid21 = true;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      } else {
                        const err153 = { instancePath, schemaPath: "#/$defs/OrchestrationApprovalRequired/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                        if (vErrors === null) {
                          vErrors = [err153];
                        } else {
                          vErrors.push(err153);
                        }
                        errors++;
                      }
                    }
                    var _valid0 = _errs173 === errors;
                    valid0 = valid0 || _valid0;
                    if (!valid0) {
                      const _errs215 = errors;
                      const _errs216 = errors;
                      if (errors === _errs216) {
                        if (data && typeof data == "object" && !Array.isArray(data)) {
                          let missing10;
                          if (data.protocol_version === void 0 && (missing10 = "protocol_version") || data.type === void 0 && (missing10 = "type") || data.run_id === void 0 && (missing10 = "run_id") || data.sequence === void 0 && (missing10 = "sequence") || data.input_tokens === void 0 && (missing10 = "input_tokens") || data.output_tokens === void 0 && (missing10 = "output_tokens") || data.actual_cost_microusd === void 0 && (missing10 = "actual_cost_microusd") || data.is_final === void 0 && (missing10 = "is_final")) {
                            const err154 = { instancePath, schemaPath: "#/$defs/OrchestrationUsage/required", keyword: "required", params: { missingProperty: missing10 }, message: "must have required property '" + missing10 + "'" };
                            if (vErrors === null) {
                              vErrors = [err154];
                            } else {
                              vErrors.push(err154);
                            }
                            errors++;
                          } else {
                            const _errs218 = errors;
                            for (const key10 in data) {
                              if (!(key10 === "protocol_version" || key10 === "type" || key10 === "run_id" || key10 === "sequence" || key10 === "input_tokens" || key10 === "output_tokens" || key10 === "actual_cost_microusd" || key10 === "is_final")) {
                                const err155 = { instancePath, schemaPath: "#/$defs/OrchestrationUsage/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key10 }, message: "must NOT have additional properties" };
                                if (vErrors === null) {
                                  vErrors = [err155];
                                } else {
                                  vErrors.push(err155);
                                }
                                errors++;
                                break;
                              }
                            }
                            if (_errs218 === errors) {
                              if (data.protocol_version !== void 0) {
                                let data83 = data.protocol_version;
                                const _errs219 = errors;
                                if (!(typeof data83 == "number" && (!(data83 % 1) && !isNaN(data83)))) {
                                  const err156 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationUsage/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                  if (vErrors === null) {
                                    vErrors = [err156];
                                  } else {
                                    vErrors.push(err156);
                                  }
                                  errors++;
                                }
                                if (1 !== data83) {
                                  const err157 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationUsage/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                  if (vErrors === null) {
                                    vErrors = [err157];
                                  } else {
                                    vErrors.push(err157);
                                  }
                                  errors++;
                                }
                                var valid27 = _errs219 === errors;
                              } else {
                                var valid27 = true;
                              }
                              if (valid27) {
                                if (data.type !== void 0) {
                                  let data84 = data.type;
                                  const _errs221 = errors;
                                  if (typeof data84 !== "string") {
                                    const err158 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationUsage/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err158];
                                    } else {
                                      vErrors.push(err158);
                                    }
                                    errors++;
                                  }
                                  if ("orchestration_usage" !== data84) {
                                    const err159 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationUsage/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_usage" }, message: "must be equal to constant" };
                                    if (vErrors === null) {
                                      vErrors = [err159];
                                    } else {
                                      vErrors.push(err159);
                                    }
                                    errors++;
                                  }
                                  var valid27 = _errs221 === errors;
                                } else {
                                  var valid27 = true;
                                }
                                if (valid27) {
                                  if (data.run_id !== void 0) {
                                    const _errs223 = errors;
                                    if (typeof data.run_id !== "string") {
                                      const err160 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationUsage/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err160];
                                      } else {
                                        vErrors.push(err160);
                                      }
                                      errors++;
                                    }
                                    var valid27 = _errs223 === errors;
                                  } else {
                                    var valid27 = true;
                                  }
                                  if (valid27) {
                                    if (data.sequence !== void 0) {
                                      let data86 = data.sequence;
                                      const _errs225 = errors;
                                      if (!(typeof data86 == "number" && (!(data86 % 1) && !isNaN(data86)))) {
                                        const err161 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationUsage/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                        if (vErrors === null) {
                                          vErrors = [err161];
                                        } else {
                                          vErrors.push(err161);
                                        }
                                        errors++;
                                      }
                                      var valid27 = _errs225 === errors;
                                    } else {
                                      var valid27 = true;
                                    }
                                    if (valid27) {
                                      if (data.input_tokens !== void 0) {
                                        let data87 = data.input_tokens;
                                        const _errs227 = errors;
                                        if (!(typeof data87 == "number" && (!(data87 % 1) && !isNaN(data87)))) {
                                          const err162 = { instancePath: instancePath + "/input_tokens", schemaPath: "#/$defs/OrchestrationUsage/properties/input_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                          if (vErrors === null) {
                                            vErrors = [err162];
                                          } else {
                                            vErrors.push(err162);
                                          }
                                          errors++;
                                        }
                                        var valid27 = _errs227 === errors;
                                      } else {
                                        var valid27 = true;
                                      }
                                      if (valid27) {
                                        if (data.output_tokens !== void 0) {
                                          let data88 = data.output_tokens;
                                          const _errs229 = errors;
                                          if (!(typeof data88 == "number" && (!(data88 % 1) && !isNaN(data88)))) {
                                            const err163 = { instancePath: instancePath + "/output_tokens", schemaPath: "#/$defs/OrchestrationUsage/properties/output_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                            if (vErrors === null) {
                                              vErrors = [err163];
                                            } else {
                                              vErrors.push(err163);
                                            }
                                            errors++;
                                          }
                                          var valid27 = _errs229 === errors;
                                        } else {
                                          var valid27 = true;
                                        }
                                        if (valid27) {
                                          if (data.actual_cost_microusd !== void 0) {
                                            let data89 = data.actual_cost_microusd;
                                            const _errs231 = errors;
                                            if (!(typeof data89 == "number" && (!(data89 % 1) && !isNaN(data89)))) {
                                              const err164 = { instancePath: instancePath + "/actual_cost_microusd", schemaPath: "#/$defs/OrchestrationUsage/properties/actual_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                              if (vErrors === null) {
                                                vErrors = [err164];
                                              } else {
                                                vErrors.push(err164);
                                              }
                                              errors++;
                                            }
                                            var valid27 = _errs231 === errors;
                                          } else {
                                            var valid27 = true;
                                          }
                                          if (valid27) {
                                            if (data.is_final !== void 0) {
                                              let data90 = data.is_final;
                                              const _errs233 = errors;
                                              if (typeof data90 !== "boolean") {
                                                const err165 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationUsage/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                if (vErrors === null) {
                                                  vErrors = [err165];
                                                } else {
                                                  vErrors.push(err165);
                                                }
                                                errors++;
                                              }
                                              if (false !== data90) {
                                                const err166 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationUsage/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                if (vErrors === null) {
                                                  vErrors = [err166];
                                                } else {
                                                  vErrors.push(err166);
                                                }
                                                errors++;
                                              }
                                              var valid27 = _errs233 === errors;
                                            } else {
                                              var valid27 = true;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          const err167 = { instancePath, schemaPath: "#/$defs/OrchestrationUsage/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                          if (vErrors === null) {
                            vErrors = [err167];
                          } else {
                            vErrors.push(err167);
                          }
                          errors++;
                        }
                      }
                      var _valid0 = _errs215 === errors;
                      valid0 = valid0 || _valid0;
                      if (!valid0) {
                        const _errs235 = errors;
                        const _errs236 = errors;
                        if (errors === _errs236) {
                          if (data && typeof data == "object" && !Array.isArray(data)) {
                            let missing11;
                            if (data.protocol_version === void 0 && (missing11 = "protocol_version") || data.type === void 0 && (missing11 = "type") || data.run_id === void 0 && (missing11 = "run_id") || data.sequence === void 0 && (missing11 = "sequence") || data.tool === void 0 && (missing11 = "tool") || data.status === void 0 && (missing11 = "status") || data.result === void 0 && (missing11 = "result") || data.is_final === void 0 && (missing11 = "is_final")) {
                              const err168 = { instancePath, schemaPath: "#/$defs/OrchestrationToolResult/required", keyword: "required", params: { missingProperty: missing11 }, message: "must have required property '" + missing11 + "'" };
                              if (vErrors === null) {
                                vErrors = [err168];
                              } else {
                                vErrors.push(err168);
                              }
                              errors++;
                            } else {
                              const _errs238 = errors;
                              for (const key11 in data) {
                                if (!(key11 === "protocol_version" || key11 === "type" || key11 === "run_id" || key11 === "sequence" || key11 === "tool" || key11 === "status" || key11 === "result" || key11 === "is_final")) {
                                  const err169 = { instancePath, schemaPath: "#/$defs/OrchestrationToolResult/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key11 }, message: "must NOT have additional properties" };
                                  if (vErrors === null) {
                                    vErrors = [err169];
                                  } else {
                                    vErrors.push(err169);
                                  }
                                  errors++;
                                  break;
                                }
                              }
                              if (_errs238 === errors) {
                                if (data.protocol_version !== void 0) {
                                  let data91 = data.protocol_version;
                                  const _errs239 = errors;
                                  if (!(typeof data91 == "number" && (!(data91 % 1) && !isNaN(data91)))) {
                                    const err170 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationToolResult/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                    if (vErrors === null) {
                                      vErrors = [err170];
                                    } else {
                                      vErrors.push(err170);
                                    }
                                    errors++;
                                  }
                                  if (1 !== data91) {
                                    const err171 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationToolResult/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                    if (vErrors === null) {
                                      vErrors = [err171];
                                    } else {
                                      vErrors.push(err171);
                                    }
                                    errors++;
                                  }
                                  var valid29 = _errs239 === errors;
                                } else {
                                  var valid29 = true;
                                }
                                if (valid29) {
                                  if (data.type !== void 0) {
                                    let data92 = data.type;
                                    const _errs241 = errors;
                                    if (typeof data92 !== "string") {
                                      const err172 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationToolResult/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err172];
                                      } else {
                                        vErrors.push(err172);
                                      }
                                      errors++;
                                    }
                                    if ("orchestration_tool_result" !== data92) {
                                      const err173 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationToolResult/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_tool_result" }, message: "must be equal to constant" };
                                      if (vErrors === null) {
                                        vErrors = [err173];
                                      } else {
                                        vErrors.push(err173);
                                      }
                                      errors++;
                                    }
                                    var valid29 = _errs241 === errors;
                                  } else {
                                    var valid29 = true;
                                  }
                                  if (valid29) {
                                    if (data.run_id !== void 0) {
                                      const _errs243 = errors;
                                      if (typeof data.run_id !== "string") {
                                        const err174 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationToolResult/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err174];
                                        } else {
                                          vErrors.push(err174);
                                        }
                                        errors++;
                                      }
                                      var valid29 = _errs243 === errors;
                                    } else {
                                      var valid29 = true;
                                    }
                                    if (valid29) {
                                      if (data.sequence !== void 0) {
                                        let data94 = data.sequence;
                                        const _errs245 = errors;
                                        if (!(typeof data94 == "number" && (!(data94 % 1) && !isNaN(data94)))) {
                                          const err175 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationToolResult/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                          if (vErrors === null) {
                                            vErrors = [err175];
                                          } else {
                                            vErrors.push(err175);
                                          }
                                          errors++;
                                        }
                                        var valid29 = _errs245 === errors;
                                      } else {
                                        var valid29 = true;
                                      }
                                      if (valid29) {
                                        if (data.tool !== void 0) {
                                          let data95 = data.tool;
                                          const _errs247 = errors;
                                          if (typeof data95 !== "string") {
                                            const err176 = { instancePath: instancePath + "/tool", schemaPath: "#/$defs/OrchestrationToolResult/properties/tool/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err176];
                                            } else {
                                              vErrors.push(err176);
                                            }
                                            errors++;
                                          }
                                          if (!(data95 === "workspace.write" || data95 === "terminal.execute" || data95 === "knowledge.search")) {
                                            const err177 = { instancePath: instancePath + "/tool", schemaPath: "#/$defs/OrchestrationToolResult/properties/tool/enum", keyword: "enum", params: { allowedValues: schema23.properties.tool.enum }, message: "must be equal to one of the allowed values" };
                                            if (vErrors === null) {
                                              vErrors = [err177];
                                            } else {
                                              vErrors.push(err177);
                                            }
                                            errors++;
                                          }
                                          var valid29 = _errs247 === errors;
                                        } else {
                                          var valid29 = true;
                                        }
                                        if (valid29) {
                                          if (data.status !== void 0) {
                                            let data96 = data.status;
                                            const _errs249 = errors;
                                            if (typeof data96 !== "string") {
                                              const err178 = { instancePath: instancePath + "/status", schemaPath: "#/$defs/OrchestrationToolResult/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err178];
                                              } else {
                                                vErrors.push(err178);
                                              }
                                              errors++;
                                            }
                                            if (!(data96 === "completed" || data96 === "failed")) {
                                              const err179 = { instancePath: instancePath + "/status", schemaPath: "#/$defs/OrchestrationToolResult/properties/status/enum", keyword: "enum", params: { allowedValues: schema23.properties.status.enum }, message: "must be equal to one of the allowed values" };
                                              if (vErrors === null) {
                                                vErrors = [err179];
                                              } else {
                                                vErrors.push(err179);
                                              }
                                              errors++;
                                            }
                                            var valid29 = _errs249 === errors;
                                          } else {
                                            var valid29 = true;
                                          }
                                          if (valid29) {
                                            if (data.result !== void 0) {
                                              const _errs251 = errors;
                                              if (typeof data.result !== "string") {
                                                const err180 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/OrchestrationToolResult/properties/result/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err180];
                                                } else {
                                                  vErrors.push(err180);
                                                }
                                                errors++;
                                              }
                                              var valid29 = _errs251 === errors;
                                            } else {
                                              var valid29 = true;
                                            }
                                            if (valid29) {
                                              if (data.is_final !== void 0) {
                                                let data98 = data.is_final;
                                                const _errs253 = errors;
                                                if (typeof data98 !== "boolean") {
                                                  const err181 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationToolResult/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                  if (vErrors === null) {
                                                    vErrors = [err181];
                                                  } else {
                                                    vErrors.push(err181);
                                                  }
                                                  errors++;
                                                }
                                                if (false !== data98) {
                                                  const err182 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationToolResult/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                  if (vErrors === null) {
                                                    vErrors = [err182];
                                                  } else {
                                                    vErrors.push(err182);
                                                  }
                                                  errors++;
                                                }
                                                var valid29 = _errs253 === errors;
                                              } else {
                                                var valid29 = true;
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          } else {
                            const err183 = { instancePath, schemaPath: "#/$defs/OrchestrationToolResult/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                            if (vErrors === null) {
                              vErrors = [err183];
                            } else {
                              vErrors.push(err183);
                            }
                            errors++;
                          }
                        }
                        var _valid0 = _errs235 === errors;
                        valid0 = valid0 || _valid0;
                        if (!valid0) {
                          const _errs255 = errors;
                          const _errs256 = errors;
                          if (errors === _errs256) {
                            if (data && typeof data == "object" && !Array.isArray(data)) {
                              let missing12;
                              if (data.protocol_version === void 0 && (missing12 = "protocol_version") || data.type === void 0 && (missing12 = "type") || data.run_id === void 0 && (missing12 = "run_id") || data.sequence === void 0 && (missing12 = "sequence") || data.agent_id === void 0 && (missing12 = "agent_id") || data.phase === void 0 && (missing12 = "phase") || data.attempt === void 0 && (missing12 = "attempt") || data.message === void 0 && (missing12 = "message") || data.is_final === void 0 && (missing12 = "is_final")) {
                                const err184 = { instancePath, schemaPath: "#/$defs/OrchestrationRetrying/required", keyword: "required", params: { missingProperty: missing12 }, message: "must have required property '" + missing12 + "'" };
                                if (vErrors === null) {
                                  vErrors = [err184];
                                } else {
                                  vErrors.push(err184);
                                }
                                errors++;
                              } else {
                                const _errs258 = errors;
                                for (const key12 in data) {
                                  if (!func2.call(schema24.properties, key12)) {
                                    const err185 = { instancePath, schemaPath: "#/$defs/OrchestrationRetrying/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key12 }, message: "must NOT have additional properties" };
                                    if (vErrors === null) {
                                      vErrors = [err185];
                                    } else {
                                      vErrors.push(err185);
                                    }
                                    errors++;
                                    break;
                                  }
                                }
                                if (_errs258 === errors) {
                                  if (data.protocol_version !== void 0) {
                                    let data99 = data.protocol_version;
                                    const _errs259 = errors;
                                    if (!(typeof data99 == "number" && (!(data99 % 1) && !isNaN(data99)))) {
                                      const err186 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationRetrying/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                      if (vErrors === null) {
                                        vErrors = [err186];
                                      } else {
                                        vErrors.push(err186);
                                      }
                                      errors++;
                                    }
                                    if (1 !== data99) {
                                      const err187 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationRetrying/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                      if (vErrors === null) {
                                        vErrors = [err187];
                                      } else {
                                        vErrors.push(err187);
                                      }
                                      errors++;
                                    }
                                    var valid31 = _errs259 === errors;
                                  } else {
                                    var valid31 = true;
                                  }
                                  if (valid31) {
                                    if (data.type !== void 0) {
                                      let data100 = data.type;
                                      const _errs261 = errors;
                                      if (typeof data100 !== "string") {
                                        const err188 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationRetrying/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err188];
                                        } else {
                                          vErrors.push(err188);
                                        }
                                        errors++;
                                      }
                                      if ("orchestration_retrying" !== data100) {
                                        const err189 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationRetrying/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_retrying" }, message: "must be equal to constant" };
                                        if (vErrors === null) {
                                          vErrors = [err189];
                                        } else {
                                          vErrors.push(err189);
                                        }
                                        errors++;
                                      }
                                      var valid31 = _errs261 === errors;
                                    } else {
                                      var valid31 = true;
                                    }
                                    if (valid31) {
                                      if (data.run_id !== void 0) {
                                        const _errs263 = errors;
                                        if (typeof data.run_id !== "string") {
                                          const err190 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationRetrying/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                          if (vErrors === null) {
                                            vErrors = [err190];
                                          } else {
                                            vErrors.push(err190);
                                          }
                                          errors++;
                                        }
                                        var valid31 = _errs263 === errors;
                                      } else {
                                        var valid31 = true;
                                      }
                                      if (valid31) {
                                        if (data.sequence !== void 0) {
                                          let data102 = data.sequence;
                                          const _errs265 = errors;
                                          if (!(typeof data102 == "number" && (!(data102 % 1) && !isNaN(data102)))) {
                                            const err191 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationRetrying/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                            if (vErrors === null) {
                                              vErrors = [err191];
                                            } else {
                                              vErrors.push(err191);
                                            }
                                            errors++;
                                          }
                                          var valid31 = _errs265 === errors;
                                        } else {
                                          var valid31 = true;
                                        }
                                        if (valid31) {
                                          if (data.agent_id !== void 0) {
                                            const _errs267 = errors;
                                            if (typeof data.agent_id !== "string") {
                                              const err192 = { instancePath: instancePath + "/agent_id", schemaPath: "#/$defs/OrchestrationRetrying/properties/agent_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err192];
                                              } else {
                                                vErrors.push(err192);
                                              }
                                              errors++;
                                            }
                                            var valid31 = _errs267 === errors;
                                          } else {
                                            var valid31 = true;
                                          }
                                          if (valid31) {
                                            if (data.phase !== void 0) {
                                              let data104 = data.phase;
                                              const _errs269 = errors;
                                              if (typeof data104 !== "string") {
                                                const err193 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationRetrying/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err193];
                                                } else {
                                                  vErrors.push(err193);
                                                }
                                                errors++;
                                              }
                                              if (!(data104 === "analysis" || data104 === "review" || data104 === "synthesis")) {
                                                const err194 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationRetrying/properties/phase/enum", keyword: "enum", params: { allowedValues: schema24.properties.phase.enum }, message: "must be equal to one of the allowed values" };
                                                if (vErrors === null) {
                                                  vErrors = [err194];
                                                } else {
                                                  vErrors.push(err194);
                                                }
                                                errors++;
                                              }
                                              var valid31 = _errs269 === errors;
                                            } else {
                                              var valid31 = true;
                                            }
                                            if (valid31) {
                                              if (data.attempt !== void 0) {
                                                let data105 = data.attempt;
                                                const _errs271 = errors;
                                                if (!(typeof data105 == "number" && (!(data105 % 1) && !isNaN(data105)))) {
                                                  const err195 = { instancePath: instancePath + "/attempt", schemaPath: "#/$defs/OrchestrationRetrying/properties/attempt/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                  if (vErrors === null) {
                                                    vErrors = [err195];
                                                  } else {
                                                    vErrors.push(err195);
                                                  }
                                                  errors++;
                                                }
                                                if (errors === _errs271) {
                                                  if (typeof data105 == "number") {
                                                    if (data105 > 3 || isNaN(data105)) {
                                                      const err196 = { instancePath: instancePath + "/attempt", schemaPath: "#/$defs/OrchestrationRetrying/properties/attempt/maximum", keyword: "maximum", params: { comparison: "<=", limit: 3 }, message: "must be <= 3" };
                                                      if (vErrors === null) {
                                                        vErrors = [err196];
                                                      } else {
                                                        vErrors.push(err196);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (data105 < 2 || isNaN(data105)) {
                                                        const err197 = { instancePath: instancePath + "/attempt", schemaPath: "#/$defs/OrchestrationRetrying/properties/attempt/minimum", keyword: "minimum", params: { comparison: ">=", limit: 2 }, message: "must be >= 2" };
                                                        if (vErrors === null) {
                                                          vErrors = [err197];
                                                        } else {
                                                          vErrors.push(err197);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                  }
                                                }
                                                var valid31 = _errs271 === errors;
                                              } else {
                                                var valid31 = true;
                                              }
                                              if (valid31) {
                                                if (data.message !== void 0) {
                                                  const _errs273 = errors;
                                                  if (typeof data.message !== "string") {
                                                    const err198 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/OrchestrationRetrying/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err198];
                                                    } else {
                                                      vErrors.push(err198);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid31 = _errs273 === errors;
                                                } else {
                                                  var valid31 = true;
                                                }
                                                if (valid31) {
                                                  if (data.is_final !== void 0) {
                                                    let data107 = data.is_final;
                                                    const _errs275 = errors;
                                                    if (typeof data107 !== "boolean") {
                                                      const err199 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationRetrying/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                      if (vErrors === null) {
                                                        vErrors = [err199];
                                                      } else {
                                                        vErrors.push(err199);
                                                      }
                                                      errors++;
                                                    }
                                                    if (false !== data107) {
                                                      const err200 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationRetrying/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                      if (vErrors === null) {
                                                        vErrors = [err200];
                                                      } else {
                                                        vErrors.push(err200);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid31 = _errs275 === errors;
                                                  } else {
                                                    var valid31 = true;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            } else {
                              const err201 = { instancePath, schemaPath: "#/$defs/OrchestrationRetrying/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                              if (vErrors === null) {
                                vErrors = [err201];
                              } else {
                                vErrors.push(err201);
                              }
                              errors++;
                            }
                          }
                          var _valid0 = _errs255 === errors;
                          valid0 = valid0 || _valid0;
                          if (!valid0) {
                            const _errs277 = errors;
                            const _errs278 = errors;
                            if (errors === _errs278) {
                              if (data && typeof data == "object" && !Array.isArray(data)) {
                                let missing13;
                                if (data.protocol_version === void 0 && (missing13 = "protocol_version") || data.type === void 0 && (missing13 = "type") || data.run_id === void 0 && (missing13 = "run_id") || data.sequence === void 0 && (missing13 = "sequence") || data.agent_id === void 0 && (missing13 = "agent_id") || data.phase === void 0 && (missing13 = "phase") || data.from_connection_id === void 0 && (missing13 = "from_connection_id") || data.to_connection_id === void 0 && (missing13 = "to_connection_id") || data.message === void 0 && (missing13 = "message") || data.is_final === void 0 && (missing13 = "is_final")) {
                                  const err202 = { instancePath, schemaPath: "#/$defs/OrchestrationFallback/required", keyword: "required", params: { missingProperty: missing13 }, message: "must have required property '" + missing13 + "'" };
                                  if (vErrors === null) {
                                    vErrors = [err202];
                                  } else {
                                    vErrors.push(err202);
                                  }
                                  errors++;
                                } else {
                                  const _errs280 = errors;
                                  for (const key13 in data) {
                                    if (!func2.call(schema25.properties, key13)) {
                                      const err203 = { instancePath, schemaPath: "#/$defs/OrchestrationFallback/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key13 }, message: "must NOT have additional properties" };
                                      if (vErrors === null) {
                                        vErrors = [err203];
                                      } else {
                                        vErrors.push(err203);
                                      }
                                      errors++;
                                      break;
                                    }
                                  }
                                  if (_errs280 === errors) {
                                    if (data.protocol_version !== void 0) {
                                      let data108 = data.protocol_version;
                                      const _errs281 = errors;
                                      if (!(typeof data108 == "number" && (!(data108 % 1) && !isNaN(data108)))) {
                                        const err204 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationFallback/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                        if (vErrors === null) {
                                          vErrors = [err204];
                                        } else {
                                          vErrors.push(err204);
                                        }
                                        errors++;
                                      }
                                      if (1 !== data108) {
                                        const err205 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationFallback/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                        if (vErrors === null) {
                                          vErrors = [err205];
                                        } else {
                                          vErrors.push(err205);
                                        }
                                        errors++;
                                      }
                                      var valid33 = _errs281 === errors;
                                    } else {
                                      var valid33 = true;
                                    }
                                    if (valid33) {
                                      if (data.type !== void 0) {
                                        let data109 = data.type;
                                        const _errs283 = errors;
                                        if (typeof data109 !== "string") {
                                          const err206 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationFallback/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                          if (vErrors === null) {
                                            vErrors = [err206];
                                          } else {
                                            vErrors.push(err206);
                                          }
                                          errors++;
                                        }
                                        if ("orchestration_fallback" !== data109) {
                                          const err207 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationFallback/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_fallback" }, message: "must be equal to constant" };
                                          if (vErrors === null) {
                                            vErrors = [err207];
                                          } else {
                                            vErrors.push(err207);
                                          }
                                          errors++;
                                        }
                                        var valid33 = _errs283 === errors;
                                      } else {
                                        var valid33 = true;
                                      }
                                      if (valid33) {
                                        if (data.run_id !== void 0) {
                                          const _errs285 = errors;
                                          if (typeof data.run_id !== "string") {
                                            const err208 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationFallback/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err208];
                                            } else {
                                              vErrors.push(err208);
                                            }
                                            errors++;
                                          }
                                          var valid33 = _errs285 === errors;
                                        } else {
                                          var valid33 = true;
                                        }
                                        if (valid33) {
                                          if (data.sequence !== void 0) {
                                            let data111 = data.sequence;
                                            const _errs287 = errors;
                                            if (!(typeof data111 == "number" && (!(data111 % 1) && !isNaN(data111)))) {
                                              const err209 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationFallback/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                              if (vErrors === null) {
                                                vErrors = [err209];
                                              } else {
                                                vErrors.push(err209);
                                              }
                                              errors++;
                                            }
                                            var valid33 = _errs287 === errors;
                                          } else {
                                            var valid33 = true;
                                          }
                                          if (valid33) {
                                            if (data.agent_id !== void 0) {
                                              const _errs289 = errors;
                                              if (typeof data.agent_id !== "string") {
                                                const err210 = { instancePath: instancePath + "/agent_id", schemaPath: "#/$defs/OrchestrationFallback/properties/agent_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err210];
                                                } else {
                                                  vErrors.push(err210);
                                                }
                                                errors++;
                                              }
                                              var valid33 = _errs289 === errors;
                                            } else {
                                              var valid33 = true;
                                            }
                                            if (valid33) {
                                              if (data.phase !== void 0) {
                                                let data113 = data.phase;
                                                const _errs291 = errors;
                                                if (typeof data113 !== "string") {
                                                  const err211 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationFallback/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err211];
                                                  } else {
                                                    vErrors.push(err211);
                                                  }
                                                  errors++;
                                                }
                                                if (!(data113 === "analysis" || data113 === "review" || data113 === "synthesis")) {
                                                  const err212 = { instancePath: instancePath + "/phase", schemaPath: "#/$defs/OrchestrationFallback/properties/phase/enum", keyword: "enum", params: { allowedValues: schema25.properties.phase.enum }, message: "must be equal to one of the allowed values" };
                                                  if (vErrors === null) {
                                                    vErrors = [err212];
                                                  } else {
                                                    vErrors.push(err212);
                                                  }
                                                  errors++;
                                                }
                                                var valid33 = _errs291 === errors;
                                              } else {
                                                var valid33 = true;
                                              }
                                              if (valid33) {
                                                if (data.from_connection_id !== void 0) {
                                                  const _errs293 = errors;
                                                  if (typeof data.from_connection_id !== "string") {
                                                    const err213 = { instancePath: instancePath + "/from_connection_id", schemaPath: "#/$defs/OrchestrationFallback/properties/from_connection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err213];
                                                    } else {
                                                      vErrors.push(err213);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid33 = _errs293 === errors;
                                                } else {
                                                  var valid33 = true;
                                                }
                                                if (valid33) {
                                                  if (data.to_connection_id !== void 0) {
                                                    const _errs295 = errors;
                                                    if (typeof data.to_connection_id !== "string") {
                                                      const err214 = { instancePath: instancePath + "/to_connection_id", schemaPath: "#/$defs/OrchestrationFallback/properties/to_connection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err214];
                                                      } else {
                                                        vErrors.push(err214);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid33 = _errs295 === errors;
                                                  } else {
                                                    var valid33 = true;
                                                  }
                                                  if (valid33) {
                                                    if (data.message !== void 0) {
                                                      const _errs297 = errors;
                                                      if (typeof data.message !== "string") {
                                                        const err215 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/OrchestrationFallback/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err215];
                                                        } else {
                                                          vErrors.push(err215);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid33 = _errs297 === errors;
                                                    } else {
                                                      var valid33 = true;
                                                    }
                                                    if (valid33) {
                                                      if (data.is_final !== void 0) {
                                                        let data117 = data.is_final;
                                                        const _errs299 = errors;
                                                        if (typeof data117 !== "boolean") {
                                                          const err216 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationFallback/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                          if (vErrors === null) {
                                                            vErrors = [err216];
                                                          } else {
                                                            vErrors.push(err216);
                                                          }
                                                          errors++;
                                                        }
                                                        if (false !== data117) {
                                                          const err217 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationFallback/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                          if (vErrors === null) {
                                                            vErrors = [err217];
                                                          } else {
                                                            vErrors.push(err217);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid33 = _errs299 === errors;
                                                      } else {
                                                        var valid33 = true;
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                const err218 = { instancePath, schemaPath: "#/$defs/OrchestrationFallback/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                if (vErrors === null) {
                                  vErrors = [err218];
                                } else {
                                  vErrors.push(err218);
                                }
                                errors++;
                              }
                            }
                            var _valid0 = _errs277 === errors;
                            valid0 = valid0 || _valid0;
                            if (!valid0) {
                              const _errs301 = errors;
                              const _errs302 = errors;
                              if (errors === _errs302) {
                                if (data && typeof data == "object" && !Array.isArray(data)) {
                                  let missing14;
                                  if (data.protocol_version === void 0 && (missing14 = "protocol_version") || data.type === void 0 && (missing14 = "type") || data.run_id === void 0 && (missing14 = "run_id") || data.sequence === void 0 && (missing14 = "sequence") || data.queue_position === void 0 && (missing14 = "queue_position") || data.resumed === void 0 && (missing14 = "resumed") || data.is_final === void 0 && (missing14 = "is_final")) {
                                    const err219 = { instancePath, schemaPath: "#/$defs/OrchestrationQueued/required", keyword: "required", params: { missingProperty: missing14 }, message: "must have required property '" + missing14 + "'" };
                                    if (vErrors === null) {
                                      vErrors = [err219];
                                    } else {
                                      vErrors.push(err219);
                                    }
                                    errors++;
                                  } else {
                                    const _errs304 = errors;
                                    for (const key14 in data) {
                                      if (!(key14 === "protocol_version" || key14 === "type" || key14 === "run_id" || key14 === "sequence" || key14 === "queue_position" || key14 === "resumed" || key14 === "is_final")) {
                                        const err220 = { instancePath, schemaPath: "#/$defs/OrchestrationQueued/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key14 }, message: "must NOT have additional properties" };
                                        if (vErrors === null) {
                                          vErrors = [err220];
                                        } else {
                                          vErrors.push(err220);
                                        }
                                        errors++;
                                        break;
                                      }
                                    }
                                    if (_errs304 === errors) {
                                      if (data.protocol_version !== void 0) {
                                        let data118 = data.protocol_version;
                                        const _errs305 = errors;
                                        if (!(typeof data118 == "number" && (!(data118 % 1) && !isNaN(data118)))) {
                                          const err221 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationQueued/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                          if (vErrors === null) {
                                            vErrors = [err221];
                                          } else {
                                            vErrors.push(err221);
                                          }
                                          errors++;
                                        }
                                        if (1 !== data118) {
                                          const err222 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationQueued/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                          if (vErrors === null) {
                                            vErrors = [err222];
                                          } else {
                                            vErrors.push(err222);
                                          }
                                          errors++;
                                        }
                                        var valid35 = _errs305 === errors;
                                      } else {
                                        var valid35 = true;
                                      }
                                      if (valid35) {
                                        if (data.type !== void 0) {
                                          let data119 = data.type;
                                          const _errs307 = errors;
                                          if (typeof data119 !== "string") {
                                            const err223 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationQueued/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err223];
                                            } else {
                                              vErrors.push(err223);
                                            }
                                            errors++;
                                          }
                                          if ("orchestration_queued" !== data119) {
                                            const err224 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationQueued/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_queued" }, message: "must be equal to constant" };
                                            if (vErrors === null) {
                                              vErrors = [err224];
                                            } else {
                                              vErrors.push(err224);
                                            }
                                            errors++;
                                          }
                                          var valid35 = _errs307 === errors;
                                        } else {
                                          var valid35 = true;
                                        }
                                        if (valid35) {
                                          if (data.run_id !== void 0) {
                                            const _errs309 = errors;
                                            if (typeof data.run_id !== "string") {
                                              const err225 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationQueued/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err225];
                                              } else {
                                                vErrors.push(err225);
                                              }
                                              errors++;
                                            }
                                            var valid35 = _errs309 === errors;
                                          } else {
                                            var valid35 = true;
                                          }
                                          if (valid35) {
                                            if (data.sequence !== void 0) {
                                              let data121 = data.sequence;
                                              const _errs311 = errors;
                                              if (!(typeof data121 == "number" && (!(data121 % 1) && !isNaN(data121)))) {
                                                const err226 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationQueued/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                if (vErrors === null) {
                                                  vErrors = [err226];
                                                } else {
                                                  vErrors.push(err226);
                                                }
                                                errors++;
                                              }
                                              var valid35 = _errs311 === errors;
                                            } else {
                                              var valid35 = true;
                                            }
                                            if (valid35) {
                                              if (data.queue_position !== void 0) {
                                                let data122 = data.queue_position;
                                                const _errs313 = errors;
                                                if (!(typeof data122 == "number" && (!(data122 % 1) && !isNaN(data122)))) {
                                                  const err227 = { instancePath: instancePath + "/queue_position", schemaPath: "#/$defs/OrchestrationQueued/properties/queue_position/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                  if (vErrors === null) {
                                                    vErrors = [err227];
                                                  } else {
                                                    vErrors.push(err227);
                                                  }
                                                  errors++;
                                                }
                                                if (errors === _errs313) {
                                                  if (typeof data122 == "number") {
                                                    if (data122 < 1 || isNaN(data122)) {
                                                      const err228 = { instancePath: instancePath + "/queue_position", schemaPath: "#/$defs/OrchestrationQueued/properties/queue_position/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                      if (vErrors === null) {
                                                        vErrors = [err228];
                                                      } else {
                                                        vErrors.push(err228);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                }
                                                var valid35 = _errs313 === errors;
                                              } else {
                                                var valid35 = true;
                                              }
                                              if (valid35) {
                                                if (data.resumed !== void 0) {
                                                  const _errs315 = errors;
                                                  if (typeof data.resumed !== "boolean") {
                                                    const err229 = { instancePath: instancePath + "/resumed", schemaPath: "#/$defs/OrchestrationQueued/properties/resumed/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                    if (vErrors === null) {
                                                      vErrors = [err229];
                                                    } else {
                                                      vErrors.push(err229);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid35 = _errs315 === errors;
                                                } else {
                                                  var valid35 = true;
                                                }
                                                if (valid35) {
                                                  if (data.is_final !== void 0) {
                                                    let data124 = data.is_final;
                                                    const _errs317 = errors;
                                                    if (typeof data124 !== "boolean") {
                                                      const err230 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationQueued/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                      if (vErrors === null) {
                                                        vErrors = [err230];
                                                      } else {
                                                        vErrors.push(err230);
                                                      }
                                                      errors++;
                                                    }
                                                    if (false !== data124) {
                                                      const err231 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationQueued/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                      if (vErrors === null) {
                                                        vErrors = [err231];
                                                      } else {
                                                        vErrors.push(err231);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid35 = _errs317 === errors;
                                                  } else {
                                                    var valid35 = true;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  const err232 = { instancePath, schemaPath: "#/$defs/OrchestrationQueued/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                  if (vErrors === null) {
                                    vErrors = [err232];
                                  } else {
                                    vErrors.push(err232);
                                  }
                                  errors++;
                                }
                              }
                              var _valid0 = _errs301 === errors;
                              valid0 = valid0 || _valid0;
                              if (!valid0) {
                                const _errs319 = errors;
                                const _errs320 = errors;
                                if (errors === _errs320) {
                                  if (data && typeof data == "object" && !Array.isArray(data)) {
                                    let missing15;
                                    if (data.protocol_version === void 0 && (missing15 = "protocol_version") || data.type === void 0 && (missing15 = "type") || data.run_id === void 0 && (missing15 = "run_id") || data.sequence === void 0 && (missing15 = "sequence") || data.worker_id === void 0 && (missing15 = "worker_id") || data.is_final === void 0 && (missing15 = "is_final")) {
                                      const err233 = { instancePath, schemaPath: "#/$defs/OrchestrationStarted/required", keyword: "required", params: { missingProperty: missing15 }, message: "must have required property '" + missing15 + "'" };
                                      if (vErrors === null) {
                                        vErrors = [err233];
                                      } else {
                                        vErrors.push(err233);
                                      }
                                      errors++;
                                    } else {
                                      const _errs322 = errors;
                                      for (const key15 in data) {
                                        if (!(key15 === "protocol_version" || key15 === "type" || key15 === "run_id" || key15 === "sequence" || key15 === "worker_id" || key15 === "is_final")) {
                                          const err234 = { instancePath, schemaPath: "#/$defs/OrchestrationStarted/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key15 }, message: "must NOT have additional properties" };
                                          if (vErrors === null) {
                                            vErrors = [err234];
                                          } else {
                                            vErrors.push(err234);
                                          }
                                          errors++;
                                          break;
                                        }
                                      }
                                      if (_errs322 === errors) {
                                        if (data.protocol_version !== void 0) {
                                          let data125 = data.protocol_version;
                                          const _errs323 = errors;
                                          if (!(typeof data125 == "number" && (!(data125 % 1) && !isNaN(data125)))) {
                                            const err235 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationStarted/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                            if (vErrors === null) {
                                              vErrors = [err235];
                                            } else {
                                              vErrors.push(err235);
                                            }
                                            errors++;
                                          }
                                          if (1 !== data125) {
                                            const err236 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationStarted/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                            if (vErrors === null) {
                                              vErrors = [err236];
                                            } else {
                                              vErrors.push(err236);
                                            }
                                            errors++;
                                          }
                                          var valid37 = _errs323 === errors;
                                        } else {
                                          var valid37 = true;
                                        }
                                        if (valid37) {
                                          if (data.type !== void 0) {
                                            let data126 = data.type;
                                            const _errs325 = errors;
                                            if (typeof data126 !== "string") {
                                              const err237 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationStarted/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err237];
                                              } else {
                                                vErrors.push(err237);
                                              }
                                              errors++;
                                            }
                                            if ("orchestration_started" !== data126) {
                                              const err238 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationStarted/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_started" }, message: "must be equal to constant" };
                                              if (vErrors === null) {
                                                vErrors = [err238];
                                              } else {
                                                vErrors.push(err238);
                                              }
                                              errors++;
                                            }
                                            var valid37 = _errs325 === errors;
                                          } else {
                                            var valid37 = true;
                                          }
                                          if (valid37) {
                                            if (data.run_id !== void 0) {
                                              const _errs327 = errors;
                                              if (typeof data.run_id !== "string") {
                                                const err239 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationStarted/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err239];
                                                } else {
                                                  vErrors.push(err239);
                                                }
                                                errors++;
                                              }
                                              var valid37 = _errs327 === errors;
                                            } else {
                                              var valid37 = true;
                                            }
                                            if (valid37) {
                                              if (data.sequence !== void 0) {
                                                let data128 = data.sequence;
                                                const _errs329 = errors;
                                                if (!(typeof data128 == "number" && (!(data128 % 1) && !isNaN(data128)))) {
                                                  const err240 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationStarted/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                  if (vErrors === null) {
                                                    vErrors = [err240];
                                                  } else {
                                                    vErrors.push(err240);
                                                  }
                                                  errors++;
                                                }
                                                var valid37 = _errs329 === errors;
                                              } else {
                                                var valid37 = true;
                                              }
                                              if (valid37) {
                                                if (data.worker_id !== void 0) {
                                                  const _errs331 = errors;
                                                  if (typeof data.worker_id !== "string") {
                                                    const err241 = { instancePath: instancePath + "/worker_id", schemaPath: "#/$defs/OrchestrationStarted/properties/worker_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err241];
                                                    } else {
                                                      vErrors.push(err241);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid37 = _errs331 === errors;
                                                } else {
                                                  var valid37 = true;
                                                }
                                                if (valid37) {
                                                  if (data.is_final !== void 0) {
                                                    let data130 = data.is_final;
                                                    const _errs333 = errors;
                                                    if (typeof data130 !== "boolean") {
                                                      const err242 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationStarted/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                      if (vErrors === null) {
                                                        vErrors = [err242];
                                                      } else {
                                                        vErrors.push(err242);
                                                      }
                                                      errors++;
                                                    }
                                                    if (false !== data130) {
                                                      const err243 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationStarted/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                      if (vErrors === null) {
                                                        vErrors = [err243];
                                                      } else {
                                                        vErrors.push(err243);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid37 = _errs333 === errors;
                                                  } else {
                                                    var valid37 = true;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const err244 = { instancePath, schemaPath: "#/$defs/OrchestrationStarted/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                    if (vErrors === null) {
                                      vErrors = [err244];
                                    } else {
                                      vErrors.push(err244);
                                    }
                                    errors++;
                                  }
                                }
                                var _valid0 = _errs319 === errors;
                                valid0 = valid0 || _valid0;
                                if (!valid0) {
                                  const _errs335 = errors;
                                  const _errs336 = errors;
                                  if (errors === _errs336) {
                                    if (data && typeof data == "object" && !Array.isArray(data)) {
                                      let missing16;
                                      if (data.protocol_version === void 0 && (missing16 = "protocol_version") || data.type === void 0 && (missing16 = "type") || data.run_id === void 0 && (missing16 = "run_id") || data.sequence === void 0 && (missing16 = "sequence") || data.message === void 0 && (missing16 = "message") || data.is_final === void 0 && (missing16 = "is_final")) {
                                        const err245 = { instancePath, schemaPath: "#/$defs/OrchestrationPaused/required", keyword: "required", params: { missingProperty: missing16 }, message: "must have required property '" + missing16 + "'" };
                                        if (vErrors === null) {
                                          vErrors = [err245];
                                        } else {
                                          vErrors.push(err245);
                                        }
                                        errors++;
                                      } else {
                                        const _errs338 = errors;
                                        for (const key16 in data) {
                                          if (!(key16 === "protocol_version" || key16 === "type" || key16 === "run_id" || key16 === "sequence" || key16 === "message" || key16 === "is_final")) {
                                            const err246 = { instancePath, schemaPath: "#/$defs/OrchestrationPaused/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key16 }, message: "must NOT have additional properties" };
                                            if (vErrors === null) {
                                              vErrors = [err246];
                                            } else {
                                              vErrors.push(err246);
                                            }
                                            errors++;
                                            break;
                                          }
                                        }
                                        if (_errs338 === errors) {
                                          if (data.protocol_version !== void 0) {
                                            let data131 = data.protocol_version;
                                            const _errs339 = errors;
                                            if (!(typeof data131 == "number" && (!(data131 % 1) && !isNaN(data131)))) {
                                              const err247 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationPaused/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                              if (vErrors === null) {
                                                vErrors = [err247];
                                              } else {
                                                vErrors.push(err247);
                                              }
                                              errors++;
                                            }
                                            if (1 !== data131) {
                                              const err248 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationPaused/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                              if (vErrors === null) {
                                                vErrors = [err248];
                                              } else {
                                                vErrors.push(err248);
                                              }
                                              errors++;
                                            }
                                            var valid39 = _errs339 === errors;
                                          } else {
                                            var valid39 = true;
                                          }
                                          if (valid39) {
                                            if (data.type !== void 0) {
                                              let data132 = data.type;
                                              const _errs341 = errors;
                                              if (typeof data132 !== "string") {
                                                const err249 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationPaused/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err249];
                                                } else {
                                                  vErrors.push(err249);
                                                }
                                                errors++;
                                              }
                                              if ("orchestration_paused" !== data132) {
                                                const err250 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationPaused/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_paused" }, message: "must be equal to constant" };
                                                if (vErrors === null) {
                                                  vErrors = [err250];
                                                } else {
                                                  vErrors.push(err250);
                                                }
                                                errors++;
                                              }
                                              var valid39 = _errs341 === errors;
                                            } else {
                                              var valid39 = true;
                                            }
                                            if (valid39) {
                                              if (data.run_id !== void 0) {
                                                const _errs343 = errors;
                                                if (typeof data.run_id !== "string") {
                                                  const err251 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationPaused/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err251];
                                                  } else {
                                                    vErrors.push(err251);
                                                  }
                                                  errors++;
                                                }
                                                var valid39 = _errs343 === errors;
                                              } else {
                                                var valid39 = true;
                                              }
                                              if (valid39) {
                                                if (data.sequence !== void 0) {
                                                  let data134 = data.sequence;
                                                  const _errs345 = errors;
                                                  if (!(typeof data134 == "number" && (!(data134 % 1) && !isNaN(data134)))) {
                                                    const err252 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationPaused/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                    if (vErrors === null) {
                                                      vErrors = [err252];
                                                    } else {
                                                      vErrors.push(err252);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid39 = _errs345 === errors;
                                                } else {
                                                  var valid39 = true;
                                                }
                                                if (valid39) {
                                                  if (data.message !== void 0) {
                                                    const _errs347 = errors;
                                                    if (typeof data.message !== "string") {
                                                      const err253 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/OrchestrationPaused/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err253];
                                                      } else {
                                                        vErrors.push(err253);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid39 = _errs347 === errors;
                                                  } else {
                                                    var valid39 = true;
                                                  }
                                                  if (valid39) {
                                                    if (data.is_final !== void 0) {
                                                      let data136 = data.is_final;
                                                      const _errs349 = errors;
                                                      if (typeof data136 !== "boolean") {
                                                        const err254 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationPaused/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                        if (vErrors === null) {
                                                          vErrors = [err254];
                                                        } else {
                                                          vErrors.push(err254);
                                                        }
                                                        errors++;
                                                      }
                                                      if (false !== data136) {
                                                        const err255 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationPaused/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                                        if (vErrors === null) {
                                                          vErrors = [err255];
                                                        } else {
                                                          vErrors.push(err255);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid39 = _errs349 === errors;
                                                    } else {
                                                      var valid39 = true;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      const err256 = { instancePath, schemaPath: "#/$defs/OrchestrationPaused/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                      if (vErrors === null) {
                                        vErrors = [err256];
                                      } else {
                                        vErrors.push(err256);
                                      }
                                      errors++;
                                    }
                                  }
                                  var _valid0 = _errs335 === errors;
                                  valid0 = valid0 || _valid0;
                                  if (!valid0) {
                                    const _errs351 = errors;
                                    const _errs352 = errors;
                                    if (errors === _errs352) {
                                      if (data && typeof data == "object" && !Array.isArray(data)) {
                                        let missing17;
                                        if (data.protocol_version === void 0 && (missing17 = "protocol_version") || data.type === void 0 && (missing17 = "type") || data.request_id === void 0 && (missing17 = "request_id") || data.sequence === void 0 && (missing17 = "sequence") || data.collection_id === void 0 && (missing17 = "collection_id") || data.workspace_id === void 0 && (missing17 = "workspace_id") || data.path === void 0 && (missing17 = "path") || data.stage === void 0 && (missing17 = "stage") || data.completed_units === void 0 && (missing17 = "completed_units") || data.total_units === void 0 && (missing17 = "total_units") || data.progress_percent === void 0 && (missing17 = "progress_percent") || data.message === void 0 && (missing17 = "message") || data.is_final === void 0 && (missing17 = "is_final")) {
                                          const err257 = { instancePath, schemaPath: "#/$defs/KnowledgeIngestionProgress/required", keyword: "required", params: { missingProperty: missing17 }, message: "must have required property '" + missing17 + "'" };
                                          if (vErrors === null) {
                                            vErrors = [err257];
                                          } else {
                                            vErrors.push(err257);
                                          }
                                          errors++;
                                        } else {
                                          const _errs354 = errors;
                                          for (const key17 in data) {
                                            if (!func2.call(schema29.properties, key17)) {
                                              const err258 = { instancePath, schemaPath: "#/$defs/KnowledgeIngestionProgress/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key17 }, message: "must NOT have additional properties" };
                                              if (vErrors === null) {
                                                vErrors = [err258];
                                              } else {
                                                vErrors.push(err258);
                                              }
                                              errors++;
                                              break;
                                            }
                                          }
                                          if (_errs354 === errors) {
                                            if (data.protocol_version !== void 0) {
                                              let data137 = data.protocol_version;
                                              const _errs355 = errors;
                                              if (!(typeof data137 == "number" && (!(data137 % 1) && !isNaN(data137)))) {
                                                const err259 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                if (vErrors === null) {
                                                  vErrors = [err259];
                                                } else {
                                                  vErrors.push(err259);
                                                }
                                                errors++;
                                              }
                                              if (1 !== data137) {
                                                const err260 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                                if (vErrors === null) {
                                                  vErrors = [err260];
                                                } else {
                                                  vErrors.push(err260);
                                                }
                                                errors++;
                                              }
                                              var valid41 = _errs355 === errors;
                                            } else {
                                              var valid41 = true;
                                            }
                                            if (valid41) {
                                              if (data.type !== void 0) {
                                                let data138 = data.type;
                                                const _errs357 = errors;
                                                if (typeof data138 !== "string") {
                                                  const err261 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err261];
                                                  } else {
                                                    vErrors.push(err261);
                                                  }
                                                  errors++;
                                                }
                                                if ("knowledge_ingestion_progress" !== data138) {
                                                  const err262 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/type/const", keyword: "const", params: { allowedValue: "knowledge_ingestion_progress" }, message: "must be equal to constant" };
                                                  if (vErrors === null) {
                                                    vErrors = [err262];
                                                  } else {
                                                    vErrors.push(err262);
                                                  }
                                                  errors++;
                                                }
                                                var valid41 = _errs357 === errors;
                                              } else {
                                                var valid41 = true;
                                              }
                                              if (valid41) {
                                                if (data.request_id !== void 0) {
                                                  let data139 = data.request_id;
                                                  const _errs359 = errors;
                                                  if (errors === _errs359) {
                                                    if (typeof data139 === "string") {
                                                      if (func7(data139) > 128) {
                                                        const err263 = { instancePath: instancePath + "/request_id", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/request_id/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err263];
                                                        } else {
                                                          vErrors.push(err263);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (func7(data139) < 1) {
                                                          const err264 = { instancePath: instancePath + "/request_id", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/request_id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err264];
                                                          } else {
                                                            vErrors.push(err264);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    } else {
                                                      const err265 = { instancePath: instancePath + "/request_id", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/request_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err265];
                                                      } else {
                                                        vErrors.push(err265);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                  var valid41 = _errs359 === errors;
                                                } else {
                                                  var valid41 = true;
                                                }
                                                if (valid41) {
                                                  if (data.sequence !== void 0) {
                                                    let data140 = data.sequence;
                                                    const _errs361 = errors;
                                                    if (!(typeof data140 == "number" && (!(data140 % 1) && !isNaN(data140)))) {
                                                      const err266 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                      if (vErrors === null) {
                                                        vErrors = [err266];
                                                      } else {
                                                        vErrors.push(err266);
                                                      }
                                                      errors++;
                                                    }
                                                    if (errors === _errs361) {
                                                      if (typeof data140 == "number") {
                                                        if (data140 < 1 || isNaN(data140)) {
                                                          const err267 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/sequence/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                          if (vErrors === null) {
                                                            vErrors = [err267];
                                                          } else {
                                                            vErrors.push(err267);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                    var valid41 = _errs361 === errors;
                                                  } else {
                                                    var valid41 = true;
                                                  }
                                                  if (valid41) {
                                                    if (data.collection_id !== void 0) {
                                                      const _errs363 = errors;
                                                      if (typeof data.collection_id !== "string") {
                                                        const err268 = { instancePath: instancePath + "/collection_id", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err268];
                                                        } else {
                                                          vErrors.push(err268);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid41 = _errs363 === errors;
                                                    } else {
                                                      var valid41 = true;
                                                    }
                                                    if (valid41) {
                                                      if (data.workspace_id !== void 0) {
                                                        const _errs365 = errors;
                                                        if (typeof data.workspace_id !== "string") {
                                                          const err269 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err269];
                                                          } else {
                                                            vErrors.push(err269);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid41 = _errs365 === errors;
                                                      } else {
                                                        var valid41 = true;
                                                      }
                                                      if (valid41) {
                                                        if (data.path !== void 0) {
                                                          let data143 = data.path;
                                                          const _errs367 = errors;
                                                          if (errors === _errs367) {
                                                            if (typeof data143 === "string") {
                                                              if (func7(data143) > 4096) {
                                                                const err270 = { instancePath: instancePath + "/path", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/path/maxLength", keyword: "maxLength", params: { limit: 4096 }, message: "must NOT have more than 4096 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err270];
                                                                } else {
                                                                  vErrors.push(err270);
                                                                }
                                                                errors++;
                                                              }
                                                            } else {
                                                              const err271 = { instancePath: instancePath + "/path", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err271];
                                                              } else {
                                                                vErrors.push(err271);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                          var valid41 = _errs367 === errors;
                                                        } else {
                                                          var valid41 = true;
                                                        }
                                                        if (valid41) {
                                                          if (data.stage !== void 0) {
                                                            let data144 = data.stage;
                                                            const _errs369 = errors;
                                                            if (typeof data144 !== "string") {
                                                              const err272 = { instancePath: instancePath + "/stage", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/stage/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err272];
                                                              } else {
                                                                vErrors.push(err272);
                                                              }
                                                              errors++;
                                                            }
                                                            if (!(data144 === "reading" || data144 === "parsing" || data144 === "chunking" || data144 === "embedding" || data144 === "committing" || data144 === "completed")) {
                                                              const err273 = { instancePath: instancePath + "/stage", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/stage/enum", keyword: "enum", params: { allowedValues: schema29.properties.stage.enum }, message: "must be equal to one of the allowed values" };
                                                              if (vErrors === null) {
                                                                vErrors = [err273];
                                                              } else {
                                                                vErrors.push(err273);
                                                              }
                                                              errors++;
                                                            }
                                                            var valid41 = _errs369 === errors;
                                                          } else {
                                                            var valid41 = true;
                                                          }
                                                          if (valid41) {
                                                            if (data.completed_units !== void 0) {
                                                              let data145 = data.completed_units;
                                                              const _errs371 = errors;
                                                              if (!(typeof data145 == "number" && (!(data145 % 1) && !isNaN(data145)))) {
                                                                const err274 = { instancePath: instancePath + "/completed_units", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/completed_units/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err274];
                                                                } else {
                                                                  vErrors.push(err274);
                                                                }
                                                                errors++;
                                                              }
                                                              if (errors === _errs371) {
                                                                if (typeof data145 == "number") {
                                                                  if (data145 < 0 || isNaN(data145)) {
                                                                    const err275 = { instancePath: instancePath + "/completed_units", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/completed_units/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err275];
                                                                    } else {
                                                                      vErrors.push(err275);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                              }
                                                              var valid41 = _errs371 === errors;
                                                            } else {
                                                              var valid41 = true;
                                                            }
                                                            if (valid41) {
                                                              if (data.total_units !== void 0) {
                                                                let data146 = data.total_units;
                                                                const _errs373 = errors;
                                                                if (!(typeof data146 == "number" && (!(data146 % 1) && !isNaN(data146)))) {
                                                                  const err276 = { instancePath: instancePath + "/total_units", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/total_units/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err276];
                                                                  } else {
                                                                    vErrors.push(err276);
                                                                  }
                                                                  errors++;
                                                                }
                                                                if (errors === _errs373) {
                                                                  if (typeof data146 == "number") {
                                                                    if (data146 < 0 || isNaN(data146)) {
                                                                      const err277 = { instancePath: instancePath + "/total_units", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/total_units/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err277];
                                                                      } else {
                                                                        vErrors.push(err277);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                  }
                                                                }
                                                                var valid41 = _errs373 === errors;
                                                              } else {
                                                                var valid41 = true;
                                                              }
                                                              if (valid41) {
                                                                if (data.progress_percent !== void 0) {
                                                                  let data147 = data.progress_percent;
                                                                  const _errs375 = errors;
                                                                  if (!(typeof data147 == "number" && (!(data147 % 1) && !isNaN(data147)))) {
                                                                    const err278 = { instancePath: instancePath + "/progress_percent", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/progress_percent/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err278];
                                                                    } else {
                                                                      vErrors.push(err278);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                  if (errors === _errs375) {
                                                                    if (typeof data147 == "number") {
                                                                      if (data147 > 100 || isNaN(data147)) {
                                                                        const err279 = { instancePath: instancePath + "/progress_percent", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/progress_percent/maximum", keyword: "maximum", params: { comparison: "<=", limit: 100 }, message: "must be <= 100" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err279];
                                                                        } else {
                                                                          vErrors.push(err279);
                                                                        }
                                                                        errors++;
                                                                      } else {
                                                                        if (data147 < 0 || isNaN(data147)) {
                                                                          const err280 = { instancePath: instancePath + "/progress_percent", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/progress_percent/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err280];
                                                                          } else {
                                                                            vErrors.push(err280);
                                                                          }
                                                                          errors++;
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                  var valid41 = _errs375 === errors;
                                                                } else {
                                                                  var valid41 = true;
                                                                }
                                                                if (valid41) {
                                                                  if (data.message !== void 0) {
                                                                    let data148 = data.message;
                                                                    const _errs377 = errors;
                                                                    if (errors === _errs377) {
                                                                      if (typeof data148 === "string") {
                                                                        if (func7(data148) > 240) {
                                                                          const err281 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/message/maxLength", keyword: "maxLength", params: { limit: 240 }, message: "must NOT have more than 240 characters" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err281];
                                                                          } else {
                                                                            vErrors.push(err281);
                                                                          }
                                                                          errors++;
                                                                        } else {
                                                                          if (func7(data148) < 1) {
                                                                            const err282 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/message/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err282];
                                                                            } else {
                                                                              vErrors.push(err282);
                                                                            }
                                                                            errors++;
                                                                          }
                                                                        }
                                                                      } else {
                                                                        const err283 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err283];
                                                                        } else {
                                                                          vErrors.push(err283);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                    }
                                                                    var valid41 = _errs377 === errors;
                                                                  } else {
                                                                    var valid41 = true;
                                                                  }
                                                                  if (valid41) {
                                                                    if (data.is_final !== void 0) {
                                                                      const _errs379 = errors;
                                                                      if (typeof data.is_final !== "boolean") {
                                                                        const err284 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/KnowledgeIngestionProgress/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err284];
                                                                        } else {
                                                                          vErrors.push(err284);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                      var valid41 = _errs379 === errors;
                                                                    } else {
                                                                      var valid41 = true;
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        const err285 = { instancePath, schemaPath: "#/$defs/KnowledgeIngestionProgress/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                        if (vErrors === null) {
                                          vErrors = [err285];
                                        } else {
                                          vErrors.push(err285);
                                        }
                                        errors++;
                                      }
                                    }
                                    var _valid0 = _errs351 === errors;
                                    valid0 = valid0 || _valid0;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (!valid0) {
    const err286 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
    if (vErrors === null) {
      vErrors = [err286];
    } else {
      vErrors.push(err286);
    }
    errors++;
    validate10.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate10.errors = vErrors;
  return errors === 0;
}
export {
  validate_event_default as default,
  validate
};
