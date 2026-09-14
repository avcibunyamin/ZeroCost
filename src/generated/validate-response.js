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
var schema41 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "request_id": { "title": "Request Id", "type": "string" }, "ok": { "const": false, "default": false, "title": "Ok", "type": "boolean" }, "code": { "enum": ["invalid_request", "conflict", "not_found", "internal_error"], "title": "Code", "type": "string" }, "message": { "title": "Message", "type": "string" } }, "required": ["protocol_version", "request_id", "ok", "code", "message"], "title": "Failure", "type": "object" };
var schema38 = { "additionalProperties": false, "properties": { "collection_id": { "title": "Collection Id", "type": "string" }, "workspace_id": { "title": "Workspace Id", "type": "string" }, "path": { "title": "Path", "type": "string" }, "status": { "enum": ["indexed", "unchanged"], "title": "Status", "type": "string" }, "chunk_count": { "title": "Chunk Count", "type": "integer" }, "embedded_count": { "title": "Embedded Count", "type": "integer" }, "reused_count": { "title": "Reused Count", "type": "integer" } }, "required": ["collection_id", "workspace_id", "path", "status", "chunk_count", "embedded_count", "reused_count"], "title": "KnowledgeIngestionResult", "type": "object" };
var schema14 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "provider": { "enum": ["ollama", "lmstudio", "anthropic", "gemini", "openai"], "title": "Provider", "type": "string" }, "model_id": { "maxLength": 100, "minLength": 1, "title": "Model Id", "type": "string" }, "id": { "title": "Id", "type": "string" }, "status": { "const": "unconfigured", "default": "unconfigured", "title": "Status", "type": "string" } }, "required": ["name", "provider", "model_id", "id", "status"], "title": "Connection", "type": "object" };
var schema15 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "role": { "maxLength": 100, "minLength": 1, "title": "Role", "type": "string" }, "connection_id": { "maxLength": 128, "minLength": 1, "title": "Connection Id", "type": "string" }, "instructions": { "default": "", "maxLength": 8e3, "title": "Instructions", "type": "string" }, "id": { "title": "Id", "type": "string" }, "permissions": { "items": { "enum": ["workspace.read", "workspace.write", "terminal.execute"], "type": "string" }, "title": "Permissions", "type": "array" }, "skill_ids": { "items": { "type": "string" }, "title": "Skill Ids", "type": "array" } }, "required": ["name", "role", "connection_id", "instructions", "id", "permissions", "skill_ids"], "title": "Agent", "type": "object" };
var schema17 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "version": { "maxLength": 20, "minLength": 5, "pattern": "^\\d+\\.\\d+\\.\\d+$", "title": "Version", "type": "string" }, "description": { "maxLength": 500, "minLength": 1, "title": "Description", "type": "string" }, "instructions": { "default": "", "maxLength": 8e3, "title": "Instructions", "type": "string" }, "required_tools": { "items": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "type": "string" }, "maxItems": 3, "title": "Required Tools", "type": "array" }, "required_permissions": { "items": { "enum": ["workspace.read", "workspace.write", "terminal.execute"], "type": "string" }, "maxItems": 3, "title": "Required Permissions", "type": "array" }, "provider_hint": { "anyOf": [{ "enum": ["ollama", "lmstudio", "anthropic", "gemini", "openai"], "type": "string" }, { "type": "null" }], "default": null, "title": "Provider Hint" }, "id": { "title": "Id", "type": "string" } }, "required": ["name", "version", "description", "instructions", "required_tools", "required_permissions", "provider_hint", "id"], "title": "SkillPackage", "type": "object" };
var func2 = require_ucs2length().default;
var pattern0 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
var schema18 = { "additionalProperties": false, "properties": { "name": { "maxLength": 100, "minLength": 1, "title": "Name", "type": "string" }, "version": { "maxLength": 20, "minLength": 5, "pattern": "^\\d+\\.\\d+\\.\\d+$", "title": "Version", "type": "string" }, "description": { "maxLength": 500, "minLength": 1, "title": "Description", "type": "string" }, "objective_prefix": { "default": "", "maxLength": 4e3, "title": "Objective Prefix", "type": "string" }, "agent_slots": { "items": { "$ref": "#/$defs/WorkflowSlotInput" }, "maxItems": 4, "minItems": 2, "title": "Agent Slots", "type": "array" }, "required_tools": { "items": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "type": "string" }, "maxItems": 3, "title": "Required Tools", "type": "array" }, "rounds": { "default": 1, "maximum": 3, "minimum": 1, "title": "Rounds", "type": "integer" }, "max_model_calls": { "default": 5, "maximum": 14, "minimum": 3, "title": "Max Model Calls", "type": "integer" }, "max_output_tokens": { "default": 512, "maximum": 4096, "minimum": 128, "title": "Max Output Tokens", "type": "integer" }, "max_cost_microusd": { "default": 5e6, "maximum": 1e9, "minimum": 0, "title": "Max Cost Microusd", "type": "integer" }, "id": { "title": "Id", "type": "string" }, "archived": { "default": false, "title": "Archived", "type": "boolean" } }, "required": ["name", "version", "description", "objective_prefix", "agent_slots", "required_tools", "rounds", "max_model_calls", "max_output_tokens", "max_cost_microusd", "id", "archived"], "title": "WorkflowTemplate", "type": "object" };
var func24 = Object.prototype.hasOwnProperty;
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
          if (!func24.call(schema18.properties, key0)) {
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
                            if (data4.name === void 0 && (missing1 = "name") || data4.provider === void 0 && (missing1 = "provider") || data4.model_id === void 0 && (missing1 = "model_id") || data4.id === void 0 && (missing1 = "id") || data4.status === void 0 && (missing1 = "status")) {
                              validate12.errors = [{ instancePath: instancePath + "/connections/" + i0, schemaPath: "#/$defs/Connection/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                              return false;
                            } else {
                              const _errs13 = errors;
                              for (const key1 in data4) {
                                if (!(key1 === "name" || key1 === "provider" || key1 === "model_id" || key1 === "id" || key1 === "status")) {
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
                                      if (data4.id !== void 0) {
                                        const _errs20 = errors;
                                        if (typeof data4.id !== "string") {
                                          validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/id", schemaPath: "#/$defs/Connection/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                        var valid3 = _errs20 === errors;
                                      } else {
                                        var valid3 = true;
                                      }
                                      if (valid3) {
                                        if (data4.status !== void 0) {
                                          let data9 = data4.status;
                                          const _errs22 = errors;
                                          if (typeof data9 !== "string") {
                                            validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/status", schemaPath: "#/$defs/Connection/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                          if ("unconfigured" !== data9) {
                                            validate12.errors = [{ instancePath: instancePath + "/connections/" + i0 + "/status", schemaPath: "#/$defs/Connection/properties/status/const", keyword: "const", params: { allowedValue: "unconfigured" }, message: "must be equal to constant" }];
                                            return false;
                                          }
                                          var valid3 = _errs22 === errors;
                                        } else {
                                          var valid3 = true;
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
                    let data10 = data.agents;
                    const _errs24 = errors;
                    if (errors === _errs24) {
                      if (Array.isArray(data10)) {
                        var valid4 = true;
                        const len1 = data10.length;
                        for (let i1 = 0; i1 < len1; i1++) {
                          let data11 = data10[i1];
                          const _errs26 = errors;
                          const _errs27 = errors;
                          if (errors === _errs27) {
                            if (data11 && typeof data11 == "object" && !Array.isArray(data11)) {
                              let missing2;
                              if (data11.name === void 0 && (missing2 = "name") || data11.role === void 0 && (missing2 = "role") || data11.connection_id === void 0 && (missing2 = "connection_id") || data11.instructions === void 0 && (missing2 = "instructions") || data11.id === void 0 && (missing2 = "id") || data11.permissions === void 0 && (missing2 = "permissions") || data11.skill_ids === void 0 && (missing2 = "skill_ids")) {
                                validate12.errors = [{ instancePath: instancePath + "/agents/" + i1, schemaPath: "#/$defs/Agent/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                return false;
                              } else {
                                const _errs29 = errors;
                                for (const key2 in data11) {
                                  if (!(key2 === "name" || key2 === "role" || key2 === "connection_id" || key2 === "instructions" || key2 === "id" || key2 === "permissions" || key2 === "skill_ids")) {
                                    validate12.errors = [{ instancePath: instancePath + "/agents/" + i1, schemaPath: "#/$defs/Agent/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs29 === errors) {
                                  if (data11.name !== void 0) {
                                    let data12 = data11.name;
                                    const _errs30 = errors;
                                    if (errors === _errs30) {
                                      if (typeof data12 === "string") {
                                        if (func2(data12) > 100) {
                                          validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/name", schemaPath: "#/$defs/Agent/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                          return false;
                                        } else {
                                          if (func2(data12) < 1) {
                                            validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/name", schemaPath: "#/$defs/Agent/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                            return false;
                                          }
                                        }
                                      } else {
                                        validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/name", schemaPath: "#/$defs/Agent/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                    }
                                    var valid6 = _errs30 === errors;
                                  } else {
                                    var valid6 = true;
                                  }
                                  if (valid6) {
                                    if (data11.role !== void 0) {
                                      let data13 = data11.role;
                                      const _errs32 = errors;
                                      if (errors === _errs32) {
                                        if (typeof data13 === "string") {
                                          if (func2(data13) > 100) {
                                            validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/role", schemaPath: "#/$defs/Agent/properties/role/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                            return false;
                                          } else {
                                            if (func2(data13) < 1) {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/role", schemaPath: "#/$defs/Agent/properties/role/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                              return false;
                                            }
                                          }
                                        } else {
                                          validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/role", schemaPath: "#/$defs/Agent/properties/role/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                      }
                                      var valid6 = _errs32 === errors;
                                    } else {
                                      var valid6 = true;
                                    }
                                    if (valid6) {
                                      if (data11.connection_id !== void 0) {
                                        let data14 = data11.connection_id;
                                        const _errs34 = errors;
                                        if (errors === _errs34) {
                                          if (typeof data14 === "string") {
                                            if (func2(data14) > 128) {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/connection_id", schemaPath: "#/$defs/Agent/properties/connection_id/maxLength", keyword: "maxLength", params: { limit: 128 }, message: "must NOT have more than 128 characters" }];
                                              return false;
                                            } else {
                                              if (func2(data14) < 1) {
                                                validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/connection_id", schemaPath: "#/$defs/Agent/properties/connection_id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                return false;
                                              }
                                            }
                                          } else {
                                            validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/connection_id", schemaPath: "#/$defs/Agent/properties/connection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid6 = _errs34 === errors;
                                      } else {
                                        var valid6 = true;
                                      }
                                      if (valid6) {
                                        if (data11.instructions !== void 0) {
                                          let data15 = data11.instructions;
                                          const _errs36 = errors;
                                          if (errors === _errs36) {
                                            if (typeof data15 === "string") {
                                              if (func2(data15) > 8e3) {
                                                validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/instructions", schemaPath: "#/$defs/Agent/properties/instructions/maxLength", keyword: "maxLength", params: { limit: 8e3 }, message: "must NOT have more than 8000 characters" }];
                                                return false;
                                              }
                                            } else {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/instructions", schemaPath: "#/$defs/Agent/properties/instructions/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                          }
                                          var valid6 = _errs36 === errors;
                                        } else {
                                          var valid6 = true;
                                        }
                                        if (valid6) {
                                          if (data11.id !== void 0) {
                                            const _errs38 = errors;
                                            if (typeof data11.id !== "string") {
                                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/id", schemaPath: "#/$defs/Agent/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                            var valid6 = _errs38 === errors;
                                          } else {
                                            var valid6 = true;
                                          }
                                          if (valid6) {
                                            if (data11.permissions !== void 0) {
                                              let data17 = data11.permissions;
                                              const _errs40 = errors;
                                              if (errors === _errs40) {
                                                if (Array.isArray(data17)) {
                                                  var valid7 = true;
                                                  const len2 = data17.length;
                                                  for (let i2 = 0; i2 < len2; i2++) {
                                                    let data18 = data17[i2];
                                                    const _errs42 = errors;
                                                    if (typeof data18 !== "string") {
                                                      validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/permissions/" + i2, schemaPath: "#/$defs/Agent/properties/permissions/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                    if (!(data18 === "workspace.read" || data18 === "workspace.write" || data18 === "terminal.execute")) {
                                                      validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/permissions/" + i2, schemaPath: "#/$defs/Agent/properties/permissions/items/enum", keyword: "enum", params: { allowedValues: schema15.properties.permissions.items.enum }, message: "must be equal to one of the allowed values" }];
                                                      return false;
                                                    }
                                                    var valid7 = _errs42 === errors;
                                                    if (!valid7) {
                                                      break;
                                                    }
                                                  }
                                                } else {
                                                  validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/permissions", schemaPath: "#/$defs/Agent/properties/permissions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                  return false;
                                                }
                                              }
                                              var valid6 = _errs40 === errors;
                                            } else {
                                              var valid6 = true;
                                            }
                                            if (valid6) {
                                              if (data11.skill_ids !== void 0) {
                                                let data19 = data11.skill_ids;
                                                const _errs44 = errors;
                                                if (errors === _errs44) {
                                                  if (Array.isArray(data19)) {
                                                    var valid8 = true;
                                                    const len3 = data19.length;
                                                    for (let i3 = 0; i3 < len3; i3++) {
                                                      const _errs46 = errors;
                                                      if (typeof data19[i3] !== "string") {
                                                        validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/skill_ids/" + i3, schemaPath: "#/$defs/Agent/properties/skill_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid8 = _errs46 === errors;
                                                      if (!valid8) {
                                                        break;
                                                      }
                                                    }
                                                  } else {
                                                    validate12.errors = [{ instancePath: instancePath + "/agents/" + i1 + "/skill_ids", schemaPath: "#/$defs/Agent/properties/skill_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                    return false;
                                                  }
                                                }
                                                var valid6 = _errs44 === errors;
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
                              validate12.errors = [{ instancePath: instancePath + "/agents/" + i1, schemaPath: "#/$defs/Agent/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                              return false;
                            }
                          }
                          var valid4 = _errs26 === errors;
                          if (!valid4) {
                            break;
                          }
                        }
                      } else {
                        validate12.errors = [{ instancePath: instancePath + "/agents", schemaPath: "#/properties/agents/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                        return false;
                      }
                    }
                    var valid0 = _errs24 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.workspaces !== void 0) {
                      let data21 = data.workspaces;
                      const _errs48 = errors;
                      if (errors === _errs48) {
                        if (Array.isArray(data21)) {
                          var valid9 = true;
                          const len4 = data21.length;
                          for (let i4 = 0; i4 < len4; i4++) {
                            let data22 = data21[i4];
                            const _errs50 = errors;
                            const _errs51 = errors;
                            if (errors === _errs51) {
                              if (data22 && typeof data22 == "object" && !Array.isArray(data22)) {
                                let missing3;
                                if (data22.name === void 0 && (missing3 = "name") || data22.path === void 0 && (missing3 = "path") || data22.id === void 0 && (missing3 = "id")) {
                                  validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4, schemaPath: "#/$defs/Workspace/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" }];
                                  return false;
                                } else {
                                  const _errs53 = errors;
                                  for (const key3 in data22) {
                                    if (!(key3 === "name" || key3 === "path" || key3 === "id")) {
                                      validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4, schemaPath: "#/$defs/Workspace/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" }];
                                      return false;
                                      break;
                                    }
                                  }
                                  if (_errs53 === errors) {
                                    if (data22.name !== void 0) {
                                      let data23 = data22.name;
                                      const _errs54 = errors;
                                      if (errors === _errs54) {
                                        if (typeof data23 === "string") {
                                          if (func2(data23) > 100) {
                                            validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4 + "/name", schemaPath: "#/$defs/Workspace/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                            return false;
                                          } else {
                                            if (func2(data23) < 1) {
                                              validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4 + "/name", schemaPath: "#/$defs/Workspace/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                              return false;
                                            }
                                          }
                                        } else {
                                          validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4 + "/name", schemaPath: "#/$defs/Workspace/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                          return false;
                                        }
                                      }
                                      var valid11 = _errs54 === errors;
                                    } else {
                                      var valid11 = true;
                                    }
                                    if (valid11) {
                                      if (data22.path !== void 0) {
                                        let data24 = data22.path;
                                        const _errs56 = errors;
                                        if (errors === _errs56) {
                                          if (typeof data24 === "string") {
                                            if (func2(data24) > 4096) {
                                              validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4 + "/path", schemaPath: "#/$defs/Workspace/properties/path/maxLength", keyword: "maxLength", params: { limit: 4096 }, message: "must NOT have more than 4096 characters" }];
                                              return false;
                                            } else {
                                              if (func2(data24) < 1) {
                                                validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4 + "/path", schemaPath: "#/$defs/Workspace/properties/path/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                return false;
                                              }
                                            }
                                          } else {
                                            validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4 + "/path", schemaPath: "#/$defs/Workspace/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid11 = _errs56 === errors;
                                      } else {
                                        var valid11 = true;
                                      }
                                      if (valid11) {
                                        if (data22.id !== void 0) {
                                          const _errs58 = errors;
                                          if (typeof data22.id !== "string") {
                                            validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4 + "/id", schemaPath: "#/$defs/Workspace/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                          var valid11 = _errs58 === errors;
                                        } else {
                                          var valid11 = true;
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate12.errors = [{ instancePath: instancePath + "/workspaces/" + i4, schemaPath: "#/$defs/Workspace/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                return false;
                              }
                            }
                            var valid9 = _errs50 === errors;
                            if (!valid9) {
                              break;
                            }
                          }
                        } else {
                          validate12.errors = [{ instancePath: instancePath + "/workspaces", schemaPath: "#/properties/workspaces/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs48 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.skills !== void 0) {
                        let data26 = data.skills;
                        const _errs60 = errors;
                        if (errors === _errs60) {
                          if (Array.isArray(data26)) {
                            var valid12 = true;
                            const len5 = data26.length;
                            for (let i5 = 0; i5 < len5; i5++) {
                              let data27 = data26[i5];
                              const _errs62 = errors;
                              const _errs63 = errors;
                              if (errors === _errs63) {
                                if (data27 && typeof data27 == "object" && !Array.isArray(data27)) {
                                  let missing4;
                                  if (data27.name === void 0 && (missing4 = "name") || data27.version === void 0 && (missing4 = "version") || data27.description === void 0 && (missing4 = "description") || data27.instructions === void 0 && (missing4 = "instructions") || data27.required_tools === void 0 && (missing4 = "required_tools") || data27.required_permissions === void 0 && (missing4 = "required_permissions") || data27.provider_hint === void 0 && (missing4 = "provider_hint") || data27.id === void 0 && (missing4 = "id")) {
                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i5, schemaPath: "#/$defs/SkillPackage/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" }];
                                    return false;
                                  } else {
                                    const _errs65 = errors;
                                    for (const key4 in data27) {
                                      if (!(key4 === "name" || key4 === "version" || key4 === "description" || key4 === "instructions" || key4 === "required_tools" || key4 === "required_permissions" || key4 === "provider_hint" || key4 === "id")) {
                                        validate12.errors = [{ instancePath: instancePath + "/skills/" + i5, schemaPath: "#/$defs/SkillPackage/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" }];
                                        return false;
                                        break;
                                      }
                                    }
                                    if (_errs65 === errors) {
                                      if (data27.name !== void 0) {
                                        let data28 = data27.name;
                                        const _errs66 = errors;
                                        if (errors === _errs66) {
                                          if (typeof data28 === "string") {
                                            if (func2(data28) > 100) {
                                              validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/name", schemaPath: "#/$defs/SkillPackage/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                              return false;
                                            } else {
                                              if (func2(data28) < 1) {
                                                validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/name", schemaPath: "#/$defs/SkillPackage/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                return false;
                                              }
                                            }
                                          } else {
                                            validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/name", schemaPath: "#/$defs/SkillPackage/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                            return false;
                                          }
                                        }
                                        var valid14 = _errs66 === errors;
                                      } else {
                                        var valid14 = true;
                                      }
                                      if (valid14) {
                                        if (data27.version !== void 0) {
                                          let data29 = data27.version;
                                          const _errs68 = errors;
                                          if (errors === _errs68) {
                                            if (typeof data29 === "string") {
                                              if (func2(data29) > 20) {
                                                validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/maxLength", keyword: "maxLength", params: { limit: 20 }, message: "must NOT have more than 20 characters" }];
                                                return false;
                                              } else {
                                                if (func2(data29) < 5) {
                                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/minLength", keyword: "minLength", params: { limit: 5 }, message: "must NOT have fewer than 5 characters" }];
                                                  return false;
                                                } else {
                                                  if (!pattern0.test(data29)) {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/pattern", keyword: "pattern", params: { pattern: "^\\d+\\.\\d+\\.\\d+$" }, message: 'must match pattern "^\\d+\\.\\d+\\.\\d+$"' }];
                                                    return false;
                                                  }
                                                }
                                              }
                                            } else {
                                              validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/version", schemaPath: "#/$defs/SkillPackage/properties/version/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                              return false;
                                            }
                                          }
                                          var valid14 = _errs68 === errors;
                                        } else {
                                          var valid14 = true;
                                        }
                                        if (valid14) {
                                          if (data27.description !== void 0) {
                                            let data30 = data27.description;
                                            const _errs70 = errors;
                                            if (errors === _errs70) {
                                              if (typeof data30 === "string") {
                                                if (func2(data30) > 500) {
                                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/description", schemaPath: "#/$defs/SkillPackage/properties/description/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" }];
                                                  return false;
                                                } else {
                                                  if (func2(data30) < 1) {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/description", schemaPath: "#/$defs/SkillPackage/properties/description/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                    return false;
                                                  }
                                                }
                                              } else {
                                                validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/description", schemaPath: "#/$defs/SkillPackage/properties/description/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                            }
                                            var valid14 = _errs70 === errors;
                                          } else {
                                            var valid14 = true;
                                          }
                                          if (valid14) {
                                            if (data27.instructions !== void 0) {
                                              let data31 = data27.instructions;
                                              const _errs72 = errors;
                                              if (errors === _errs72) {
                                                if (typeof data31 === "string") {
                                                  if (func2(data31) > 8e3) {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/instructions", schemaPath: "#/$defs/SkillPackage/properties/instructions/maxLength", keyword: "maxLength", params: { limit: 8e3 }, message: "must NOT have more than 8000 characters" }];
                                                    return false;
                                                  }
                                                } else {
                                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/instructions", schemaPath: "#/$defs/SkillPackage/properties/instructions/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                              }
                                              var valid14 = _errs72 === errors;
                                            } else {
                                              var valid14 = true;
                                            }
                                            if (valid14) {
                                              if (data27.required_tools !== void 0) {
                                                let data32 = data27.required_tools;
                                                const _errs74 = errors;
                                                if (errors === _errs74) {
                                                  if (Array.isArray(data32)) {
                                                    if (data32.length > 3) {
                                                      validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_tools", schemaPath: "#/$defs/SkillPackage/properties/required_tools/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                                      return false;
                                                    } else {
                                                      var valid15 = true;
                                                      const len6 = data32.length;
                                                      for (let i6 = 0; i6 < len6; i6++) {
                                                        let data33 = data32[i6];
                                                        const _errs76 = errors;
                                                        if (typeof data33 !== "string") {
                                                          validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_tools/" + i6, schemaPath: "#/$defs/SkillPackage/properties/required_tools/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                        if (!(data33 === "workspace.write" || data33 === "terminal.execute" || data33 === "knowledge.search")) {
                                                          validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_tools/" + i6, schemaPath: "#/$defs/SkillPackage/properties/required_tools/items/enum", keyword: "enum", params: { allowedValues: schema17.properties.required_tools.items.enum }, message: "must be equal to one of the allowed values" }];
                                                          return false;
                                                        }
                                                        var valid15 = _errs76 === errors;
                                                        if (!valid15) {
                                                          break;
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_tools", schemaPath: "#/$defs/SkillPackage/properties/required_tools/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                    return false;
                                                  }
                                                }
                                                var valid14 = _errs74 === errors;
                                              } else {
                                                var valid14 = true;
                                              }
                                              if (valid14) {
                                                if (data27.required_permissions !== void 0) {
                                                  let data34 = data27.required_permissions;
                                                  const _errs78 = errors;
                                                  if (errors === _errs78) {
                                                    if (Array.isArray(data34)) {
                                                      if (data34.length > 3) {
                                                        validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_permissions", schemaPath: "#/$defs/SkillPackage/properties/required_permissions/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                                        return false;
                                                      } else {
                                                        var valid16 = true;
                                                        const len7 = data34.length;
                                                        for (let i7 = 0; i7 < len7; i7++) {
                                                          let data35 = data34[i7];
                                                          const _errs80 = errors;
                                                          if (typeof data35 !== "string") {
                                                            validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_permissions/" + i7, schemaPath: "#/$defs/SkillPackage/properties/required_permissions/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                          if (!(data35 === "workspace.read" || data35 === "workspace.write" || data35 === "terminal.execute")) {
                                                            validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_permissions/" + i7, schemaPath: "#/$defs/SkillPackage/properties/required_permissions/items/enum", keyword: "enum", params: { allowedValues: schema17.properties.required_permissions.items.enum }, message: "must be equal to one of the allowed values" }];
                                                            return false;
                                                          }
                                                          var valid16 = _errs80 === errors;
                                                          if (!valid16) {
                                                            break;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/required_permissions", schemaPath: "#/$defs/SkillPackage/properties/required_permissions/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid14 = _errs78 === errors;
                                                } else {
                                                  var valid14 = true;
                                                }
                                                if (valid14) {
                                                  if (data27.provider_hint !== void 0) {
                                                    let data36 = data27.provider_hint;
                                                    const _errs82 = errors;
                                                    const _errs83 = errors;
                                                    let valid17 = false;
                                                    const _errs84 = errors;
                                                    if (typeof data36 !== "string") {
                                                      const err0 = { instancePath: instancePath + "/skills/" + i5 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err0];
                                                      } else {
                                                        vErrors.push(err0);
                                                      }
                                                      errors++;
                                                    }
                                                    if (!(data36 === "ollama" || data36 === "lmstudio" || data36 === "anthropic" || data36 === "gemini" || data36 === "openai")) {
                                                      const err1 = { instancePath: instancePath + "/skills/" + i5 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf/0/enum", keyword: "enum", params: { allowedValues: schema17.properties.provider_hint.anyOf[0].enum }, message: "must be equal to one of the allowed values" };
                                                      if (vErrors === null) {
                                                        vErrors = [err1];
                                                      } else {
                                                        vErrors.push(err1);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid0 = _errs84 === errors;
                                                    valid17 = valid17 || _valid0;
                                                    if (!valid17) {
                                                      const _errs86 = errors;
                                                      if (data36 !== null) {
                                                        const err2 = { instancePath: instancePath + "/skills/" + i5 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err2];
                                                        } else {
                                                          vErrors.push(err2);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid0 = _errs86 === errors;
                                                      valid17 = valid17 || _valid0;
                                                    }
                                                    if (!valid17) {
                                                      const err3 = { instancePath: instancePath + "/skills/" + i5 + "/provider_hint", schemaPath: "#/$defs/SkillPackage/properties/provider_hint/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                      if (vErrors === null) {
                                                        vErrors = [err3];
                                                      } else {
                                                        vErrors.push(err3);
                                                      }
                                                      errors++;
                                                      validate12.errors = vErrors;
                                                      return false;
                                                    } else {
                                                      errors = _errs83;
                                                      if (vErrors !== null) {
                                                        if (_errs83) {
                                                          vErrors.length = _errs83;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid14 = _errs82 === errors;
                                                  } else {
                                                    var valid14 = true;
                                                  }
                                                  if (valid14) {
                                                    if (data27.id !== void 0) {
                                                      const _errs88 = errors;
                                                      if (typeof data27.id !== "string") {
                                                        validate12.errors = [{ instancePath: instancePath + "/skills/" + i5 + "/id", schemaPath: "#/$defs/SkillPackage/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid14 = _errs88 === errors;
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
                                    }
                                  }
                                } else {
                                  validate12.errors = [{ instancePath: instancePath + "/skills/" + i5, schemaPath: "#/$defs/SkillPackage/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                  return false;
                                }
                              }
                              var valid12 = _errs62 === errors;
                              if (!valid12) {
                                break;
                              }
                            }
                          } else {
                            validate12.errors = [{ instancePath: instancePath + "/skills", schemaPath: "#/properties/skills/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs60 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.workflows !== void 0) {
                          let data38 = data.workflows;
                          const _errs90 = errors;
                          if (errors === _errs90) {
                            if (Array.isArray(data38)) {
                              var valid18 = true;
                              const len8 = data38.length;
                              for (let i8 = 0; i8 < len8; i8++) {
                                const _errs92 = errors;
                                if (!validate13(data38[i8], { instancePath: instancePath + "/workflows/" + i8, parentData: data38, parentDataProperty: i8, rootData })) {
                                  vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
                                  errors = vErrors.length;
                                }
                                var valid18 = _errs92 === errors;
                                if (!valid18) {
                                  break;
                                }
                              }
                            } else {
                              validate12.errors = [{ instancePath: instancePath + "/workflows", schemaPath: "#/properties/workflows/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                              return false;
                            }
                          }
                          var valid0 = _errs90 === errors;
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
var schema30 = { "additionalProperties": false, "properties": { "run_id": { "title": "Run Id", "type": "string" }, "objective": { "title": "Objective", "type": "string" }, "agent_ids": { "items": { "type": "string" }, "title": "Agent Ids", "type": "array" }, "rounds": { "title": "Rounds", "type": "integer" }, "routing_mode": { "enum": ["manual", "auto"], "title": "Routing Mode", "type": "string" }, "route_reason": { "title": "Route Reason", "type": "string" }, "max_model_calls": { "title": "Max Model Calls", "type": "integer" }, "max_output_tokens": { "title": "Max Output Tokens", "type": "integer" }, "used_model_calls": { "title": "Used Model Calls", "type": "integer" }, "max_cost_microusd": { "title": "Max Cost Microusd", "type": "integer" }, "estimated_max_cost_microusd": { "title": "Estimated Max Cost Microusd", "type": "integer" }, "actual_cost_microusd": { "title": "Actual Cost Microusd", "type": "integer" }, "input_tokens": { "title": "Input Tokens", "type": "integer" }, "output_tokens": { "title": "Output Tokens", "type": "integer" }, "price_catalog_version": { "title": "Price Catalog Version", "type": "string" }, "workspace_id": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Workspace Id" }, "context_paths": { "items": { "type": "string" }, "title": "Context Paths", "type": "array" }, "enabled_tools": { "items": { "enum": ["workspace.write", "terminal.execute"], "type": "string" }, "title": "Enabled Tools", "type": "array" }, "knowledge_collection_ids": { "items": { "type": "string" }, "title": "Knowledge Collection Ids", "type": "array" }, "workflow_id": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Workflow Id" }, "workflow_version": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Workflow Version" }, "attempt": { "title": "Attempt", "type": "integer" }, "parent_run_id": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Parent Run Id" }, "resumed_from_node": { "title": "Resumed From Node", "type": "string" }, "failed_node": { "title": "Failed Node", "type": "string" }, "error_class": { "enum": ["", "retryable", "permanent", "uncertain_tool"], "title": "Error Class", "type": "string" }, "cumulative_model_calls": { "title": "Cumulative Model Calls", "type": "integer" }, "cumulative_cost_microusd": { "title": "Cumulative Cost Microusd", "type": "integer" }, "tool_action": { "anyOf": [{ "$ref": "#/$defs/ToolAction" }, { "type": "null" }] }, "status": { "enum": ["running", "waiting_approval", "completed", "cancelled", "failed", "interrupted"], "title": "Status", "type": "string" }, "error": { "title": "Error", "type": "string" }, "messages": { "items": { "$ref": "#/$defs/OrchestrationMessage" }, "title": "Messages", "type": "array" } }, "required": ["run_id", "objective", "agent_ids", "rounds", "routing_mode", "route_reason", "max_model_calls", "max_output_tokens", "used_model_calls", "max_cost_microusd", "estimated_max_cost_microusd", "actual_cost_microusd", "input_tokens", "output_tokens", "price_catalog_version", "workspace_id", "context_paths", "enabled_tools", "knowledge_collection_ids", "workflow_id", "workflow_version", "attempt", "parent_run_id", "resumed_from_node", "failed_node", "error_class", "cumulative_model_calls", "cumulative_cost_microusd", "tool_action", "status", "error", "messages"], "title": "OrchestrationRun", "type": "object" };
var schema31 = { "additionalProperties": false, "properties": { "tool": { "enum": ["workspace.write", "terminal.execute", "knowledge.search"], "title": "Tool", "type": "string" }, "path": { "default": "", "title": "Path", "type": "string" }, "command": { "items": { "type": "string" }, "title": "Command", "type": "array" }, "collection_id": { "default": "", "title": "Collection Id", "type": "string" }, "query": { "default": "", "title": "Query", "type": "string" }, "limit": { "default": 5, "maximum": 10, "minimum": 1, "title": "Limit", "type": "integer" }, "preview": { "default": "", "title": "Preview", "type": "string" }, "risk": { "enum": ["medium", "high"], "title": "Risk", "type": "string" }, "status": { "enum": ["waiting", "approved", "executing", "uncertain", "rejected", "completed", "failed"], "title": "Status", "type": "string" }, "args_hash": { "default": "", "title": "Args Hash", "type": "string" }, "content_hash": { "default": "", "title": "Content Hash", "type": "string" }, "result": { "default": "", "title": "Result", "type": "string" } }, "required": ["tool", "path", "command", "collection_id", "query", "limit", "preview", "risk", "status", "args_hash", "content_hash", "result"], "title": "ToolAction", "type": "object" };
var schema32 = { "additionalProperties": false, "properties": { "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "content": { "title": "Content", "type": "string" } }, "required": ["sequence", "agent_id", "phase", "content"], "title": "OrchestrationMessage", "type": "object" };
function validate23(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.run_id === void 0 && (missing0 = "run_id") || data.objective === void 0 && (missing0 = "objective") || data.agent_ids === void 0 && (missing0 = "agent_ids") || data.rounds === void 0 && (missing0 = "rounds") || data.routing_mode === void 0 && (missing0 = "routing_mode") || data.route_reason === void 0 && (missing0 = "route_reason") || data.max_model_calls === void 0 && (missing0 = "max_model_calls") || data.max_output_tokens === void 0 && (missing0 = "max_output_tokens") || data.used_model_calls === void 0 && (missing0 = "used_model_calls") || data.max_cost_microusd === void 0 && (missing0 = "max_cost_microusd") || data.estimated_max_cost_microusd === void 0 && (missing0 = "estimated_max_cost_microusd") || data.actual_cost_microusd === void 0 && (missing0 = "actual_cost_microusd") || data.input_tokens === void 0 && (missing0 = "input_tokens") || data.output_tokens === void 0 && (missing0 = "output_tokens") || data.price_catalog_version === void 0 && (missing0 = "price_catalog_version") || data.workspace_id === void 0 && (missing0 = "workspace_id") || data.context_paths === void 0 && (missing0 = "context_paths") || data.enabled_tools === void 0 && (missing0 = "enabled_tools") || data.knowledge_collection_ids === void 0 && (missing0 = "knowledge_collection_ids") || data.workflow_id === void 0 && (missing0 = "workflow_id") || data.workflow_version === void 0 && (missing0 = "workflow_version") || data.attempt === void 0 && (missing0 = "attempt") || data.parent_run_id === void 0 && (missing0 = "parent_run_id") || data.resumed_from_node === void 0 && (missing0 = "resumed_from_node") || data.failed_node === void 0 && (missing0 = "failed_node") || data.error_class === void 0 && (missing0 = "error_class") || data.cumulative_model_calls === void 0 && (missing0 = "cumulative_model_calls") || data.cumulative_cost_microusd === void 0 && (missing0 = "cumulative_cost_microusd") || data.tool_action === void 0 && (missing0 = "tool_action") || data.status === void 0 && (missing0 = "status") || data.error === void 0 && (missing0 = "error") || data.messages === void 0 && (missing0 = "messages")) {
        validate23.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!func24.call(schema30.properties, key0)) {
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
                                        if (data.workspace_id !== void 0) {
                                          let data16 = data.workspace_id;
                                          const _errs34 = errors;
                                          const _errs35 = errors;
                                          let valid2 = false;
                                          const _errs36 = errors;
                                          if (typeof data16 !== "string") {
                                            const err0 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/properties/workspace_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err0];
                                            } else {
                                              vErrors.push(err0);
                                            }
                                            errors++;
                                          }
                                          var _valid0 = _errs36 === errors;
                                          valid2 = valid2 || _valid0;
                                          if (!valid2) {
                                            const _errs38 = errors;
                                            if (data16 !== null) {
                                              const err1 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/properties/workspace_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                              if (vErrors === null) {
                                                vErrors = [err1];
                                              } else {
                                                vErrors.push(err1);
                                              }
                                              errors++;
                                            }
                                            var _valid0 = _errs38 === errors;
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
                                            errors = _errs35;
                                            if (vErrors !== null) {
                                              if (_errs35) {
                                                vErrors.length = _errs35;
                                              } else {
                                                vErrors = null;
                                              }
                                            }
                                          }
                                          var valid0 = _errs34 === errors;
                                        } else {
                                          var valid0 = true;
                                        }
                                        if (valid0) {
                                          if (data.context_paths !== void 0) {
                                            let data17 = data.context_paths;
                                            const _errs40 = errors;
                                            if (errors === _errs40) {
                                              if (Array.isArray(data17)) {
                                                var valid3 = true;
                                                const len1 = data17.length;
                                                for (let i1 = 0; i1 < len1; i1++) {
                                                  const _errs42 = errors;
                                                  if (typeof data17[i1] !== "string") {
                                                    validate23.errors = [{ instancePath: instancePath + "/context_paths/" + i1, schemaPath: "#/properties/context_paths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                  var valid3 = _errs42 === errors;
                                                  if (!valid3) {
                                                    break;
                                                  }
                                                }
                                              } else {
                                                validate23.errors = [{ instancePath: instancePath + "/context_paths", schemaPath: "#/properties/context_paths/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                return false;
                                              }
                                            }
                                            var valid0 = _errs40 === errors;
                                          } else {
                                            var valid0 = true;
                                          }
                                          if (valid0) {
                                            if (data.enabled_tools !== void 0) {
                                              let data19 = data.enabled_tools;
                                              const _errs44 = errors;
                                              if (errors === _errs44) {
                                                if (Array.isArray(data19)) {
                                                  var valid4 = true;
                                                  const len2 = data19.length;
                                                  for (let i2 = 0; i2 < len2; i2++) {
                                                    let data20 = data19[i2];
                                                    const _errs46 = errors;
                                                    if (typeof data20 !== "string") {
                                                      validate23.errors = [{ instancePath: instancePath + "/enabled_tools/" + i2, schemaPath: "#/properties/enabled_tools/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                    if (!(data20 === "workspace.write" || data20 === "terminal.execute")) {
                                                      validate23.errors = [{ instancePath: instancePath + "/enabled_tools/" + i2, schemaPath: "#/properties/enabled_tools/items/enum", keyword: "enum", params: { allowedValues: schema30.properties.enabled_tools.items.enum }, message: "must be equal to one of the allowed values" }];
                                                      return false;
                                                    }
                                                    var valid4 = _errs46 === errors;
                                                    if (!valid4) {
                                                      break;
                                                    }
                                                  }
                                                } else {
                                                  validate23.errors = [{ instancePath: instancePath + "/enabled_tools", schemaPath: "#/properties/enabled_tools/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                  return false;
                                                }
                                              }
                                              var valid0 = _errs44 === errors;
                                            } else {
                                              var valid0 = true;
                                            }
                                            if (valid0) {
                                              if (data.knowledge_collection_ids !== void 0) {
                                                let data21 = data.knowledge_collection_ids;
                                                const _errs48 = errors;
                                                if (errors === _errs48) {
                                                  if (Array.isArray(data21)) {
                                                    var valid5 = true;
                                                    const len3 = data21.length;
                                                    for (let i3 = 0; i3 < len3; i3++) {
                                                      const _errs50 = errors;
                                                      if (typeof data21[i3] !== "string") {
                                                        validate23.errors = [{ instancePath: instancePath + "/knowledge_collection_ids/" + i3, schemaPath: "#/properties/knowledge_collection_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                      var valid5 = _errs50 === errors;
                                                      if (!valid5) {
                                                        break;
                                                      }
                                                    }
                                                  } else {
                                                    validate23.errors = [{ instancePath: instancePath + "/knowledge_collection_ids", schemaPath: "#/properties/knowledge_collection_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                    return false;
                                                  }
                                                }
                                                var valid0 = _errs48 === errors;
                                              } else {
                                                var valid0 = true;
                                              }
                                              if (valid0) {
                                                if (data.workflow_id !== void 0) {
                                                  let data23 = data.workflow_id;
                                                  const _errs52 = errors;
                                                  const _errs53 = errors;
                                                  let valid6 = false;
                                                  const _errs54 = errors;
                                                  if (typeof data23 !== "string") {
                                                    const err3 = { instancePath: instancePath + "/workflow_id", schemaPath: "#/properties/workflow_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err3];
                                                    } else {
                                                      vErrors.push(err3);
                                                    }
                                                    errors++;
                                                  }
                                                  var _valid1 = _errs54 === errors;
                                                  valid6 = valid6 || _valid1;
                                                  if (!valid6) {
                                                    const _errs56 = errors;
                                                    if (data23 !== null) {
                                                      const err4 = { instancePath: instancePath + "/workflow_id", schemaPath: "#/properties/workflow_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                      if (vErrors === null) {
                                                        vErrors = [err4];
                                                      } else {
                                                        vErrors.push(err4);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid1 = _errs56 === errors;
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
                                                    errors = _errs53;
                                                    if (vErrors !== null) {
                                                      if (_errs53) {
                                                        vErrors.length = _errs53;
                                                      } else {
                                                        vErrors = null;
                                                      }
                                                    }
                                                  }
                                                  var valid0 = _errs52 === errors;
                                                } else {
                                                  var valid0 = true;
                                                }
                                                if (valid0) {
                                                  if (data.workflow_version !== void 0) {
                                                    let data24 = data.workflow_version;
                                                    const _errs58 = errors;
                                                    const _errs59 = errors;
                                                    let valid7 = false;
                                                    const _errs60 = errors;
                                                    if (typeof data24 !== "string") {
                                                      const err6 = { instancePath: instancePath + "/workflow_version", schemaPath: "#/properties/workflow_version/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err6];
                                                      } else {
                                                        vErrors.push(err6);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid2 = _errs60 === errors;
                                                    valid7 = valid7 || _valid2;
                                                    if (!valid7) {
                                                      const _errs62 = errors;
                                                      if (data24 !== null) {
                                                        const err7 = { instancePath: instancePath + "/workflow_version", schemaPath: "#/properties/workflow_version/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err7];
                                                        } else {
                                                          vErrors.push(err7);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid2 = _errs62 === errors;
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
                                                      errors = _errs59;
                                                      if (vErrors !== null) {
                                                        if (_errs59) {
                                                          vErrors.length = _errs59;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid0 = _errs58 === errors;
                                                  } else {
                                                    var valid0 = true;
                                                  }
                                                  if (valid0) {
                                                    if (data.attempt !== void 0) {
                                                      let data25 = data.attempt;
                                                      const _errs64 = errors;
                                                      if (!(typeof data25 == "number" && (!(data25 % 1) && !isNaN(data25)))) {
                                                        validate23.errors = [{ instancePath: instancePath + "/attempt", schemaPath: "#/properties/attempt/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                        return false;
                                                      }
                                                      var valid0 = _errs64 === errors;
                                                    } else {
                                                      var valid0 = true;
                                                    }
                                                    if (valid0) {
                                                      if (data.parent_run_id !== void 0) {
                                                        let data26 = data.parent_run_id;
                                                        const _errs66 = errors;
                                                        const _errs67 = errors;
                                                        let valid8 = false;
                                                        const _errs68 = errors;
                                                        if (typeof data26 !== "string") {
                                                          const err9 = { instancePath: instancePath + "/parent_run_id", schemaPath: "#/properties/parent_run_id/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err9];
                                                          } else {
                                                            vErrors.push(err9);
                                                          }
                                                          errors++;
                                                        }
                                                        var _valid3 = _errs68 === errors;
                                                        valid8 = valid8 || _valid3;
                                                        if (!valid8) {
                                                          const _errs70 = errors;
                                                          if (data26 !== null) {
                                                            const err10 = { instancePath: instancePath + "/parent_run_id", schemaPath: "#/properties/parent_run_id/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                            if (vErrors === null) {
                                                              vErrors = [err10];
                                                            } else {
                                                              vErrors.push(err10);
                                                            }
                                                            errors++;
                                                          }
                                                          var _valid3 = _errs70 === errors;
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
                                                          errors = _errs67;
                                                          if (vErrors !== null) {
                                                            if (_errs67) {
                                                              vErrors.length = _errs67;
                                                            } else {
                                                              vErrors = null;
                                                            }
                                                          }
                                                        }
                                                        var valid0 = _errs66 === errors;
                                                      } else {
                                                        var valid0 = true;
                                                      }
                                                      if (valid0) {
                                                        if (data.resumed_from_node !== void 0) {
                                                          const _errs72 = errors;
                                                          if (typeof data.resumed_from_node !== "string") {
                                                            validate23.errors = [{ instancePath: instancePath + "/resumed_from_node", schemaPath: "#/properties/resumed_from_node/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                          var valid0 = _errs72 === errors;
                                                        } else {
                                                          var valid0 = true;
                                                        }
                                                        if (valid0) {
                                                          if (data.failed_node !== void 0) {
                                                            const _errs74 = errors;
                                                            if (typeof data.failed_node !== "string") {
                                                              validate23.errors = [{ instancePath: instancePath + "/failed_node", schemaPath: "#/properties/failed_node/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                              return false;
                                                            }
                                                            var valid0 = _errs74 === errors;
                                                          } else {
                                                            var valid0 = true;
                                                          }
                                                          if (valid0) {
                                                            if (data.error_class !== void 0) {
                                                              let data29 = data.error_class;
                                                              const _errs76 = errors;
                                                              if (typeof data29 !== "string") {
                                                                validate23.errors = [{ instancePath: instancePath + "/error_class", schemaPath: "#/properties/error_class/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                return false;
                                                              }
                                                              if (!(data29 === "" || data29 === "retryable" || data29 === "permanent" || data29 === "uncertain_tool")) {
                                                                validate23.errors = [{ instancePath: instancePath + "/error_class", schemaPath: "#/properties/error_class/enum", keyword: "enum", params: { allowedValues: schema30.properties.error_class.enum }, message: "must be equal to one of the allowed values" }];
                                                                return false;
                                                              }
                                                              var valid0 = _errs76 === errors;
                                                            } else {
                                                              var valid0 = true;
                                                            }
                                                            if (valid0) {
                                                              if (data.cumulative_model_calls !== void 0) {
                                                                let data30 = data.cumulative_model_calls;
                                                                const _errs78 = errors;
                                                                if (!(typeof data30 == "number" && (!(data30 % 1) && !isNaN(data30)))) {
                                                                  validate23.errors = [{ instancePath: instancePath + "/cumulative_model_calls", schemaPath: "#/properties/cumulative_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                  return false;
                                                                }
                                                                var valid0 = _errs78 === errors;
                                                              } else {
                                                                var valid0 = true;
                                                              }
                                                              if (valid0) {
                                                                if (data.cumulative_cost_microusd !== void 0) {
                                                                  let data31 = data.cumulative_cost_microusd;
                                                                  const _errs80 = errors;
                                                                  if (!(typeof data31 == "number" && (!(data31 % 1) && !isNaN(data31)))) {
                                                                    validate23.errors = [{ instancePath: instancePath + "/cumulative_cost_microusd", schemaPath: "#/properties/cumulative_cost_microusd/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                    return false;
                                                                  }
                                                                  var valid0 = _errs80 === errors;
                                                                } else {
                                                                  var valid0 = true;
                                                                }
                                                                if (valid0) {
                                                                  if (data.tool_action !== void 0) {
                                                                    let data32 = data.tool_action;
                                                                    const _errs82 = errors;
                                                                    const _errs83 = errors;
                                                                    let valid9 = false;
                                                                    const _errs84 = errors;
                                                                    const _errs85 = errors;
                                                                    if (errors === _errs85) {
                                                                      if (data32 && typeof data32 == "object" && !Array.isArray(data32)) {
                                                                        let missing1;
                                                                        if (data32.tool === void 0 && (missing1 = "tool") || data32.path === void 0 && (missing1 = "path") || data32.command === void 0 && (missing1 = "command") || data32.collection_id === void 0 && (missing1 = "collection_id") || data32.query === void 0 && (missing1 = "query") || data32.limit === void 0 && (missing1 = "limit") || data32.preview === void 0 && (missing1 = "preview") || data32.risk === void 0 && (missing1 = "risk") || data32.status === void 0 && (missing1 = "status") || data32.args_hash === void 0 && (missing1 = "args_hash") || data32.content_hash === void 0 && (missing1 = "content_hash") || data32.result === void 0 && (missing1 = "result")) {
                                                                          const err12 = { instancePath: instancePath + "/tool_action", schemaPath: "#/$defs/ToolAction/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err12];
                                                                          } else {
                                                                            vErrors.push(err12);
                                                                          }
                                                                          errors++;
                                                                        } else {
                                                                          const _errs87 = errors;
                                                                          for (const key1 in data32) {
                                                                            if (!func24.call(schema31.properties, key1)) {
                                                                              const err13 = { instancePath: instancePath + "/tool_action", schemaPath: "#/$defs/ToolAction/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err13];
                                                                              } else {
                                                                                vErrors.push(err13);
                                                                              }
                                                                              errors++;
                                                                              break;
                                                                            }
                                                                          }
                                                                          if (_errs87 === errors) {
                                                                            if (data32.tool !== void 0) {
                                                                              let data33 = data32.tool;
                                                                              const _errs88 = errors;
                                                                              if (typeof data33 !== "string") {
                                                                                const err14 = { instancePath: instancePath + "/tool_action/tool", schemaPath: "#/$defs/ToolAction/properties/tool/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err14];
                                                                                } else {
                                                                                  vErrors.push(err14);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                              if (!(data33 === "workspace.write" || data33 === "terminal.execute" || data33 === "knowledge.search")) {
                                                                                const err15 = { instancePath: instancePath + "/tool_action/tool", schemaPath: "#/$defs/ToolAction/properties/tool/enum", keyword: "enum", params: { allowedValues: schema31.properties.tool.enum }, message: "must be equal to one of the allowed values" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err15];
                                                                                } else {
                                                                                  vErrors.push(err15);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                              var valid11 = _errs88 === errors;
                                                                            } else {
                                                                              var valid11 = true;
                                                                            }
                                                                            if (valid11) {
                                                                              if (data32.path !== void 0) {
                                                                                const _errs90 = errors;
                                                                                if (typeof data32.path !== "string") {
                                                                                  const err16 = { instancePath: instancePath + "/tool_action/path", schemaPath: "#/$defs/ToolAction/properties/path/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err16];
                                                                                  } else {
                                                                                    vErrors.push(err16);
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                                var valid11 = _errs90 === errors;
                                                                              } else {
                                                                                var valid11 = true;
                                                                              }
                                                                              if (valid11) {
                                                                                if (data32.command !== void 0) {
                                                                                  let data35 = data32.command;
                                                                                  const _errs92 = errors;
                                                                                  if (errors === _errs92) {
                                                                                    if (Array.isArray(data35)) {
                                                                                      var valid12 = true;
                                                                                      const len4 = data35.length;
                                                                                      for (let i4 = 0; i4 < len4; i4++) {
                                                                                        const _errs94 = errors;
                                                                                        if (typeof data35[i4] !== "string") {
                                                                                          const err17 = { instancePath: instancePath + "/tool_action/command/" + i4, schemaPath: "#/$defs/ToolAction/properties/command/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err17];
                                                                                          } else {
                                                                                            vErrors.push(err17);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                        var valid12 = _errs94 === errors;
                                                                                        if (!valid12) {
                                                                                          break;
                                                                                        }
                                                                                      }
                                                                                    } else {
                                                                                      const err18 = { instancePath: instancePath + "/tool_action/command", schemaPath: "#/$defs/ToolAction/properties/command/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err18];
                                                                                      } else {
                                                                                        vErrors.push(err18);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                  }
                                                                                  var valid11 = _errs92 === errors;
                                                                                } else {
                                                                                  var valid11 = true;
                                                                                }
                                                                                if (valid11) {
                                                                                  if (data32.collection_id !== void 0) {
                                                                                    const _errs96 = errors;
                                                                                    if (typeof data32.collection_id !== "string") {
                                                                                      const err19 = { instancePath: instancePath + "/tool_action/collection_id", schemaPath: "#/$defs/ToolAction/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err19];
                                                                                      } else {
                                                                                        vErrors.push(err19);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                    var valid11 = _errs96 === errors;
                                                                                  } else {
                                                                                    var valid11 = true;
                                                                                  }
                                                                                  if (valid11) {
                                                                                    if (data32.query !== void 0) {
                                                                                      const _errs98 = errors;
                                                                                      if (typeof data32.query !== "string") {
                                                                                        const err20 = { instancePath: instancePath + "/tool_action/query", schemaPath: "#/$defs/ToolAction/properties/query/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err20];
                                                                                        } else {
                                                                                          vErrors.push(err20);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                      var valid11 = _errs98 === errors;
                                                                                    } else {
                                                                                      var valid11 = true;
                                                                                    }
                                                                                    if (valid11) {
                                                                                      if (data32.limit !== void 0) {
                                                                                        let data39 = data32.limit;
                                                                                        const _errs100 = errors;
                                                                                        if (!(typeof data39 == "number" && (!(data39 % 1) && !isNaN(data39)))) {
                                                                                          const err21 = { instancePath: instancePath + "/tool_action/limit", schemaPath: "#/$defs/ToolAction/properties/limit/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err21];
                                                                                          } else {
                                                                                            vErrors.push(err21);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                        if (errors === _errs100) {
                                                                                          if (typeof data39 == "number") {
                                                                                            if (data39 > 10 || isNaN(data39)) {
                                                                                              const err22 = { instancePath: instancePath + "/tool_action/limit", schemaPath: "#/$defs/ToolAction/properties/limit/maximum", keyword: "maximum", params: { comparison: "<=", limit: 10 }, message: "must be <= 10" };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err22];
                                                                                              } else {
                                                                                                vErrors.push(err22);
                                                                                              }
                                                                                              errors++;
                                                                                            } else {
                                                                                              if (data39 < 1 || isNaN(data39)) {
                                                                                                const err23 = { instancePath: instancePath + "/tool_action/limit", schemaPath: "#/$defs/ToolAction/properties/limit/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                                                                                                if (vErrors === null) {
                                                                                                  vErrors = [err23];
                                                                                                } else {
                                                                                                  vErrors.push(err23);
                                                                                                }
                                                                                                errors++;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                        var valid11 = _errs100 === errors;
                                                                                      } else {
                                                                                        var valid11 = true;
                                                                                      }
                                                                                      if (valid11) {
                                                                                        if (data32.preview !== void 0) {
                                                                                          const _errs102 = errors;
                                                                                          if (typeof data32.preview !== "string") {
                                                                                            const err24 = { instancePath: instancePath + "/tool_action/preview", schemaPath: "#/$defs/ToolAction/properties/preview/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err24];
                                                                                            } else {
                                                                                              vErrors.push(err24);
                                                                                            }
                                                                                            errors++;
                                                                                          }
                                                                                          var valid11 = _errs102 === errors;
                                                                                        } else {
                                                                                          var valid11 = true;
                                                                                        }
                                                                                        if (valid11) {
                                                                                          if (data32.risk !== void 0) {
                                                                                            let data41 = data32.risk;
                                                                                            const _errs104 = errors;
                                                                                            if (typeof data41 !== "string") {
                                                                                              const err25 = { instancePath: instancePath + "/tool_action/risk", schemaPath: "#/$defs/ToolAction/properties/risk/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err25];
                                                                                              } else {
                                                                                                vErrors.push(err25);
                                                                                              }
                                                                                              errors++;
                                                                                            }
                                                                                            if (!(data41 === "medium" || data41 === "high")) {
                                                                                              const err26 = { instancePath: instancePath + "/tool_action/risk", schemaPath: "#/$defs/ToolAction/properties/risk/enum", keyword: "enum", params: { allowedValues: schema31.properties.risk.enum }, message: "must be equal to one of the allowed values" };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err26];
                                                                                              } else {
                                                                                                vErrors.push(err26);
                                                                                              }
                                                                                              errors++;
                                                                                            }
                                                                                            var valid11 = _errs104 === errors;
                                                                                          } else {
                                                                                            var valid11 = true;
                                                                                          }
                                                                                          if (valid11) {
                                                                                            if (data32.status !== void 0) {
                                                                                              let data42 = data32.status;
                                                                                              const _errs106 = errors;
                                                                                              if (typeof data42 !== "string") {
                                                                                                const err27 = { instancePath: instancePath + "/tool_action/status", schemaPath: "#/$defs/ToolAction/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                if (vErrors === null) {
                                                                                                  vErrors = [err27];
                                                                                                } else {
                                                                                                  vErrors.push(err27);
                                                                                                }
                                                                                                errors++;
                                                                                              }
                                                                                              if (!(data42 === "waiting" || data42 === "approved" || data42 === "executing" || data42 === "uncertain" || data42 === "rejected" || data42 === "completed" || data42 === "failed")) {
                                                                                                const err28 = { instancePath: instancePath + "/tool_action/status", schemaPath: "#/$defs/ToolAction/properties/status/enum", keyword: "enum", params: { allowedValues: schema31.properties.status.enum }, message: "must be equal to one of the allowed values" };
                                                                                                if (vErrors === null) {
                                                                                                  vErrors = [err28];
                                                                                                } else {
                                                                                                  vErrors.push(err28);
                                                                                                }
                                                                                                errors++;
                                                                                              }
                                                                                              var valid11 = _errs106 === errors;
                                                                                            } else {
                                                                                              var valid11 = true;
                                                                                            }
                                                                                            if (valid11) {
                                                                                              if (data32.args_hash !== void 0) {
                                                                                                const _errs108 = errors;
                                                                                                if (typeof data32.args_hash !== "string") {
                                                                                                  const err29 = { instancePath: instancePath + "/tool_action/args_hash", schemaPath: "#/$defs/ToolAction/properties/args_hash/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                  if (vErrors === null) {
                                                                                                    vErrors = [err29];
                                                                                                  } else {
                                                                                                    vErrors.push(err29);
                                                                                                  }
                                                                                                  errors++;
                                                                                                }
                                                                                                var valid11 = _errs108 === errors;
                                                                                              } else {
                                                                                                var valid11 = true;
                                                                                              }
                                                                                              if (valid11) {
                                                                                                if (data32.content_hash !== void 0) {
                                                                                                  const _errs110 = errors;
                                                                                                  if (typeof data32.content_hash !== "string") {
                                                                                                    const err30 = { instancePath: instancePath + "/tool_action/content_hash", schemaPath: "#/$defs/ToolAction/properties/content_hash/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                    if (vErrors === null) {
                                                                                                      vErrors = [err30];
                                                                                                    } else {
                                                                                                      vErrors.push(err30);
                                                                                                    }
                                                                                                    errors++;
                                                                                                  }
                                                                                                  var valid11 = _errs110 === errors;
                                                                                                } else {
                                                                                                  var valid11 = true;
                                                                                                }
                                                                                                if (valid11) {
                                                                                                  if (data32.result !== void 0) {
                                                                                                    const _errs112 = errors;
                                                                                                    if (typeof data32.result !== "string") {
                                                                                                      const err31 = { instancePath: instancePath + "/tool_action/result", schemaPath: "#/$defs/ToolAction/properties/result/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                                      if (vErrors === null) {
                                                                                                        vErrors = [err31];
                                                                                                      } else {
                                                                                                        vErrors.push(err31);
                                                                                                      }
                                                                                                      errors++;
                                                                                                    }
                                                                                                    var valid11 = _errs112 === errors;
                                                                                                  } else {
                                                                                                    var valid11 = true;
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
                                                                        const err32 = { instancePath: instancePath + "/tool_action", schemaPath: "#/$defs/ToolAction/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err32];
                                                                        } else {
                                                                          vErrors.push(err32);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                    }
                                                                    var _valid4 = _errs84 === errors;
                                                                    valid9 = valid9 || _valid4;
                                                                    if (!valid9) {
                                                                      const _errs114 = errors;
                                                                      if (data32 !== null) {
                                                                        const err33 = { instancePath: instancePath + "/tool_action", schemaPath: "#/properties/tool_action/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err33];
                                                                        } else {
                                                                          vErrors.push(err33);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                      var _valid4 = _errs114 === errors;
                                                                      valid9 = valid9 || _valid4;
                                                                    }
                                                                    if (!valid9) {
                                                                      const err34 = { instancePath: instancePath + "/tool_action", schemaPath: "#/properties/tool_action/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err34];
                                                                      } else {
                                                                        vErrors.push(err34);
                                                                      }
                                                                      errors++;
                                                                      validate23.errors = vErrors;
                                                                      return false;
                                                                    } else {
                                                                      errors = _errs83;
                                                                      if (vErrors !== null) {
                                                                        if (_errs83) {
                                                                          vErrors.length = _errs83;
                                                                        } else {
                                                                          vErrors = null;
                                                                        }
                                                                      }
                                                                    }
                                                                    var valid0 = _errs82 === errors;
                                                                  } else {
                                                                    var valid0 = true;
                                                                  }
                                                                  if (valid0) {
                                                                    if (data.status !== void 0) {
                                                                      let data46 = data.status;
                                                                      const _errs116 = errors;
                                                                      if (typeof data46 !== "string") {
                                                                        validate23.errors = [{ instancePath: instancePath + "/status", schemaPath: "#/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                        return false;
                                                                      }
                                                                      if (!(data46 === "running" || data46 === "waiting_approval" || data46 === "completed" || data46 === "cancelled" || data46 === "failed" || data46 === "interrupted")) {
                                                                        validate23.errors = [{ instancePath: instancePath + "/status", schemaPath: "#/properties/status/enum", keyword: "enum", params: { allowedValues: schema30.properties.status.enum }, message: "must be equal to one of the allowed values" }];
                                                                        return false;
                                                                      }
                                                                      var valid0 = _errs116 === errors;
                                                                    } else {
                                                                      var valid0 = true;
                                                                    }
                                                                    if (valid0) {
                                                                      if (data.error !== void 0) {
                                                                        const _errs118 = errors;
                                                                        if (typeof data.error !== "string") {
                                                                          validate23.errors = [{ instancePath: instancePath + "/error", schemaPath: "#/properties/error/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                          return false;
                                                                        }
                                                                        var valid0 = _errs118 === errors;
                                                                      } else {
                                                                        var valid0 = true;
                                                                      }
                                                                      if (valid0) {
                                                                        if (data.messages !== void 0) {
                                                                          let data48 = data.messages;
                                                                          const _errs120 = errors;
                                                                          if (errors === _errs120) {
                                                                            if (Array.isArray(data48)) {
                                                                              var valid13 = true;
                                                                              const len5 = data48.length;
                                                                              for (let i5 = 0; i5 < len5; i5++) {
                                                                                let data49 = data48[i5];
                                                                                const _errs122 = errors;
                                                                                const _errs123 = errors;
                                                                                if (errors === _errs123) {
                                                                                  if (data49 && typeof data49 == "object" && !Array.isArray(data49)) {
                                                                                    let missing2;
                                                                                    if (data49.sequence === void 0 && (missing2 = "sequence") || data49.agent_id === void 0 && (missing2 = "agent_id") || data49.phase === void 0 && (missing2 = "phase") || data49.content === void 0 && (missing2 = "content")) {
                                                                                      validate23.errors = [{ instancePath: instancePath + "/messages/" + i5, schemaPath: "#/$defs/OrchestrationMessage/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                                                                      return false;
                                                                                    } else {
                                                                                      const _errs125 = errors;
                                                                                      for (const key2 in data49) {
                                                                                        if (!(key2 === "sequence" || key2 === "agent_id" || key2 === "phase" || key2 === "content")) {
                                                                                          validate23.errors = [{ instancePath: instancePath + "/messages/" + i5, schemaPath: "#/$defs/OrchestrationMessage/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                                                                          return false;
                                                                                          break;
                                                                                        }
                                                                                      }
                                                                                      if (_errs125 === errors) {
                                                                                        if (data49.sequence !== void 0) {
                                                                                          let data50 = data49.sequence;
                                                                                          const _errs126 = errors;
                                                                                          if (!(typeof data50 == "number" && (!(data50 % 1) && !isNaN(data50)))) {
                                                                                            validate23.errors = [{ instancePath: instancePath + "/messages/" + i5 + "/sequence", schemaPath: "#/$defs/OrchestrationMessage/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                                                                            return false;
                                                                                          }
                                                                                          var valid15 = _errs126 === errors;
                                                                                        } else {
                                                                                          var valid15 = true;
                                                                                        }
                                                                                        if (valid15) {
                                                                                          if (data49.agent_id !== void 0) {
                                                                                            const _errs128 = errors;
                                                                                            if (typeof data49.agent_id !== "string") {
                                                                                              validate23.errors = [{ instancePath: instancePath + "/messages/" + i5 + "/agent_id", schemaPath: "#/$defs/OrchestrationMessage/properties/agent_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                              return false;
                                                                                            }
                                                                                            var valid15 = _errs128 === errors;
                                                                                          } else {
                                                                                            var valid15 = true;
                                                                                          }
                                                                                          if (valid15) {
                                                                                            if (data49.phase !== void 0) {
                                                                                              let data52 = data49.phase;
                                                                                              const _errs130 = errors;
                                                                                              if (typeof data52 !== "string") {
                                                                                                validate23.errors = [{ instancePath: instancePath + "/messages/" + i5 + "/phase", schemaPath: "#/$defs/OrchestrationMessage/properties/phase/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                return false;
                                                                                              }
                                                                                              if (!(data52 === "analysis" || data52 === "review" || data52 === "synthesis")) {
                                                                                                validate23.errors = [{ instancePath: instancePath + "/messages/" + i5 + "/phase", schemaPath: "#/$defs/OrchestrationMessage/properties/phase/enum", keyword: "enum", params: { allowedValues: schema32.properties.phase.enum }, message: "must be equal to one of the allowed values" }];
                                                                                                return false;
                                                                                              }
                                                                                              var valid15 = _errs130 === errors;
                                                                                            } else {
                                                                                              var valid15 = true;
                                                                                            }
                                                                                            if (valid15) {
                                                                                              if (data49.content !== void 0) {
                                                                                                const _errs132 = errors;
                                                                                                if (typeof data49.content !== "string") {
                                                                                                  validate23.errors = [{ instancePath: instancePath + "/messages/" + i5 + "/content", schemaPath: "#/$defs/OrchestrationMessage/properties/content/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                                                                  return false;
                                                                                                }
                                                                                                var valid15 = _errs132 === errors;
                                                                                              } else {
                                                                                                var valid15 = true;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    validate23.errors = [{ instancePath: instancePath + "/messages/" + i5, schemaPath: "#/$defs/OrchestrationMessage/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                                                                    return false;
                                                                                  }
                                                                                }
                                                                                var valid13 = _errs122 === errors;
                                                                                if (!valid13) {
                                                                                  break;
                                                                                }
                                                                              }
                                                                            } else {
                                                                              validate23.errors = [{ instancePath: instancePath + "/messages", schemaPath: "#/properties/messages/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                                                              return false;
                                                                            }
                                                                          }
                                                                          var valid0 = _errs120 === errors;
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
    } else {
      validate23.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate23.errors = vErrors;
  return errors === 0;
}
function validate22(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.runs === void 0 && (missing0 = "runs")) {
        validate22.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "runs")) {
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
var schema34 = { "additionalProperties": false, "properties": { "provider": { "enum": ["anthropic", "gemini"], "title": "Provider", "type": "string" }, "model_pattern": { "title": "Model Pattern", "type": "string" }, "input_per_million_usd": { "title": "Input Per Million Usd", "type": "number" }, "output_per_million_usd": { "title": "Output Per Million Usd", "type": "number" } }, "required": ["provider", "model_pattern", "input_per_million_usd", "output_per_million_usd"], "title": "PriceEntry", "type": "object" };
function validate26(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.version === void 0 && (missing0 = "version") || data.currency === void 0 && (missing0 = "currency") || data.sources === void 0 && (missing0 = "sources") || data.entries === void 0 && (missing0 = "entries")) {
        validate26.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "version" || key0 === "currency" || key0 === "sources" || key0 === "entries")) {
            validate26.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.version !== void 0) {
            const _errs2 = errors;
            if (typeof data.version !== "string") {
              validate26.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/properties/version/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                validate26.errors = [{ instancePath: instancePath + "/currency", schemaPath: "#/properties/currency/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
              if ("USD" !== data1) {
                validate26.errors = [{ instancePath: instancePath + "/currency", schemaPath: "#/properties/currency/const", keyword: "const", params: { allowedValue: "USD" }, message: "must be equal to constant" }];
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
                        validate26.errors = [{ instancePath: instancePath + "/sources/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/sources/additionalProperties/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                      var valid1 = _errs9 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  } else {
                    validate26.errors = [{ instancePath: instancePath + "/sources", schemaPath: "#/properties/sources/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
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
                              validate26.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/PriceEntry/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                              return false;
                            } else {
                              const _errs16 = errors;
                              for (const key2 in data5) {
                                if (!(key2 === "provider" || key2 === "model_pattern" || key2 === "input_per_million_usd" || key2 === "output_per_million_usd")) {
                                  validate26.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/PriceEntry/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                  return false;
                                  break;
                                }
                              }
                              if (_errs16 === errors) {
                                if (data5.provider !== void 0) {
                                  let data6 = data5.provider;
                                  const _errs17 = errors;
                                  if (typeof data6 !== "string") {
                                    validate26.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/provider", schemaPath: "#/$defs/PriceEntry/properties/provider/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                    return false;
                                  }
                                  if (!(data6 === "anthropic" || data6 === "gemini")) {
                                    validate26.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/provider", schemaPath: "#/$defs/PriceEntry/properties/provider/enum", keyword: "enum", params: { allowedValues: schema34.properties.provider.enum }, message: "must be equal to one of the allowed values" }];
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
                                      validate26.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/model_pattern", schemaPath: "#/$defs/PriceEntry/properties/model_pattern/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                        validate26.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/input_per_million_usd", schemaPath: "#/$defs/PriceEntry/properties/input_per_million_usd/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
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
                                          validate26.errors = [{ instancePath: instancePath + "/entries/" + i0 + "/output_per_million_usd", schemaPath: "#/$defs/PriceEntry/properties/output_per_million_usd/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
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
                            validate26.errors = [{ instancePath: instancePath + "/entries/" + i0, schemaPath: "#/$defs/PriceEntry/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                            return false;
                          }
                        }
                        var valid2 = _errs13 === errors;
                        if (!valid2) {
                          break;
                        }
                      }
                    } else {
                      validate26.errors = [{ instancePath: instancePath + "/entries", schemaPath: "#/properties/entries/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
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
      validate26.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate26.errors = vErrors;
  return errors === 0;
}
function validate28(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.collections === void 0 && (missing0 = "collections") || data.embedding_models === void 0 && (missing0 = "embedding_models") || data.embedding_error === void 0 && (missing0 = "embedding_error")) {
        validate28.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "collections" || key0 === "embedding_models" || key0 === "embedding_error")) {
            validate28.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
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
                        validate28.errors = [{ instancePath: instancePath + "/collections/" + i0, schemaPath: "#/$defs/KnowledgeCollection/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                        return false;
                      } else {
                        const _errs7 = errors;
                        for (const key1 in data1) {
                          if (!(key1 === "name" || key1 === "embedding_provider" || key1 === "embedding_model" || key1 === "id" || key1 === "dimensions" || key1 === "source_count" || key1 === "chunk_count")) {
                            validate28.errors = [{ instancePath: instancePath + "/collections/" + i0, schemaPath: "#/$defs/KnowledgeCollection/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
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
                                  validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/name", schemaPath: "#/$defs/KnowledgeCollection/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                  return false;
                                } else {
                                  if (func2(data2) < 1) {
                                    validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/name", schemaPath: "#/$defs/KnowledgeCollection/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                    return false;
                                  }
                                }
                              } else {
                                validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/name", schemaPath: "#/$defs/KnowledgeCollection/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_provider", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_provider/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                              if ("ollama" !== data3) {
                                validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_provider", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_provider/const", keyword: "const", params: { allowedValue: "ollama" }, message: "must be equal to constant" }];
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
                                      validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_model", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_model/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" }];
                                      return false;
                                    } else {
                                      if (func2(data4) < 1) {
                                        validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_model", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_model/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                        return false;
                                      }
                                    }
                                  } else {
                                    validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/embedding_model", schemaPath: "#/$defs/KnowledgeCollection/properties/embedding_model/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                    validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/id", schemaPath: "#/$defs/KnowledgeCollection/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                      validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/dimensions", schemaPath: "#/$defs/KnowledgeCollection/properties/dimensions/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
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
                                        validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/source_count", schemaPath: "#/$defs/KnowledgeCollection/properties/source_count/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
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
                                          validate28.errors = [{ instancePath: instancePath + "/collections/" + i0 + "/chunk_count", schemaPath: "#/$defs/KnowledgeCollection/properties/chunk_count/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
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
                      validate28.errors = [{ instancePath: instancePath + "/collections/" + i0, schemaPath: "#/$defs/KnowledgeCollection/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                      return false;
                    }
                  }
                  var valid1 = _errs4 === errors;
                  if (!valid1) {
                    break;
                  }
                }
              } else {
                validate28.errors = [{ instancePath: instancePath + "/collections", schemaPath: "#/properties/collections/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
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
                          validate28.errors = [{ instancePath: instancePath + "/embedding_models/" + i1, schemaPath: "#/$defs/EmbeddingModel/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                          return false;
                        } else {
                          const _errs27 = errors;
                          for (const key2 in data10) {
                            if (!(key2 === "name" || key2 === "size")) {
                              validate28.errors = [{ instancePath: instancePath + "/embedding_models/" + i1, schemaPath: "#/$defs/EmbeddingModel/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                              return false;
                              break;
                            }
                          }
                          if (_errs27 === errors) {
                            if (data10.name !== void 0) {
                              const _errs28 = errors;
                              if (typeof data10.name !== "string") {
                                validate28.errors = [{ instancePath: instancePath + "/embedding_models/" + i1 + "/name", schemaPath: "#/$defs/EmbeddingModel/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                  validate28.errors = [{ instancePath: instancePath + "/embedding_models/" + i1 + "/size", schemaPath: "#/$defs/EmbeddingModel/properties/size/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
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
                        validate28.errors = [{ instancePath: instancePath + "/embedding_models/" + i1, schemaPath: "#/$defs/EmbeddingModel/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                        return false;
                      }
                    }
                    var valid4 = _errs24 === errors;
                    if (!valid4) {
                      break;
                    }
                  }
                } else {
                  validate28.errors = [{ instancePath: instancePath + "/embedding_models", schemaPath: "#/properties/embedding_models/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
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
                  validate28.errors = [{ instancePath: instancePath + "/embedding_error", schemaPath: "#/properties/embedding_error/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
      validate28.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate28.errors = vErrors;
  return errors === 0;
}
var schema40 = { "additionalProperties": false, "properties": { "chunk_id": { "title": "Chunk Id", "type": "string" }, "collection_id": { "title": "Collection Id", "type": "string" }, "collection_name": { "title": "Collection Name", "type": "string" }, "workspace_id": { "title": "Workspace Id", "type": "string" }, "source_path": { "title": "Source Path", "type": "string" }, "ordinal": { "title": "Ordinal", "type": "integer" }, "start_line": { "title": "Start Line", "type": "integer" }, "end_line": { "title": "End Line", "type": "integer" }, "content": { "maxLength": 3200, "title": "Content", "type": "string" }, "rrf_score": { "minimum": 0, "title": "Rrf Score", "type": "number" }, "fts_rank": { "anyOf": [{ "minimum": 1, "type": "integer" }, { "type": "null" }], "default": null, "title": "Fts Rank" }, "vector_rank": { "anyOf": [{ "minimum": 1, "type": "integer" }, { "type": "null" }], "default": null, "title": "Vector Rank" }, "cosine_similarity": { "anyOf": [{ "maximum": 1, "minimum": -1, "type": "number" }, { "type": "null" }], "default": null, "title": "Cosine Similarity" } }, "required": ["chunk_id", "collection_id", "collection_name", "workspace_id", "source_path", "ordinal", "start_line", "end_line", "content", "rrf_score", "fts_rank", "vector_rank", "cosine_similarity"], "title": "KnowledgeSearchHit", "type": "object" };
function validate30(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.collection_id === void 0 && (missing0 = "collection_id") || data.query === void 0 && (missing0 = "query") || data.hits === void 0 && (missing0 = "hits")) {
        validate30.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "collection_id" || key0 === "query" || key0 === "hits")) {
            validate30.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.collection_id !== void 0) {
            const _errs2 = errors;
            if (typeof data.collection_id !== "string") {
              validate30.errors = [{ instancePath: instancePath + "/collection_id", schemaPath: "#/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                validate30.errors = [{ instancePath: instancePath + "/query", schemaPath: "#/properties/query/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                      validate30.errors = [{ instancePath: instancePath + "/hits", schemaPath: "#/properties/hits/maxItems", keyword: "maxItems", params: { limit: 10 }, message: "must NOT have more than 10 items" }];
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
                              validate30.errors = [{ instancePath: instancePath + "/hits/" + i0, schemaPath: "#/$defs/KnowledgeSearchHit/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                              return false;
                            } else {
                              const _errs11 = errors;
                              for (const key1 in data3) {
                                if (!func24.call(schema40.properties, key1)) {
                                  validate30.errors = [{ instancePath: instancePath + "/hits/" + i0, schemaPath: "#/$defs/KnowledgeSearchHit/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                  return false;
                                  break;
                                }
                              }
                              if (_errs11 === errors) {
                                if (data3.chunk_id !== void 0) {
                                  const _errs12 = errors;
                                  if (typeof data3.chunk_id !== "string") {
                                    validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/chunk_id", schemaPath: "#/$defs/KnowledgeSearchHit/properties/chunk_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                      validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/collection_id", schemaPath: "#/$defs/KnowledgeSearchHit/properties/collection_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                        validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/collection_name", schemaPath: "#/$defs/KnowledgeSearchHit/properties/collection_name/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                          validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/workspace_id", schemaPath: "#/$defs/KnowledgeSearchHit/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                            validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/source_path", schemaPath: "#/$defs/KnowledgeSearchHit/properties/source_path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                              validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/ordinal", schemaPath: "#/$defs/KnowledgeSearchHit/properties/ordinal/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
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
                                                validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/start_line", schemaPath: "#/$defs/KnowledgeSearchHit/properties/start_line/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
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
                                                  validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/end_line", schemaPath: "#/$defs/KnowledgeSearchHit/properties/end_line/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
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
                                                        validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/content", schemaPath: "#/$defs/KnowledgeSearchHit/properties/content/maxLength", keyword: "maxLength", params: { limit: 3200 }, message: "must NOT have more than 3200 characters" }];
                                                        return false;
                                                      }
                                                    } else {
                                                      validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/content", schemaPath: "#/$defs/KnowledgeSearchHit/properties/content/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
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
                                                          validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/rrf_score", schemaPath: "#/$defs/KnowledgeSearchHit/properties/rrf_score/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                                          return false;
                                                        }
                                                      } else {
                                                        validate30.errors = [{ instancePath: instancePath + "/hits/" + i0 + "/rrf_score", schemaPath: "#/$defs/KnowledgeSearchHit/properties/rrf_score/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
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
                                                        validate30.errors = vErrors;
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
                                                          validate30.errors = vErrors;
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
                                                            validate30.errors = vErrors;
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
                            validate30.errors = [{ instancePath: instancePath + "/hits/" + i0, schemaPath: "#/$defs/KnowledgeSearchHit/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
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
                    validate30.errors = [{ instancePath: instancePath + "/hits", schemaPath: "#/properties/hits/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
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
      validate30.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate30.errors = vErrors;
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
                                  if (!validate26(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                    vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
                                    errors = vErrors.length;
                                  }
                                  var _valid0 = _errs41 === errors;
                                  valid1 = valid1 || _valid0;
                                  if (!valid1) {
                                    const _errs42 = errors;
                                    if (!validate28(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                      vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
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
                                                        const err22 = { instancePath: instancePath + "/result/status", schemaPath: "#/$defs/KnowledgeIngestionResult/properties/status/enum", keyword: "enum", params: { allowedValues: schema38.properties.status.enum }, message: "must be equal to one of the allowed values" };
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
                                        if (!validate30(data3, { instancePath: instancePath + "/result", parentData: data, parentDataProperty: "result", rootData })) {
                                          vErrors = vErrors === null ? validate30.errors : vErrors.concat(validate30.errors);
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
                      const err8 = { instancePath: instancePath + "/code", schemaPath: "#/$defs/Failure/properties/code/enum", keyword: "enum", params: { allowedValues: schema41.properties.code.enum }, message: "must be equal to one of the allowed values" };
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
