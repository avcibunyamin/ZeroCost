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

// validate-response.js
var validate = validate10;
var validate_response_default = validate10;
var schema47 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "request_id": { "title": "Request Id", "type": "string" }, "ok": { "const": false, "default": false, "title": "Ok", "type": "boolean" }, "code": { "enum": ["invalid_request", "conflict", "not_found", "internal_error"], "title": "Code", "type": "string" }, "message": { "title": "Message", "type": "string" } }, "required": ["protocol_version", "request_id", "ok", "code", "message"], "title": "Failure", "type": "object" };
var schema44 = { "additionalProperties": false, "properties": { "collection_id": { "title": "Collection Id", "type": "string" }, "workspace_id": { "title": "Workspace Id", "type": "string" }, "path": { "title": "Path", "type": "string" }, "status": { "enum": ["indexed", "unchanged"], "title": "Status", "type": "string" }, "chunk_count": { "title": "Chunk Count", "type": "integer" }, "embedded_count": { "title": "Embedded Count", "type": "integer" }, "reused_count": { "title": "Reused Count", "type": "integer" } }, "required": ["collection_id", "workspace_id", "path", "status", "chunk_count", "embedded_count", "reused_count"], "title": "KnowledgeIngestionResult", "type": "object" };
var schema14 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "provider": { "enum": ["ollama", "lmstudio", "anthropic", "gemini", "openai"], "title": "Provider", "type": "string" }, "model_id": { "maxLength": 100, "minLength": 1, "title": "Model Id", "type": "string" }, "base_url": { "default": "", "maxLength": 500, "title": "Base Url", "type": "string" }, "supports_tools": { "default": "unknown", "enum": ["unknown", "true", "false"], "title": "Supports Tools", "type": "string" }, "id": { "title": "Id", "type": "string" }, "status": { "const": "unconfigured", "default": "unconfigured", "title": "Status", "type": "string" } }, "required": ["name", "provider", "model_id", "base_url", "supports_tools", "id", "status"], "title": "Connection", "type": "object" };
var schema15 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "role": { "maxLength": 100, "minLength": 1, "title": "Role", "type": "string" }, "connection_id": { "maxLength": 128, "minLength": 1, "title": "Connection Id", "type": "string" }, "instructions": { "default": "", "maxLength": 8e3, "title": "Instructions", "type": "string" }, "id": { "title": "Id", "type": "string" }, "fallback_connection_ids": { "items": { "maxLength": 128, "minLength": 1, "type": "string" }, "maxItems": 3, "title": "Fallback Connection Ids", "type": "array" }, "permissions": { "items": { "enum": ["workspace.read", "workspace.write", "terminal.execute"], "type": "string" }, "title": "Permissions", "type": "array" }, "skill_ids": { "items": { "type": "string" }, "title": "Skill Ids", "type": "array" } }, "required": ["name", "role", "connection_id", "instructions", "id", "fallback_connection_ids", "permissions", "skill_ids"], "title": "Agent", "type": "object" };
var schema17 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "version": { "maxLength": 20, "minLength": 5, "pattern": "^\\d+\\.\\d+\\.\\d+$", "title": "Version", "type": "string" }, "description": { "maxLength": 500, "minLength": 1, "title": "Description", "type": "string" }, "instructions": { "default": "", "maxLength": 8e3, "title": "Instructions", "type": "string" }, "required_tools": { "items": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "type": "string" }, "maxItems": 3, "title": "Required Tools", "type": "array" }, "required_permissions": { "items": { "enum": ["workspace.read", "workspace.write", "terminal.execute"], "type": "string" }, "maxItems": 3, "title": "Required Permissions", "type": "array" }, "provider_hint": { "anyOf": [{ "enum": ["ollama", "lmstudio", "anthropic", "gemini", "openai"], "type": "string" }, { "type": "null" }], "default": null, "title": "Provider Hint" }, "id": { "title": "Id", "type": "string" } }, "required": ["name", "version", "description", "instructions", "required_tools", "required_permissions", "provider_hint", "id"], "title": "SkillPackage", "type": "object" };
var func2 = require_ucs2length().default;
var pattern0 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
var schema18 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "version": { "maxLength": 20, "minLength": 5, "pattern": "^\\d+\\.\\d+\\.\\d+$", "title": "Version", "type": "string" }, "description": { "maxLength": 500, "minLength": 1, "title": "Description", "type": "string" }, "objective_prefix": { "default": "", "maxLength": 4e3, "title": "Objective Prefix", "type": "string" }, "agent_slots": { "items": { "$ref": "#/$defs/WorkflowSlotInput" }, "maxItems": 4, "minItems": 2, "title": "Agent Slots", "type": "array" }, "required_tools": { "items": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "type": "string" }, "maxItems": 3, "title": "Required Tools", "type": "array" }, "rounds": { "default": 1, "maximum": 3, "minimum": 1, "title": "Rounds", "type": "integer" }, "max_model_calls": { "default": 5, "maximum": 14, "minimum": 3, "title": "Max Model Calls", "type": "integer" }, "max_output_tokens": { "default": 512, "maximum": 4096, "minimum": 128, "title": "Max Output Tokens", "type": "integer" }, "max_cost_microusd": { "default": 5e6, "maximum": 1e9, "minimum": 0, "title": "Max Cost Microusd", "type": "integer" }, "id": { "title": "Id", "type": "string" }, "archived": { "default": false, "title": "Archived", "type": "boolean" } }, "required": ["name", "version", "description", "objective_prefix", "agent_slots", "required_tools", "rounds", "max_model_calls", "max_output_tokens", "max_cost_microusd", "id", "archived"], "title": "WorkflowTemplate", "type": "object" };
var func27 = Object.prototype.hasOwnProperty;
function validate13(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.name === void 0 && (missing0 = "name") || data.version === void 0 && (missing0 = "version") || data.description === void 0 && (missing0 = "description") || data.objective_prefix === void 0 && (missing0 = "objective_prefix") || data.agent_slots === void 0 && (missing0 = "agent_slots") || data.required_tools === void 0 && (missing0 = "required_tools") || data.rounds === void 0 && (missing0 = "rounds") || data.max_model_calls === void 0 && (missing0 = "max_model_calls") || data.max_output_tokens === void 0 && (missing0 = "max_output_tokens") || data.max_cost_microusd === void 0 && (missing0 = "max_cost_microusd") || data.id === void 0 && (missing0 = "id") || data.archived === void 0 && (missing0 = "archived")) {
        validate13.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!func27.call(schema18.properties, key0)) {
            validate13.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== void 0) {
            let data0 = data.name;
            const _errs2 = errors;
            if (errors === _errs2) {
              if (typeof data0 === "string") {
                if (func2(data0) > 100) {
                  validate13.errors = [{ instancePath: instancePath + "/name", schemaPath: "#/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                  return false;
                } else {
                  if (func2(data0) < 1) {
                    validate13.errors = [{ instancePath: instancePath + "/name", schemaPath: "#/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                    return false;
                  }
                }
              } else {
                validate13.errors = [{ instancePath: instancePath + "/name", schemaPath: "#/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.version !== void 0) {
              let data1 = data.version;
              const _errs4 = errors;
              if (errors === _errs4) {
                if (typeof data1 === "string") {
                  if (func2(data1) > 20) {
                    validate13.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/properties/version/maxLength", keyword: "maxLength", params: { limit: 20 }, message: "must NOT have more than 20 characters" }];
                    return false;
                  } else {
                    if (func2(data1) < 5) {
                      validate13.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/properties/version/minLength", keyword: "minLength", params: { limit: 5 }, message: "must NOT have fewer than 5 characters" }];
                      return false;
                    } else {
                      if (!pattern0.test(data1)) {
                        validate13.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/properties/version/pattern", keyword: "pattern", params: { pattern: "^\\d+\\.\\d+\\.\\d+$" }, message: 'must match pattern "^\\d+\\.\\d+\\.\\d+$"' }];
                        return false;
                      }
                    }
                  }
                } else {
                  validate13.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/properties/version/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.description !== void 0) {
                let data2 = data.description;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (typeof data2 === "string") {
                    if (func2(data2) > 500) {
                      validate13.errors = [{ instancePath: instancePath + "/description", schemaPath: "#/properties/description/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" }];
                      return false;
                    } else {
                      if (func2(data2) < 1) {
                        validate13.errors = [{ instancePath: instancePath + "/description", schemaPath: "#/properties/description/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                        return false;
                      }
                    }
                  } else {
                    validate13.errors = [{ instancePath: instancePath + "/description", schemaPath: "#/properties/description/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.objective_prefix !== void 0) {
                  let data3 = data.objective_prefix;
                  const _errs8 = errors;
                  if (errors === _errs8) {
                    if (typeof data3 === "string") {
                      if (func2(data3) > 4e3) {
                        validate13.errors = [{ instancePath: instancePath + "/objective_prefix", schemaPath: "#/properties/objective_prefix/maxLength", keyword: "maxLength", params: { limit: 4e3 }, message: "must NOT have more than 4000 characters" }];
                        return false;
                      }
                    } else {
                      validate13.errors = [{ instancePath: instancePath + "/objective_prefix", schemaPath: "#/properties/objective_prefix/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                      return false;
                    }
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.agent_slots !== void 0) {
                    let data4 = data.agent_slots;
                    const _errs10 = errors;
                    if (errors === _errs10) {
                      if (Array.isArray(data4)) {
                        if (data4.length > 4) {
                          validate13.errors = [{ instancePath: instancePath + "/agent_slots", schemaPath: "#/properties/agent_slots/maxItems", keyword: "maxItems", params: { limit: 4 }, message: "must NOT have more than 4 items" }];
                          return false;
                        } else {
                          if (data4.length < 2) {
                            validate13.errors = [{ instancePath: instancePath + "/agent_slots", schemaPath: "#/properties/agent_slots/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" }];
                            return false;
                          } else {
                            var valid1 = true;
                            const len0 = data4.length;
                            for (let i0 = 0; i0 < len0; i0++) {
                              let data5 = data4[i0];
                              const _errs12 = errors;
                              const _errs13 = errors;
                              if (errors === _errs13) {
                                if (data5 && typeof data5 == "object" && !Array.isArray(data5)) {
                                  let missing1;
                                  if (data5.name === void 0 && (missing1 = "name") || data5.required_skill_ids === void 0 && (missing1 = "required_skill_ids")) {
                                    validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0, schemaPath: "#/$defs/WorkflowSlotInput/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                                    return false;
                                  } else {
                                    const _errs15 = errors;
                                    for (const key1 in data5) {
                                      if (!(key1 === "name" || key1 === "required_skill_ids")) {
                                        validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0, schemaPath: "#/$defs/WorkflowSlotInput/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                        return false;
                                        break;
                                      }
                                    }
                                    if (_errs15 === errors) {
                                      if (data5.name !== void 0) {
                                        let data6 = data5.name;
                                        const _errs16 = errors;
                                        if (errors === _errs16) {
                                          if (typeof data6 === "string") {
                                            if (func2(data6) > 100) {
                                              validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/name", schemaPath: "#/$defs/WorkflowSlotInput/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                              return false;
                                            } else {
                                              if (func2(data6) < 1) {
                                                validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/name", schemaPath: "#/$defs/WorkflowSlotInput/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                return false;
                                              }
                                            }
                                          } else {
                                            validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/name", schemaPath: "#/$defs/WorkflowSlotInput/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid3 = _errs16 === errors;
                                      } else {
                                        var valid3 = true;
                                      }
                                      if (valid3) {
                                        if (data5.required_skill_ids !== void 0) {
                                          let data7 = data5.required_skill_ids;
                                          const _errs18 = errors;
                                          if (errors === _errs18) {
                                            if (Array.isArray(data7)) {
                                              if (data7.length > 8) {
                                                validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/required_skill_ids", schemaPath: "#/$defs/WorkflowSlotInput/properties/required_skill_ids/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" }];
                                                return false;
                                              } else {
                                                var valid4 = true;
                                                const len1 = data7.length;
                                                for (let i1 = 0; i1 < len1; i1++) {
                                                  let data8 = data7[i1];
                                                  const _errs20 = errors;
                                                  if (errors === _errs20) {
                                                    if (typeof data8 === "string") {
                                                      if (func2(data8) > 128) {
                                                        validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/required_skill_ids/" + i1, schemaPath: "#/$defs/WorkflowSlotInput/properties/required_skill_ids/items/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
                                                        return false;
                                                      } else {
                                                        if (func2(data8) < 1) {
                                                          validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/required_skill_ids/" + i1, schemaPath: "#/$defs/WorkflowSlotInput/properties/required_skill_ids/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                          return false;
                                                        }
                                                      }
                                                    } else {
                                                      validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/required_skill_ids/" + i1, schemaPath: "#/$defs/WorkflowSlotInput/properties/required_skill_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid4 = _errs20 === errors;
                                                  if (!valid4) {
                                                    break;
                                                  }
                                                }
                                              }
                                            } else {
                                              validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0 + "/required_skill_ids", schemaPath: "#/$defs/WorkflowSlotInput/properties/required_skill_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                              return false;
                                            }
                                          }
                                          var valid3 = _errs18 === errors;
                                        } else {
                                          var valid3 = true;
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate13.errors = [{ instancePath: instancePath + "/agent_slots/" + i0, schemaPath: "#/$defs/WorkflowSlotInput/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                  return false;
                                }
                              }
                              var valid1 = _errs12 === errors;
                              if (!valid1) {
                                break;
                              }
                            }
                          }
                        }
                      } else {
                        validate13.errors = [{ instancePath: instancePath + "/agent_slots", schemaPath: "#/properties/agent_slots/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                        return false;
                      }
                    }
                    var valid0 = _errs10 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.required_tools !== void 0) {
                      let data9 = data.required_tools;
                      const _errs22 = errors;
                      if (errors === _errs22) {
                        if (Array.isArray(data9)) {
                          if (data9.length > 3) {
                            validate13.errors = [{ instancePath: instancePath + "/required_tools", schemaPath: "#/properties/required_tools/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                            return false;
                          } else {
                            var valid5 = true;
                            const len2 = data9.length;
                            for (let i2 = 0; i2 < len2; i2++) {
                              let data10 = data9[i2];
                              const _errs24 = errors;
                              if (typeof data10 !== "string") {
                                validate13.errors = [{ instancePath: instancePath + "/required_tools/" + i2, schemaPath: "#/properties/required_tools/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              if (!(data10 === "workspace.write" || data10 === "terminal.execute" || data10 === "knowledge.search")) {
                                validate13.errors = [{ instancePath: instancePath + "/required_tools/" + i2, schemaPath: "#/properties/required_tools/items/enum", keyword: "enum", params: { allowedValues: schema18.properties.required_tools.items.enum }, message: "must be equal to one of the allowed values" }];
                                return false;
                              }
                              var valid5 = _errs24 === errors;
                              if (!valid5) {
                                break;
                              }
                            }
                          }
                        } else {
                          validate13.errors = [{ instancePath: instancePath + "/required_tools", schemaPath: "#/properties/required_tools/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs22 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.rounds !== void 0) {
                        let data11 = data.rounds;
                        const _errs26 = errors;
                        if (!(typeof data11 == "number" && (!(data11 % 1) && !isNaN(data11)))) {
                          validate13.errors = [{ instancePath: instancePath + "/rounds", schemaPath: "#/properties/rounds/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                          return false;
                        }
                        if (errors === _errs26) {
                          if (typeof data11 == "number") {
                            if (data11 > 3 || isNaN(data11)) {
                              validate13.errors = [{ instancePath: instancePath + "/rounds", schemaPath: "#/properties/rounds/maximum", keyword: "maximum", params: { comparison: "<=", limit: 3 }, message: "must be <= 3" }];
                              return false;
                            } else {
                              if (data11 < 1 || isNaN(data11)) {
                                validate13.errors = [{ instancePath: instancePath + "/rounds", schemaPath: "#/properties/rounds/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
                                return false;
                              }
                            }
                          }
                        }
                        var valid0 = _errs26 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.max_model_calls !== void 0) {
                          let data12 = data.max_model_calls;
                          const _errs28 = errors;
                          if (!(typeof data12 == "number" && (!(data12 % 1) && !isNaN(data12)))) {
                            validate13.errors = [{ instancePath: instancePath + "/max_model_calls", schemaPath: "#/properties/max_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                            return false;
                          }
                          if (errors === _errs28) {
                            if (typeof data12 == "number") {
                              if (data12 > 14 || isNaN(data12)) {
                                validate13.errors = [{ instancePath: instancePath + "/max_model_calls", schemaPath: "#/properties/max_model_calls/maximum", keyword: "maximum", params: { comparison: "<=", limit: 14 }, message: "must be <= 14" }];
                                return false;
                              } else {
                                if (data12 < 3 || isNaN(data12)) {
                                  validate13.errors = [{ instancePath: instancePath + "/max_model_calls", schemaPath: "#/properties/max_model_calls/minimum", keyword: "minimum", params: { comparison: ">=", limit: 3 }, message: "must be >= 3" }];
                                  return false;
                                }
                              }
                            }
                          }
                          var valid0 = _errs28 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.max_output_tokens !== void 0) {
                            let data13 = data.max_output_tokens;
                            const _errs30 = errors;
                            if (!(typeof data13 == "number" && (!(data13 % 1) && !isNaN(data13)))) {
                              validate13.errors = [{ instancePath: instancePath + "/max_output_tokens", schemaPath: "#/properties/max_output_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                              return false;
                            }
                            if (errors === _errs30) {
                              if (typeof data13 == "number") {
                                if (data13 > 4096 || isNaN(data13)) {
                                  validate13.errors = [{ instancePath: instancePath + "/max_output_tokens", schemaPath: "#/properties/max_output_tokens/maximum", keyword: "maximum", params: { comparison: "<=", limit: 4096 }, message: "must be <= 4096" }];
                                  return false;
                                } else {
                                  if (data13 < 128 || isNaN(data13)) {
                                    validate13.errors = [{ instancePath: instancePath + "/max_output_tokens", schemaPath: "#/properties/max_output_tokens/minimum", keyword: "minimum", params: { comparison: ">=", limit: 128 }, message: "must be >= 128" }];
                                    return false;
                                  }
                                }
                              }
                            }
                            var valid0 = _errs30 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.max_cost_microusd !== void 0) {
                              let data14 = data.max_cost_microusd;
                              const _errs32 = errors;
                              if (!(typeof data14 == "number" && (!(data14 % 1) && !isNaN(data14)))) {
                                validate13.errors = [{ instancePath: instancePath + "/max_cost_microusd", schemaPath: "#/properties/max_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                return false;
                              }
                              if (errors === _errs32) {
                                if (typeof data14 == "number") {
                                  if (data14 > 1e9 || isNaN(data14)) {
                                    validate13.errors = [{ instancePath: instancePath + "/max_cost_microusd", schemaPath: "#/properties/max_cost_microusd/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e9 }, message: "must be <= 1000000000" }];
                                    return false;
                                  } else {
                                    if (data14 < 0 || isNaN(data14)) {
                                      validate13.errors = [{ instancePath: instancePath + "/max_cost_microusd", schemaPath: "#/properties/max_cost_microusd/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                      return false;
                                    }
                                  }
                                }
                              }
                              var valid0 = _errs32 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.id !== void 0) {
                                const _errs34 = errors;
                                if (typeof data.id !== "string") {
                                  validate13.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                  return false;
                                }
                                var valid0 = _errs34 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.archived !== void 0) {
                                  const _errs36 = errors;
                                  if (typeof data.archived !== "boolean") {
                                    validate13.errors = [{ instancePath: instancePath + "/archived", schemaPath: "#/properties/archived/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                    return false;
                                  }
                                  var valid0 = _errs36 === errors;
                                } else {
                                  var valid0 = true;
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
      validate13.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate13.errors = vErrors;
  return errors === 0;
}
function validate12(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.app_version === void 0 && (missing0 = "app_version") || data.protocol_version === void 0 && (missing0 = "protocol_version") || data.database_version === void 0 && (missing0 = "database_version") || data.connections === void 0 && (missing0 = "connections") || data.agents === void 0 && (missing0 = "agents") || data.workspaces === void 0 && (missing0 = "workspaces") || data.skills === void 0 && (missing0 = "skills") || data.workflows === void 0 && (missing0 = "workflows")) {
        validate12.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "app_version" || key0 === "protocol_version" || key0 === "database_version" || key0 === "connections" || key0 === "agents" || key0 === "workspaces" || key0 === "skills" || key0 === "workflows")) {
            validate12.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.app_version !== void 0) {
            let data0 = data.app_version;
            const _errs2 = errors;
            if (typeof data0 !== "string") {
              validate12.errors = [{ instancePath: instancePath + "/app_version", schemaPath: "#/properties/app_version/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            if ("0.1.0" !== data0) {
              validate12.errors = [{ instancePath: instancePath + "/app_version", schemaPath: "#/properties/app_version/const", keyword: "const", params: { allowedValue: "0.1.0" }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.protocol_version !== void 0) {
              let data1 = data.protocol_version;
              const _errs4 = errors;
              if (!(typeof data1 == "number" && (!(data1 % 1) && !isNaN(data1)))) {
                validate12.errors = [{ instancePath: instancePath + "/protocol_version", schemaPath: "#/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                return false;
              }
              if (1 !== data1) {
                validate12.errors = [{ instancePath: instancePath + "/protocol_version", schemaPath: "#/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.database_version !== void 0) {
                let data2 = data.database_version;
                const _errs6 = errors;
                if (!(typeof data2 == "number" && (!(data2 % 1) && !isNaN(data2)))) {
                  validate12.errors = [{ instancePath: instancePath + "/database_version", schemaPath: "#/properties/database_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                  return false;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.connections !== void 0) {
                  let data3 = data.connections;
                  const _errs8 = errors;
                  if (errors === _errs8) {
                    if (Array.isArray(data3)) {
                      var valid1 = true;
                      const len0 = data3.length;
                      for (let i0 = 0; i0 < len0; i0++) {
                        let data4 = data3[i0];
                        const _errs10 = errors;
                        const _errs11 = errors;
                        if (errors === _errs11) {
                          if (data4 && typeof data4 == "object" && !Array.isArray(data4)) {
                            let missing1;
                            if (data4.name === void 0 && (missing1 = "name") || data4.provider === void 0 && (missing1 = "provider") || data4.model_id === void 0 && (missing1 = "model_id") || data4.base_url === void 0 && (missing1 = "base_url") || data4.supports_tools === void 0 && (missing1 = "supports_tools") || data4.id === void 0 && (missing1 = "id") || data4.status === void 0 && (missing1 = "status")) {
                              validate12.errors = [{ instancePath: instancePath + "/connections/" + i0, schemaPath: "#/$defs/Connection/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                              return false;
                            } else {
                              const _errs13 = errors;
                              for (const key1 in data4) {
                                if (!(key1 === "name" || key1 === "provider" || key1 === "model_id" || key1 === "base_url" || key1 === "supports_tools" || key1 === "id" || key1 === "status")) {
                                  validate12.errors = [{ instancePath: instancePath + "/connections/" + i0, schemaPath: "#/$defs/Connection/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                  return false;
                                  break;
                                }
                              }
                              if (_errs13 === errors) {
                                if (data4.name !== void 0) {
                                  let data5 = data4.name;
                                  const _errs14 = errors;
                                  if (errors === _errs14) {
                                    if (typeof data5 === "string") {
                                      if (func2(data5) > 100) {
                                        validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/name", schemaPath: "#/$defs/Connection/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                        return false;
                                      } else {
                                        if (func2(data5) < 1) {
                                          validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/name", schemaPath: "#/$defs/Connection/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                          return false;
                                        }
                                      }
                                    } else {
                                      validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/name", schemaPath: "#/$defs/Connection/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                  }
                                  var valid3 = _errs14 === errors;
                                } else {
                                  var valid3 = true;
                                }
                                if (valid3) {
                                  if (data4.provider !== void 0) {
                                    let data6 = data4.provider;
                                    const _errs16 = errors;
                                    if (typeof data6 !== "string") {
                                      validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/provider", schemaPath: "#/$defs/Connection/properties/provider/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    if (!(data6 === "ollama" || data6 === "lmstudio" || data6 === "anthropic" || data6 === "gemini" || data6 === "openai")) {
                                      validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/provider", schemaPath: "#/$defs/Connection/properties/provider/enum", keyword: "enum", params: { allowedValues: schema14.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                      return false;
                                    }
                                    var valid3 = _errs16 === errors;
                                  } else {
                                    var valid3 = true;
                                  }
                                  if (valid3) {
                                    if (data4.model_id !== void 0) {
                                      let data7 = data4.model_id;
                                      const _errs18 = errors;
                                      if (errors === _errs18) {
                                        if (typeof data7 === "string") {
                                          if (func2(data7) > 100) {
                                            validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/model_id", schemaPath: "#/$defs/Connection/properties/model_id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                            return false;
                                          } else {
                                            if (func2(data7) < 1) {
                                              validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/model_id", schemaPath: "#/$defs/Connection/properties/model_id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                              return false;
                                            }
                                          }
                                        } else {
                                          validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/model_id", schemaPath: "#/$defs/Connection/properties/model_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                      }
                                      var valid3 = _errs18 === errors;
                                    } else {
                                      var valid3 = true;
                                    }
                                    if (valid3) {
                                      if (data4.base_url !== void 0) {
                                        let data8 = data4.base_url;
                                        const _errs20 = errors;
                                        if (errors === _errs20) {
                                          if (typeof data8 === "string") {
                                            if (func2(data8) > 500) {
                                              validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/base_url", schemaPath: "#/$defs/Connection/properties/base_url/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" }];
                                              return false;
                                            }
                                          } else {
                                            validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/base_url", schemaPath: "#/$defs/Connection/properties/base_url/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid3 = _errs20 === errors;
                                      } else {
                                        var valid3 = true;
                                      }
                                      if (valid3) {
                                        if (data4.supports_tools !== void 0) {
                                          let data9 = data4.supports_tools;
                                          const _errs22 = errors;
                                          if (typeof data9 !== "string") {
                                            validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/supports_tools", schemaPath: "#/$defs/Connection/properties/supports_tools/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                          if (!(data9 === "unknown" || data9 === "true" || data9 === "false")) {
                                            validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/supports_tools", schemaPath: "#/$defs/Connection/properties/supports_tools/enum", keyword: "enum", params: { allowedValues: schema14.properties.supports_tools.enum }, message: "must be equal to one of the allowed values" }];
                                            return false;
                                          }
                                          var valid3 = _errs22 === errors;
                                        } else {
                                          var valid3 = true;
                                        }
                                        if (valid3) {
                                          if (data4.id !== void 0) {
                                            const _errs24 = errors;
                                            if (typeof data4.id !== "string") {
                                              validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/id", schemaPath: "#/$defs/Connection/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid3 = _errs24 === errors;
                                          } else {
                                            var valid3 = true;
                                          }
                                          if (valid3) {
                                            if (data4.status !== void 0) {
                                              let data11 = data4.status;
                                              const _errs26 = errors;
                                              if (typeof data11 !== "string") {
                                                validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/status", schemaPath: "#/$defs/Connection/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                              if ("unconfigured" !== data11) {
                                                validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/status", schemaPath: "#/$defs/Connection/properties/status/const", keyword: "const", params: { allowedValue: "unconfigured" }, message: "must be equal to constant" }];
                                                return false;
                                              }
                                              var valid3 = _errs26 === errors;
                                            } else {
                                              var valid3 = true;
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
                            validate12.errors = [{ instancePath: instancePath + "/connections/" + i0, schemaPath: "#/$defs/Connection/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                            return false;
                          }
                        }
                        var valid1 = _errs10 === errors;
                        if (!valid1) {
                          break;
                        }
                      }
                    } else {
                      validate12.errors = [{ instancePath: instancePath + "/connections", schemaPath: "#/properties/connections/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.agents !== void 0) {
                    let data12 = data.agents;
                    const _errs28 = errors;
                    if (errors === _errs28) {
                      if (Array.isArray(data12)) {
                        var valid4 = true;
                        const len1 = data12.length;
                        for (let i1 = 0; i1 < len1; i1++) {
                          let data13 = data12[i1];
                          const _errs30 = errors;
                          const _errs31 = errors;
                          if (errors === _errs31) {
                            if (data13 && typeof data13 == "object" && !Array.isArray(data13)) {
                              let missing2;
                              if (data13.name === void 0 && (missing2 = "name") || data13.role === void 0 && (missing2 = "role") || data13.connection_id === void 0 && (missing2 = "connection_id") || data13.instructions === void 0 && (missing2 = "instructions") || data13.id === void 0 && (missing2 = "id") || data13.fallback_connection_ids === void 0 && (missing2 = "fallback_connection_ids") || data13.permissions === void 0 && (missing2 = "permissions") || data13.skill_ids === void 0 && (missing2 = "skill_ids")) {
                                validate12.errors = [{ instancePath: instancePath + "/agents/" + i1, schemaPath: "#/$defs/Agent/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                return false;
                              } else {
                                const _errs33 = errors;
                                for (const key2 in data13) {
                                  if (!(key2 === "name" || key2 === "role" || key2 === "connection_id" || key2 === "instructions" || key2 === "id" || key2 === "fallback_connection_ids" || key2 === "permissions" || key2 === "skill_ids")) {
                                    validate12.errors = [{ instancePath: instancePath + "/agents/" + i1, schemaPath: "#/$defs/Agent/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs33 === errors) {
                                  if (data13.name !== void 0) {
                                    let data14 = data13.name;
                                    const _errs34 = errors;
                                    if (errors === _errs34) {
                                      if (typeof data14 === "string") {
                                        if (func2(data14) > 100) {
                                          validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/name", schemaPath: "#/$defs/Agent/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                          return false;
                                        } else {
                                          if (func2(data14) < 1) {
                                            validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/name", schemaPath: "#/$defs/Agent/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                            return false;
                                          }
                                        }
                                      } else {
                                        validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/name", schemaPath: "#/$defs/Agent/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                    }
                                    var valid6 = _errs34 === errors;
                                  } else {
                                    var valid6 = true;
                                  }
                                  if (valid6) {
                                    if (data13.role !== void 0) {
                                      let data15 = data13.role;
                                      const _errs36 = errors;
                                      if (errors === _errs36) {
                                        if (typeof data15 === "string") {
                                          if (func2(data15) > 100) {
                                            validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/role", schemaPath: "#/$defs/Agent/properties/role/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                            return false;
                                          } else {
                                            if (func2(data15) < 1) {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/role", schemaPath: "#/$defs/Agent/properties/role/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                              return false;
                                            }
                                          }
                                        } else {
                                          validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/role", schemaPath: "#/$defs/Agent/properties/role/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                      }
                                      var valid6 = _errs36 === errors;
                                    } else {
                                      var valid6 = true;
                                    }
                                    if (valid6) {
                                      if (data13.connection_id !== void 0) {
                                        let data16 = data13.connection_id;
                                        const _errs38 = errors;
                                        if (errors === _errs38) {
                                          if (typeof data16 === "string") {
                                            if (func2(data16) > 128) {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/connection_id", schemaPath: "#/$defs/Agent/properties/connection_id/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
                                              return false;
                                            } else {
                                              if (func2(data16) < 1) {
                                                validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/connection_id", schemaPath: "#/$defs/Agent/properties/connection_id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                return false;
                                              }
                                            }
                                          } else {
                                            validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/connection_id", schemaPath: "#/$defs/Agent/properties/connection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid6 = _errs38 === errors;
                                      } else {
                                        var valid6 = true;
                                      }
                                      if (valid6) {
                                        if (data13.instructions !== void 0) {
                                          let data17 = data13.instructions;
                                          const _errs40 = errors;
                                          if (errors === _errs40) {
                                            if (typeof data17 === "string") {
                                              if (func2(data17) > 8e3) {
                                                validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/instructions", schemaPath: "#/$defs/Agent/properties/instructions/maxLength", keyword: "maxLength", params: { limit: 8e3 }, message: "must NOT have more than 8000 characters" }];
                                                return false;
                                              }
                                            } else {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/instructions", schemaPath: "#/$defs/Agent/properties/instructions/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                          }
                                          var valid6 = _errs40 === errors;
                                        } else {
                                          var valid6 = true;
                                        }
                                        if (valid6) {
                                          if (data13.id !== void 0) {
                                            const _errs42 = errors;
                                            if (typeof data13.id !== "string") {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/id", schemaPath: "#/$defs/Agent/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid6 = _errs42 === errors;
                                          } else {
                                            var valid6 = true;
                                          }
                                          if (valid6) {
                                            if (data13.fallback_connection_ids !== void 0) {
                                              let data19 = data13.fallback_connection_ids;
                                              const _errs44 = errors;
                                              if (errors === _errs44) {
                                                if (Array.isArray(data19)) {
                                                  if (data19.length > 3) {
                                                    validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/fallback_connection_ids", schemaPath: "#/$defs/Agent/properties/fallback_connection_ids/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                                    return false;
                                                  } else {
                                                    var valid7 = true;
                                                    const len2 = data19.length;
                                                    for (let i2 = 0; i2 < len2; i2++) {
                                                      let data20 = data19[i2];
                                                      const _errs46 = errors;
                                                      if (errors === _errs46) {
                                                        if (typeof data20 === "string") {
                                                          if (func2(data20) > 128) {
                                                            validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/fallback_connection_ids/" + i2, schemaPath: "#/$defs/Agent/properties/fallback_connection_ids/items/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
                                                            return false;
                                                          } else {
                                                            if (func2(data20) < 1) {
                                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/fallback_connection_ids/" + i2, schemaPath: "#/$defs/Agent/properties/fallback_connection_ids/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                              return false;
                                                            }
                                                          }
                                                        } else {
                                                          validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/fallback_connection_ids/" + i2, schemaPath: "#/$defs/Agent/properties/fallback_connection_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                      }
                                                      var valid7 = _errs46 === errors;
                                                      if (!valid7) {
                                                        break;
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/fallback_connection_ids", schemaPath: "#/$defs/Agent/properties/fallback_connection_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                  return false;
                                                }
                                              }
                                              var valid6 = _errs44 === errors;
                                            } else {
                                              var valid6 = true;
                                            }
                                            if (valid6) {
                                              if (data13.permissions !== void 0) {
                                                let data21 = data13.permissions;
                                                const _errs48 = errors;
                                                if (errors === _errs48) {
                                                  if (Array.isArray(data21)) {
                                                    var valid8 = true;
                                                    const len3 = data21.length;
                                                    for (let i3 = 0; i3 < len3; i3++) {
                                                      let data22 = data21[i3];
                                                      const _errs50 = errors;
                                                      if (typeof data22 !== "string") {
                                                        validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/permissions/" + i3, schemaPath: "#/$defs/Agent/properties/permissions/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      if (!(data22 === "workspace.read" || data22 === "workspace.write" || data22 === "terminal.execute")) {
                                                        validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/permissions/" + i3, schemaPath: "#/$defs/Agent/properties/permissions/items/enum", keyword: "enum", params: { allowedValues: schema15.properties.permissions.items.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid8 = _errs50 === errors;
                                                      if (!valid8) {
                                                        break;
                                                      }
                                                    }
                                                  } else {
                                                    validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/permissions", schemaPath: "#/$defs/Agent/properties/permissions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                    return false;
                                                  }
                                                }
                                                var valid6 = _errs48 === errors;
                                              } else {
                                                var valid6 = true;
                                              }
                                              if (valid6) {
                                                if (data13.skill_ids !== void 0) {
                                                  let data23 = data13.skill_ids;
                                                  const _errs52 = errors;
                                                  if (errors === _errs52) {
                                                    if (Array.isArray(data23)) {
                                                      var valid9 = true;
                                                      const len4 = data23.length;
                                                      for (let i4 = 0; i4 < len4; i4++) {
                                                        const _errs54 = errors;
                                                        if (typeof data23[i4] !== "string") {
                                                          validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/skill_ids/" + i4, schemaPath: "#/$defs/Agent/properties/skill_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                        var valid9 = _errs54 === errors;
                                                        if (!valid9) {
                                                          break;
                                                        }
                                                      }
                                                    } else {
                                                      validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/skill_ids", schemaPath: "#/$defs/Agent/properties/skill_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid6 = _errs52 === errors;
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
                              }
                            } else {
                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1, schemaPath: "#/$defs/Agent/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                              return false;
                            }
                          }
                          var valid4 = _errs30 === errors;
                          if (!valid4) {
                            break;
                          }
                        }
                      } else {
                        validate12.errors = [{ instancePath: instancePath + "/agents", schemaPath: "#/properties/agents/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                        return false;
                      }
                    }
                    var valid0 = _errs28 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.workspaces !== void 0) {
                      let data25 = data.workspaces;
                      const _errs56 = errors;
                      if (errors === _errs56) {
                        if (Array.isArray(data25)) {
                          var valid10 = true;
                          const len5 = data25.length;
                          for (let i5 = 0; i5 < len5; i5++) {
                            let data26 = data25[i5];
                            const _errs58 = errors;
                            const _errs59 = errors;
                            if (errors === _errs59) {
                              if (data26 && typeof data26 == "object" && !Array.isArray(data26)) {
                                let missing3;
                                if (data26.name === void 0 && (missing3 = "name") || data26.path === void 0 && (missing3 = "path") || data26.id === void 0 && (missing3 = "id")) {
                                  validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5, schemaPath: "#/$defs/Workspace/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                  return false;
                                } else {
                                  const _errs61 = errors;
                                  for (const key3 in data26) {
                                    if (!(key3 === "name" || key3 === "path" || key3 === "id")) {
                                      validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5, schemaPath: "#/$defs/Workspace/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                      return false;
                                      break;
                                    }
                                  }
                                  if (_errs61 === errors) {
                                    if (data26.name !== void 0) {
                                      let data27 = data26.name;
                                      const _errs62 = errors;
                                      if (errors === _errs62) {
                                        if (typeof data27 === "string") {
                                          if (func2(data27) > 100) {
                                            validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5 + "/name", schemaPath: "#/$defs/Workspace/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                            return false;
                                          } else {
                                            if (func2(data27) < 1) {
                                              validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5 + "/name", schemaPath: "#/$defs/Workspace/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                              return false;
                                            }
                                          }
                                        } else {
                                          validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5 + "/name", schemaPath: "#/$defs/Workspace/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                      }
                                      var valid12 = _errs62 === errors;
                                    } else {
                                      var valid12 = true;
                                    }
                                    if (valid12) {
                                      if (data26.path !== void 0) {
                                        let data28 = data26.path;
                                        const _errs64 = errors;
                                        if (errors === _errs64) {
                                          if (typeof data28 === "string") {
                                            if (func2(data28) > 4096) {
                                              validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5 + "/path", schemaPath: "#/$defs/Workspace/properties/path/maxLength", keyword: "maxLength", params: { limit: 4096 }, message: "must NOT have more than 4096 characters" }];
                                              return false;
                                            } else {
                                              if (func2(data28) < 1) {
                                                validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5 + "/path", schemaPath: "#/$defs/Workspace/properties/path/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                return false;
                                              }
                                            }
                                          } else {
                                            validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5 + "/path", schemaPath: "#/$defs/Workspace/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid12 = _errs64 === errors;
                                      } else {
                                        var valid12 = true;
                                      }
                                      if (valid12) {
                                        if (data26.id !== void 0) {
                                          const _errs66 = errors;
                                          if (typeof data26.id !== "string") {
                                            validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5 + "/id", schemaPath: "#/$defs/Workspace/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                          var valid12 = _errs66 === errors;
                                        } else {
                                          var valid12 = true;
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i5, schemaPath: "#/$defs/Workspace/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                return false;
                              }
                            }
                            var valid10 = _errs58 === errors;
                            if (!valid10) {
                              break;
                            }
                          }
                        } else {
                          validate12.errors = [{ instancePath: instancePath + "/workspaces", schemaPath: "#/properties/workspaces/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs56 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.skills !== void 0) {
                        let data30 = data.skills;
                        const _errs68 = errors;
                        if (errors === _errs68) {
                          if (Array.isArray(data30)) {
                            var valid13 = true;
                            const len6 = data30.length;
                            for (let i6 = 0; i6 < len6; i6++) {
                              let data31 = data30[i6];
                              const _errs70 = errors;
                              const _errs71 = errors;
                              if (errors === _errs71) {
                                if (data31 && typeof data31 == "object" && !Array.isArray(data31)) {
                                  let missing4;
                                  if (data31.name === void 0 && (missing4 = "name") || data31.version === void 0 && (missing4 = "version") || data31.description === void 0 && (missing4 = "description") || data31.instructions === void 0 && (missing4 = "instructions") || data31.required_tools === void 0 && (missing4 = "required_tools") || data31.required_permissions === void 0 && (missing4 = "required_permissions") || data31.provider_hint === void 0 && (missing4 = "provider_hint") || data31.id === void 0 && (missing4 = "id")) {
                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i6, schemaPath: "#/$defs/SkillPackage/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" }];
                                    return false;
                                  } else {
                                    const _errs73 = errors;
                                    for (const key4 in data31) {
                                      if (!(key4 === "name" || key4 === "version" || key4 === "description" || key4 === "instructions" || key4 === "required_tools" || key4 === "required_permissions" || key4 === "provider_hint" || key4 === "id")) {
                                        validate12.errors = [{ instancePath: instancePath + "/skills/" + i6, schemaPath: "#/$defs/SkillPackage/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" }];
                                        return false;
                                        break;
                                      }
                                    }
                                    if (_errs73 === errors) {
                                      if (data31.name !== void 0) {
                                        let data32 = data31.name;
                                        const _errs74 = errors;
                                        if (errors === _errs74) {
                                          if (typeof data32 === "string") {
                                            if (func2(data32) > 100) {
                                              validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/name", schemaPath: "#/$defs/SkillPackage/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                              return false;
                                            } else {
                                              if (func2(data32) < 1) {
                                                validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/name", schemaPath: "#/$defs/SkillPackage/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                return false;
                                              }
                                            }
                                          } else {
                                            validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/name", schemaPath: "#/$defs/SkillPackage/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid15 = _errs74 === errors;
                                      } else {
                                        var valid15 = true;
                                      }
                                      if (valid15) {
                                        if (data31.version !== void 0) {
                                          let data33 = data31.version;
                                          const _errs76 = errors;
                                          if (errors === _errs76) {
                                            if (typeof data33 === "string") {
                                              if (func2(data33) > 20) {
                                                validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/maxLength", keyword: "maxLength", params: { limit: 20 }, message: "must NOT have more than 20 characters" }];
                                                return false;
                                              } else {
                                                if (func2(data33) < 5) {
                                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/minLength", keyword: "minLength", params: { limit: 5 }, message: "must NOT have fewer than 5 characters" }];
                                                  return false;
                                                } else {
                                                  if (!pattern0.test(data33)) {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/pattern", keyword: "pattern", params: { pattern: "^\\d+\\.\\d+\\.\\d+$" }, message: 'must match pattern "^\\d+\\.\\d+\\.\\d+$"' }];
                                                    return false;
                                                  }
                                                }
                                              }
                                            } else {
                                              validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                          }
                                          var valid15 = _errs76 === errors;
                                        } else {
                                          var valid15 = true;
                                        }
                                        if (valid15) {
                                          if (data31.description !== void 0) {
                                            let data34 = data31.description;
                                            const _errs78 = errors;
                                            if (errors === _errs78) {
                                              if (typeof data34 === "string") {
                                                if (func2(data34) > 500) {
                                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/description", schemaPath: "#/$defs/SkillPackage/properties/description/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" }];
                                                  return false;
                                                } else {
                                                  if (func2(data34) < 1) {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/description", schemaPath: "#/$defs/SkillPackage/properties/description/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                    return false;
                                                  }
                                                }
                                              } else {
                                                validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/description", schemaPath: "#/$defs/SkillPackage/properties/description/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                            }
                                            var valid15 = _errs78 === errors;
                                          } else {
                                            var valid15 = true;
                                          }
                                          if (valid15) {
                                            if (data31.instructions !== void 0) {
                                              let data35 = data31.instructions;
                                              const _errs80 = errors;
                                              if (errors === _errs80) {
                                                if (typeof data35 === "string") {
                                                  if (func2(data35) > 8e3) {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/instructions", schemaPath: "#/$defs/SkillPackage/properties/instructions/maxLength", keyword: "maxLength", params: { limit: 8e3 }, message: "must NOT have more than 8000 characters" }];
                                                    return false;
                                                  }
                                                } else {
                                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/instructions", schemaPath: "#/$defs/SkillPackage/properties/instructions/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                              }
                                              var valid15 = _errs80 === errors;
                                            } else {
                                              var valid15 = true;
                                            }
                                            if (valid15) {
                                              if (data31.required_tools !== void 0) {
                                                let data36 = data31.required_tools;
                                                const _errs82 = errors;
                                                if (errors === _errs82) {
                                                  if (Array.isArray(data36)) {
                                                    if (data36.length > 3) {
                                                      validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_tools", schemaPath: "#/$defs/SkillPackage/properties/required_tools/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                                      return false;
                                                    } else {
                                                      var valid16 = true;
                                                      const len7 = data36.length;
                                                      for (let i7 = 0; i7 < len7; i7++) {
                                                        let data37 = data36[i7];
                                                        const _errs84 = errors;
                                                        if (typeof data37 !== "string") {
                                                          validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_tools/" + i7, schemaPath: "#/$defs/SkillPackage/properties/required_tools/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                        if (!(data37 === "workspace.write" || data37 === "terminal.execute" || data37 === "knowledge.search")) {
                                                          validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_tools/" + i7, schemaPath: "#/$defs/SkillPackage/properties/required_tools/items/enum", keyword: "enum", params: { allowedValues: schema17.properties.required_tools.items.enum }, message: "must be equal to one of the allowed values" }];
                                                          return false;
                                                        }
                                                        var valid16 = _errs84 === errors;
                                                        if (!valid16) {
                                                          break;
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_tools", schemaPath: "#/$defs/SkillPackage/properties/required_tools/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                    return false;
                                                  }
                                                }
                                                var valid15 = _errs82 === errors;
                                              } else {
                                                var valid15 = true;
                                              }
                                              if (valid15) {
                                                if (data31.required_permissions !== void 0) {
                                                  let data38 = data31.required_permissions;
                                                  const _errs86 = errors;
                                                  if (errors === _errs86) {
                                                    if (Array.isArray(data38)) {
                                                      if (data38.length > 3) {
                                                        validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_permissions", schemaPath: "#/$defs/SkillPackage/properties/required_permissions/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                                        return false;
                                                      } else {
                                                        var valid17 = true;
                                                        const len8 = data38.length;
                                                        for (let i8 = 0; i8 < len8; i8++) {
                                                          let data39 = data38[i8];
                                                          const _errs88 = errors;
                                                          if (typeof data39 !== "string") {
                                                            validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_permissions/" + i8, schemaPath: "#/$defs/SkillPackage/properties/required_permissions/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                          if (!(data39 === "workspace.read" || data39 === "workspace.write" || data39 === "terminal.execute")) {
                                                            validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_permissions/" + i8, schemaPath: "#/$defs/SkillPackage/properties/required_permissions/items/enum", keyword: "enum", params: { allowedValues: schema17.properties.required_permissions.items.enum }, message: "must be equal to one of the allowed values" }];
                                                            return false;
                                                          }
                                                          var valid17 = _errs88 === errors;
                                                          if (!valid17) {
                                                            break;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/required_permissions", schemaPath: "#/$defs/SkillPackage/properties/required_permissions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid15 = _errs86 === errors;
                                                } else {
                                                  var valid15 = true;
                                                }
                                                if (valid15) {
                                                  if (data31.provider_hint !== void 0) {
                                                    let data40 = data31.provider_hint;
                                                    const _errs90 = errors;
                                                    const _errs91 = errors;
                                                    let valid18 = false;
                                                    const _errs92 = errors;
                                                    if (typeof data40 !== "string") {
                                                      const err0 = { instancePath: instancePath + "/skills/" + i6 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err0];
                                                      } else {
                                                        vErrors.push(err0);
                                                      }
                                                      errors++;
                                                    }
                                                    if (!(data40 === "ollama" || data40 === "lmstudio" || data40 === "anthropic" || data40 === "gemini" || data40 === "openai")) {
                                                      const err1 = { instancePath: instancePath + "/skills/" + i6 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf/0/enum", keyword: "enum", params: { allowedValues: schema17.properties.provider_hint.anyOf[0].enum }, message: "must be equal to one of the allowed values" };
                                                      if (vErrors === null) {
                                                        vErrors = [err1];
                                                      } else {
                                                        vErrors.push(err1);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid0 = _errs92 === errors;
                                                    valid18 = valid18 || _valid0;
                                                    if (!valid18) {
                                                      const _errs94 = errors;
                                                      if (data40 !== null) {
                                                        const err2 = { instancePath: instancePath + "/skills/" + i6 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err2];
                                                        } else {
                                                          vErrors.push(err2);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid0 = _errs94 === errors;
                                                      valid18 = valid18 || _valid0;
                                                    }
                                                    if (!valid18) {
                                                      const err3 = { instancePath: instancePath + "/skills/" + i6 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                      if (vErrors === null) {
                                                        vErrors = [err3];
                                                      } else {
                                                        vErrors.push(err3);
                                                      }
                                                      errors++;
                                                      validate12.errors = vErrors;
                                                      return false;
                                                    } else {
                                                      errors = _errs91;
                                                      if (vErrors !== null) {
                                                        if (_errs91) {
                                                          vErrors.length = _errs91;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid15 = _errs90 === errors;
                                                  } else {
                                                    var valid15 = true;
                                                  }
                                                  if (valid15) {
                                                    if (data31.id !== void 0) {
                                                      const _errs96 = errors;
                                                      if (typeof data31.id !== "string") {
                                                        validate12.errors = [{ instancePath: instancePath + "/skills/" + i6 + "/id", schemaPath: "#/$defs/SkillPackage/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid15 = _errs96 === errors;
                                                    } else {
                                                      var valid15 = true;
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
                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i6, schemaPath: "#/$defs/SkillPackage/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                  return false;
                                }
                              }
                              var valid13 = _errs70 === errors;
                              if (!valid13) {
                                break;
                              }
                            }
                          } else {
                            validate12.errors = [{ instancePath: instancePath + "/skills", schemaPath: "#/properties/skills/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs68 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.workflows !== void 0) {
                          let data42 = data.workflows;
                          const _errs98 = errors;
                          if (errors === _errs98) {
                            if (Array.isArray(data42)) {
                              var valid19 = true;
                              const len9 = data42.length;
                              for (let i9 = 0; i9 < len9; i9++) {
                                const _errs100 = errors;
                                if (!validate13(data42[i9], { instancePath: instancePath + "/workflows/" + i9, parentData: data42, parentDataProperty: i9, rootData })) {
                                  vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
                                  errors = vErrors.length;
                                }
                                var valid19 = _errs100 === errors;
                                if (!valid19) {
                                  break;
                                }
                              }
                            } else {
                              validate12.errors = [{ instancePath: instancePath + "/workflows", schemaPath: "#/properties/workflows/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                              return false;
                            }
                          }
                          var valid0 = _errs98 === errors;
                        } else {
                          var valid0 = true;
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
      validate12.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate12.errors = vErrors;
  return errors === 0;
}
function validate16(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.models === void 0 && (missing0 = "models")) {
        validate16.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "models")) {
            validate16.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.models !== void 0) {
            let data0 = data.models;
            const _errs2 = errors;
            if (errors === _errs2) {
              if (Array.isArray(data0)) {
                var valid1 = true;
                const len0 = data0.length;
                for (let i0 = 0; i0 < len0; i0++) {
                  let data1 = data0[i0];
                  const _errs4 = errors;
                  const _errs5 = errors;
                  if (errors === _errs5) {
                    if (data1 && typeof data1 == "object" && !Array.isArray(data1)) {
                      let missing1;
                      if (data1.name === void 0 && (missing1 = "name") || data1.size === void 0 && (missing1 = "size") || data1.capabilities === void 0 && (missing1 = "capabilities")) {
                        validate16.errors = [{ instancePath: instancePath + "/models/" + i0, schemaPath: "#/$defs/OllamaModel/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                        return false;
                      } else {
                        const _errs7 = errors;
                        for (const key1 in data1) {
                          if (!(key1 === "name" || key1 === "size" || key1 === "capabilities")) {
                            validate16.errors = [{ instancePath: instancePath + "/models/" + i0, schemaPath: "#/$defs/OllamaModel/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                            return false;
                            break;
                          }
                        }
                        if (_errs7 === errors) {
                          if (data1.name !== void 0) {
                            const _errs8 = errors;
                            if (typeof data1.name !== "string") {
                              validate16.errors = [{ instancePath: instancePath + "/models/" + i0 + "/name", schemaPath: "#/$defs/OllamaModel/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                              return false;
                            }
                            var valid3 = _errs8 === errors;
                          } else {
                            var valid3 = true;
                          }
                          if (valid3) {
                            if (data1.size !== void 0) {
                              let data3 = data1.size;
                              const _errs10 = errors;
                              if (!(typeof data3 == "number" && (!(data3 % 1) && !isNaN(data3)))) {
                                validate16.errors = [{ instancePath: instancePath + "/models/" + i0 + "/size", schemaPath: "#/$defs/OllamaModel/properties/size/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                return false;
                              }
                              var valid3 = _errs10 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data1.capabilities !== void 0) {
                                let data4 = data1.capabilities;
                                const _errs12 = errors;
                                if (errors === _errs12) {
                                  if (Array.isArray(data4)) {
                                    var valid4 = true;
                                    const len1 = data4.length;
                                    for (let i1 = 0; i1 < len1; i1++) {
                                      const _errs14 = errors;
                                      if (typeof data4[i1] !== "string") {
                                        validate16.errors = [{ instancePath: instancePath + "/models/" + i0 + "/capabilities/" + i1, schemaPath: "#/$defs/OllamaModel/properties/capabilities/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                      var valid4 = _errs14 === errors;
                                      if (!valid4) {
                                        break;
                                      }
                                    }
                                  } else {
                                    validate16.errors = [{ instancePath: instancePath + "/models/" + i0 + "/capabilities", schemaPath: "#/$defs/OllamaModel/properties/capabilities/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid3 = _errs12 === errors;
                              } else {
                                var valid3 = true;
                              }
                            }
                          }
                        }
                      }
                    } else {
                      validate16.errors = [{ instancePath: instancePath + "/models/" + i0, schemaPath: "#/$defs/OllamaModel/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                      return false;
                    }
                  }
                  var valid1 = _errs4 === errors;
                  if (!valid1) {
                    break;
                  }
                }
              } else {
                validate16.errors = [{ instancePath: instancePath + "/models", schemaPath: "#/properties/models/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
          }
        }
      }
    } else {
      validate16.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate16.errors = vErrors;
  return errors === 0;
}
var schema23 = { "additionalProperties": false, "properties": { "run_id": { "title": "Run Id", "type": "string" }, "agent_id": { "title": "Agent Id", "type": "string" }, "prompt": { "title": "Prompt", "type": "string" }, "content": { "title": "Content", "type": "string" }, "status": { "enum": ["running", "completed", "cancelled", "failed", "interrupted"], "title": "Status", "type": "string" }, "error": { "title": "Error", "type": "string" } }, "required": ["run_id", "agent_id", "prompt", "content", "status", "error"], "title": "ChatTurn", "type": "object" };
function validate18(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.turns === void 0 && (missing0 = "turns")) {
        validate18.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "turns")) {
            validate18.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.turns !== void 0) {
            let data0 = data.turns;
            const _errs2 = errors;
            if (errors === _errs2) {
              if (Array.isArray(data0)) {
                var valid1 = true;
                const len0 = data0.length;
                for (let i0 = 0; i0 < len0; i0++) {
                  let data1 = data0[i0];
                  const _errs4 = errors;
                  const _errs5 = errors;
                  if (errors === _errs5) {
                    if (data1 && typeof data1 == "object" && !Array.isArray(data1)) {
                      let missing1;
                      if (data1.run_id === void 0 && (missing1 = "run_id") || data1.agent_id === void 0 && (missing1 = "agent_id") || data1.prompt === void 0 && (missing1 = "prompt") || data1.content === void 0 && (missing1 = "content") || data1.status === void 0 && (missing1 = "status") || data1.error === void 0 && (missing1 = "error")) {
                        validate18.errors = [{ instancePath: instancePath + "/turns/" + i0, schemaPath: "#/$defs/ChatTurn/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                        return false;
                      } else {
                        const _errs7 = errors;
                        for (const key1 in data1) {
                          if (!(key1 === "run_id" || key1 === "agent_id" || key1 === "prompt" || key1 === "content" || key1 === "status" || key1 === "error")) {
                            validate18.errors = [{ instancePath: instancePath + "/turns/" + i0, schemaPath: "#/$defs/ChatTurn/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                            return false;
                            break;
                          }
                        }
                        if (_errs7 === errors) {
                          if (data1.run_id !== void 0) {
                            const _errs8 = errors;
                            if (typeof data1.run_id !== "string") {
                              validate18.errors = [{ instancePath: instancePath + "/turns/" + i0 + "/run_id", schemaPath: "#/$defs/ChatTurn/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                              return false;
                            }
                            var valid3 = _errs8 === errors;
                          } else {
                            var valid3 = true;
                          }
                          if (valid3) {
                            if (data1.agent_id !== void 0) {
                              const _errs10 = errors;
                              if (typeof data1.agent_id !== "string") {
                                validate18.errors = [{ instancePath: instancePath + "/turns/" + i0 + "/agent_id", schemaPath: "#/$defs/ChatTurn/properties/agent_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              var valid3 = _errs10 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data1.prompt !== void 0) {
                                const _errs12 = errors;
                                if (typeof data1.prompt !== "string") {
                                  validate18.errors = [{ instancePath: instancePath + "/turns/" + i0 + "/prompt", schemaPath: "#/$defs/ChatTurn/properties/prompt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                  return false;
                                }
                                var valid3 = _errs12 === errors;
                              } else {
                                var valid3 = true;
                              }
                              if (valid3) {
                                if (data1.content !== void 0) {
                                  const _errs14 = errors;
                                  if (typeof data1.content !== "string") {
                                    validate18.errors = [{ instancePath: instancePath + "/turns/" + i0 + "/content", schemaPath: "#/$defs/ChatTurn/properties/content/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  var valid3 = _errs14 === errors;
                                } else {
                                  var valid3 = true;
                                }
                                if (valid3) {
                                  if (data1.status !== void 0) {
                                    let data6 = data1.status;
                                    const _errs16 = errors;
                                    if (typeof data6 !== "string") {
                                      validate18.errors = [{ instancePath: instancePath + "/turns/" + i0 + "/status", schemaPath: "#/$defs/ChatTurn/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    if (!(data6 === "running" || data6 === "completed" || data6 === "cancelled" || data6 === "failed" || data6 === "interrupted")) {
                                      validate18.errors = [{ instancePath: instancePath + "/turns/" + i0 + "/status", schemaPath: "#/$defs/ChatTurn/properties/status/enum", keyword: "enum", params: { allowedValues: schema23.properties.status.enum }, message: "must be equal to one of the allowed values" }];
                                      return false;
                                    }
                                    var valid3 = _errs16 === errors;
                                  } else {
                                    var valid3 = true;
                                  }
                                  if (valid3) {
                                    if (data1.error !== void 0) {
                                      const _errs18 = errors;
                                      if (typeof data1.error !== "string") {
                                        validate18.errors = [{ instancePath: instancePath + "/turns/" + i0 + "/error", schemaPath: "#/$defs/ChatTurn/properties/error/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                      var valid3 = _errs18 === errors;
                                    } else {
                                      var valid3 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      validate18.errors = [{ instancePath: instancePath + "/turns/" + i0, schemaPath: "#/$defs/ChatTurn/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                      return false;
                    }
                  }
                  var valid1 = _errs4 === errors;
                  if (!valid1) {
                    break;
                  }
                }
              } else {
                validate18.errors = [{ instancePath: instancePath + "/turns", schemaPath: "#/properties/turns/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
          }
        }
      }
    } else {
      validate18.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate18.errors = vErrors;
  return errors === 0;
}
var schema27 = { "additionalProperties": false, "properties": { "path": { "title": "Path", "type": "string" }, "name": { "title": "Name", "type": "string" }, "kind": { "enum": ["file", "directory"], "title": "Kind", "type": "string" }, "size": { "title": "Size", "type": "integer" } }, "required": ["path", "name", "kind", "size"], "title": "WorkspaceEntry", "type": "object" };
function validate20(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.workspace_id === void 0 && (missing0 = "workspace_id") || data.path === void 0 && (missing0 = "path") || data.entries === void 0 && (missing0 = "entries")) {
        validate20.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "workspace_id" || key0 === "path" || key0 === "entries")) {
            validate20.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.workspace_id !== void 0) {
            const _errs2 = errors;
            if (typeof data.workspace_id !== "string") {
              validate20.errors = [{ instancePath: instancePath + "/workspace_id", schemaPath: "#/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.path !== void 0) {
              const _errs4 = errors;
              if (typeof data.path !== "string") {
                validate20.errors = [{ instancePath: instancePath + "/path", schemaPath: "#/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.entries !== void 0) {
                let data2 = data.entries;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (Array.isArray(data2)) {
                    var valid1 = true;
                    const len0 = data2.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      let data3 = data2[i0];
                      const _errs8 = errors;
                      const _errs9 = errors;
                      if (errors === _errs9) {
                        if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                          let missing1;
                          if (data3.path === void 0 && (missing1 = "path") || data3.name === void 0 && (missing1 = "name") || data3.kind === void 0 && (missing1 = "kind") || data3.size === void 0 && (missing1 = "size")) {
                            validate20.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/WorkspaceEntry/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                            return false;
                          } else {
                            const _errs11 = errors;
                            for (const key1 in data3) {
                              if (!(key1 === "path" || key1 === "name" || key1 === "kind" || key1 === "size")) {
                                validate20.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/WorkspaceEntry/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                return false;
                                break;
                              }
                            }
                            if (_errs11 === errors) {
                              if (data3.path !== void 0) {
                                const _errs12 = errors;
                                if (typeof data3.path !== "string") {
                                  validate20.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/path", schemaPath: "#/$defs/WorkspaceEntry/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                  return false;
                                }
                                var valid3 = _errs12 === errors;
                              } else {
                                var valid3 = true;
                              }
                              if (valid3) {
                                if (data3.name !== void 0) {
                                  const _errs14 = errors;
                                  if (typeof data3.name !== "string") {
                                    validate20.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/name", schemaPath: "#/$defs/WorkspaceEntry/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  var valid3 = _errs14 === errors;
                                } else {
                                  var valid3 = true;
                                }
                                if (valid3) {
                                  if (data3.kind !== void 0) {
                                    let data6 = data3.kind;
                                    const _errs16 = errors;
                                    if (typeof data6 !== "string") {
                                      validate20.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/kind", schemaPath: "#/$defs/WorkspaceEntry/properties/kind/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    if (!(data6 === "file" || data6 === "directory")) {
                                      validate20.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/kind", schemaPath: "#/$defs/WorkspaceEntry/properties/kind/enum", keyword: "enum", params: { allowedValues: schema27.properties.kind.enum }, message: "must be equal to one of the allowed values" }];
                                      return false;
                                    }
                                    var valid3 = _errs16 === errors;
                                  } else {
                                    var valid3 = true;
                                  }
                                  if (valid3) {
                                    if (data3.size !== void 0) {
                                      let data7 = data3.size;
                                      const _errs18 = errors;
                                      if (!(typeof data7 == "number" && (!(data7 % 1) && !isNaN(data7)))) {
                                        validate20.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/size", schemaPath: "#/$defs/WorkspaceEntry/properties/size/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                        return false;
                                      }
                                      var valid3 = _errs18 === errors;
                                    } else {
                                      var valid3 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          validate20.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/WorkspaceEntry/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                          return false;
                        }
                      }
                      var valid1 = _errs8 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  } else {
                    validate20.errors = [{ instancePath: instancePath + "/entries", schemaPath: "#/properties/entries/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate20.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate20.errors = vErrors;
  return errors === 0;
}
var schema30 = { "additionalProperties": false, "properties": { "run_id": { "title": "Run Id", "type": "string" }, "objective": { "title": "Objective", "type": "string" }, "agent_ids": { "items": { "type": "string" }, "title": "Agent Ids", "type": "array" }, "rounds": { "title": "Rounds", "type": "integer" }, "routing_mode": { "enum": ["manual", "auto"], "title": "Routing Mode", "type": "string" }, "route_reason": { "title": "Route Reason", "type": "string" }, "max_model_calls": { "title": "Max Model Calls", "type": "integer" }, "max_output_tokens": { "title": "Max Output Tokens", "type": "integer" }, "used_model_calls": { "title": "Used Model Calls", "type": "integer" }, "max_cost_microusd": { "title": "Max Cost Microusd", "type": "integer" }, "estimated_max_cost_microusd": { "title": "Estimated Max Cost Microusd", "type": "integer" }, "actual_cost_microusd": { "title": "Actual Cost Microusd", "type": "integer" }, "input_tokens": { "title": "Input Tokens", "type": "integer" }, "output_tokens": { "title": "Output Tokens", "type": "integer" }, "price_catalog_version": { "title": "Price Catalog Version", "type": "string" }, "pricing_warning": { "default": "", "title": "Pricing Warning", "type": "string" }, "workspace_id": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Workspace Id" }, "context_paths": { "items": { "type": "string" }, "title": "Context Paths", "type": "array" }, "enabled_tools": { "items": { "enum": ["workspace.write", "terminal.execute"], "type": "string" }, "title": "Enabled Tools", "type": "array" }, "knowledge_collection_ids": { "items": { "type": "string" }, "title": "Knowledge Collection Ids", "type": "array" }, "workflow_id": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Workflow Id" }, "workflow_version": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Workflow Version" }, "attempt": { "title": "Attempt", "type": "integer" }, "parent_run_id": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Parent Run Id" }, "resumed_from_node": { "title": "Resumed From Node", "type": "string" }, "failed_node": { "title": "Failed Node", "type": "string" }, "error_class": { "enum": ["", "retryable", "permanent", "uncertain_tool"], "title": "Error Class", "type": "string" }, "cumulative_model_calls": { "title": "Cumulative Model Calls", "type": "integer" }, "cumulative_cost_microusd": { "title": "Cumulative Cost Microusd", "type": "integer" }, "fallback_chain": { "items": { "items": { "type": "string" }, "type": "array" }, "title": "Fallback Chain", "type": "array" }, "model_call_attempts": { "items": { "$ref": "#/$defs/ModelCallAttempt" }, "title": "Model Call Attempts", "type": "array" }, "queue_sequence": { "title": "Queue Sequence", "type": "integer" }, "queue_position": { "anyOf": [{ "type": "integer" }, { "type": "null" }], "title": "Queue Position" }, "worker_id": { "title": "Worker Id", "type": "string" }, "queued_at": { "title": "Queued At", "type": "string" }, "started_at": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Started At" }, "resumed_at": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Resumed At" }, "finished_at": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Finished At" }, "status_events": { "items": { "$ref": "#/$defs/OrchestrationStatusEvent" }, "title": "Status Events", "type": "array" }, "tool_calls": { "items": { "$ref": "#/$defs/ToolCall" }, "title": "Tool Calls", "type": "array" }, "tool_action": { "anyOf": [{ "$ref": "#/$defs/ToolAction" }, { "type": "null" }] }, "status": { "enum": ["queued", "running", "paused", "waiting_approval", "completed", "cancelled", "failed", "interrupted"], "title": "Status", "type": "string" }, "error": { "title": "Error", "type": "string" }, "messages": { "items": { "$ref": "#/$defs/OrchestrationMessage" }, "title": "Messages", "type": "array" } }, "required": ["run_id", "objective", "agent_ids", "rounds", "routing_mode", "route_reason", "max_model_calls", "max_output_tokens", "used_model_calls", "max_cost_microusd", "estimated_max_cost_microusd", "actual_cost_microusd", "input_tokens", "output_tokens", "price_catalog_version", "pricing_warning", "workspace_id", "context_paths", "enabled_tools", "knowledge_collection_ids", "workflow_id", "workflow_version", "attempt", "parent_run_id", "resumed_from_node", "failed_node", "error_class", "cumulative_model_calls", "cumulative_cost_microusd", "fallback_chain", "model_call_attempts", "queue_sequence", "queue_position", "worker_id", "queued_at", "started_at", "resumed_at", "finished_at", "status_events", "tool_calls", "tool_action", "status", "error", "messages"], "title": "OrchestrationRun", "type": "object" };
var schema31 = { "additionalProperties": false, "properties": { "id": { "title": "Id", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "node_name": { "title": "Node Name", "type": "string" }, "connection_id": { "title": "Connection Id", "type": "string" }, "attempt": { "title": "Attempt", "type": "integer" }, "outcome": { "enum": ["success", "retryable", "permanent", "budget_exceeded", "skipped"], "title": "Outcome", "type": "string" }, "error_message": { "title": "Error Message", "type": "string" }, "input_tokens": { "title": "Input Tokens", "type": "integer" }, "output_tokens": { "title": "Output Tokens", "type": "integer" }, "cost_microusd": { "title": "Cost Microusd", "type": "integer" }, "started_at": { "title": "Started At", "type": "string" }, "duration_ms": { "title": "Duration Ms", "type": "integer" } }, "required": ["id", "run_id", "node_name", "connection_id", "attempt", "outcome", "error_message", "input_tokens", "output_tokens", "cost_microusd", "started_at", "duration_ms"], "title": "ModelCallAttempt", "type": "object" };
var schema32 = { "additionalProperties": false, "properties": { "sequence": { "title": "Sequence", "type": "integer" }, "from_status": { "enum": ["", "queued", "running", "paused", "waiting_approval", "completed", "cancelled", "failed", "interrupted"], "title": "From Status", "type": "string" }, "to_status": { "enum": ["queued", "running", "paused", "waiting_approval", "completed", "cancelled", "failed", "interrupted"], "title": "To Status", "type": "string" }, "reason": { "title": "Reason", "type": "string" }, "timestamp": { "title": "Timestamp", "type": "string" } }, "required": ["sequence", "from_status", "to_status", "reason", "timestamp"], "title": "OrchestrationStatusEvent", "type": "object" };
var schema33 = { "additionalProperties": false, "properties": { "id": { "title": "Id", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "node_name": { "title": "Node Name", "type": "string" }, "sequence": { "minimum": 1, "title": "Sequence", "type": "integer" }, "provider_call_id": { "default": "", "title": "Provider Call Id", "type": "string" }, "tool_name": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "title": "Tool Name", "type": "string" }, "arguments": { "additionalProperties": true, "title": "Arguments", "type": "object" }, "args_hash": { "title": "Args Hash", "type": "string" }, "content_hash": { "default": "", "title": "Content Hash", "type": "string" }, "status": { "enum": ["pending", "approved", "executing", "completed", "rejected", "uncertain"], "title": "Status", "type": "string" }, "result": { "default": "", "title": "Result", "type": "string" }, "duration_ms": { "default": 0, "minimum": 0, "title": "Duration Ms", "type": "integer" }, "created_at": { "title": "Created At", "type": "string" } }, "required": ["id", "run_id", "node_name", "sequence", "provider_call_id", "tool_name", "arguments", "args_hash", "content_hash", "status", "result", "duration_ms", "created_at"], "title": "ToolCall", "type": "object" };
var schema34 = { "additionalProperties": false, "properties": { "tool": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "title": "Tool", "type": "string" }, "path": { "default": "", "title": "Path", "type": "string" }, "command": { "items": { "type": "string" }, "title": "Command", "type": "array" }, "collection_id": { "default": "", "title": "Collection Id", "type": "string" }, "query": { "default": "", "title": "Query", "type": "string" }, "limit": { "default": 5, "maximum": 10, "minimum": 1, "title": "Limit", "type": "integer" }, "preview": { "default": "", "title": "Preview", "type": "string" }, "risk": { "enum": ["medium", "high"], "title": "Risk", "type": "string" }, "status": { "enum": ["waiting", "approved", "executing", "uncertain", "rejected", "completed", "failed"], "title": "Status", "type": "string" }, "args_hash": { "default": "", "title": "Args Hash", "type": "string" }, "content_hash": { "default": "", "title": "Content Hash", "type": "string" }, "result": { "default": "", "title": "Result", "type": "string" } }, "required": ["tool", "path", "command", "collection_id", "query", "limit", "preview", "risk", "status", "args_hash", "content_hash", "result"], "title": "ToolAction", "type": "object" };
var schema35 = { "additionalProperties": false, "properties": { "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "content": { "title": "Content", "type": "string" } }, "required": ["sequence", "agent_id", "phase", "content"], "title": "OrchestrationMessage", "type": "object" };
function validate23(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.run_id === void 0 && (missing0 = "run_id") || data.objective === void 0 && (missing0 = "objective") || data.agent_ids === void 0 && (missing0 = "agent_ids") || data.rounds === void 0 && (missing0 = "rounds") || data.routing_mode === void 0 && (missing0 = "routing_mode") || data.route_reason === void 0 && (missing0 = "route_reason") || data.max_model_calls === void 0 && (missing0 = "max_model_calls") || data.max_output_tokens === void 0 && (missing0 = "max_output_tokens") || data.used_model_calls === void 0 && (missing0 = "used_model_calls") || data.max_cost_microusd === void 0 && (missing0 = "max_cost_microusd") || data.estimated_max_cost_microusd === void 0 && (missing0 = "estimated_max_cost_microusd") || data.actual_cost_microusd === void 0 && (missing0 = "actual_cost_microusd") || data.input_tokens === void 0 && (missing0 = "input_tokens") || data.output_tokens === void 0 && (missing0 = "output_tokens") || data.price_catalog_version === void 0 && (missing0 = "price_catalog_version") || data.pricing_warning === void 0 && (missing0 = "pricing_warning") || data.workspace_id === void 0 && (missing0 = "workspace_id") || data.context_paths === void 0 && (missing0 = "context_paths") || data.enabled_tools === void 0 && (missing0 = "enabled_tools") || data.knowledge_collection_ids === void 0 && (missing0 = "knowledge_collection_ids") || data.workflow_id === void 0 && (missing0 = "workflow_id") || data.workflow_version === void 0 && (missing0 = "workflow_version") || data.attempt === void 0 && (missing0 = "attempt") || data.parent_run_id === void 0 && (missing0 = "parent_run_id") || data.resumed_from_node === void 0 && (missing0 = "resumed_from_node") || data.failed_node === void 0 && (missing0 = "failed_node") || data.error_class === void 0 && (missing0 = "error_class") || data.cumulative_model_calls === void 0 && (missing0 = "cumulative_model_calls") || data.cumulative_cost_microusd === void 0 && (missing0 = "cumulative_cost_microusd") || data.fallback_chain === void 0 && (missing0 = "fallback_chain") || data.model_call_attempts === void 0 && (missing0 = "model_call_attempts") || data.queue_sequence === void 0 && (missing0 = "queue_sequence") || data.queue_position === void 0 && (missing0 = "queue_position") || data.worker_id === void 0 && (missing0 = "worker_id") || data.queued_at === void 0 && (missing0 = "queued_at") || data.started_at === void 0 && (missing0 = "started_at") || data.resumed_at === void 0 && (missing0 = "resumed_at") || data.finished_at === void 0 && (missing0 = "finished_at") || data.status_events === void 0 && (missing0 = "status_events") || data.tool_calls === void 0 && (missing0 = "tool_calls") || data.tool_action === void 0 && (missing0 = "tool_action") || data.status === void 0 && (missing0 = "status") || data.error === void 0 && (missing0 = "error") || data.messages === void 0 && (missing0 = "messages")) {
        validate23.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!func27.call(schema30.properties, key0)) {
            validate23.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.run_id !== void 0) {
            const _errs2 = errors;
            if (typeof data.run_id !== "string") {
              validate23.errors = [{ instancePath: instancePath + "/run_id", schemaPath: "#/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.objective !== void 0) {
              const _errs4 = errors;
              if (typeof data.objective !== "string") {
                validate23.errors = [{ instancePath: instancePath + "/objective", schemaPath: "#/properties/objective/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.agent_ids !== void 0) {
                let data2 = data.agent_ids;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (Array.isArray(data2)) {
                    var valid1 = true;
                    const len0 = data2.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      const _errs8 = errors;
                      if (typeof data2[i0] !== "string") {
                        validate23.errors = [{ instancePath: instancePath + "/agent_ids/" + i0, schemaPath: "#/properties/agent_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      var valid1 = _errs8 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  } else {
                    validate23.errors = [{ instancePath: instancePath + "/agent_ids", schemaPath: "#/properties/agent_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.rounds !== void 0) {
                  let data4 = data.rounds;
                  const _errs10 = errors;
                  if (!(typeof data4 == "number" && (!(data4 % 1) && !isNaN(data4)))) {
                    validate23.errors = [{ instancePath: instancePath + "/rounds", schemaPath: "#/properties/rounds/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                    return false;
                  }
                  var valid0 = _errs10 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.routing_mode !== void 0) {
                    let data5 = data.routing_mode;
                    const _errs12 = errors;
                    if (typeof data5 !== "string") {
                      validate23.errors = [{ instancePath: instancePath + "/routing_mode", schemaPath: "#/properties/routing_mode/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                      return false;
                    }
                    if (!(data5 === "manual" || data5 === "auto")) {
                      validate23.errors = [{ instancePath: instancePath + "/routing_mode", schemaPath: "#/properties/routing_mode/enum", keyword: "enum", params: { allowedValues: schema30.properties.routing_mode.enum }, message: "must be equal to one of the allowed values" }];
                      return false;
                    }
                    var valid0 = _errs12 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.route_reason !== void 0) {
                      const _errs14 = errors;
                      if (typeof data.route_reason !== "string") {
                        validate23.errors = [{ instancePath: instancePath + "/route_reason", schemaPath: "#/properties/route_reason/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      var valid0 = _errs14 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.max_model_calls !== void 0) {
                        let data7 = data.max_model_calls;
                        const _errs16 = errors;
                        if (!(typeof data7 == "number" && (!(data7 % 1) && !isNaN(data7)))) {
                          validate23.errors = [{ instancePath: instancePath + "/max_model_calls", schemaPath: "#/properties/max_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                          return false;
                        }
                        var valid0 = _errs16 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.max_output_tokens !== void 0) {
                          let data8 = data.max_output_tokens;
                          const _errs18 = errors;
                          if (!(typeof data8 == "number" && (!(data8 % 1) && !isNaN(data8)))) {
                            validate23.errors = [{ instancePath: instancePath + "/max_output_tokens", schemaPath: "#/properties/max_output_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                            return false;
                          }
                          var valid0 = _errs18 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.used_model_calls !== void 0) {
                            let data9 = data.used_model_calls;
                            const _errs20 = errors;
                            if (!(typeof data9 == "number" && (!(data9 % 1) && !isNaN(data9)))) {
                              validate23.errors = [{ instancePath: instancePath + "/used_model_calls", schemaPath: "#/properties/used_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                              return false;
                            }
                            var valid0 = _errs20 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.max_cost_microusd !== void 0) {
                              let data10 = data.max_cost_microusd;
                              const _errs22 = errors;
                              if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)))) {
                                validate23.errors = [{ instancePath: instancePath + "/max_cost_microusd", schemaPath: "#/properties/max_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                return false;
                              }
                              var valid0 = _errs22 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.estimated_max_cost_microusd !== void 0) {
                                let data11 = data.estimated_max_cost_microusd;
                                const _errs24 = errors;
                                if (!(typeof data11 == "number" && (!(data11 % 1) && !isNaN(data11)))) {
                                  validate23.errors = [{ instancePath: instancePath + "/estimated_max_cost_microusd", schemaPath: "#/properties/estimated_max_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                var valid0 = _errs24 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.actual_cost_microusd !== void 0) {
                                  let data12 = data.actual_cost_microusd;
                                  const _errs26 = errors;
                                  if (!(typeof data12 == "number" && (!(data12 % 1) && !isNaN(data12)))) {
                                    validate23.errors = [{ instancePath: instancePath + "/actual_cost_microusd", schemaPath: "#/properties/actual_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                    return false;
                                  }
                                  var valid0 = _errs26 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.input_tokens !== void 0) {
                                    let data13 = data.input_tokens;
                                    const _errs28 = errors;
                                    if (!(typeof data13 == "number" && (!(data13 % 1) && !isNaN(data13)))) {
                                      validate23.errors = [{ instancePath: instancePath + "/input_tokens", schemaPath: "#/properties/input_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                      return false;
                                    }
                                    var valid0 = _errs28 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.output_tokens !== void 0) {
                                      let data14 = data.output_tokens;
                                      const _errs30 = errors;
                                      if (!(typeof data14 == "number" && (!(data14 % 1) && !isNaN(data14)))) {
                                        validate23.errors = [{ instancePath: instancePath + "/output_tokens", schemaPath: "#/properties/output_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                        return false;
                                      }
                                      var valid0 = _errs30 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                    if (valid0) {
                                      if (data.price_catalog_version !== void 0) {
                                        const _errs32 = errors;
                                        if (typeof data.price_catalog_version !== "string") {
                                          validate23.errors = [{ instancePath: instancePath + "/price_catalog_version", schemaPath: "#/properties/price_catalog_version/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                        var valid0 = _errs32 === errors;
                                      } else {
                                        var valid0 = true;
                                      }
                                      if (valid0) {
                                        if (data.pricing_warning !== void 0) {
                                          const _errs34 = errors;
                                          if (typeof data.pricing_warning !== "string") {
                                            validate23.errors = [{ instancePath: instancePath + "/pricing_warning", schemaPath: "#/properties/pricing_warning/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                          var valid0 = _errs34 === errors;
                                        } else {
                                          var valid0 = true;
                                        }
                                        if (valid0) {
                                          if (data.workspace_id !== void 0) {
                                            let data17 = data.workspace_id;
                                            const _errs36 = errors;
                                            const _errs37 = errors;
                                            let valid2 = false;
                                            const _errs38 = errors;
                                            if (typeof data17 !== "string") {
                                              const err0 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/properties/workspace_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err0];
                                              } else {
                                                vErrors.push(err0);
                                              }
                                              errors++;
                                            }
                                            var _valid0 = _errs38 === errors;
                                            valid2 = valid2 || _valid0;
                                            if (!valid2) {
                                              const _errs40 = errors;
                                              if (data17 !== null) {
                                                const err1 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/properties/workspace_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                if (vErrors === null) {
                                                  vErrors = [err1];
                                                } else {
                                                  vErrors.push(err1);
                                                }
                                                errors++;
                                              }
                                              var _valid0 = _errs40 === errors;
                                              valid2 = valid2 || _valid0;
                                            }
                                            if (!valid2) {
                                              const err2 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/properties/workspace_id/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                              if (vErrors === null) {
                                                vErrors = [err2];
                                              } else {
                                                vErrors.push(err2);
                                              }
                                              errors++;
                                              validate23.errors = vErrors;
                                              return false;
                                            } else {
                                              errors = _errs37;
                                              if (vErrors !== null) {
                                                if (_errs37) {
                                                  vErrors.length = _errs37;
                                                } else {
                                                  vErrors = null;
                                                }
                                              }
                                            }
                                            var valid0 = _errs36 === errors;
                                          } else {
                                            var valid0 = true;
                                          }
                                          if (valid0) {
                                            if (data.context_paths !== void 0) {
                                              let data18 = data.context_paths;
                                              const _errs42 = errors;
                                              if (errors === _errs42) {
                                                if (Array.isArray(data18)) {
                                                  var valid3 = true;
                                                  const len1 = data18.length;
                                                  for (let i1 = 0; i1 < len1; i1++) {
                                                    const _errs44 = errors;
                                                    if (typeof data18[i1] !== "string") {
                                                      validate23.errors = [{ instancePath: instancePath + "/context_paths/" + i1, schemaPath: "#/properties/context_paths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                    var valid3 = _errs44 === errors;
                                                    if (!valid3) {
                                                      break;
                                                    }
                                                  }
                                                } else {
                                                  validate23.errors = [{ instancePath: instancePath + "/context_paths", schemaPath: "#/properties/context_paths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                  return false;
                                                }
                                              }
                                              var valid0 = _errs42 === errors;
                                            } else {
                                              var valid0 = true;
                                            }
                                            if (valid0) {
                                              if (data.enabled_tools !== void 0) {
                                                let data20 = data.enabled_tools;
                                                const _errs46 = errors;
                                                if (errors === _errs46) {
                                                  if (Array.isArray(data20)) {
                                                    var valid4 = true;
                                                    const len2 = data20.length;
                                                    for (let i2 = 0; i2 < len2; i2++) {
                                                      let data21 = data20[i2];
                                                      const _errs48 = errors;
                                                      if (typeof data21 !== "string") {
                                                        validate23.errors = [{ instancePath: instancePath + "/enabled_tools/" + i2, schemaPath: "#/properties/enabled_tools/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      if (!(data21 === "workspace.write" || data21 === "terminal.execute")) {
                                                        validate23.errors = [{ instancePath: instancePath + "/enabled_tools/" + i2, schemaPath: "#/properties/enabled_tools/items/enum", keyword: "enum", params: { allowedValues: schema30.properties.enabled_tools.items.enum }, message: "must be equal to one of the allowed values" }];
                                                        return false;
                                                      }
                                                      var valid4 = _errs48 === errors;
                                                      if (!valid4) {
                                                        break;
                                                      }
                                                    }
                                                  } else {
                                                    validate23.errors = [{ instancePath: instancePath + "/enabled_tools", schemaPath: "#/properties/enabled_tools/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                    return false;
                                                  }
                                                }
                                                var valid0 = _errs46 === errors;
                                              } else {
                                                var valid0 = true;
                                              }
                                              if (valid0) {
                                                if (data.knowledge_collection_ids !== void 0) {
                                                  let data22 = data.knowledge_collection_ids;
                                                  const _errs50 = errors;
                                                  if (errors === _errs50) {
                                                    if (Array.isArray(data22)) {
                                                      var valid5 = true;
                                                      const len3 = data22.length;
                                                      for (let i3 = 0; i3 < len3; i3++) {
                                                        const _errs52 = errors;
                                                        if (typeof data22[i3] !== "string") {
                                                          validate23.errors = [{ instancePath: instancePath + "/knowledge_collection_ids/" + i3, schemaPath: "#/properties/knowledge_collection_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                        var valid5 = _errs52 === errors;
                                                        if (!valid5) {
                                                          break;
                                                        }
                                                      }
                                                    } else {
                                                      validate23.errors = [{ instancePath: instancePath + "/knowledge_collection_ids", schemaPath: "#/properties/knowledge_collection_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid0 = _errs50 === errors;
                                                } else {
                                                  var valid0 = true;
                                                }
                                                if (valid0) {
                                                  if (data.workflow_id !== void 0) {
                                                    let data24 = data.workflow_id;
                                                    const _errs54 = errors;
                                                    const _errs55 = errors;
                                                    let valid6 = false;
                                                    const _errs56 = errors;
                                                    if (typeof data24 !== "string") {
                                                      const err3 = { instancePath: instancePath + "/workflow_id", schemaPath: "#/properties/workflow_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err3];
                                                      } else {
                                                        vErrors.push(err3);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid1 = _errs56 === errors;
                                                    valid6 = valid6 || _valid1;
                                                    if (!valid6) {
                                                      const _errs58 = errors;
                                                      if (data24 !== null) {
                                                        const err4 = { instancePath: instancePath + "/workflow_id", schemaPath: "#/properties/workflow_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err4];
                                                        } else {
                                                          vErrors.push(err4);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid1 = _errs58 === errors;
                                                      valid6 = valid6 || _valid1;
                                                    }
                                                    if (!valid6) {
                                                      const err5 = { instancePath: instancePath + "/workflow_id", schemaPath: "#/properties/workflow_id/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                      if (vErrors === null) {
                                                        vErrors = [err5];
                                                      } else {
                                                        vErrors.push(err5);
                                                      }
                                                      errors++;
                                                      validate23.errors = vErrors;
                                                      return false;
                                                    } else {
                                                      errors = _errs55;
                                                      if (vErrors !== null) {
                                                        if (_errs55) {
                                                          vErrors.length = _errs55;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid0 = _errs54 === errors;
                                                  } else {
                                                    var valid0 = true;
                                                  }
                                                  if (valid0) {
                                                    if (data.workflow_version !== void 0) {
                                                      let data25 = data.workflow_version;
                                                      const _errs60 = errors;
                                                      const _errs61 = errors;
                                                      let valid7 = false;
                                                      const _errs62 = errors;
                                                      if (typeof data25 !== "string") {
                                                        const err6 = { instancePath: instancePath + "/workflow_version", schemaPath: "#/properties/workflow_version/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err6];
                                                        } else {
                                                          vErrors.push(err6);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid2 = _errs62 === errors;
                                                      valid7 = valid7 || _valid2;
                                                      if (!valid7) {
                                                        const _errs64 = errors;
                                                        if (data25 !== null) {
                                                          const err7 = { instancePath: instancePath + "/workflow_version", schemaPath: "#/properties/workflow_version/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                          if (vErrors === null) {
                                                            vErrors = [err7];
                                                          } else {
                                                            vErrors.push(err7);
                                                          }
                                                          errors++;
                                                        }
                                                        var _valid2 = _errs64 === errors;
                                                        valid7 = valid7 || _valid2;
                                                      }
                                                      if (!valid7) {
                                                        const err8 = { instancePath: instancePath + "/workflow_version", schemaPath: "#/properties/workflow_version/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                        if (vErrors === null) {
                                                          vErrors = [err8];
                                                        } else {
                                                          vErrors.push(err8);
                                                        }
                                                        errors++;
                                                        validate23.errors = vErrors;
                                                        return false;
                                                      } else {
                                                        errors = _errs61;
                                                        if (vErrors !== null) {
                                                          if (_errs61) {
                                                            vErrors.length = _errs61;
                                                          } else {
                                                            vErrors = null;
                                                          }
                                                        }
                                                      }
                                                      var valid0 = _errs60 === errors;
                                                    } else {
                                                      var valid0 = true;
                                                    }
                                                    if (valid0) {
                                                      if (data.attempt !== void 0) {
                                                        let data26 = data.attempt;
                                                        const _errs66 = errors;
                                                        if (!(typeof data26 == "number" && (!(data26 % 1) && !isNaN(data26)))) {
                                                          validate23.errors = [{ instancePath: instancePath + "/attempt", schemaPath: "#/properties/attempt/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                          return false;
                                                        }
                                                        var valid0 = _errs66 === errors;
                                                      } else {
                                                        var valid0 = true;
                                                      }
                                                      if (valid0) {
                                                        if (data.parent_run_id !== void 0) {
                                                          let data27 = data.parent_run_id;
                                                          const _errs68 = errors;
                                                          const _errs69 = errors;
                                                          let valid8 = false;
                                                          const _errs70 = errors;
                                                          if (typeof data27 !== "string") {
                                                            const err9 = { instancePath: instancePath + "/parent_run_id", schemaPath: "#/properties/parent_run_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err9];
                                                            } else {
                                                              vErrors.push(err9);
                                                            }
                                                            errors++;
                                                          }
                                                          var _valid3 = _errs70 === errors;
                                                          valid8 = valid8 || _valid3;
                                                          if (!valid8) {
                                                            const _errs72 = errors;
                                                            if (data27 !== null) {
                                                              const err10 = { instancePath: instancePath + "/parent_run_id", schemaPath: "#/properties/parent_run_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                              if (vErrors === null) {
                                                                vErrors = [err10];
                                                              } else {
                                                                vErrors.push(err10);
                                                              }
                                                              errors++;
                                                            }
                                                            var _valid3 = _errs72 === errors;
                                                            valid8 = valid8 || _valid3;
                                                          }
                                                          if (!valid8) {
                                                            const err11 = { instancePath: instancePath + "/parent_run_id", schemaPath: "#/properties/parent_run_id/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                            if (vErrors === null) {
                                                              vErrors = [err11];
                                                            } else {
                                                              vErrors.push(err11);
                                                            }
                                                            errors++;
                                                            validate23.errors = vErrors;
                                                            return false;
                                                          } else {
                                                            errors = _errs69;
                                                            if (vErrors !== null) {
                                                              if (_errs69) {
                                                                vErrors.length = _errs69;
                                                              } else {
                                                                vErrors = null;
                                                              }
                                                            }
                                                          }
                                                          var valid0 = _errs68 === errors;
                                                        } else {
                                                          var valid0 = true;
                                                        }
                                                        if (valid0) {
                                                          if (data.resumed_from_node !== void 0) {
                                                            const _errs74 = errors;
                                                            if (typeof data.resumed_from_node !== "string") {
                                                              validate23.errors = [{ instancePath: instancePath + "/resumed_from_node", schemaPath: "#/properties/resumed_from_node/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                              return false;
                                                            }
                                                            var valid0 = _errs74 === errors;
                                                          } else {
                                                            var valid0 = true;
                                                          }
                                                          if (valid0) {
                                                            if (data.failed_node !== void 0) {
                                                              const _errs76 = errors;
                                                              if (typeof data.failed_node !== "string") {
                                                                validate23.errors = [{ instancePath: instancePath + "/failed_node", schemaPath: "#/properties/failed_node/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              var valid0 = _errs76 === errors;
                                                            } else {
                                                              var valid0 = true;
                                                            }
                                                            if (valid0) {
                                                              if (data.error_class !== void 0) {
                                                                let data30 = data.error_class;
                                                                const _errs78 = errors;
                                                                if (typeof data30 !== "string") {
                                                                  validate23.errors = [{ instancePath: instancePath + "/error_class", schemaPath: "#/properties/error_class/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                  return false;
                                                                }
                                                                if (!(data30 === "" || data30 === "retryable" || data30 === "permanent" || data30 === "uncertain_tool")) {
                                                                  validate23.errors = [{ instancePath: instancePath + "/error_class", schemaPath: "#/properties/error_class/enum", keyword: "enum", params: { allowedValues: schema30.properties.error_class.enum }, message: "must be equal to one of the allowed values" }];
                                                                  return false;
                                                                }
                                                                var valid0 = _errs78 === errors;
                                                              } else {
                                                                var valid0 = true;
                                                              }
                                                              if (valid0) {
                                                                if (data.cumulative_model_calls !== void 0) {
                                                                  let data31 = data.cumulative_model_calls;
                                                                  const _errs80 = errors;
                                                                  if (!(typeof data31 == "number" && (!(data31 % 1) && !isNaN(data31)))) {
                                                                    validate23.errors = [{ instancePath: instancePath + "/cumulative_model_calls", schemaPath: "#/properties/cumulative_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                    return false;
                                                                  }
                                                                  var valid0 = _errs80 === errors;
                                                                } else {
                                                                  var valid0 = true;
                                                                }
                                                                if (valid0) {
                                                                  if (data.cumulative_cost_microusd !== void 0) {
                                                                    let data32 = data.cumulative_cost_microusd;
                                                                    const _errs82 = errors;
                                                                    if (!(typeof data32 == "number" && (!(data32 % 1) && !isNaN(data32)))) {
                                                                      validate23.errors = [{ instancePath: instancePath + "/cumulative_cost_microusd", schemaPath: "#/properties/cumulative_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                      return false;
                                                                    }
                                                                    var valid0 = _errs82 === errors;
                                                                  } else {
                                                                    var valid0 = true;
                                                                  }
                                                                  if (valid0) {
                                                                    if (data.fallback_chain !== void 0) {
                                                                      let data33 = data.fallback_chain;
                                                                      const _errs84 = errors;
                                                                      if (errors === _errs84) {
                                                                        if (Array.isArray(data33)) {
                                                                          var valid9 = true;
                                                                          const len4 = data33.length;
                                                                          for (let i4 = 0; i4 < len4; i4++) {
                                                                            let data34 = data33[i4];
                                                                            const _errs86 = errors;
                                                                            if (errors === _errs86) {
                                                                              if (Array.isArray(data34)) {
                                                                                var valid10 = true;
                                                                                const len5 = data34.length;
                                                                                for (let i5 = 0; i5 < len5; i5++) {
                                                                                  const _errs88 = errors;
                                                                                  if (typeof data34[i5] !== "string") {
                                                                                    validate23.errors = [{ instancePath: instancePath + "/fallback_chain/" + i4 + "/" + i5, schemaPath: "#/properties/fallback_chain/items/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                    return false;
                                                                                  }
                                                                                  var valid10 = _errs88 === errors;
                                                                                  if (!valid10) {
                                                                                    break;
                                                                                  }
                                                                                }
                                                                              } else {
                                                                                validate23.errors = [{ instancePath: instancePath + "/fallback_chain/" + i4, schemaPath: "#/properties/fallback_chain/items/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                return false;
                                                                              }
                                                                            }
                                                                            var valid9 = _errs86 === errors;
                                                                            if (!valid9) {
                                                                              break;
                                                                            }
                                                                          }
                                                                        } else {
                                                                          validate23.errors = [{ instancePath: instancePath + "/fallback_chain", schemaPath: "#/properties/fallback_chain/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                          return false;
                                                                        }
                                                                      }
                                                                      var valid0 = _errs84 === errors;
                                                                    } else {
                                                                      var valid0 = true;
                                                                    }
                                                                    if (valid0) {
                                                                      if (data.model_call_attempts !== void 0) {
                                                                        let data36 = data.model_call_attempts;
                                                                        const _errs90 = errors;
                                                                        if (errors === _errs90) {
                                                                          if (Array.isArray(data36)) {
                                                                            var valid11 = true;
                                                                            const len6 = data36.length;
                                                                            for (let i6 = 0; i6 < len6; i6++) {
                                                                              let data37 = data36[i6];
                                                                              const _errs92 = errors;
                                                                              const _errs93 = errors;
                                                                              if (errors === _errs93) {
                                                                                if (data37 && typeof data37 == "object" && !Array.isArray(data37)) {
                                                                                  let missing1;
                                                                                  if (data37.id === void 0 && (missing1 = "id") || data37.run_id === void 0 && (missing1 = "run_id") || data37.node_name === void 0 && (missing1 = "node_name") || data37.connection_id === void 0 && (missing1 = "connection_id") || data37.attempt === void 0 && (missing1 = "attempt") || data37.outcome === void 0 && (missing1 = "outcome") || data37.error_message === void 0 && (missing1 = "error_message") || data37.input_tokens === void 0 && (missing1 = "input_tokens") || data37.output_tokens === void 0 && (missing1 = "output_tokens") || data37.cost_microusd === void 0 && (missing1 = "cost_microusd") || data37.started_at === void 0 && (missing1 = "started_at") || data37.duration_ms === void 0 && (missing1 = "duration_ms")) {
                                                                                    validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6, schemaPath: "#/$defs/ModelCallAttempt/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                                                                                    return false;
                                                                                  } else {
                                                                                    const _errs95 = errors;
                                                                                    for (const key1 in data37) {
                                                                                      if (!func27.call(schema31.properties, key1)) {
                                                                                        validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6, schemaPath: "#/$defs/ModelCallAttempt/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                                                                        return false;
                                                                                        break;
                                                                                      }
                                                                                    }
                                                                                    if (_errs95 === errors) {
                                                                                      if (data37.id !== void 0) {
                                                                                        const _errs96 = errors;
                                                                                        if (typeof data37.id !== "string") {
                                                                                          validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/id", schemaPath: "#/$defs/ModelCallAttempt/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                          return false;
                                                                                        }
                                                                                        var valid13 = _errs96 === errors;
                                                                                      } else {
                                                                                        var valid13 = true;
                                                                                      }
                                                                                      if (valid13) {
                                                                                        if (data37.run_id !== void 0) {
                                                                                          const _errs98 = errors;
                                                                                          if (typeof data37.run_id !== "string") {
                                                                                            validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/run_id", schemaPath: "#/$defs/ModelCallAttempt/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                            return false;
                                                                                          }
                                                                                          var valid13 = _errs98 === errors;
                                                                                        } else {
                                                                                          var valid13 = true;
                                                                                        }
                                                                                        if (valid13) {
                                                                                          if (data37.node_name !== void 0) {
                                                                                            const _errs100 = errors;
                                                                                            if (typeof data37.node_name !== "string") {
                                                                                              validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/node_name", schemaPath: "#/$defs/ModelCallAttempt/properties/node_name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                              return false;
                                                                                            }
                                                                                            var valid13 = _errs100 === errors;
                                                                                          } else {
                                                                                            var valid13 = true;
                                                                                          }
                                                                                          if (valid13) {
                                                                                            if (data37.connection_id !== void 0) {
                                                                                              const _errs102 = errors;
                                                                                              if (typeof data37.connection_id !== "string") {
                                                                                                validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/connection_id", schemaPath: "#/$defs/ModelCallAttempt/properties/connection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                return false;
                                                                                              }
                                                                                              var valid13 = _errs102 === errors;
                                                                                            } else {
                                                                                              var valid13 = true;
                                                                                            }
                                                                                            if (valid13) {
                                                                                              if (data37.attempt !== void 0) {
                                                                                                let data42 = data37.attempt;
                                                                                                const _errs104 = errors;
                                                                                                if (!(typeof data42 == "number" && (!(data42 % 1) && !isNaN(data42)))) {
                                                                                                  validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/attempt", schemaPath: "#/$defs/ModelCallAttempt/properties/attempt/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                  return false;
                                                                                                }
                                                                                                var valid13 = _errs104 === errors;
                                                                                              } else {
                                                                                                var valid13 = true;
                                                                                              }
                                                                                              if (valid13) {
                                                                                                if (data37.outcome !== void 0) {
                                                                                                  let data43 = data37.outcome;
                                                                                                  const _errs106 = errors;
                                                                                                  if (typeof data43 !== "string") {
                                                                                                    validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/outcome", schemaPath: "#/$defs/ModelCallAttempt/properties/outcome/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                  if (!(data43 === "success" || data43 === "retryable" || data43 === "permanent" || data43 === "budget_exceeded" || data43 === "skipped")) {
                                                                                                    validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/outcome", schemaPath: "#/$defs/ModelCallAttempt/properties/outcome/enum", keyword: "enum", params: { allowedValues: schema31.properties.outcome.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                  var valid13 = _errs106 === errors;
                                                                                                } else {
                                                                                                  var valid13 = true;
                                                                                                }
                                                                                                if (valid13) {
                                                                                                  if (data37.error_message !== void 0) {
                                                                                                    const _errs108 = errors;
                                                                                                    if (typeof data37.error_message !== "string") {
                                                                                                      validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/error_message", schemaPath: "#/$defs/ModelCallAttempt/properties/error_message/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                    var valid13 = _errs108 === errors;
                                                                                                  } else {
                                                                                                    var valid13 = true;
                                                                                                  }
                                                                                                  if (valid13) {
                                                                                                    if (data37.input_tokens !== void 0) {
                                                                                                      let data45 = data37.input_tokens;
                                                                                                      const _errs110 = errors;
                                                                                                      if (!(typeof data45 == "number" && (!(data45 % 1) && !isNaN(data45)))) {
                                                                                                        validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/input_tokens", schemaPath: "#/$defs/ModelCallAttempt/properties/input_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                        return false;
                                                                                                      }
                                                                                                      var valid13 = _errs110 === errors;
                                                                                                    } else {
                                                                                                      var valid13 = true;
                                                                                                    }
                                                                                                    if (valid13) {
                                                                                                      if (data37.output_tokens !== void 0) {
                                                                                                        let data46 = data37.output_tokens;
                                                                                                        const _errs112 = errors;
                                                                                                        if (!(typeof data46 == "number" && (!(data46 % 1) && !isNaN(data46)))) {
                                                                                                          validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/output_tokens", schemaPath: "#/$defs/ModelCallAttempt/properties/output_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                        var valid13 = _errs112 === errors;
                                                                                                      } else {
                                                                                                        var valid13 = true;
                                                                                                      }
                                                                                                      if (valid13) {
                                                                                                        if (data37.cost_microusd !== void 0) {
                                                                                                          let data47 = data37.cost_microusd;
                                                                                                          const _errs114 = errors;
                                                                                                          if (!(typeof data47 == "number" && (!(data47 % 1) && !isNaN(data47)))) {
                                                                                                            validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/cost_microusd", schemaPath: "#/$defs/ModelCallAttempt/properties/cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                          var valid13 = _errs114 === errors;
                                                                                                        } else {
                                                                                                          var valid13 = true;
                                                                                                        }
                                                                                                        if (valid13) {
                                                                                                          if (data37.started_at !== void 0) {
                                                                                                            const _errs116 = errors;
                                                                                                            if (typeof data37.started_at !== "string") {
                                                                                                              validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/started_at", schemaPath: "#/$defs/ModelCallAttempt/properties/started_at/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                              return false;
                                                                                                            }
                                                                                                            var valid13 = _errs116 === errors;
                                                                                                          } else {
                                                                                                            var valid13 = true;
                                                                                                          }
                                                                                                          if (valid13) {
                                                                                                            if (data37.duration_ms !== void 0) {
                                                                                                              let data49 = data37.duration_ms;
                                                                                                              const _errs118 = errors;
                                                                                                              if (!(typeof data49 == "number" && (!(data49 % 1) && !isNaN(data49)))) {
                                                                                                                validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6 + "/duration_ms", schemaPath: "#/$defs/ModelCallAttempt/properties/duration_ms/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                                return false;
                                                                                                              }
                                                                                                              var valid13 = _errs118 === errors;
                                                                                                            } else {
                                                                                                              var valid13 = true;
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
                                                                                  validate23.errors = [{ instancePath: instancePath + "/model_call_attempts/" + i6, schemaPath: "#/$defs/ModelCallAttempt/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                  return false;
                                                                                }
                                                                              }
                                                                              var valid11 = _errs92 === errors;
                                                                              if (!valid11) {
                                                                                break;
                                                                              }
                                                                            }
                                                                          } else {
                                                                            validate23.errors = [{ instancePath: instancePath + "/model_call_attempts", schemaPath: "#/properties/model_call_attempts/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                            return false;
                                                                          }
                                                                        }
                                                                        var valid0 = _errs90 === errors;
                                                                      } else {
                                                                        var valid0 = true;
                                                                      }
                                                                      if (valid0) {
                                                                        if (data.queue_sequence !== void 0) {
                                                                          let data50 = data.queue_sequence;
                                                                          const _errs120 = errors;
                                                                          if (!(typeof data50 == "number" && (!(data50 % 1) && !isNaN(data50)))) {
                                                                            validate23.errors = [{ instancePath: instancePath + "/queue_sequence", schemaPath: "#/properties/queue_sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                            return false;
                                                                          }
                                                                          var valid0 = _errs120 === errors;
                                                                        } else {
                                                                          var valid0 = true;
                                                                        }
                                                                        if (valid0) {
                                                                          if (data.queue_position !== void 0) {
                                                                            let data51 = data.queue_position;
                                                                            const _errs122 = errors;
                                                                            const _errs123 = errors;
                                                                            let valid14 = false;
                                                                            const _errs124 = errors;
                                                                            if (!(typeof data51 == "number" && (!(data51 % 1) && !isNaN(data51)))) {
                                                                              const err12 = { instancePath: instancePath + "/queue_position", schemaPath: "#/properties/queue_position/anyOf/0/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err12];
                                                                              } else {
                                                                                vErrors.push(err12);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                            var _valid4 = _errs124 === errors;
                                                                            valid14 = valid14 || _valid4;
                                                                            if (!valid14) {
                                                                              const _errs126 = errors;
                                                                              if (data51 !== null) {
                                                                                const err13 = { instancePath: instancePath + "/queue_position", schemaPath: "#/properties/queue_position/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err13];
                                                                                } else {
                                                                                  vErrors.push(err13);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                              var _valid4 = _errs126 === errors;
                                                                              valid14 = valid14 || _valid4;
                                                                            }
                                                                            if (!valid14) {
                                                                              const err14 = { instancePath: instancePath + "/queue_position", schemaPath: "#/properties/queue_position/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err14];
                                                                              } else {
                                                                                vErrors.push(err14);
                                                                              }
                                                                              errors++;
                                                                              validate23.errors = vErrors;
                                                                              return false;
                                                                            } else {
                                                                              errors = _errs123;
                                                                              if (vErrors !== null) {
                                                                                if (_errs123) {
                                                                                  vErrors.length = _errs123;
                                                                                } else {
                                                                                  vErrors = null;
                                                                                }
                                                                              }
                                                                            }
                                                                            var valid0 = _errs122 === errors;
                                                                          } else {
                                                                            var valid0 = true;
                                                                          }
                                                                          if (valid0) {
                                                                            if (data.worker_id !== void 0) {
                                                                              const _errs128 = errors;
                                                                              if (typeof data.worker_id !== "string") {
                                                                                validate23.errors = [{ instancePath: instancePath + "/worker_id", schemaPath: "#/properties/worker_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                return false;
                                                                              }
                                                                              var valid0 = _errs128 === errors;
                                                                            } else {
                                                                              var valid0 = true;
                                                                            }
                                                                            if (valid0) {
                                                                              if (data.queued_at !== void 0) {
                                                                                const _errs130 = errors;
                                                                                if (typeof data.queued_at !== "string") {
                                                                                  validate23.errors = [{ instancePath: instancePath + "/queued_at", schemaPath: "#/properties/queued_at/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                  return false;
                                                                                }
                                                                                var valid0 = _errs130 === errors;
                                                                              } else {
                                                                                var valid0 = true;
                                                                              }
                                                                              if (valid0) {
                                                                                if (data.started_at !== void 0) {
                                                                                  let data54 = data.started_at;
                                                                                  const _errs132 = errors;
                                                                                  const _errs133 = errors;
                                                                                  let valid15 = false;
                                                                                  const _errs134 = errors;
                                                                                  if (typeof data54 !== "string") {
                                                                                    const err15 = { instancePath: instancePath + "/started_at", schemaPath: "#/properties/started_at/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err15];
                                                                                    } else {
                                                                                      vErrors.push(err15);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                  var _valid5 = _errs134 === errors;
                                                                                  valid15 = valid15 || _valid5;
                                                                                  if (!valid15) {
                                                                                    const _errs136 = errors;
                                                                                    if (data54 !== null) {
                                                                                      const err16 = { instancePath: instancePath + "/started_at", schemaPath: "#/properties/started_at/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err16];
                                                                                      } else {
                                                                                        vErrors.push(err16);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                    var _valid5 = _errs136 === errors;
                                                                                    valid15 = valid15 || _valid5;
                                                                                  }
                                                                                  if (!valid15) {
                                                                                    const err17 = { instancePath: instancePath + "/started_at", schemaPath: "#/properties/started_at/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err17];
                                                                                    } else {
                                                                                      vErrors.push(err17);
                                                                                    }
                                                                                    errors++;
                                                                                    validate23.errors = vErrors;
                                                                                    return false;
                                                                                  } else {
                                                                                    errors = _errs133;
                                                                                    if (vErrors !== null) {
                                                                                      if (_errs133) {
                                                                                        vErrors.length = _errs133;
                                                                                      } else {
                                                                                        vErrors = null;
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                  var valid0 = _errs132 === errors;
                                                                                } else {
                                                                                  var valid0 = true;
                                                                                }
                                                                                if (valid0) {
                                                                                  if (data.resumed_at !== void 0) {
                                                                                    let data55 = data.resumed_at;
                                                                                    const _errs138 = errors;
                                                                                    const _errs139 = errors;
                                                                                    let valid16 = false;
                                                                                    const _errs140 = errors;
                                                                                    if (typeof data55 !== "string") {
                                                                                      const err18 = { instancePath: instancePath + "/resumed_at", schemaPath: "#/properties/resumed_at/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err18];
                                                                                      } else {
                                                                                        vErrors.push(err18);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                    var _valid6 = _errs140 === errors;
                                                                                    valid16 = valid16 || _valid6;
                                                                                    if (!valid16) {
                                                                                      const _errs142 = errors;
                                                                                      if (data55 !== null) {
                                                                                        const err19 = { instancePath: instancePath + "/resumed_at", schemaPath: "#/properties/resumed_at/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err19];
                                                                                        } else {
                                                                                          vErrors.push(err19);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                      var _valid6 = _errs142 === errors;
                                                                                      valid16 = valid16 || _valid6;
                                                                                    }
                                                                                    if (!valid16) {
                                                                                      const err20 = { instancePath: instancePath + "/resumed_at", schemaPath: "#/properties/resumed_at/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err20];
                                                                                      } else {
                                                                                        vErrors.push(err20);
                                                                                      }
                                                                                      errors++;
                                                                                      validate23.errors = vErrors;
                                                                                      return false;
                                                                                    } else {
                                                                                      errors = _errs139;
                                                                                      if (vErrors !== null) {
                                                                                        if (_errs139) {
                                                                                          vErrors.length = _errs139;
                                                                                        } else {
                                                                                          vErrors = null;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                    var valid0 = _errs138 === errors;
                                                                                  } else {
                                                                                    var valid0 = true;
                                                                                  }
                                                                                  if (valid0) {
                                                                                    if (data.finished_at !== void 0) {
                                                                                      let data56 = data.finished_at;
                                                                                      const _errs144 = errors;
                                                                                      const _errs145 = errors;
                                                                                      let valid17 = false;
                                                                                      const _errs146 = errors;
                                                                                      if (typeof data56 !== "string") {
                                                                                        const err21 = { instancePath: instancePath + "/finished_at", schemaPath: "#/properties/finished_at/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err21];
                                                                                        } else {
                                                                                          vErrors.push(err21);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                      var _valid7 = _errs146 === errors;
                                                                                      valid17 = valid17 || _valid7;
                                                                                      if (!valid17) {
                                                                                        const _errs148 = errors;
                                                                                        if (data56 !== null) {
                                                                                          const err22 = { instancePath: instancePath + "/finished_at", schemaPath: "#/properties/finished_at/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err22];
                                                                                          } else {
                                                                                            vErrors.push(err22);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                        var _valid7 = _errs148 === errors;
                                                                                        valid17 = valid17 || _valid7;
                                                                                      }
                                                                                      if (!valid17) {
                                                                                        const err23 = { instancePath: instancePath + "/finished_at", schemaPath: "#/properties/finished_at/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err23];
                                                                                        } else {
                                                                                          vErrors.push(err23);
                                                                                        }
                                                                                        errors++;
                                                                                        validate23.errors = vErrors;
                                                                                        return false;
                                                                                      } else {
                                                                                        errors = _errs145;
                                                                                        if (vErrors !== null) {
                                                                                          if (_errs145) {
                                                                                            vErrors.length = _errs145;
                                                                                          } else {
                                                                                            vErrors = null;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                      var valid0 = _errs144 === errors;
                                                                                    } else {
                                                                                      var valid0 = true;
                                                                                    }
                                                                                    if (valid0) {
                                                                                      if (data.status_events !== void 0) {
                                                                                        let data57 = data.status_events;
                                                                                        const _errs150 = errors;
                                                                                        if (errors === _errs150) {
                                                                                          if (Array.isArray(data57)) {
                                                                                            var valid18 = true;
                                                                                            const len7 = data57.length;
                                                                                            for (let i7 = 0; i7 < len7; i7++) {
                                                                                              let data58 = data57[i7];
                                                                                              const _errs152 = errors;
                                                                                              const _errs153 = errors;
                                                                                              if (errors === _errs153) {
                                                                                                if (data58 && typeof data58 == "object" && !Array.isArray(data58)) {
                                                                                                  let missing2;
                                                                                                  if (data58.sequence === void 0 && (missing2 = "sequence") || data58.from_status === void 0 && (missing2 = "from_status") || data58.to_status === void 0 && (missing2 = "to_status") || data58.reason === void 0 && (missing2 = "reason") || data58.timestamp === void 0 && (missing2 = "timestamp")) {
                                                                                                    validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7, schemaPath: "#/$defs/OrchestrationStatusEvent/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                                                                                    return false;
                                                                                                  } else {
                                                                                                    const _errs155 = errors;
                                                                                                    for (const key2 in data58) {
                                                                                                      if (!(key2 === "sequence" || key2 === "from_status" || key2 === "to_status" || key2 === "reason" || key2 === "timestamp")) {
                                                                                                        validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7, schemaPath: "#/$defs/OrchestrationStatusEvent/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                                                                                        return false;
                                                                                                        break;
                                                                                                      }
                                                                                                    }
                                                                                                    if (_errs155 === errors) {
                                                                                                      if (data58.sequence !== void 0) {
                                                                                                        let data59 = data58.sequence;
                                                                                                        const _errs156 = errors;
                                                                                                        if (!(typeof data59 == "number" && (!(data59 % 1) && !isNaN(data59)))) {
                                                                                                          validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7 + "/sequence", schemaPath: "#/$defs/OrchestrationStatusEvent/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                          return false;
                                                                                                        }
                                                                                                        var valid20 = _errs156 === errors;
                                                                                                      } else {
                                                                                                        var valid20 = true;
                                                                                                      }
                                                                                                      if (valid20) {
                                                                                                        if (data58.from_status !== void 0) {
                                                                                                          let data60 = data58.from_status;
                                                                                                          const _errs158 = errors;
                                                                                                          if (typeof data60 !== "string") {
                                                                                                            validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7 + "/from_status", schemaPath: "#/$defs/OrchestrationStatusEvent/properties/from_status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                          if (!(data60 === "" || data60 === "queued" || data60 === "running" || data60 === "paused" || data60 === "waiting_approval" || data60 === "completed" || data60 === "cancelled" || data60 === "failed" || data60 === "interrupted")) {
                                                                                                            validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7 + "/from_status", schemaPath: "#/$defs/OrchestrationStatusEvent/properties/from_status/enum", keyword: "enum", params: { allowedValues: schema32.properties.from_status.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                          var valid20 = _errs158 === errors;
                                                                                                        } else {
                                                                                                          var valid20 = true;
                                                                                                        }
                                                                                                        if (valid20) {
                                                                                                          if (data58.to_status !== void 0) {
                                                                                                            let data61 = data58.to_status;
                                                                                                            const _errs160 = errors;
                                                                                                            if (typeof data61 !== "string") {
                                                                                                              validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7 + "/to_status", schemaPath: "#/$defs/OrchestrationStatusEvent/properties/to_status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                              return false;
                                                                                                            }
                                                                                                            if (!(data61 === "queued" || data61 === "running" || data61 === "paused" || data61 === "waiting_approval" || data61 === "completed" || data61 === "cancelled" || data61 === "failed" || data61 === "interrupted")) {
                                                                                                              validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7 + "/to_status", schemaPath: "#/$defs/OrchestrationStatusEvent/properties/to_status/enum", keyword: "enum", params: { allowedValues: schema32.properties.to_status.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                              return false;
                                                                                                            }
                                                                                                            var valid20 = _errs160 === errors;
                                                                                                          } else {
                                                                                                            var valid20 = true;
                                                                                                          }
                                                                                                          if (valid20) {
                                                                                                            if (data58.reason !== void 0) {
                                                                                                              const _errs162 = errors;
                                                                                                              if (typeof data58.reason !== "string") {
                                                                                                                validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7 + "/reason", schemaPath: "#/$defs/OrchestrationStatusEvent/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                return false;
                                                                                                              }
                                                                                                              var valid20 = _errs162 === errors;
                                                                                                            } else {
                                                                                                              var valid20 = true;
                                                                                                            }
                                                                                                            if (valid20) {
                                                                                                              if (data58.timestamp !== void 0) {
                                                                                                                const _errs164 = errors;
                                                                                                                if (typeof data58.timestamp !== "string") {
                                                                                                                  validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7 + "/timestamp", schemaPath: "#/$defs/OrchestrationStatusEvent/properties/timestamp/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                  return false;
                                                                                                                }
                                                                                                                var valid20 = _errs164 === errors;
                                                                                                              } else {
                                                                                                                var valid20 = true;
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                } else {
                                                                                                  validate23.errors = [{ instancePath: instancePath + "/status_events/" + i7, schemaPath: "#/$defs/OrchestrationStatusEvent/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                                  return false;
                                                                                                }
                                                                                              }
                                                                                              var valid18 = _errs152 === errors;
                                                                                              if (!valid18) {
                                                                                                break;
                                                                                              }
                                                                                            }
                                                                                          } else {
                                                                                            validate23.errors = [{ instancePath: instancePath + "/status_events", schemaPath: "#/properties/status_events/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                            return false;
                                                                                          }
                                                                                        }
                                                                                        var valid0 = _errs150 === errors;
                                                                                      } else {
                                                                                        var valid0 = true;
                                                                                      }
                                                                                      if (valid0) {
                                                                                        if (data.tool_calls !== void 0) {
                                                                                          let data64 = data.tool_calls;
                                                                                          const _errs166 = errors;
                                                                                          if (errors === _errs166) {
                                                                                            if (Array.isArray(data64)) {
                                                                                              var valid21 = true;
                                                                                              const len8 = data64.length;
                                                                                              for (let i8 = 0; i8 < len8; i8++) {
                                                                                                let data65 = data64[i8];
                                                                                                const _errs168 = errors;
                                                                                                const _errs169 = errors;
                                                                                                if (errors === _errs169) {
                                                                                                  if (data65 && typeof data65 == "object" && !Array.isArray(data65)) {
                                                                                                    let missing3;
                                                                                                    if (data65.id === void 0 && (missing3 = "id") || data65.run_id === void 0 && (missing3 = "run_id") || data65.node_name === void 0 && (missing3 = "node_name") || data65.sequence === void 0 && (missing3 = "sequence") || data65.provider_call_id === void 0 && (missing3 = "provider_call_id") || data65.tool_name === void 0 && (missing3 = "tool_name") || data65.arguments === void 0 && (missing3 = "arguments") || data65.args_hash === void 0 && (missing3 = "args_hash") || data65.content_hash === void 0 && (missing3 = "content_hash") || data65.status === void 0 && (missing3 = "status") || data65.result === void 0 && (missing3 = "result") || data65.duration_ms === void 0 && (missing3 = "duration_ms") || data65.created_at === void 0 && (missing3 = "created_at")) {
                                                                                                      validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8, schemaPath: "#/$defs/ToolCall/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                                                                                      return false;
                                                                                                    } else {
                                                                                                      const _errs171 = errors;
                                                                                                      for (const key3 in data65) {
                                                                                                        if (!func27.call(schema33.properties, key3)) {
                                                                                                          validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8, schemaPath: "#/$defs/ToolCall/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                                                                                          return false;
                                                                                                          break;
                                                                                                        }
                                                                                                      }
                                                                                                      if (_errs171 === errors) {
                                                                                                        if (data65.id !== void 0) {
                                                                                                          const _errs172 = errors;
                                                                                                          if (typeof data65.id !== "string") {
                                                                                                            validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/id", schemaPath: "#/$defs/ToolCall/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                          var valid23 = _errs172 === errors;
                                                                                                        } else {
                                                                                                          var valid23 = true;
                                                                                                        }
                                                                                                        if (valid23) {
                                                                                                          if (data65.run_id !== void 0) {
                                                                                                            const _errs174 = errors;
                                                                                                            if (typeof data65.run_id !== "string") {
                                                                                                              validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/run_id", schemaPath: "#/$defs/ToolCall/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                              return false;
                                                                                                            }
                                                                                                            var valid23 = _errs174 === errors;
                                                                                                          } else {
                                                                                                            var valid23 = true;
                                                                                                          }
                                                                                                          if (valid23) {
                                                                                                            if (data65.node_name !== void 0) {
                                                                                                              const _errs176 = errors;
                                                                                                              if (typeof data65.node_name !== "string") {
                                                                                                                validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/node_name", schemaPath: "#/$defs/ToolCall/properties/node_name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                return false;
                                                                                                              }
                                                                                                              var valid23 = _errs176 === errors;
                                                                                                            } else {
                                                                                                              var valid23 = true;
                                                                                                            }
                                                                                                            if (valid23) {
                                                                                                              if (data65.sequence !== void 0) {
                                                                                                                let data69 = data65.sequence;
                                                                                                                const _errs178 = errors;
                                                                                                                if (!(typeof data69 == "number" && (!(data69 % 1) && !isNaN(data69)))) {
                                                                                                                  validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/sequence", schemaPath: "#/$defs/ToolCall/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                                  return false;
                                                                                                                }
                                                                                                                if (errors === _errs178) {
                                                                                                                  if (typeof data69 == "number") {
                                                                                                                    if (data69 < 1 || isNaN(data69)) {
                                                                                                                      validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/sequence", schemaPath: "#/$defs/ToolCall/properties/sequence/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
                                                                                                                      return false;
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                                var valid23 = _errs178 === errors;
                                                                                                              } else {
                                                                                                                var valid23 = true;
                                                                                                              }
                                                                                                              if (valid23) {
                                                                                                                if (data65.provider_call_id !== void 0) {
                                                                                                                  const _errs180 = errors;
                                                                                                                  if (typeof data65.provider_call_id !== "string") {
                                                                                                                    validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/provider_call_id", schemaPath: "#/$defs/ToolCall/properties/provider_call_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                    return false;
                                                                                                                  }
                                                                                                                  var valid23 = _errs180 === errors;
                                                                                                                } else {
                                                                                                                  var valid23 = true;
                                                                                                                }
                                                                                                                if (valid23) {
                                                                                                                  if (data65.tool_name !== void 0) {
                                                                                                                    let data71 = data65.tool_name;
                                                                                                                    const _errs182 = errors;
                                                                                                                    if (typeof data71 !== "string") {
                                                                                                                      validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/tool_name", schemaPath: "#/$defs/ToolCall/properties/tool_name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                      return false;
                                                                                                                    }
                                                                                                                    if (!(data71 === "workspace.write" || data71 === "terminal.execute" || data71 === "knowledge.search")) {
                                                                                                                      validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/tool_name", schemaPath: "#/$defs/ToolCall/properties/tool_name/enum", keyword: "enum", params: { allowedValues: schema33.properties.tool_name.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                                      return false;
                                                                                                                    }
                                                                                                                    var valid23 = _errs182 === errors;
                                                                                                                  } else {
                                                                                                                    var valid23 = true;
                                                                                                                  }
                                                                                                                  if (valid23) {
                                                                                                                    if (data65.arguments !== void 0) {
                                                                                                                      let data72 = data65.arguments;
                                                                                                                      const _errs184 = errors;
                                                                                                                      if (errors === _errs184) {
                                                                                                                        if (data72 && typeof data72 == "object" && !Array.isArray(data72)) {
                                                                                                                        } else {
                                                                                                                          validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/arguments", schemaPath: "#/$defs/ToolCall/properties/arguments/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                                                          return false;
                                                                                                                        }
                                                                                                                      }
                                                                                                                      var valid23 = _errs184 === errors;
                                                                                                                    } else {
                                                                                                                      var valid23 = true;
                                                                                                                    }
                                                                                                                    if (valid23) {
                                                                                                                      if (data65.args_hash !== void 0) {
                                                                                                                        const _errs187 = errors;
                                                                                                                        if (typeof data65.args_hash !== "string") {
                                                                                                                          validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/args_hash", schemaPath: "#/$defs/ToolCall/properties/args_hash/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                          return false;
                                                                                                                        }
                                                                                                                        var valid23 = _errs187 === errors;
                                                                                                                      } else {
                                                                                                                        var valid23 = true;
                                                                                                                      }
                                                                                                                      if (valid23) {
                                                                                                                        if (data65.content_hash !== void 0) {
                                                                                                                          const _errs189 = errors;
                                                                                                                          if (typeof data65.content_hash !== "string") {
                                                                                                                            validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/content_hash", schemaPath: "#/$defs/ToolCall/properties/content_hash/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                            return false;
                                                                                                                          }
                                                                                                                          var valid23 = _errs189 === errors;
                                                                                                                        } else {
                                                                                                                          var valid23 = true;
                                                                                                                        }
                                                                                                                        if (valid23) {
                                                                                                                          if (data65.status !== void 0) {
                                                                                                                            let data75 = data65.status;
                                                                                                                            const _errs191 = errors;
                                                                                                                            if (typeof data75 !== "string") {
                                                                                                                              validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/status", schemaPath: "#/$defs/ToolCall/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                              return false;
                                                                                                                            }
                                                                                                                            if (!(data75 === "pending" || data75 === "approved" || data75 === "executing" || data75 === "completed" || data75 === "rejected" || data75 === "uncertain")) {
                                                                                                                              validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/status", schemaPath: "#/$defs/ToolCall/properties/status/enum", keyword: "enum", params: { allowedValues: schema33.properties.status.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                                              return false;
                                                                                                                            }
                                                                                                                            var valid23 = _errs191 === errors;
                                                                                                                          } else {
                                                                                                                            var valid23 = true;
                                                                                                                          }
                                                                                                                          if (valid23) {
                                                                                                                            if (data65.result !== void 0) {
                                                                                                                              const _errs193 = errors;
                                                                                                                              if (typeof data65.result !== "string") {
                                                                                                                                validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/result", schemaPath: "#/$defs/ToolCall/properties/result/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                                return false;
                                                                                                                              }
                                                                                                                              var valid23 = _errs193 === errors;
                                                                                                                            } else {
                                                                                                                              var valid23 = true;
                                                                                                                            }
                                                                                                                            if (valid23) {
                                                                                                                              if (data65.duration_ms !== void 0) {
                                                                                                                                let data77 = data65.duration_ms;
                                                                                                                                const _errs195 = errors;
                                                                                                                                if (!(typeof data77 == "number" && (!(data77 % 1) && !isNaN(data77)))) {
                                                                                                                                  validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/duration_ms", schemaPath: "#/$defs/ToolCall/properties/duration_ms/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                                                  return false;
                                                                                                                                }
                                                                                                                                if (errors === _errs195) {
                                                                                                                                  if (typeof data77 == "number") {
                                                                                                                                    if (data77 < 0 || isNaN(data77)) {
                                                                                                                                      validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/duration_ms", schemaPath: "#/$defs/ToolCall/properties/duration_ms/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                                                                                                      return false;
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                                var valid23 = _errs195 === errors;
                                                                                                                              } else {
                                                                                                                                var valid23 = true;
                                                                                                                              }
                                                                                                                              if (valid23) {
                                                                                                                                if (data65.created_at !== void 0) {
                                                                                                                                  const _errs197 = errors;
                                                                                                                                  if (typeof data65.created_at !== "string") {
                                                                                                                                    validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8 + "/created_at", schemaPath: "#/$defs/ToolCall/properties/created_at/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                                    return false;
                                                                                                                                  }
                                                                                                                                  var valid23 = _errs197 === errors;
                                                                                                                                } else {
                                                                                                                                  var valid23 = true;
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
                                                                                                    validate23.errors = [{ instancePath: instancePath + "/tool_calls/" + i8, schemaPath: "#/$defs/ToolCall/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                                    return false;
                                                                                                  }
                                                                                                }
                                                                                                var valid21 = _errs168 === errors;
                                                                                                if (!valid21) {
                                                                                                  break;
                                                                                                }
                                                                                              }
                                                                                            } else {
                                                                                              validate23.errors = [{ instancePath: instancePath + "/tool_calls", schemaPath: "#/properties/tool_calls/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                              return false;
                                                                                            }
                                                                                          }
                                                                                          var valid0 = _errs166 === errors;
                                                                                        } else {
                                                                                          var valid0 = true;
                                                                                        }
                                                                                        if (valid0) {
                                                                                          if (data.tool_action !== void 0) {
                                                                                            let data79 = data.tool_action;
                                                                                            const _errs199 = errors;
                                                                                            const _errs200 = errors;
                                                                                            let valid24 = false;
                                                                                            const _errs201 = errors;
                                                                                            const _errs202 = errors;
                                                                                            if (errors === _errs202) {
                                                                                              if (data79 && typeof data79 == "object" && !Array.isArray(data79)) {
                                                                                                let missing4;
                                                                                                if (data79.tool === void 0 && (missing4 = "tool") || data79.path === void 0 && (missing4 = "path") || data79.command === void 0 && (missing4 = "command") || data79.collection_id === void 0 && (missing4 = "collection_id") || data79.query === void 0 && (missing4 = "query") || data79.limit === void 0 && (missing4 = "limit") || data79.preview === void 0 && (missing4 = "preview") || data79.risk === void 0 && (missing4 = "risk") || data79.status === void 0 && (missing4 = "status") || data79.args_hash === void 0 && (missing4 = "args_hash") || data79.content_hash === void 0 && (missing4 = "content_hash") || data79.result === void 0 && (missing4 = "result")) {
                                                                                                  const err24 = { instancePath: instancePath + "/tool_action", schemaPath: "#/$defs/ToolAction/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" };
                                                                                                  if (vErrors === null) {
                                                                                                    vErrors = [err24];
                                                                                                  } else {
                                                                                                    vErrors.push(err24);
                                                                                                  }
                                                                                                  errors++;
                                                                                                } else {
                                                                                                  const _errs204 = errors;
                                                                                                  for (const key4 in data79) {
                                                                                                    if (!func27.call(schema34.properties, key4)) {
                                                                                                      const err25 = { instancePath: instancePath + "/tool_action", schemaPath: "#/$defs/ToolAction/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                                                                                                      if (vErrors === null) {
                                                                                                        vErrors = [err25];
                                                                                                      } else {
                                                                                                        vErrors.push(err25);
                                                                                                      }
                                                                                                      errors++;
                                                                                                      break;
                                                                                                    }
                                                                                                  }
                                                                                                  if (_errs204 === errors) {
                                                                                                    if (data79.tool !== void 0) {
                                                                                                      let data80 = data79.tool;
                                                                                                      const _errs205 = errors;
                                                                                                      if (typeof data80 !== "string") {
                                                                                                        const err26 = { instancePath: instancePath + "/tool_action/tool", schemaPath: "#/$defs/ToolAction/properties/tool/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                        if (vErrors === null) {
                                                                                                          vErrors = [err26];
                                                                                                        } else {
                                                                                                          vErrors.push(err26);
                                                                                                        }
                                                                                                        errors++;
                                                                                                      }
                                                                                                      if (!(data80 === "workspace.write" || data80 === "terminal.execute" || data80 === "knowledge.search")) {
                                                                                                        const err27 = { instancePath: instancePath + "/tool_action/tool", schemaPath: "#/$defs/ToolAction/properties/tool/enum", keyword: "enum", params: { allowedValues: schema34.properties.tool.enum }, message: "must be equal to one of the allowed values" };
                                                                                                        if (vErrors === null) {
                                                                                                          vErrors = [err27];
                                                                                                        } else {
                                                                                                          vErrors.push(err27);
                                                                                                        }
                                                                                                        errors++;
                                                                                                      }
                                                                                                      var valid26 = _errs205 === errors;
                                                                                                    } else {
                                                                                                      var valid26 = true;
                                                                                                    }
                                                                                                    if (valid26) {
                                                                                                      if (data79.path !== void 0) {
                                                                                                        const _errs207 = errors;
                                                                                                        if (typeof data79.path !== "string") {
                                                                                                          const err28 = { instancePath: instancePath + "/tool_action/path", schemaPath: "#/$defs/ToolAction/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                          if (vErrors === null) {
                                                                                                            vErrors = [err28];
                                                                                                          } else {
                                                                                                            vErrors.push(err28);
                                                                                                          }
                                                                                                          errors++;
                                                                                                        }
                                                                                                        var valid26 = _errs207 === errors;
                                                                                                      } else {
                                                                                                        var valid26 = true;
                                                                                                      }
                                                                                                      if (valid26) {
                                                                                                        if (data79.command !== void 0) {
                                                                                                          let data82 = data79.command;
                                                                                                          const _errs209 = errors;
                                                                                                          if (errors === _errs209) {
                                                                                                            if (Array.isArray(data82)) {
                                                                                                              var valid27 = true;
                                                                                                              const len9 = data82.length;
                                                                                                              for (let i9 = 0; i9 < len9; i9++) {
                                                                                                                const _errs211 = errors;
                                                                                                                if (typeof data82[i9] !== "string") {
                                                                                                                  const err29 = { instancePath: instancePath + "/tool_action/command/" + i9, schemaPath: "#/$defs/ToolAction/properties/command/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                  if (vErrors === null) {
                                                                                                                    vErrors = [err29];
                                                                                                                  } else {
                                                                                                                    vErrors.push(err29);
                                                                                                                  }
                                                                                                                  errors++;
                                                                                                                }
                                                                                                                var valid27 = _errs211 === errors;
                                                                                                                if (!valid27) {
                                                                                                                  break;
                                                                                                                }
                                                                                                              }
                                                                                                            } else {
                                                                                                              const err30 = { instancePath: instancePath + "/tool_action/command", schemaPath: "#/$defs/ToolAction/properties/command/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                                                              if (vErrors === null) {
                                                                                                                vErrors = [err30];
                                                                                                              } else {
                                                                                                                vErrors.push(err30);
                                                                                                              }
                                                                                                              errors++;
                                                                                                            }
                                                                                                          }
                                                                                                          var valid26 = _errs209 === errors;
                                                                                                        } else {
                                                                                                          var valid26 = true;
                                                                                                        }
                                                                                                        if (valid26) {
                                                                                                          if (data79.collection_id !== void 0) {
                                                                                                            const _errs213 = errors;
                                                                                                            if (typeof data79.collection_id !== "string") {
                                                                                                              const err31 = { instancePath: instancePath + "/tool_action/collection_id", schemaPath: "#/$defs/ToolAction/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                              if (vErrors === null) {
                                                                                                                vErrors = [err31];
                                                                                                              } else {
                                                                                                                vErrors.push(err31);
                                                                                                              }
                                                                                                              errors++;
                                                                                                            }
                                                                                                            var valid26 = _errs213 === errors;
                                                                                                          } else {
                                                                                                            var valid26 = true;
                                                                                                          }
                                                                                                          if (valid26) {
                                                                                                            if (data79.query !== void 0) {
                                                                                                              const _errs215 = errors;
                                                                                                              if (typeof data79.query !== "string") {
                                                                                                                const err32 = { instancePath: instancePath + "/tool_action/query", schemaPath: "#/$defs/ToolAction/properties/query/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                if (vErrors === null) {
                                                                                                                  vErrors = [err32];
                                                                                                                } else {
                                                                                                                  vErrors.push(err32);
                                                                                                                }
                                                                                                                errors++;
                                                                                                              }
                                                                                                              var valid26 = _errs215 === errors;
                                                                                                            } else {
                                                                                                              var valid26 = true;
                                                                                                            }
                                                                                                            if (valid26) {
                                                                                                              if (data79.limit !== void 0) {
                                                                                                                let data86 = data79.limit;
                                                                                                                const _errs217 = errors;
                                                                                                                if (!(typeof data86 == "number" && (!(data86 % 1) && !isNaN(data86)))) {
                                                                                                                  const err33 = { instancePath: instancePath + "/tool_action/limit", schemaPath: "#/$defs/ToolAction/properties/limit/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                                                  if (vErrors === null) {
                                                                                                                    vErrors = [err33];
                                                                                                                  } else {
                                                                                                                    vErrors.push(err33);
                                                                                                                  }
                                                                                                                  errors++;
                                                                                                                }
                                                                                                                if (errors === _errs217) {
                                                                                                                  if (typeof data86 == "number") {
                                                                                                                    if (data86 > 10 || isNaN(data86)) {
                                                                                                                      const err34 = { instancePath: instancePath + "/tool_action/limit", schemaPath: "#/$defs/ToolAction/properties/limit/maximum", keyword: "maximum", params: { comparison: "<=", limit: 10 }, message: "must be <= 10" };
                                                                                                                      if (vErrors === null) {
                                                                                                                        vErrors = [err34];
                                                                                                                      } else {
                                                                                                                        vErrors.push(err34);
                                                                                                                      }
                                                                                                                      errors++;
                                                                                                                    } else {
                                                                                                                      if (data86 < 1 || isNaN(data86)) {
                                                                                                                        const err35 = { instancePath: instancePath + "/tool_action/limit", schemaPath: "#/$defs/ToolAction/properties/limit/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                                                                                        if (vErrors === null) {
                                                                                                                          vErrors = [err35];
                                                                                                                        } else {
                                                                                                                          vErrors.push(err35);
                                                                                                                        }
                                                                                                                        errors++;
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                                var valid26 = _errs217 === errors;
                                                                                                              } else {
                                                                                                                var valid26 = true;
                                                                                                              }
                                                                                                              if (valid26) {
                                                                                                                if (data79.preview !== void 0) {
                                                                                                                  const _errs219 = errors;
                                                                                                                  if (typeof data79.preview !== "string") {
                                                                                                                    const err36 = { instancePath: instancePath + "/tool_action/preview", schemaPath: "#/$defs/ToolAction/properties/preview/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                    if (vErrors === null) {
                                                                                                                      vErrors = [err36];
                                                                                                                    } else {
                                                                                                                      vErrors.push(err36);
                                                                                                                    }
                                                                                                                    errors++;
                                                                                                                  }
                                                                                                                  var valid26 = _errs219 === errors;
                                                                                                                } else {
                                                                                                                  var valid26 = true;
                                                                                                                }
                                                                                                                if (valid26) {
                                                                                                                  if (data79.risk !== void 0) {
                                                                                                                    let data88 = data79.risk;
                                                                                                                    const _errs221 = errors;
                                                                                                                    if (typeof data88 !== "string") {
                                                                                                                      const err37 = { instancePath: instancePath + "/tool_action/risk", schemaPath: "#/$defs/ToolAction/properties/risk/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                      if (vErrors === null) {
                                                                                                                        vErrors = [err37];
                                                                                                                      } else {
                                                                                                                        vErrors.push(err37);
                                                                                                                      }
                                                                                                                      errors++;
                                                                                                                    }
                                                                                                                    if (!(data88 === "medium" || data88 === "high")) {
                                                                                                                      const err38 = { instancePath: instancePath + "/tool_action/risk", schemaPath: "#/$defs/ToolAction/properties/risk/enum", keyword: "enum", params: { allowedValues: schema34.properties.risk.enum }, message: "must be equal to one of the allowed values" };
                                                                                                                      if (vErrors === null) {
                                                                                                                        vErrors = [err38];
                                                                                                                      } else {
                                                                                                                        vErrors.push(err38);
                                                                                                                      }
                                                                                                                      errors++;
                                                                                                                    }
                                                                                                                    var valid26 = _errs221 === errors;
                                                                                                                  } else {
                                                                                                                    var valid26 = true;
                                                                                                                  }
                                                                                                                  if (valid26) {
                                                                                                                    if (data79.status !== void 0) {
                                                                                                                      let data89 = data79.status;
                                                                                                                      const _errs223 = errors;
                                                                                                                      if (typeof data89 !== "string") {
                                                                                                                        const err39 = { instancePath: instancePath + "/tool_action/status", schemaPath: "#/$defs/ToolAction/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                        if (vErrors === null) {
                                                                                                                          vErrors = [err39];
                                                                                                                        } else {
                                                                                                                          vErrors.push(err39);
                                                                                                                        }
                                                                                                                        errors++;
                                                                                                                      }
                                                                                                                      if (!(data89 === "waiting" || data89 === "approved" || data89 === "executing" || data89 === "uncertain" || data89 === "rejected" || data89 === "completed" || data89 === "failed")) {
                                                                                                                        const err40 = { instancePath: instancePath + "/tool_action/status", schemaPath: "#/$defs/ToolAction/properties/status/enum", keyword: "enum", params: { allowedValues: schema34.properties.status.enum }, message: "must be equal to one of the allowed values" };
                                                                                                                        if (vErrors === null) {
                                                                                                                          vErrors = [err40];
                                                                                                                        } else {
                                                                                                                          vErrors.push(err40);
                                                                                                                        }
                                                                                                                        errors++;
                                                                                                                      }
                                                                                                                      var valid26 = _errs223 === errors;
                                                                                                                    } else {
                                                                                                                      var valid26 = true;
                                                                                                                    }
                                                                                                                    if (valid26) {
                                                                                                                      if (data79.args_hash !== void 0) {
                                                                                                                        const _errs225 = errors;
                                                                                                                        if (typeof data79.args_hash !== "string") {
                                                                                                                          const err41 = { instancePath: instancePath + "/tool_action/args_hash", schemaPath: "#/$defs/ToolAction/properties/args_hash/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                          if (vErrors === null) {
                                                                                                                            vErrors = [err41];
                                                                                                                          } else {
                                                                                                                            vErrors.push(err41);
                                                                                                                          }
                                                                                                                          errors++;
                                                                                                                        }
                                                                                                                        var valid26 = _errs225 === errors;
                                                                                                                      } else {
                                                                                                                        var valid26 = true;
                                                                                                                      }
                                                                                                                      if (valid26) {
                                                                                                                        if (data79.content_hash !== void 0) {
                                                                                                                          const _errs227 = errors;
                                                                                                                          if (typeof data79.content_hash !== "string") {
                                                                                                                            const err42 = { instancePath: instancePath + "/tool_action/content_hash", schemaPath: "#/$defs/ToolAction/properties/content_hash/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                            if (vErrors === null) {
                                                                                                                              vErrors = [err42];
                                                                                                                            } else {
                                                                                                                              vErrors.push(err42);
                                                                                                                            }
                                                                                                                            errors++;
                                                                                                                          }
                                                                                                                          var valid26 = _errs227 === errors;
                                                                                                                        } else {
                                                                                                                          var valid26 = true;
                                                                                                                        }
                                                                                                                        if (valid26) {
                                                                                                                          if (data79.result !== void 0) {
                                                                                                                            const _errs229 = errors;
                                                                                                                            if (typeof data79.result !== "string") {
                                                                                                                              const err43 = { instancePath: instancePath + "/tool_action/result", schemaPath: "#/$defs/ToolAction/properties/result/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                                              if (vErrors === null) {
                                                                                                                                vErrors = [err43];
                                                                                                                              } else {
                                                                                                                                vErrors.push(err43);
                                                                                                                              }
                                                                                                                              errors++;
                                                                                                                            }
                                                                                                                            var valid26 = _errs229 === errors;
                                                                                                                          } else {
                                                                                                                            var valid26 = true;
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
                                                                                                const err44 = { instancePath: instancePath + "/tool_action", schemaPath: "#/$defs/ToolAction/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                                                if (vErrors === null) {
                                                                                                  vErrors = [err44];
                                                                                                } else {
                                                                                                  vErrors.push(err44);
                                                                                                }
                                                                                                errors++;
                                                                                              }
                                                                                            }
                                                                                            var _valid8 = _errs201 === errors;
                                                                                            valid24 = valid24 || _valid8;
                                                                                            if (!valid24) {
                                                                                              const _errs231 = errors;
                                                                                              if (data79 !== null) {
                                                                                                const err45 = { instancePath: instancePath + "/tool_action", schemaPath: "#/properties/tool_action/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                                                if (vErrors === null) {
                                                                                                  vErrors = [err45];
                                                                                                } else {
                                                                                                  vErrors.push(err45);
                                                                                                }
                                                                                                errors++;
                                                                                              }
                                                                                              var _valid8 = _errs231 === errors;
                                                                                              valid24 = valid24 || _valid8;
                                                                                            }
                                                                                            if (!valid24) {
                                                                                              const err46 = { instancePath: instancePath + "/tool_action", schemaPath: "#/properties/tool_action/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err46];
                                                                                              } else {
                                                                                                vErrors.push(err46);
                                                                                              }
                                                                                              errors++;
                                                                                              validate23.errors = vErrors;
                                                                                              return false;
                                                                                            } else {
                                                                                              errors = _errs200;
                                                                                              if (vErrors !== null) {
                                                                                                if (_errs200) {
                                                                                                  vErrors.length = _errs200;
                                                                                                } else {
                                                                                                  vErrors = null;
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                            var valid0 = _errs199 === errors;
                                                                                          } else {
                                                                                            var valid0 = true;
                                                                                          }
                                                                                          if (valid0) {
                                                                                            if (data.status !== void 0) {
                                                                                              let data93 = data.status;
                                                                                              const _errs233 = errors;
                                                                                              if (typeof data93 !== "string") {
                                                                                                validate23.errors = [{ instancePath: instancePath + "/status", schemaPath: "#/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                return false;
                                                                                              }
                                                                                              if (!(data93 === "queued" || data93 === "running" || data93 === "paused" || data93 === "waiting_approval" || data93 === "completed" || data93 === "cancelled" || data93 === "failed" || data93 === "interrupted")) {
                                                                                                validate23.errors = [{ instancePath: instancePath + "/status", schemaPath: "#/properties/status/enum", keyword: "enum", params: { allowedValues: schema30.properties.status.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                return false;
                                                                                              }
                                                                                              var valid0 = _errs233 === errors;
                                                                                            } else {
                                                                                              var valid0 = true;
                                                                                            }
                                                                                            if (valid0) {
                                                                                              if (data.error !== void 0) {
                                                                                                const _errs235 = errors;
                                                                                                if (typeof data.error !== "string") {
                                                                                                  validate23.errors = [{ instancePath: instancePath + "/error", schemaPath: "#/properties/error/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                  return false;
                                                                                                }
                                                                                                var valid0 = _errs235 === errors;
                                                                                              } else {
                                                                                                var valid0 = true;
                                                                                              }
                                                                                              if (valid0) {
                                                                                                if (data.messages !== void 0) {
                                                                                                  let data95 = data.messages;
                                                                                                  const _errs237 = errors;
                                                                                                  if (errors === _errs237) {
                                                                                                    if (Array.isArray(data95)) {
                                                                                                      var valid28 = true;
                                                                                                      const len10 = data95.length;
                                                                                                      for (let i10 = 0; i10 < len10; i10++) {
                                                                                                        let data96 = data95[i10];
                                                                                                        const _errs239 = errors;
                                                                                                        const _errs240 = errors;
                                                                                                        if (errors === _errs240) {
                                                                                                          if (data96 && typeof data96 == "object" && !Array.isArray(data96)) {
                                                                                                            let missing5;
                                                                                                            if (data96.sequence === void 0 && (missing5 = "sequence") || data96.agent_id === void 0 && (missing5 = "agent_id") || data96.phase === void 0 && (missing5 = "phase") || data96.content === void 0 && (missing5 = "content")) {
                                                                                                              validate23.errors = [{ instancePath: instancePath + "/messages/" + i10, schemaPath: "#/$defs/OrchestrationMessage/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" }];
                                                                                                              return false;
                                                                                                            } else {
                                                                                                              const _errs242 = errors;
                                                                                                              for (const key5 in data96) {
                                                                                                                if (!(key5 === "sequence" || key5 === "agent_id" || key5 === "phase" || key5 === "content")) {
                                                                                                                  validate23.errors = [{ instancePath: instancePath + "/messages/" + i10, schemaPath: "#/$defs/OrchestrationMessage/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" }];
                                                                                                                  return false;
                                                                                                                  break;
                                                                                                                }
                                                                                                              }
                                                                                                              if (_errs242 === errors) {
                                                                                                                if (data96.sequence !== void 0) {
                                                                                                                  let data97 = data96.sequence;
                                                                                                                  const _errs243 = errors;
                                                                                                                  if (!(typeof data97 == "number" && (!(data97 % 1) && !isNaN(data97)))) {
                                                                                                                    validate23.errors = [{ instancePath: instancePath + "/messages/" + i10 + "/sequence", schemaPath: "#/$defs/OrchestrationMessage/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                                                    return false;
                                                                                                                  }
                                                                                                                  var valid30 = _errs243 === errors;
                                                                                                                } else {
                                                                                                                  var valid30 = true;
                                                                                                                }
                                                                                                                if (valid30) {
                                                                                                                  if (data96.agent_id !== void 0) {
                                                                                                                    const _errs245 = errors;
                                                                                                                    if (typeof data96.agent_id !== "string") {
                                                                                                                      validate23.errors = [{ instancePath: instancePath + "/messages/" + i10 + "/agent_id", schemaPath: "#/$defs/OrchestrationMessage/properties/agent_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                      return false;
                                                                                                                    }
                                                                                                                    var valid30 = _errs245 === errors;
                                                                                                                  } else {
                                                                                                                    var valid30 = true;
                                                                                                                  }
                                                                                                                  if (valid30) {
                                                                                                                    if (data96.phase !== void 0) {
                                                                                                                      let data99 = data96.phase;
                                                                                                                      const _errs247 = errors;
                                                                                                                      if (typeof data99 !== "string") {
                                                                                                                        validate23.errors = [{ instancePath: instancePath + "/messages/" + i10 + "/phase", schemaPath: "#/$defs/OrchestrationMessage/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                        return false;
                                                                                                                      }
                                                                                                                      if (!(data99 === "analysis" || data99 === "review" || data99 === "synthesis")) {
                                                                                                                        validate23.errors = [{ instancePath: instancePath + "/messages/" + i10 + "/phase", schemaPath: "#/$defs/OrchestrationMessage/properties/phase/enum", keyword: "enum", params: { allowedValues: schema35.properties.phase.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                                        return false;
                                                                                                                      }
                                                                                                                      var valid30 = _errs247 === errors;
                                                                                                                    } else {
                                                                                                                      var valid30 = true;
                                                                                                                    }
                                                                                                                    if (valid30) {
                                                                                                                      if (data96.content !== void 0) {
                                                                                                                        const _errs249 = errors;
                                                                                                                        if (typeof data96.content !== "string") {
                                                                                                                          validate23.errors = [{ instancePath: instancePath + "/messages/" + i10 + "/content", schemaPath: "#/$defs/OrchestrationMessage/properties/content/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                                          return false;
                                                                                                                        }
                                                                                                                        var valid30 = _errs249 === errors;
                                                                                                                      } else {
                                                                                                                        var valid30 = true;
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          } else {
                                                                                                            validate23.errors = [{ instancePath: instancePath + "/messages/" + i10, schemaPath: "#/$defs/OrchestrationMessage/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                                            return false;
                                                                                                          }
                                                                                                        }
                                                                                                        var valid28 = _errs239 === errors;
                                                                                                        if (!valid28) {
                                                                                                          break;
                                                                                                        }
                                                                                                      }
                                                                                                    } else {
                                                                                                      validate23.errors = [{ instancePath: instancePath + "/messages", schemaPath: "#/properties/messages/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                                                      return false;
                                                                                                    }
                                                                                                  }
                                                                                                  var valid0 = _errs237 === errors;
                                                                                                } else {
                                                                                                  var valid0 = true;
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
      validate23.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate23.errors = vErrors;
  return errors === 0;
}
function validate25(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.worker_limit === void 0 && (missing0 = "worker_limit") || data.workers === void 0 && (missing0 = "workers") || data.connections === void 0 && (missing0 = "connections")) {
        validate25.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "worker_limit" || key0 === "workers" || key0 === "connections")) {
            validate25.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.worker_limit !== void 0) {
            let data0 = data.worker_limit;
            const _errs2 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)))) {
              validate25.errors = [{ instancePath: instancePath + "/worker_limit", schemaPath: "#/properties/worker_limit/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.workers !== void 0) {
              let data1 = data.workers;
              const _errs4 = errors;
              if (errors === _errs4) {
                if (Array.isArray(data1)) {
                  var valid1 = true;
                  const len0 = data1.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    let data2 = data1[i0];
                    const _errs6 = errors;
                    const _errs7 = errors;
                    if (errors === _errs7) {
                      if (data2 && typeof data2 == "object" && !Array.isArray(data2)) {
                        let missing1;
                        if (data2.worker_id === void 0 && (missing1 = "worker_id") || data2.run_id === void 0 && (missing1 = "run_id")) {
                          validate25.errors = [{ instancePath: instancePath + "/workers/" + i0, schemaPath: "#/$defs/WorkerSlot/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                          return false;
                        } else {
                          const _errs9 = errors;
                          for (const key1 in data2) {
                            if (!(key1 === "worker_id" || key1 === "run_id")) {
                              validate25.errors = [{ instancePath: instancePath + "/workers/" + i0, schemaPath: "#/$defs/WorkerSlot/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                              return false;
                              break;
                            }
                          }
                          if (_errs9 === errors) {
                            if (data2.worker_id !== void 0) {
                              const _errs10 = errors;
                              if (typeof data2.worker_id !== "string") {
                                validate25.errors = [{ instancePath: instancePath + "/workers/" + i0 + "/worker_id", schemaPath: "#/$defs/WorkerSlot/properties/worker_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              var valid3 = _errs10 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data2.run_id !== void 0) {
                                let data4 = data2.run_id;
                                const _errs12 = errors;
                                const _errs13 = errors;
                                let valid4 = false;
                                const _errs14 = errors;
                                if (typeof data4 !== "string") {
                                  const err0 = { instancePath: instancePath + "/workers/" + i0 + "/run_id", schemaPath: "#/$defs/WorkerSlot/properties/run_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err0];
                                  } else {
                                    vErrors.push(err0);
                                  }
                                  errors++;
                                }
                                var _valid0 = _errs14 === errors;
                                valid4 = valid4 || _valid0;
                                if (!valid4) {
                                  const _errs16 = errors;
                                  if (data4 !== null) {
                                    const err1 = { instancePath: instancePath + "/workers/" + i0 + "/run_id", schemaPath: "#/$defs/WorkerSlot/properties/run_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                    if (vErrors === null) {
                                      vErrors = [err1];
                                    } else {
                                      vErrors.push(err1);
                                    }
                                    errors++;
                                  }
                                  var _valid0 = _errs16 === errors;
                                  valid4 = valid4 || _valid0;
                                }
                                if (!valid4) {
                                  const err2 = { instancePath: instancePath + "/workers/" + i0 + "/run_id", schemaPath: "#/$defs/WorkerSlot/properties/run_id/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                  if (vErrors === null) {
                                    vErrors = [err2];
                                  } else {
                                    vErrors.push(err2);
                                  }
                                  errors++;
                                  validate25.errors = vErrors;
                                  return false;
                                } else {
                                  errors = _errs13;
                                  if (vErrors !== null) {
                                    if (_errs13) {
                                      vErrors.length = _errs13;
                                    } else {
                                      vErrors = null;
                                    }
                                  }
                                }
                                var valid3 = _errs12 === errors;
                              } else {
                                var valid3 = true;
                              }
                            }
                          }
                        }
                      } else {
                        validate25.errors = [{ instancePath: instancePath + "/workers/" + i0, schemaPath: "#/$defs/WorkerSlot/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                        return false;
                      }
                    }
                    var valid1 = _errs6 === errors;
                    if (!valid1) {
                      break;
                    }
                  }
                } else {
                  validate25.errors = [{ instancePath: instancePath + "/workers", schemaPath: "#/properties/workers/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.connections !== void 0) {
                let data5 = data.connections;
                const _errs18 = errors;
                if (errors === _errs18) {
                  if (Array.isArray(data5)) {
                    var valid5 = true;
                    const len1 = data5.length;
                    for (let i1 = 0; i1 < len1; i1++) {
                      let data6 = data5[i1];
                      const _errs20 = errors;
                      const _errs21 = errors;
                      if (errors === _errs21) {
                        if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                          let missing2;
                          if (data6.connection_id === void 0 && (missing2 = "connection_id") || data6.holder_run_id === void 0 && (missing2 = "holder_run_id") || data6.holder_worker_id === void 0 && (missing2 = "holder_worker_id") || data6.waiting_run_ids === void 0 && (missing2 = "waiting_run_ids")) {
                            validate25.errors = [{ instancePath: instancePath + "/connections/" + i1, schemaPath: "#/$defs/ConnectionRuntime/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                            return false;
                          } else {
                            const _errs23 = errors;
                            for (const key2 in data6) {
                              if (!(key2 === "connection_id" || key2 === "holder_run_id" || key2 === "holder_worker_id" || key2 === "waiting_run_ids")) {
                                validate25.errors = [{ instancePath: instancePath + "/connections/" + i1, schemaPath: "#/$defs/ConnectionRuntime/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                return false;
                                break;
                              }
                            }
                            if (_errs23 === errors) {
                              if (data6.connection_id !== void 0) {
                                const _errs24 = errors;
                                if (typeof data6.connection_id !== "string") {
                                  validate25.errors = [{ instancePath: instancePath + "/connections/" + i1 + "/connection_id", schemaPath: "#/$defs/ConnectionRuntime/properties/connection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                  return false;
                                }
                                var valid7 = _errs24 === errors;
                              } else {
                                var valid7 = true;
                              }
                              if (valid7) {
                                if (data6.holder_run_id !== void 0) {
                                  let data8 = data6.holder_run_id;
                                  const _errs26 = errors;
                                  const _errs27 = errors;
                                  let valid8 = false;
                                  const _errs28 = errors;
                                  if (typeof data8 !== "string") {
                                    const err3 = { instancePath: instancePath + "/connections/" + i1 + "/holder_run_id", schemaPath: "#/$defs/ConnectionRuntime/properties/holder_run_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err3];
                                    } else {
                                      vErrors.push(err3);
                                    }
                                    errors++;
                                  }
                                  var _valid1 = _errs28 === errors;
                                  valid8 = valid8 || _valid1;
                                  if (!valid8) {
                                    const _errs30 = errors;
                                    if (data8 !== null) {
                                      const err4 = { instancePath: instancePath + "/connections/" + i1 + "/holder_run_id", schemaPath: "#/$defs/ConnectionRuntime/properties/holder_run_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                      if (vErrors === null) {
                                        vErrors = [err4];
                                      } else {
                                        vErrors.push(err4);
                                      }
                                      errors++;
                                    }
                                    var _valid1 = _errs30 === errors;
                                    valid8 = valid8 || _valid1;
                                  }
                                  if (!valid8) {
                                    const err5 = { instancePath: instancePath + "/connections/" + i1 + "/holder_run_id", schemaPath: "#/$defs/ConnectionRuntime/properties/holder_run_id/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                    if (vErrors === null) {
                                      vErrors = [err5];
                                    } else {
                                      vErrors.push(err5);
                                    }
                                    errors++;
                                    validate25.errors = vErrors;
                                    return false;
                                  } else {
                                    errors = _errs27;
                                    if (vErrors !== null) {
                                      if (_errs27) {
                                        vErrors.length = _errs27;
                                      } else {
                                        vErrors = null;
                                      }
                                    }
                                  }
                                  var valid7 = _errs26 === errors;
                                } else {
                                  var valid7 = true;
                                }
                                if (valid7) {
                                  if (data6.holder_worker_id !== void 0) {
                                    const _errs32 = errors;
                                    if (typeof data6.holder_worker_id !== "string") {
                                      validate25.errors = [{ instancePath: instancePath + "/connections/" + i1 + "/holder_worker_id", schemaPath: "#/$defs/ConnectionRuntime/properties/holder_worker_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    var valid7 = _errs32 === errors;
                                  } else {
                                    var valid7 = true;
                                  }
                                  if (valid7) {
                                    if (data6.waiting_run_ids !== void 0) {
                                      let data10 = data6.waiting_run_ids;
                                      const _errs34 = errors;
                                      if (errors === _errs34) {
                                        if (Array.isArray(data10)) {
                                          var valid9 = true;
                                          const len2 = data10.length;
                                          for (let i2 = 0; i2 < len2; i2++) {
                                            const _errs36 = errors;
                                            if (typeof data10[i2] !== "string") {
                                              validate25.errors = [{ instancePath: instancePath + "/connections/" + i1 + "/waiting_run_ids/" + i2, schemaPath: "#/$defs/ConnectionRuntime/properties/waiting_run_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid9 = _errs36 === errors;
                                            if (!valid9) {
                                              break;
                                            }
                                          }
                                        } else {
                                          validate25.errors = [{ instancePath: instancePath + "/connections/" + i1 + "/waiting_run_ids", schemaPath: "#/$defs/ConnectionRuntime/properties/waiting_run_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                          return false;
                                        }
                                      }
                                      var valid7 = _errs34 === errors;
                                    } else {
                                      var valid7 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          validate25.errors = [{ instancePath: instancePath + "/connections/" + i1, schemaPath: "#/$defs/ConnectionRuntime/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                          return false;
                        }
                      }
                      var valid5 = _errs20 === errors;
                      if (!valid5) {
                        break;
                      }
                    }
                  } else {
                    validate25.errors = [{ instancePath: instancePath + "/connections", schemaPath: "#/properties/connections/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs18 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate25.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate25.errors = vErrors;
  return errors === 0;
}
function validate22(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.runs === void 0 && (missing0 = "runs") || data.runtime === void 0 && (missing0 = "runtime")) {
        validate22.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "runs" || key0 === "runtime")) {
            validate22.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.runs !== void 0) {
            let data0 = data.runs;
            const _errs2 = errors;
            if (errors === _errs2) {
              if (Array.isArray(data0)) {
                var valid1 = true;
                const len0 = data0.length;
                for (let i0 = 0; i0 < len0; i0++) {
                  const _errs4 = errors;
                  if (!validate23(data0[i0], { instancePath: instancePath + "/runs/" + i0, parentData: data0, parentDataProperty: i0, rootData })) {
                    vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                    errors = vErrors.length;
                  }
                  var valid1 = _errs4 === errors;
                  if (!valid1) {
                    break;
                  }
                }
              } else {
                validate22.errors = [{ instancePath: instancePath + "/runs", schemaPath: "#/properties/runs/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.runtime !== void 0) {
              const _errs5 = errors;
              if (!validate25(data.runtime, { instancePath: instancePath + "/runtime", parentData: data, parentDataProperty: "runtime", rootData })) {
                vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate22.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate22.errors = vErrors;
  return errors === 0;
}
var schema40 = { "additionalProperties": false, "properties": { "provider": { "enum": ["anthropic", "gemini", "openai"], "title": "Provider", "type": "string" }, "model_pattern": { "title": "Model Pattern", "type": "string" }, "input_per_million_usd": { "title": "Input Per Million Usd", "type": "number" }, "output_per_million_usd": { "title": "Output Per Million Usd", "type": "number" } }, "required": ["provider", "model_pattern", "input_per_million_usd", "output_per_million_usd"], "title": "PriceEntry", "type": "object" };
function validate28(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.version === void 0 && (missing0 = "version") || data.currency === void 0 && (missing0 = "currency") || data.sources === void 0 && (missing0 = "sources") || data.entries === void 0 && (missing0 = "entries")) {
        validate28.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "version" || key0 === "currency" || key0 === "sources" || key0 === "entries")) {
            validate28.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.version !== void 0) {
            const _errs2 = errors;
            if (typeof data.version !== "string") {
              validate28.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/properties/version/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.currency !== void 0) {
              let data1 = data.currency;
              const _errs4 = errors;
              if (typeof data1 !== "string") {
                validate28.errors = [{ instancePath: instancePath + "/currency", schemaPath: "#/properties/currency/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if ("USD" !== data1) {
                validate28.errors = [{ instancePath: instancePath + "/currency", schemaPath: "#/properties/currency/const", keyword: "const", params: { allowedValue: "USD" }, message: "must be equal to constant" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.sources !== void 0) {
                let data2 = data.sources;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (data2 && typeof data2 == "object" && !Array.isArray(data2)) {
                    for (const key1 in data2) {
                      const _errs9 = errors;
                      if (typeof data2[key1] !== "string") {
                        validate28.errors = [{ instancePath: instancePath + "/sources/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/sources/additionalProperties/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      var valid1 = _errs9 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  } else {
                    validate28.errors = [{ instancePath: instancePath + "/sources", schemaPath: "#/properties/sources/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.entries !== void 0) {
                  let data4 = data.entries;
                  const _errs11 = errors;
                  if (errors === _errs11) {
                    if (Array.isArray(data4)) {
                      var valid2 = true;
                      const len0 = data4.length;
                      for (let i0 = 0; i0 < len0; i0++) {
                        let data5 = data4[i0];
                        const _errs13 = errors;
                        const _errs14 = errors;
                        if (errors === _errs14) {
                          if (data5 && typeof data5 == "object" && !Array.isArray(data5)) {
                            let missing1;
                            if (data5.provider === void 0 && (missing1 = "provider") || data5.model_pattern === void 0 && (missing1 = "model_pattern") || data5.input_per_million_usd === void 0 && (missing1 = "input_per_million_usd") || data5.output_per_million_usd === void 0 && (missing1 = "output_per_million_usd")) {
                              validate28.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/PriceEntry/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                              return false;
                            } else {
                              const _errs16 = errors;
                              for (const key2 in data5) {
                                if (!(key2 === "provider" || key2 === "model_pattern" || key2 === "input_per_million_usd" || key2 === "output_per_million_usd")) {
                                  validate28.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/PriceEntry/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                  return false;
                                  break;
                                }
                              }
                              if (_errs16 === errors) {
                                if (data5.provider !== void 0) {
                                  let data6 = data5.provider;
                                  const _errs17 = errors;
                                  if (typeof data6 !== "string") {
                                    validate28.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/provider", schemaPath: "#/$defs/PriceEntry/properties/provider/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if (!(data6 === "anthropic" || data6 === "gemini" || data6 === "openai")) {
                                    validate28.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/provider", schemaPath: "#/$defs/PriceEntry/properties/provider/enum", keyword: "enum", params: { allowedValues: schema40.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
                                    return false;
                                  }
                                  var valid4 = _errs17 === errors;
                                } else {
                                  var valid4 = true;
                                }
                                if (valid4) {
                                  if (data5.model_pattern !== void 0) {
                                    const _errs19 = errors;
                                    if (typeof data5.model_pattern !== "string") {
                                      validate28.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/model_pattern", schemaPath: "#/$defs/PriceEntry/properties/model_pattern/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    var valid4 = _errs19 === errors;
                                  } else {
                                    var valid4 = true;
                                  }
                                  if (valid4) {
                                    if (data5.input_per_million_usd !== void 0) {
                                      const _errs21 = errors;
                                      if (!(typeof data5.input_per_million_usd == "number")) {
                                        validate28.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/input_per_million_usd", schemaPath: "#/$defs/PriceEntry/properties/input_per_million_usd/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                        return false;
                                      }
                                      var valid4 = _errs21 === errors;
                                    } else {
                                      var valid4 = true;
                                    }
                                    if (valid4) {
                                      if (data5.output_per_million_usd !== void 0) {
                                        const _errs23 = errors;
                                        if (!(typeof data5.output_per_million_usd == "number")) {
                                          validate28.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/output_per_million_usd", schemaPath: "#/$defs/PriceEntry/properties/output_per_million_usd/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                          return false;
                                        }
                                        var valid4 = _errs23 === errors;
                                      } else {
                                        var valid4 = true;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          } else {
                            validate28.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/PriceEntry/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                            return false;
                          }
                        }
                        var valid2 = _errs13 === errors;
                        if (!valid2) {
                          break;
                        }
                      }
                    } else {
                      validate28.errors = [{ instancePath: instancePath + "/entries", schemaPath: "#/properties/entries/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                      return false;
                    }
                  }
                  var valid0 = _errs11 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate28.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate28.errors = vErrors;
  return errors === 0;
}
function validate30(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.collections === void 0 && (missing0 = "collections") || data.embedding_models === void 0 && (missing0 = "embedding_models") || data.embedding_error === void 0 && (missing0 = "embedding_error")) {
        validate30.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "collections" || key0 === "embedding_models" || key0 === "embedding_error")) {
            validate30.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.collections !== void 0) {
            let data0 = data.collections;
            const _errs2 = errors;
            if (errors === _errs2) {
              if (Array.isArray(data0)) {
                var valid1 = true;
                const len0 = data0.length;
                for (let i0 = 0; i0 < len0; i0++) {
                  let data1 = data0[i0];
                  const _errs4 = errors;
                  const _errs5 = errors;
                  if (errors === _errs5) {
                    if (data1 && typeof data1 == "object" && !Array.isArray(data1)) {
                      let missing1;
                      if (data1.name === void 0 && (missing1 = "name") || data1.embedding_provider === void 0 && (missing1 = "embedding_provider") || data1.embedding_model === void 0 && (missing1 = "embedding_model") || data1.id === void 0 && (missing1 = "id") || data1.dimensions === void 0 && (missing1 = "dimensions") || data1.source_count === void 0 && (missing1 = "source_count") || data1.chunk_count === void 0 && (missing1 = "chunk_count")) {
                        validate30.errors = [{ instancePath: instancePath + "/collections/" + i0, schemaPath: "#/$defs/KnowledgeCollection/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                        return false;
                      } else {
                        const _errs7 = errors;
                        for (const key1 in data1) {
                          if (!(key1 === "name" || key1 === "embedding_provider" || key1 === "embedding_model" || key1 === "id" || key1 === "dimensions" || key1 === "source_count" || key1 === "chunk_count")) {
                            validate30.errors = [{ instancePath: instancePath + "/collections/" + i0, schemaPath: "#/$defs/KnowledgeCollection/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                            return false;
                            break;
                          }
                        }
                        if (_errs7 === errors) {
                          if (data1.name !== void 0) {
                            let data2 = data1.name;
                            const _errs8 = errors;
                            if (errors === _errs8) {
                              if (typeof data2 === "string") {
                                if (func2(data2) > 100) {
                                  validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/name", schemaPath: "#/$defs/KnowledgeCollection/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                  return false;
                                } else {
                                  if (func2(data2) < 1) {
                                    validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/name", schemaPath: "#/$defs/KnowledgeCollection/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                    return false;
                                  }
                                }
                              } else {
                                validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/name", schemaPath: "#/$defs/KnowledgeCollection/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                            }
                            var valid3 = _errs8 === errors;
                          } else {
                            var valid3 = true;
                          }
                          if (valid3) {
                            if (data1.embedding_provider !== void 0) {
                              let data3 = data1.embedding_provider;
                              const _errs10 = errors;
                              if (typeof data3 !== "string") {
                                validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_provider", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_provider/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              if ("ollama" !== data3) {
                                validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_provider", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_provider/const", keyword: "const", params: { allowedValue: "ollama" }, message: "must be equal to constant" }];
                                return false;
                              }
                              var valid3 = _errs10 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data1.embedding_model !== void 0) {
                                let data4 = data1.embedding_model;
                                const _errs12 = errors;
                                if (errors === _errs12) {
                                  if (typeof data4 === "string") {
                                    if (func2(data4) > 100) {
                                      validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_model", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_model/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                      return false;
                                    } else {
                                      if (func2(data4) < 1) {
                                        validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_model", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_model/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                        return false;
                                      }
                                    }
                                  } else {
                                    validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_model", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_model/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                }
                                var valid3 = _errs12 === errors;
                              } else {
                                var valid3 = true;
                              }
                              if (valid3) {
                                if (data1.id !== void 0) {
                                  const _errs14 = errors;
                                  if (typeof data1.id !== "string") {
                                    validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/id", schemaPath: "#/$defs/KnowledgeCollection/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  var valid3 = _errs14 === errors;
                                } else {
                                  var valid3 = true;
                                }
                                if (valid3) {
                                  if (data1.dimensions !== void 0) {
                                    let data6 = data1.dimensions;
                                    const _errs16 = errors;
                                    if (!(typeof data6 == "number" && (!(data6 % 1) && !isNaN(data6)))) {
                                      validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/dimensions", schemaPath: "#/$defs/KnowledgeCollection/properties/dimensions/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                      return false;
                                    }
                                    var valid3 = _errs16 === errors;
                                  } else {
                                    var valid3 = true;
                                  }
                                  if (valid3) {
                                    if (data1.source_count !== void 0) {
                                      let data7 = data1.source_count;
                                      const _errs18 = errors;
                                      if (!(typeof data7 == "number" && (!(data7 % 1) && !isNaN(data7)))) {
                                        validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/source_count", schemaPath: "#/$defs/KnowledgeCollection/properties/source_count/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                        return false;
                                      }
                                      var valid3 = _errs18 === errors;
                                    } else {
                                      var valid3 = true;
                                    }
                                    if (valid3) {
                                      if (data1.chunk_count !== void 0) {
                                        let data8 = data1.chunk_count;
                                        const _errs20 = errors;
                                        if (!(typeof data8 == "number" && (!(data8 % 1) && !isNaN(data8)))) {
                                          validate30.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/chunk_count", schemaPath: "#/$defs/KnowledgeCollection/properties/chunk_count/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                          return false;
                                        }
                                        var valid3 = _errs20 === errors;
                                      } else {
                                        var valid3 = true;
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
                      validate30.errors = [{ instancePath: instancePath + "/collections/" + i0, schemaPath: "#/$defs/KnowledgeCollection/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                      return false;
                    }
                  }
                  var valid1 = _errs4 === errors;
                  if (!valid1) {
                    break;
                  }
                }
              } else {
                validate30.errors = [{ instancePath: instancePath + "/collections", schemaPath: "#/properties/collections/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                return false;
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.embedding_models !== void 0) {
              let data9 = data.embedding_models;
              const _errs22 = errors;
              if (errors === _errs22) {
                if (Array.isArray(data9)) {
                  var valid4 = true;
                  const len1 = data9.length;
                  for (let i1 = 0; i1 < len1; i1++) {
                    let data10 = data9[i1];
                    const _errs24 = errors;
                    const _errs25 = errors;
                    if (errors === _errs25) {
                      if (data10 && typeof data10 == "object" && !Array.isArray(data10)) {
                        let missing2;
                        if (data10.name === void 0 && (missing2 = "name") || data10.size === void 0 && (missing2 = "size")) {
                          validate30.errors = [{ instancePath: instancePath + "/embedding_models/" + i1, schemaPath: "#/$defs/EmbeddingModel/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                          return false;
                        } else {
                          const _errs27 = errors;
                          for (const key2 in data10) {
                            if (!(key2 === "name" || key2 === "size")) {
                              validate30.errors = [{ instancePath: instancePath + "/embedding_models/" + i1, schemaPath: "#/$defs/EmbeddingModel/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                              return false;
                              break;
                            }
                          }
                          if (_errs27 === errors) {
                            if (data10.name !== void 0) {
                              const _errs28 = errors;
                              if (typeof data10.name !== "string") {
                                validate30.errors = [{ instancePath: instancePath + "/embedding_models/" + i1 + "/name", schemaPath: "#/$defs/EmbeddingModel/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              var valid6 = _errs28 === errors;
                            } else {
                              var valid6 = true;
                            }
                            if (valid6) {
                              if (data10.size !== void 0) {
                                let data12 = data10.size;
                                const _errs30 = errors;
                                if (!(typeof data12 == "number" && (!(data12 % 1) && !isNaN(data12)))) {
                                  validate30.errors = [{ instancePath: instancePath + "/embedding_models/" + i1 + "/size", schemaPath: "#/$defs/EmbeddingModel/properties/size/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                  return false;
                                }
                                var valid6 = _errs30 === errors;
                              } else {
                                var valid6 = true;
                              }
                            }
                          }
                        }
                      } else {
                        validate30.errors = [{ instancePath: instancePath + "/embedding_models/" + i1, schemaPath: "#/$defs/EmbeddingModel/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                        return false;
                      }
                    }
                    var valid4 = _errs24 === errors;
                    if (!valid4) {
                      break;
                    }
                  }
                } else {
                  validate30.errors = [{ instancePath: instancePath + "/embedding_models", schemaPath: "#/properties/embedding_models/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                  return false;
                }
              }
              var valid0 = _errs22 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.embedding_error !== void 0) {
                const _errs32 = errors;
                if (typeof data.embedding_error !== "string") {
                  validate30.errors = [{ instancePath: instancePath + "/embedding_error", schemaPath: "#/properties/embedding_error/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                var valid0 = _errs32 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate30.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate30.errors = vErrors;
  return errors === 0;
}
var schema46 = { "additionalProperties": false, "properties": { "chunk_id": { "title": "Chunk Id", "type": "string" }, "collection_id": { "title": "Collection Id", "type": "string" }, "collection_name": { "title": "Collection Name", "type": "string" }, "workspace_id": { "title": "Workspace Id", "type": "string" }, "source_path": { "title": "Source Path", "type": "string" }, "ordinal": { "title": "Ordinal", "type": "integer" }, "start_line": { "title": "Start Line", "type": "integer" }, "end_line": { "title": "End Line", "type": "integer" }, "content": { "maxLength": 3200, "title": "Content", "type": "string" }, "rrf_score": { "minimum": 0, "title": "Rrf Score", "type": "number" }, "fts_rank": { "anyOf": [{ "minimum": 1, "type": "integer" }, { "type": "null" }], "default": null, "title": "Fts Rank" }, "vector_rank": { "anyOf": [{ "minimum": 1, "type": "integer" }, { "type": "null" }], "default": null, "title": "Vector Rank" }, "cosine_similarity": { "anyOf": [{ "maximum": 1, "minimum": -1, "type": "number" }, { "type": "null" }], "default": null, "title": "Cosine Similarity" } }, "required": ["chunk_id", "collection_id", "collection_name", "workspace_id", "source_path", "ordinal", "start_line", "end_line", "content", "rrf_score", "fts_rank", "vector_rank", "cosine_similarity"], "title": "KnowledgeSearchHit", "type": "object" };
function validate32(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.collection_id === void 0 && (missing0 = "collection_id") || data.query === void 0 && (missing0 = "query") || data.hits === void 0 && (missing0 = "hits")) {
        validate32.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "collection_id" || key0 === "query" || key0 === "hits")) {
            validate32.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.collection_id !== void 0) {
            const _errs2 = errors;
            if (typeof data.collection_id !== "string") {
              validate32.errors = [{ instancePath: instancePath + "/collection_id", schemaPath: "#/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.query !== void 0) {
              const _errs4 = errors;
              if (typeof data.query !== "string") {
                validate32.errors = [{ instancePath: instancePath + "/query", schemaPath: "#/properties/query/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.hits !== void 0) {
                let data2 = data.hits;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (Array.isArray(data2)) {
                    if (data2.length > 10) {
                      validate32.errors = [{ instancePath: instancePath + "/hits", schemaPath: "#/properties/hits/maxItems", keyword: "maxItems", params: { limit: 10 }, message: "must NOT have more than 10 items" }];
                      return false;
                    } else {
                      var valid1 = true;
                      const len0 = data2.length;
                      for (let i0 = 0; i0 < len0; i0++) {
                        let data3 = data2[i0];
                        const _errs8 = errors;
                        const _errs9 = errors;
                        if (errors === _errs9) {
                          if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                            let missing1;
                            if (data3.chunk_id === void 0 && (missing1 = "chunk_id") || data3.collection_id === void 0 && (missing1 = "collection_id") || data3.collection_name === void 0 && (missing1 = "collection_name") || data3.workspace_id === void 0 && (missing1 = "workspace_id") || data3.source_path === void 0 && (missing1 = "source_path") || data3.ordinal === void 0 && (missing1 = "ordinal") || data3.start_line === void 0 && (missing1 = "start_line") || data3.end_line === void 0 && (missing1 = "end_line") || data3.content === void 0 && (missing1 = "content") || data3.rrf_score === void 0 && (missing1 = "rrf_score") || data3.fts_rank === void 0 && (missing1 = "fts_rank") || data3.vector_rank === void 0 && (missing1 = "vector_rank") || data3.cosine_similarity === void 0 && (missing1 = "cosine_similarity")) {
                              validate32.errors = [{ instancePath: instancePath + "/hits/" + i0, schemaPath: "#/$defs/KnowledgeSearchHit/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                              return false;
                            } else {
                              const _errs11 = errors;
                              for (const key1 in data3) {
                                if (!func27.call(schema46.properties, key1)) {
                                  validate32.errors = [{ instancePath: instancePath + "/hits/" + i0, schemaPath: "#/$defs/KnowledgeSearchHit/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                  return false;
                                  break;
                                }
                              }
                              if (_errs11 === errors) {
                                if (data3.chunk_id !== void 0) {
                                  const _errs12 = errors;
                                  if (typeof data3.chunk_id !== "string") {
                                    validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/chunk_id", schemaPath: "#/$defs/KnowledgeSearchHit/properties/chunk_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  var valid3 = _errs12 === errors;
                                } else {
                                  var valid3 = true;
                                }
                                if (valid3) {
                                  if (data3.collection_id !== void 0) {
                                    const _errs14 = errors;
                                    if (typeof data3.collection_id !== "string") {
                                      validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/collection_id", schemaPath: "#/$defs/KnowledgeSearchHit/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                      return false;
                                    }
                                    var valid3 = _errs14 === errors;
                                  } else {
                                    var valid3 = true;
                                  }
                                  if (valid3) {
                                    if (data3.collection_name !== void 0) {
                                      const _errs16 = errors;
                                      if (typeof data3.collection_name !== "string") {
                                        validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/collection_name", schemaPath: "#/$defs/KnowledgeSearchHit/properties/collection_name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                      var valid3 = _errs16 === errors;
                                    } else {
                                      var valid3 = true;
                                    }
                                    if (valid3) {
                                      if (data3.workspace_id !== void 0) {
                                        const _errs18 = errors;
                                        if (typeof data3.workspace_id !== "string") {
                                          validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/workspace_id", schemaPath: "#/$defs/KnowledgeSearchHit/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                        var valid3 = _errs18 === errors;
                                      } else {
                                        var valid3 = true;
                                      }
                                      if (valid3) {
                                        if (data3.source_path !== void 0) {
                                          const _errs20 = errors;
                                          if (typeof data3.source_path !== "string") {
                                            validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/source_path", schemaPath: "#/$defs/KnowledgeSearchHit/properties/source_path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                          var valid3 = _errs20 === errors;
                                        } else {
                                          var valid3 = true;
                                        }
                                        if (valid3) {
                                          if (data3.ordinal !== void 0) {
                                            let data9 = data3.ordinal;
                                            const _errs22 = errors;
                                            if (!(typeof data9 == "number" && (!(data9 % 1) && !isNaN(data9)))) {
                                              validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/ordinal", schemaPath: "#/$defs/KnowledgeSearchHit/properties/ordinal/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                              return false;
                                            }
                                            var valid3 = _errs22 === errors;
                                          } else {
                                            var valid3 = true;
                                          }
                                          if (valid3) {
                                            if (data3.start_line !== void 0) {
                                              let data10 = data3.start_line;
                                              const _errs24 = errors;
                                              if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)))) {
                                                validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/start_line", schemaPath: "#/$defs/KnowledgeSearchHit/properties/start_line/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                return false;
                                              }
                                              var valid3 = _errs24 === errors;
                                            } else {
                                              var valid3 = true;
                                            }
                                            if (valid3) {
                                              if (data3.end_line !== void 0) {
                                                let data11 = data3.end_line;
                                                const _errs26 = errors;
                                                if (!(typeof data11 == "number" && (!(data11 % 1) && !isNaN(data11)))) {
                                                  validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/end_line", schemaPath: "#/$defs/KnowledgeSearchHit/properties/end_line/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                  return false;
                                                }
                                                var valid3 = _errs26 === errors;
                                              } else {
                                                var valid3 = true;
                                              }
                                              if (valid3) {
                                                if (data3.content !== void 0) {
                                                  let data12 = data3.content;
                                                  const _errs28 = errors;
                                                  if (errors === _errs28) {
                                                    if (typeof data12 === "string") {
                                                      if (func2(data12) > 3200) {
                                                        validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/content", schemaPath: "#/$defs/KnowledgeSearchHit/properties/content/maxLength", keyword: "maxLength", params: { limit: 3200 }, message: "must NOT have more than 3200 characters" }];
                                                        return false;
                                                      }
                                                    } else {
                                                      validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/content", schemaPath: "#/$defs/KnowledgeSearchHit/properties/content/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid3 = _errs28 === errors;
                                                } else {
                                                  var valid3 = true;
                                                }
                                                if (valid3) {
                                                  if (data3.rrf_score !== void 0) {
                                                    let data13 = data3.rrf_score;
                                                    const _errs30 = errors;
                                                    if (errors === _errs30) {
                                                      if (typeof data13 == "number") {
                                                        if (data13 < 0 || isNaN(data13)) {
                                                          validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/rrf_score", schemaPath: "#/$defs/KnowledgeSearchHit/properties/rrf_score/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                          return false;
                                                        }
                                                      } else {
                                                        validate32.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/rrf_score", schemaPath: "#/$defs/KnowledgeSearchHit/properties/rrf_score/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                                                        return false;
                                                      }
                                                    }
                                                    var valid3 = _errs30 === errors;
                                                  } else {
                                                    var valid3 = true;
                                                  }
                                                  if (valid3) {
                                                    if (data3.fts_rank !== void 0) {
                                                      let data14 = data3.fts_rank;
                                                      const _errs32 = errors;
                                                      const _errs33 = errors;
                                                      let valid4 = false;
                                                      const _errs34 = errors;
                                                      if (!(typeof data14 == "number" && (!(data14 % 1) && !isNaN(data14)))) {
                                                        const err0 = { instancePath: instancePath + "/hits/" + i0 + "/fts_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/fts_rank/anyOf/0/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                        if (vErrors === null) {
                                                          vErrors = [err0];
                                                        } else {
                                                          vErrors.push(err0);
                                                        }
                                                        errors++;
                                                      }
                                                      if (errors === _errs34) {
                                                        if (typeof data14 == "number") {
                                                          if (data14 < 1 || isNaN(data14)) {
                                                            const err1 = { instancePath: instancePath + "/hits/" + i0 + "/fts_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/fts_rank/anyOf/0/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                            if (vErrors === null) {
                                                              vErrors = [err1];
                                                            } else {
                                                              vErrors.push(err1);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                      var _valid0 = _errs34 === errors;
                                                      valid4 = valid4 || _valid0;
                                                      if (!valid4) {
                                                        const _errs36 = errors;
                                                        if (data14 !== null) {
                                                          const err2 = { instancePath: instancePath + "/hits/" + i0 + "/fts_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/fts_rank/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                          if (vErrors === null) {
                                                            vErrors = [err2];
                                                          } else {
                                                            vErrors.push(err2);
                                                          }
                                                          errors++;
                                                        }
                                                        var _valid0 = _errs36 === errors;
                                                        valid4 = valid4 || _valid0;
                                                      }
                                                      if (!valid4) {
                                                        const err3 = { instancePath: instancePath + "/hits/" + i0 + "/fts_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/fts_rank/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                        if (vErrors === null) {
                                                          vErrors = [err3];
                                                        } else {
                                                          vErrors.push(err3);
                                                        }
                                                        errors++;
                                                        validate32.errors = vErrors;
                                                        return false;
                                                      } else {
                                                        errors = _errs33;
                                                        if (vErrors !== null) {
                                                          if (_errs33) {
                                                            vErrors.length = _errs33;
                                                          } else {
                                                            vErrors = null;
                                                          }
                                                        }
                                                      }
                                                      var valid3 = _errs32 === errors;
                                                    } else {
                                                      var valid3 = true;
                                                    }
                                                    if (valid3) {
                                                      if (data3.vector_rank !== void 0) {
                                                        let data15 = data3.vector_rank;
                                                        const _errs38 = errors;
                                                        const _errs39 = errors;
                                                        let valid5 = false;
                                                        const _errs40 = errors;
                                                        if (!(typeof data15 == "number" && (!(data15 % 1) && !isNaN(data15)))) {
                                                          const err4 = { instancePath: instancePath + "/hits/" + i0 + "/vector_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/vector_rank/anyOf/0/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                          if (vErrors === null) {
                                                            vErrors = [err4];
                                                          } else {
                                                            vErrors.push(err4);
                                                          }
                                                          errors++;
                                                        }
                                                        if (errors === _errs40) {
                                                          if (typeof data15 == "number") {
                                                            if (data15 < 1 || isNaN(data15)) {
                                                              const err5 = { instancePath: instancePath + "/hits/" + i0 + "/vector_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/vector_rank/anyOf/0/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                              if (vErrors === null) {
                                                                vErrors = [err5];
                                                              } else {
                                                                vErrors.push(err5);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                        var _valid1 = _errs40 === errors;
                                                        valid5 = valid5 || _valid1;
                                                        if (!valid5) {
                                                          const _errs42 = errors;
                                                          if (data15 !== null) {
                                                            const err6 = { instancePath: instancePath + "/hits/" + i0 + "/vector_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/vector_rank/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                            if (vErrors === null) {
                                                              vErrors = [err6];
                                                            } else {
                                                              vErrors.push(err6);
                                                            }
                                                            errors++;
                                                          }
                                                          var _valid1 = _errs42 === errors;
                                                          valid5 = valid5 || _valid1;
                                                        }
                                                        if (!valid5) {
                                                          const err7 = { instancePath: instancePath + "/hits/" + i0 + "/vector_rank", schemaPath: "#/$defs/KnowledgeSearchHit/properties/vector_rank/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                          if (vErrors === null) {
                                                            vErrors = [err7];
                                                          } else {
                                                            vErrors.push(err7);
                                                          }
                                                          errors++;
                                                          validate32.errors = vErrors;
                                                          return false;
                                                        } else {
                                                          errors = _errs39;
                                                          if (vErrors !== null) {
                                                            if (_errs39) {
                                                              vErrors.length = _errs39;
                                                            } else {
                                                              vErrors = null;
                                                            }
                                                          }
                                                        }
                                                        var valid3 = _errs38 === errors;
                                                      } else {
                                                        var valid3 = true;
                                                      }
                                                      if (valid3) {
                                                        if (data3.cosine_similarity !== void 0) {
                                                          let data16 = data3.cosine_similarity;
                                                          const _errs44 = errors;
                                                          const _errs45 = errors;
                                                          let valid6 = false;
                                                          const _errs46 = errors;
                                                          if (errors === _errs46) {
                                                            if (typeof data16 == "number") {
                                                              if (data16 > 1 || isNaN(data16)) {
                                                                const err8 = { instancePath: instancePath + "/hits/" + i0 + "/cosine_similarity", schemaPath: "#/$defs/KnowledgeSearchHit/properties/cosine_similarity/anyOf/0/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1 }, message: "must be <= 1" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err8];
                                                                } else {
                                                                  vErrors.push(err8);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (data16 < -1 || isNaN(data16)) {
                                                                  const err9 = { instancePath: instancePath + "/hits/" + i0 + "/cosine_similarity", schemaPath: "#/$defs/KnowledgeSearchHit/properties/cosine_similarity/anyOf/0/minimum", keyword: "minimum", params: { comparison: ">=", limit: -1 }, message: "must be >= -1" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err9];
                                                                  } else {
                                                                    vErrors.push(err9);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                            } else {
                                                              const err10 = { instancePath: instancePath + "/hits/" + i0 + "/cosine_similarity", schemaPath: "#/$defs/KnowledgeSearchHit/properties/cosine_similarity/anyOf/0/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                                                              if (vErrors === null) {
                                                                vErrors = [err10];
                                                              } else {
                                                                vErrors.push(err10);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                          var _valid2 = _errs46 === errors;
                                                          valid6 = valid6 || _valid2;
                                                          if (!valid6) {
                                                            const _errs48 = errors;
                                                            if (data16 !== null) {
                                                              const err11 = { instancePath: instancePath + "/hits/" + i0 + "/cosine_similarity", schemaPath: "#/$defs/KnowledgeSearchHit/properties/cosine_similarity/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                              if (vErrors === null) {
                                                                vErrors = [err11];
                                                              } else {
                                                                vErrors.push(err11);
                                                              }
                                                              errors++;
                                                            }
                                                            var _valid2 = _errs48 === errors;
                                                            valid6 = valid6 || _valid2;
                                                          }
                                                          if (!valid6) {
                                                            const err12 = { instancePath: instancePath + "/hits/" + i0 + "/cosine_similarity", schemaPath: "#/$defs/KnowledgeSearchHit/properties/cosine_similarity/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                            if (vErrors === null) {
                                                              vErrors = [err12];
                                                            } else {
                                                              vErrors.push(err12);
                                                            }
                                                            errors++;
                                                            validate32.errors = vErrors;
                                                            return false;
                                                          } else {
                                                            errors = _errs45;
                                                            if (vErrors !== null) {
                                                              if (_errs45) {
                                                                vErrors.length = _errs45;
                                                              } else {
                                                                vErrors = null;
                                                              }
                                                            }
                                                          }
                                                          var valid3 = _errs44 === errors;
                                                        } else {
                                                          var valid3 = true;
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
                            validate32.errors = [{ instancePath: instancePath + "/hits/" + i0, schemaPath: "#/$defs/KnowledgeSearchHit/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                            return false;
                          }
                        }
                        var valid1 = _errs8 === errors;
                        if (!valid1) {
                          break;
                        }
                      }
                    }
                  } else {
                    validate32.errors = [{ instancePath: instancePath + "/hits", schemaPath: "#/properties/hits/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate32.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate32.errors = vErrors;
  return errors === 0;
}
function validate11(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.protocol_version === void 0 && (missing0 = "protocol_version") || data.request_id === void 0 && (missing0 = "request_id") || data.ok === void 0 && (missing0 = "ok") || data.result === void 0 && (missing0 = "result")) {
        validate11.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "protocol_version" || key0 === "request_id" || key0 === "ok" || key0 === "result")) {
            validate11.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.protocol_version !== void 0) {
            let data0 = data.protocol_version;
            const _errs2 = errors;
            if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)))) {
              validate11.errors = [{ instancePath: instancePath + "/protocol_version", schemaPath: "#/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
              return false;
            }
            if (1 !== data0) {
              validate11.errors = [{ instancePath: instancePath + "/protocol_version", schemaPath: "#/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.request_id !== void 0) {
              const _errs4 = errors;
              if (typeof data.request_id !== "string") {
                validate11.errors = [{ instancePath: instancePath + "/request_id", schemaPath: "#/properties/request_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.ok !== void 0) {
                let data2 = data.ok;
                const _errs6 = errors;
                if (typeof data2 !== "boolean") {
                  validate11.errors = [{ instancePath: instancePath + "/ok", schemaPath: "#/properties/ok/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                  return false;
                }
                if (true !== data2) {
                  validate11.errors = [{ instancePath: instancePath + "/ok", schemaPath: "#/properties/ok/const", keyword: "const", params: { allowedValue: true }, message: "must be equal to constant" }];
                  return false;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.result !== void 0) {
                  let data3 = data.result;
                  const _errs8 = errors;
                  const _errs9 = errors;
                  let valid1 = false;
                  const _errs10 = errors;
                  if (!validate12(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                    vErrors = vErrors === null ? validate12.errors : vErrors.concat(validate12.errors);
                    errors = vErrors.length;
                  }
                  var _valid0 = _errs10 === errors;
                  valid1 = valid1 || _valid0;
                  if (!valid1) {
                    const _errs11 = errors;
                    if (!validate16(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                      vErrors = vErrors === null ? validate16.errors : vErrors.concat(validate16.errors);
                      errors = vErrors.length;
                    }
                    var _valid0 = _errs11 === errors;
                    valid1 = valid1 || _valid0;
                    if (!valid1) {
                      const _errs12 = errors;
                      if (!validate18(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                        vErrors = vErrors === null ? validate18.errors : vErrors.concat(validate18.errors);
                        errors = vErrors.length;
                      }
                      var _valid0 = _errs12 === errors;
                      valid1 = valid1 || _valid0;
                      if (!valid1) {
                        const _errs13 = errors;
                        const _errs14 = errors;
                        if (errors === _errs14) {
                          if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                            let missing1;
                            if (data3.run_id === void 0 && (missing1 = "run_id")) {
                              const err0 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/Accepted/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" };
                              if (vErrors === null) {
                                vErrors = [err0];
                              } else {
                                vErrors.push(err0);
                              }
                              errors++;
                            } else {
                              const _errs16 = errors;
                              for (const key1 in data3) {
                                if (!(key1 === "run_id")) {
                                  const err1 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/Accepted/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" };
                                  if (vErrors === null) {
                                    vErrors = [err1];
                                  } else {
                                    vErrors.push(err1);
                                  }
                                  errors++;
                                  break;
                                }
                              }
                              if (_errs16 === errors) {
                                if (data3.run_id !== void 0) {
                                  if (typeof data3.run_id !== "string") {
                                    const err2 = { instancePath: instancePath + "/result/run_id", schemaPath: "#/$defs/Accepted/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err2];
                                    } else {
                                      vErrors.push(err2);
                                    }
                                    errors++;
                                  }
                                }
                              }
                            }
                          } else {
                            const err3 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/Accepted/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                            if (vErrors === null) {
                              vErrors = [err3];
                            } else {
                              vErrors.push(err3);
                            }
                            errors++;
                          }
                        }
                        var _valid0 = _errs13 === errors;
                        valid1 = valid1 || _valid0;
                        if (!valid1) {
                          const _errs19 = errors;
                          const _errs20 = errors;
                          if (errors === _errs20) {
                            if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                              let missing2;
                              if (data3.connection_id === void 0 && (missing2 = "connection_id") || data3.has_key === void 0 && (missing2 = "has_key")) {
                                const err4 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/VaultStatus/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" };
                                if (vErrors === null) {
                                  vErrors = [err4];
                                } else {
                                  vErrors.push(err4);
                                }
                                errors++;
                              } else {
                                const _errs22 = errors;
                                for (const key2 in data3) {
                                  if (!(key2 === "connection_id" || key2 === "has_key")) {
                                    const err5 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/VaultStatus/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" };
                                    if (vErrors === null) {
                                      vErrors = [err5];
                                    } else {
                                      vErrors.push(err5);
                                    }
                                    errors++;
                                    break;
                                  }
                                }
                                if (_errs22 === errors) {
                                  if (data3.connection_id !== void 0) {
                                    const _errs23 = errors;
                                    if (typeof data3.connection_id !== "string") {
                                      const err6 = { instancePath: instancePath + "/result/connection_id", schemaPath: "#/$defs/VaultStatus/properties/connection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err6];
                                      } else {
                                        vErrors.push(err6);
                                      }
                                      errors++;
                                    }
                                    var valid5 = _errs23 === errors;
                                  } else {
                                    var valid5 = true;
                                  }
                                  if (valid5) {
                                    if (data3.has_key !== void 0) {
                                      const _errs25 = errors;
                                      if (typeof data3.has_key !== "boolean") {
                                        const err7 = { instancePath: instancePath + "/result/has_key", schemaPath: "#/$defs/VaultStatus/properties/has_key/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                        if (vErrors === null) {
                                          vErrors = [err7];
                                        } else {
                                          vErrors.push(err7);
                                        }
                                        errors++;
                                      }
                                      var valid5 = _errs25 === errors;
                                    } else {
                                      var valid5 = true;
                                    }
                                  }
                                }
                              }
                            } else {
                              const err8 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/VaultStatus/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                              if (vErrors === null) {
                                vErrors = [err8];
                              } else {
                                vErrors.push(err8);
                              }
                              errors++;
                            }
                          }
                          var _valid0 = _errs19 === errors;
                          valid1 = valid1 || _valid0;
                          if (!valid1) {
                            const _errs27 = errors;
                            if (!validate20(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                              vErrors = vErrors === null ? validate20.errors : vErrors.concat(validate20.errors);
                              errors = vErrors.length;
                            }
                            var _valid0 = _errs27 === errors;
                            valid1 = valid1 || _valid0;
                            if (!valid1) {
                              const _errs28 = errors;
                              const _errs29 = errors;
                              if (errors === _errs29) {
                                if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                                  let missing3;
                                  if (data3.workspace_id === void 0 && (missing3 = "workspace_id") || data3.path === void 0 && (missing3 = "path") || data3.content === void 0 && (missing3 = "content") || data3.size === void 0 && (missing3 = "size")) {
                                    const err9 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/WorkspaceFile/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" };
                                    if (vErrors === null) {
                                      vErrors = [err9];
                                    } else {
                                      vErrors.push(err9);
                                    }
                                    errors++;
                                  } else {
                                    const _errs31 = errors;
                                    for (const key3 in data3) {
                                      if (!(key3 === "workspace_id" || key3 === "path" || key3 === "content" || key3 === "size")) {
                                        const err10 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/WorkspaceFile/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" };
                                        if (vErrors === null) {
                                          vErrors = [err10];
                                        } else {
                                          vErrors.push(err10);
                                        }
                                        errors++;
                                        break;
                                      }
                                    }
                                    if (_errs31 === errors) {
                                      if (data3.workspace_id !== void 0) {
                                        const _errs32 = errors;
                                        if (typeof data3.workspace_id !== "string") {
                                          const err11 = { instancePath: instancePath + "/result/workspace_id", schemaPath: "#/$defs/WorkspaceFile/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                          if (vErrors === null) {
                                            vErrors = [err11];
                                          } else {
                                            vErrors.push(err11);
                                          }
                                          errors++;
                                        }
                                        var valid7 = _errs32 === errors;
                                      } else {
                                        var valid7 = true;
                                      }
                                      if (valid7) {
                                        if (data3.path !== void 0) {
                                          const _errs34 = errors;
                                          if (typeof data3.path !== "string") {
                                            const err12 = { instancePath: instancePath + "/result/path", schemaPath: "#/$defs/WorkspaceFile/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err12];
                                            } else {
                                              vErrors.push(err12);
                                            }
                                            errors++;
                                          }
                                          var valid7 = _errs34 === errors;
                                        } else {
                                          var valid7 = true;
                                        }
                                        if (valid7) {
                                          if (data3.content !== void 0) {
                                            const _errs36 = errors;
                                            if (typeof data3.content !== "string") {
                                              const err13 = { instancePath: instancePath + "/result/content", schemaPath: "#/$defs/WorkspaceFile/properties/content/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err13];
                                              } else {
                                                vErrors.push(err13);
                                              }
                                              errors++;
                                            }
                                            var valid7 = _errs36 === errors;
                                          } else {
                                            var valid7 = true;
                                          }
                                          if (valid7) {
                                            if (data3.size !== void 0) {
                                              let data10 = data3.size;
                                              const _errs38 = errors;
                                              if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)))) {
                                                const err14 = { instancePath: instancePath + "/result/size", schemaPath: "#/$defs/WorkspaceFile/properties/size/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                if (vErrors === null) {
                                                  vErrors = [err14];
                                                } else {
                                                  vErrors.push(err14);
                                                }
                                                errors++;
                                              }
                                              var valid7 = _errs38 === errors;
                                            } else {
                                              var valid7 = true;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  const err15 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/WorkspaceFile/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                  if (vErrors === null) {
                                    vErrors = [err15];
                                  } else {
                                    vErrors.push(err15);
                                  }
                                  errors++;
                                }
                              }
                              var _valid0 = _errs28 === errors;
                              valid1 = valid1 || _valid0;
                              if (!valid1) {
                                const _errs40 = errors;
                                if (!validate22(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                  vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
                                  errors = vErrors.length;
                                }
                                var _valid0 = _errs40 === errors;
                                valid1 = valid1 || _valid0;
                                if (!valid1) {
                                  const _errs41 = errors;
                                  if (!validate28(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                    vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
                                    errors = vErrors.length;
                                  }
                                  var _valid0 = _errs41 === errors;
                                  valid1 = valid1 || _valid0;
                                  if (!valid1) {
                                    const _errs42 = errors;
                                    if (!validate30(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                      vErrors = vErrors === null ? validate30.errors : vErrors.concat(validate30.errors);
                                      errors = vErrors.length;
                                    }
                                    var _valid0 = _errs42 === errors;
                                    valid1 = valid1 || _valid0;
                                    if (!valid1) {
                                      const _errs43 = errors;
                                      const _errs44 = errors;
                                      if (errors === _errs44) {
                                        if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                                          let missing4;
                                          if (data3.collection_id === void 0 && (missing4 = "collection_id") || data3.workspace_id === void 0 && (missing4 = "workspace_id") || data3.path === void 0 && (missing4 = "path") || data3.status === void 0 && (missing4 = "status") || data3.chunk_count === void 0 && (missing4 = "chunk_count") || data3.embedded_count === void 0 && (missing4 = "embedded_count") || data3.reused_count === void 0 && (missing4 = "reused_count")) {
                                            const err16 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/KnowledgeIngestionResult/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" };
                                            if (vErrors === null) {
                                              vErrors = [err16];
                                            } else {
                                              vErrors.push(err16);
                                            }
                                            errors++;
                                          } else {
                                            const _errs46 = errors;
                                            for (const key4 in data3) {
                                              if (!(key4 === "collection_id" || key4 === "workspace_id" || key4 === "path" || key4 === "status" || key4 === "chunk_count" || key4 === "embedded_count" || key4 === "reused_count")) {
                                                const err17 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/KnowledgeIngestionResult/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                                                if (vErrors === null) {
                                                  vErrors = [err17];
                                                } else {
                                                  vErrors.push(err17);
                                                }
                                                errors++;
                                                break;
                                              }
                                            }
                                            if (_errs46 === errors) {
                                              if (data3.collection_id !== void 0) {
                                                const _errs47 = errors;
                                                if (typeof data3.collection_id !== "string") {
                                                  const err18 = { instancePath: instancePath + "/result/collection_id", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err18];
                                                  } else {
                                                    vErrors.push(err18);
                                                  }
                                                  errors++;
                                                }
                                                var valid9 = _errs47 === errors;
                                              } else {
                                                var valid9 = true;
                                              }
                                              if (valid9) {
                                                if (data3.workspace_id !== void 0) {
                                                  const _errs49 = errors;
                                                  if (typeof data3.workspace_id !== "string") {
                                                    const err19 = { instancePath: instancePath + "/result/workspace_id", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err19];
                                                    } else {
                                                      vErrors.push(err19);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid9 = _errs49 === errors;
                                                } else {
                                                  var valid9 = true;
                                                }
                                                if (valid9) {
                                                  if (data3.path !== void 0) {
                                                    const _errs51 = errors;
                                                    if (typeof data3.path !== "string") {
                                                      const err20 = { instancePath: instancePath + "/result/path", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err20];
                                                      } else {
                                                        vErrors.push(err20);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid9 = _errs51 === errors;
                                                  } else {
                                                    var valid9 = true;
                                                  }
                                                  if (valid9) {
                                                    if (data3.status !== void 0) {
                                                      let data14 = data3.status;
                                                      const _errs53 = errors;
                                                      if (typeof data14 !== "string") {
                                                        const err21 = { instancePath: instancePath + "/result/status", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err21];
                                                        } else {
                                                          vErrors.push(err21);
                                                        }
                                                        errors++;
                                                      }
                                                      if (!(data14 === "indexed" || data14 === "unchanged")) {
                                                        const err22 = { instancePath: instancePath + "/result/status", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/status/enum", keyword: "enum", params: { allowedValues: schema44.properties.status.enum }, message: "must be equal to one of the allowed values" };
                                                        if (vErrors === null) {
                                                          vErrors = [err22];
                                                        } else {
                                                          vErrors.push(err22);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid9 = _errs53 === errors;
                                                    } else {
                                                      var valid9 = true;
                                                    }
                                                    if (valid9) {
                                                      if (data3.chunk_count !== void 0) {
                                                        let data15 = data3.chunk_count;
                                                        const _errs55 = errors;
                                                        if (!(typeof data15 == "number" && (!(data15 % 1) && !isNaN(data15)))) {
                                                          const err23 = { instancePath: instancePath + "/result/chunk_count", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/chunk_count/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                          if (vErrors === null) {
                                                            vErrors = [err23];
                                                          } else {
                                                            vErrors.push(err23);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid9 = _errs55 === errors;
                                                      } else {
                                                        var valid9 = true;
                                                      }
                                                      if (valid9) {
                                                        if (data3.embedded_count !== void 0) {
                                                          let data16 = data3.embedded_count;
                                                          const _errs57 = errors;
                                                          if (!(typeof data16 == "number" && (!(data16 % 1) && !isNaN(data16)))) {
                                                            const err24 = { instancePath: instancePath + "/result/embedded_count", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/embedded_count/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                            if (vErrors === null) {
                                                              vErrors = [err24];
                                                            } else {
                                                              vErrors.push(err24);
                                                            }
                                                            errors++;
                                                          }
                                                          var valid9 = _errs57 === errors;
                                                        } else {
                                                          var valid9 = true;
                                                        }
                                                        if (valid9) {
                                                          if (data3.reused_count !== void 0) {
                                                            let data17 = data3.reused_count;
                                                            const _errs59 = errors;
                                                            if (!(typeof data17 == "number" && (!(data17 % 1) && !isNaN(data17)))) {
                                                              const err25 = { instancePath: instancePath + "/result/reused_count", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/reused_count/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                              if (vErrors === null) {
                                                                vErrors = [err25];
                                                              } else {
                                                                vErrors.push(err25);
                                                              }
                                                              errors++;
                                                            }
                                                            var valid9 = _errs59 === errors;
                                                          } else {
                                                            var valid9 = true;
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
                                          const err26 = { instancePath: instancePath + "/result", schemaPath: "#/$defs/KnowledgeIngestionResult/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                          if (vErrors === null) {
                                            vErrors = [err26];
                                          } else {
                                            vErrors.push(err26);
                                          }
                                          errors++;
                                        }
                                      }
                                      var _valid0 = _errs43 === errors;
                                      valid1 = valid1 || _valid0;
                                      if (!valid1) {
                                        const _errs61 = errors;
                                        if (!validate32(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                          vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
                                          errors = vErrors.length;
                                        }
                                        var _valid0 = _errs61 === errors;
                                        valid1 = valid1 || _valid0;
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
                  if (!valid1) {
                    const err27 = { instancePath: instancePath + "/result", schemaPath: "#/properties/result/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                    if (vErrors === null) {
                      vErrors = [err27];
                    } else {
                      vErrors.push(err27);
                    }
                    errors++;
                    validate11.errors = vErrors;
                    return false;
                  } else {
                    errors = _errs9;
                    if (vErrors !== null) {
                      if (_errs9) {
                        vErrors.length = _errs9;
                      } else {
                        vErrors = null;
                      }
                    }
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate11.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate11.errors = vErrors;
  return errors === 0;
}
function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  const _errs1 = errors;
  if (!validate11(data, { instancePath, parentData, parentDataProperty, rootData })) {
    vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  valid0 = valid0 || _valid0;
  if (!valid0) {
    const _errs2 = errors;
    const _errs3 = errors;
    if (errors === _errs3) {
      if (data && typeof data == "object" && !Array.isArray(data)) {
        let missing0;
        if (data.protocol_version === void 0 && (missing0 = "protocol_version") || data.request_id === void 0 && (missing0 = "request_id") || data.ok === void 0 && (missing0 = "ok") || data.code === void 0 && (missing0 = "code") || data.message === void 0 && (missing0 = "message")) {
          const err0 = { instancePath, schemaPath: "#/$defs/Failure/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        } else {
          const _errs5 = errors;
          for (const key0 in data) {
            if (!(key0 === "protocol_version" || key0 === "request_id" || key0 === "ok" || key0 === "code" || key0 === "message")) {
              const err1 = { instancePath, schemaPath: "#/$defs/Failure/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" };
              if (vErrors === null) {
                vErrors = [err1];
              } else {
                vErrors.push(err1);
              }
              errors++;
              break;
            }
          }
          if (_errs5 === errors) {
            if (data.protocol_version !== void 0) {
              let data0 = data.protocol_version;
              const _errs6 = errors;
              if (!(typeof data0 == "number" && (!(data0 % 1) && !isNaN(data0)))) {
                const err2 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/Failure/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                if (vErrors === null) {
                  vErrors = [err2];
                } else {
                  vErrors.push(err2);
                }
                errors++;
              }
              if (1 !== data0) {
                const err3 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/Failure/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                if (vErrors === null) {
                  vErrors = [err3];
                } else {
                  vErrors.push(err3);
                }
                errors++;
              }
              var valid2 = _errs6 === errors;
            } else {
              var valid2 = true;
            }
            if (valid2) {
              if (data.request_id !== void 0) {
                const _errs8 = errors;
                if (typeof data.request_id !== "string") {
                  const err4 = { instancePath: instancePath + "/request_id", schemaPath: "#/$defs/Failure/properties/request_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                  if (vErrors === null) {
                    vErrors = [err4];
                  } else {
                    vErrors.push(err4);
                  }
                  errors++;
                }
                var valid2 = _errs8 === errors;
              } else {
                var valid2 = true;
              }
              if (valid2) {
                if (data.ok !== void 0) {
                  let data2 = data.ok;
                  const _errs10 = errors;
                  if (typeof data2 !== "boolean") {
                    const err5 = { instancePath: instancePath + "/ok", schemaPath: "#/$defs/Failure/properties/ok/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err5];
                    } else {
                      vErrors.push(err5);
                    }
                    errors++;
                  }
                  if (false !== data2) {
                    const err6 = { instancePath: instancePath + "/ok", schemaPath: "#/$defs/Failure/properties/ok/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err6];
                    } else {
                      vErrors.push(err6);
                    }
                    errors++;
                  }
                  var valid2 = _errs10 === errors;
                } else {
                  var valid2 = true;
                }
                if (valid2) {
                  if (data.code !== void 0) {
                    let data3 = data.code;
                    const _errs12 = errors;
                    if (typeof data3 !== "string") {
                      const err7 = { instancePath: instancePath + "/code", schemaPath: "#/$defs/Failure/properties/code/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err7];
                      } else {
                        vErrors.push(err7);
                      }
                      errors++;
                    }
                    if (!(data3 === "invalid_request" || data3 === "conflict" || data3 === "not_found" || data3 === "internal_error")) {
                      const err8 = { instancePath: instancePath + "/code", schemaPath: "#/$defs/Failure/properties/code/enum", keyword: "enum", params: { allowedValues: schema47.properties.code.enum }, message: "must be equal to one of the allowed values" };
                      if (vErrors === null) {
                        vErrors = [err8];
                      } else {
                        vErrors.push(err8);
                      }
                      errors++;
                    }
                    var valid2 = _errs12 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data.message !== void 0) {
                      const _errs14 = errors;
                      if (typeof data.message !== "string") {
                        const err9 = { instancePath: instancePath + "/message", schemaPath: "#/$defs/Failure/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err9];
                        } else {
                          vErrors.push(err9);
                        }
                        errors++;
                      }
                      var valid2 = _errs14 === errors;
                    } else {
                      var valid2 = true;
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        const err10 = { instancePath, schemaPath: "#/$defs/Failure/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
          vErrors = [err10];
        } else {
          vErrors.push(err10);
        }
        errors++;
      }
    }
    var _valid0 = _errs2 === errors;
    valid0 = valid0 || _valid0;
  }
  if (!valid0) {
    const err11 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
    if (vErrors === null) {
      vErrors = [err11];
    } else {
      vErrors.push(err11);
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
  validate_response_default as default,
  validate
};
