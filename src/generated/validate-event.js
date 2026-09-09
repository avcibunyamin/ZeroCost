// validate-event.js
var validate = validate10;
var validate_event_default = validate10;
var schema13 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "stream_end", "default": "stream_end", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "full_content": { "title": "Full Content", "type": "string" }, "status": { "enum": ["completed", "cancelled"], "title": "Status", "type": "string" }, "is_final": { "const": true, "default": true, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "full_content", "status", "is_final"], "title": "StreamEnd", "type": "object" };
var schema16 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_chunk", "default": "orchestration_chunk", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "token": { "title": "Token", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_id", "phase", "token", "is_final"], "title": "OrchestrationChunk", "type": "object" };
var schema17 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_message_end", "default": "orchestration_message_end", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_id": { "title": "Agent Id", "type": "string" }, "phase": { "enum": ["analysis", "review", "synthesis"], "title": "Phase", "type": "string" }, "full_content": { "title": "Full Content", "type": "string" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_id", "phase", "full_content", "is_final"], "title": "OrchestrationMessageEnd", "type": "object" };
var schema18 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_end", "default": "orchestration_end", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "status": { "enum": ["completed", "cancelled"], "title": "Status", "type": "string" }, "is_final": { "const": true, "default": true, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "status", "is_final"], "title": "OrchestrationEnd", "type": "object" };
var schema20 = { "additionalProperties": false, "properties": { "protocol_version": { "const": 1, "default": 1, "title": "Protocol Version", "type": "integer" }, "type": { "const": "orchestration_route", "default": "orchestration_route", "title": "Type", "type": "string" }, "run_id": { "title": "Run Id", "type": "string" }, "sequence": { "title": "Sequence", "type": "integer" }, "agent_ids": { "items": { "type": "string" }, "title": "Agent Ids", "type": "array" }, "reason": { "title": "Reason", "type": "string" }, "planned_model_calls": { "title": "Planned Model Calls", "type": "integer" }, "max_model_calls": { "title": "Max Model Calls", "type": "integer" }, "max_output_tokens": { "title": "Max Output Tokens", "type": "integer" }, "is_final": { "const": false, "default": false, "title": "Is Final", "type": "boolean" } }, "required": ["protocol_version", "type", "run_id", "sequence", "agent_ids", "reason", "planned_model_calls", "max_model_calls", "max_output_tokens", "is_final"], "title": "OrchestrationRoute", "type": "object" };
var func2 = Object.prototype.hasOwnProperty;
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
                    if (data.protocol_version === void 0 && (missing7 = "protocol_version") || data.type === void 0 && (missing7 = "type") || data.run_id === void 0 && (missing7 = "run_id") || data.sequence === void 0 && (missing7 = "sequence") || data.message === void 0 && (missing7 = "message") || data.is_final === void 0 && (missing7 = "is_final")) {
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
                        if (!(key7 === "protocol_version" || key7 === "type" || key7 === "run_id" || key7 === "sequence" || key7 === "message" || key7 === "is_final")) {
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
                                  if (data.is_final !== void 0) {
                                    let data50 = data.is_final;
                                    const _errs133 = errors;
                                    if (typeof data50 !== "boolean") {
                                      const err99 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationError/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                      if (vErrors === null) {
                                        vErrors = [err99];
                                      } else {
                                        vErrors.push(err99);
                                      }
                                      errors++;
                                    }
                                    if (true !== data50) {
                                      const err100 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationError/properties/is_final/const", keyword: "const", params: { allowedValue: true }, message: "must be equal to constant" };
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
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } else {
                    const err101 = { instancePath, schemaPath: "#/$defs/OrchestrationError/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err101];
                    } else {
                      vErrors.push(err101);
                    }
                    errors++;
                  }
                }
                var _valid0 = _errs119 === errors;
                valid0 = valid0 || _valid0;
                if (!valid0) {
                  const _errs135 = errors;
                  const _errs136 = errors;
                  if (errors === _errs136) {
                    if (data && typeof data == "object" && !Array.isArray(data)) {
                      let missing8;
                      if (data.protocol_version === void 0 && (missing8 = "protocol_version") || data.type === void 0 && (missing8 = "type") || data.run_id === void 0 && (missing8 = "run_id") || data.sequence === void 0 && (missing8 = "sequence") || data.agent_ids === void 0 && (missing8 = "agent_ids") || data.reason === void 0 && (missing8 = "reason") || data.planned_model_calls === void 0 && (missing8 = "planned_model_calls") || data.max_model_calls === void 0 && (missing8 = "max_model_calls") || data.max_output_tokens === void 0 && (missing8 = "max_output_tokens") || data.is_final === void 0 && (missing8 = "is_final")) {
                        const err102 = { instancePath, schemaPath: "#/$defs/OrchestrationRoute/required", keyword: "required", params: { missingProperty: missing8 }, message: "must have required property '" + missing8 + "'" };
                        if (vErrors === null) {
                          vErrors = [err102];
                        } else {
                          vErrors.push(err102);
                        }
                        errors++;
                      } else {
                        const _errs138 = errors;
                        for (const key8 in data) {
                          if (!func2.call(schema20.properties, key8)) {
                            const err103 = { instancePath, schemaPath: "#/$defs/OrchestrationRoute/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key8 }, message: "must NOT have additional properties" };
                            if (vErrors === null) {
                              vErrors = [err103];
                            } else {
                              vErrors.push(err103);
                            }
                            errors++;
                            break;
                          }
                        }
                        if (_errs138 === errors) {
                          if (data.protocol_version !== void 0) {
                            let data51 = data.protocol_version;
                            const _errs139 = errors;
                            if (!(typeof data51 == "number" && (!(data51 % 1) && !isNaN(data51)))) {
                              const err104 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationRoute/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                              if (vErrors === null) {
                                vErrors = [err104];
                              } else {
                                vErrors.push(err104);
                              }
                              errors++;
                            }
                            if (1 !== data51) {
                              const err105 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationRoute/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                              if (vErrors === null) {
                                vErrors = [err105];
                              } else {
                                vErrors.push(err105);
                              }
                              errors++;
                            }
                            var valid18 = _errs139 === errors;
                          } else {
                            var valid18 = true;
                          }
                          if (valid18) {
                            if (data.type !== void 0) {
                              let data52 = data.type;
                              const _errs141 = errors;
                              if (typeof data52 !== "string") {
                                const err106 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationRoute/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err106];
                                } else {
                                  vErrors.push(err106);
                                }
                                errors++;
                              }
                              if ("orchestration_route" !== data52) {
                                const err107 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationRoute/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_route" }, message: "must be equal to constant" };
                                if (vErrors === null) {
                                  vErrors = [err107];
                                } else {
                                  vErrors.push(err107);
                                }
                                errors++;
                              }
                              var valid18 = _errs141 === errors;
                            } else {
                              var valid18 = true;
                            }
                            if (valid18) {
                              if (data.run_id !== void 0) {
                                const _errs143 = errors;
                                if (typeof data.run_id !== "string") {
                                  const err108 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationRoute/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
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
                                if (data.sequence !== void 0) {
                                  let data54 = data.sequence;
                                  const _errs145 = errors;
                                  if (!(typeof data54 == "number" && (!(data54 % 1) && !isNaN(data54)))) {
                                    const err109 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationRoute/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                    if (vErrors === null) {
                                      vErrors = [err109];
                                    } else {
                                      vErrors.push(err109);
                                    }
                                    errors++;
                                  }
                                  var valid18 = _errs145 === errors;
                                } else {
                                  var valid18 = true;
                                }
                                if (valid18) {
                                  if (data.agent_ids !== void 0) {
                                    let data55 = data.agent_ids;
                                    const _errs147 = errors;
                                    if (errors === _errs147) {
                                      if (Array.isArray(data55)) {
                                        var valid19 = true;
                                        const len0 = data55.length;
                                        for (let i0 = 0; i0 < len0; i0++) {
                                          const _errs149 = errors;
                                          if (typeof data55[i0] !== "string") {
                                            const err110 = { instancePath: instancePath + "/agent_ids/" + i0, schemaPath: "#/$defs/OrchestrationRoute/properties/agent_ids/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err110];
                                            } else {
                                              vErrors.push(err110);
                                            }
                                            errors++;
                                          }
                                          var valid19 = _errs149 === errors;
                                          if (!valid19) {
                                            break;
                                          }
                                        }
                                      } else {
                                        const err111 = { instancePath: instancePath + "/agent_ids", schemaPath: "#/$defs/OrchestrationRoute/properties/agent_ids/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                        if (vErrors === null) {
                                          vErrors = [err111];
                                        } else {
                                          vErrors.push(err111);
                                        }
                                        errors++;
                                      }
                                    }
                                    var valid18 = _errs147 === errors;
                                  } else {
                                    var valid18 = true;
                                  }
                                  if (valid18) {
                                    if (data.reason !== void 0) {
                                      const _errs151 = errors;
                                      if (typeof data.reason !== "string") {
                                        const err112 = { instancePath: instancePath + "/reason", schemaPath: "#/$defs/OrchestrationRoute/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err112];
                                        } else {
                                          vErrors.push(err112);
                                        }
                                        errors++;
                                      }
                                      var valid18 = _errs151 === errors;
                                    } else {
                                      var valid18 = true;
                                    }
                                    if (valid18) {
                                      if (data.planned_model_calls !== void 0) {
                                        let data58 = data.planned_model_calls;
                                        const _errs153 = errors;
                                        if (!(typeof data58 == "number" && (!(data58 % 1) && !isNaN(data58)))) {
                                          const err113 = { instancePath: instancePath + "/planned_model_calls", schemaPath: "#/$defs/OrchestrationRoute/properties/planned_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                          if (vErrors === null) {
                                            vErrors = [err113];
                                          } else {
                                            vErrors.push(err113);
                                          }
                                          errors++;
                                        }
                                        var valid18 = _errs153 === errors;
                                      } else {
                                        var valid18 = true;
                                      }
                                      if (valid18) {
                                        if (data.max_model_calls !== void 0) {
                                          let data59 = data.max_model_calls;
                                          const _errs155 = errors;
                                          if (!(typeof data59 == "number" && (!(data59 % 1) && !isNaN(data59)))) {
                                            const err114 = { instancePath: instancePath + "/max_model_calls", schemaPath: "#/$defs/OrchestrationRoute/properties/max_model_calls/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                            if (vErrors === null) {
                                              vErrors = [err114];
                                            } else {
                                              vErrors.push(err114);
                                            }
                                            errors++;
                                          }
                                          var valid18 = _errs155 === errors;
                                        } else {
                                          var valid18 = true;
                                        }
                                        if (valid18) {
                                          if (data.max_output_tokens !== void 0) {
                                            let data60 = data.max_output_tokens;
                                            const _errs157 = errors;
                                            if (!(typeof data60 == "number" && (!(data60 % 1) && !isNaN(data60)))) {
                                              const err115 = { instancePath: instancePath + "/max_output_tokens", schemaPath: "#/$defs/OrchestrationRoute/properties/max_output_tokens/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                              if (vErrors === null) {
                                                vErrors = [err115];
                                              } else {
                                                vErrors.push(err115);
                                              }
                                              errors++;
                                            }
                                            var valid18 = _errs157 === errors;
                                          } else {
                                            var valid18 = true;
                                          }
                                          if (valid18) {
                                            if (data.is_final !== void 0) {
                                              let data61 = data.is_final;
                                              const _errs159 = errors;
                                              if (typeof data61 !== "boolean") {
                                                const err116 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationRoute/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                                if (vErrors === null) {
                                                  vErrors = [err116];
                                                } else {
                                                  vErrors.push(err116);
                                                }
                                                errors++;
                                              }
                                              if (false !== data61) {
                                                const err117 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationRoute/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
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
                      const err118 = { instancePath, schemaPath: "#/$defs/OrchestrationRoute/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                      if (vErrors === null) {
                        vErrors = [err118];
                      } else {
                        vErrors.push(err118);
                      }
                      errors++;
                    }
                  }
                  var _valid0 = _errs135 === errors;
                  valid0 = valid0 || _valid0;
                  if (!valid0) {
                    const _errs161 = errors;
                    const _errs162 = errors;
                    if (errors === _errs162) {
                      if (data && typeof data == "object" && !Array.isArray(data)) {
                        let missing9;
                        if (data.protocol_version === void 0 && (missing9 = "protocol_version") || data.type === void 0 && (missing9 = "type") || data.run_id === void 0 && (missing9 = "run_id") || data.sequence === void 0 && (missing9 = "sequence") || data.permission === void 0 && (missing9 = "permission") || data.workspace_id === void 0 && (missing9 = "workspace_id") || data.paths === void 0 && (missing9 = "paths") || data.is_final === void 0 && (missing9 = "is_final")) {
                          const err119 = { instancePath, schemaPath: "#/$defs/OrchestrationApprovalRequired/required", keyword: "required", params: { missingProperty: missing9 }, message: "must have required property '" + missing9 + "'" };
                          if (vErrors === null) {
                            vErrors = [err119];
                          } else {
                            vErrors.push(err119);
                          }
                          errors++;
                        } else {
                          const _errs164 = errors;
                          for (const key9 in data) {
                            if (!(key9 === "protocol_version" || key9 === "type" || key9 === "run_id" || key9 === "sequence" || key9 === "permission" || key9 === "workspace_id" || key9 === "paths" || key9 === "is_final")) {
                              const err120 = { instancePath, schemaPath: "#/$defs/OrchestrationApprovalRequired/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key9 }, message: "must NOT have additional properties" };
                              if (vErrors === null) {
                                vErrors = [err120];
                              } else {
                                vErrors.push(err120);
                              }
                              errors++;
                              break;
                            }
                          }
                          if (_errs164 === errors) {
                            if (data.protocol_version !== void 0) {
                              let data62 = data.protocol_version;
                              const _errs165 = errors;
                              if (!(typeof data62 == "number" && (!(data62 % 1) && !isNaN(data62)))) {
                                const err121 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/protocol_version/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                if (vErrors === null) {
                                  vErrors = [err121];
                                } else {
                                  vErrors.push(err121);
                                }
                                errors++;
                              }
                              if (1 !== data62) {
                                const err122 = { instancePath: instancePath + "/protocol_version", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/protocol_version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                                if (vErrors === null) {
                                  vErrors = [err122];
                                } else {
                                  vErrors.push(err122);
                                }
                                errors++;
                              }
                              var valid21 = _errs165 === errors;
                            } else {
                              var valid21 = true;
                            }
                            if (valid21) {
                              if (data.type !== void 0) {
                                let data63 = data.type;
                                const _errs167 = errors;
                                if (typeof data63 !== "string") {
                                  const err123 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err123];
                                  } else {
                                    vErrors.push(err123);
                                  }
                                  errors++;
                                }
                                if ("orchestration_approval_required" !== data63) {
                                  const err124 = { instancePath: instancePath + "/type", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/type/const", keyword: "const", params: { allowedValue: "orchestration_approval_required" }, message: "must be equal to constant" };
                                  if (vErrors === null) {
                                    vErrors = [err124];
                                  } else {
                                    vErrors.push(err124);
                                  }
                                  errors++;
                                }
                                var valid21 = _errs167 === errors;
                              } else {
                                var valid21 = true;
                              }
                              if (valid21) {
                                if (data.run_id !== void 0) {
                                  const _errs169 = errors;
                                  if (typeof data.run_id !== "string") {
                                    const err125 = { instancePath: instancePath + "/run_id", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/run_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err125];
                                    } else {
                                      vErrors.push(err125);
                                    }
                                    errors++;
                                  }
                                  var valid21 = _errs169 === errors;
                                } else {
                                  var valid21 = true;
                                }
                                if (valid21) {
                                  if (data.sequence !== void 0) {
                                    let data65 = data.sequence;
                                    const _errs171 = errors;
                                    if (!(typeof data65 == "number" && (!(data65 % 1) && !isNaN(data65)))) {
                                      const err126 = { instancePath: instancePath + "/sequence", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/sequence/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                                      if (vErrors === null) {
                                        vErrors = [err126];
                                      } else {
                                        vErrors.push(err126);
                                      }
                                      errors++;
                                    }
                                    var valid21 = _errs171 === errors;
                                  } else {
                                    var valid21 = true;
                                  }
                                  if (valid21) {
                                    if (data.permission !== void 0) {
                                      let data66 = data.permission;
                                      const _errs173 = errors;
                                      if (typeof data66 !== "string") {
                                        const err127 = { instancePath: instancePath + "/permission", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/permission/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err127];
                                        } else {
                                          vErrors.push(err127);
                                        }
                                        errors++;
                                      }
                                      if ("workspace.read" !== data66) {
                                        const err128 = { instancePath: instancePath + "/permission", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/permission/const", keyword: "const", params: { allowedValue: "workspace.read" }, message: "must be equal to constant" };
                                        if (vErrors === null) {
                                          vErrors = [err128];
                                        } else {
                                          vErrors.push(err128);
                                        }
                                        errors++;
                                      }
                                      var valid21 = _errs173 === errors;
                                    } else {
                                      var valid21 = true;
                                    }
                                    if (valid21) {
                                      if (data.workspace_id !== void 0) {
                                        const _errs175 = errors;
                                        if (typeof data.workspace_id !== "string") {
                                          const err129 = { instancePath: instancePath + "/workspace_id", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/workspace_id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                          if (vErrors === null) {
                                            vErrors = [err129];
                                          } else {
                                            vErrors.push(err129);
                                          }
                                          errors++;
                                        }
                                        var valid21 = _errs175 === errors;
                                      } else {
                                        var valid21 = true;
                                      }
                                      if (valid21) {
                                        if (data.paths !== void 0) {
                                          let data68 = data.paths;
                                          const _errs177 = errors;
                                          if (errors === _errs177) {
                                            if (Array.isArray(data68)) {
                                              var valid22 = true;
                                              const len1 = data68.length;
                                              for (let i1 = 0; i1 < len1; i1++) {
                                                const _errs179 = errors;
                                                if (typeof data68[i1] !== "string") {
                                                  const err130 = { instancePath: instancePath + "/paths/" + i1, schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/paths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err130];
                                                  } else {
                                                    vErrors.push(err130);
                                                  }
                                                  errors++;
                                                }
                                                var valid22 = _errs179 === errors;
                                                if (!valid22) {
                                                  break;
                                                }
                                              }
                                            } else {
                                              const err131 = { instancePath: instancePath + "/paths", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/paths/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                              if (vErrors === null) {
                                                vErrors = [err131];
                                              } else {
                                                vErrors.push(err131);
                                              }
                                              errors++;
                                            }
                                          }
                                          var valid21 = _errs177 === errors;
                                        } else {
                                          var valid21 = true;
                                        }
                                        if (valid21) {
                                          if (data.is_final !== void 0) {
                                            let data70 = data.is_final;
                                            const _errs181 = errors;
                                            if (typeof data70 !== "boolean") {
                                              const err132 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/is_final/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                              if (vErrors === null) {
                                                vErrors = [err132];
                                              } else {
                                                vErrors.push(err132);
                                              }
                                              errors++;
                                            }
                                            if (false !== data70) {
                                              const err133 = { instancePath: instancePath + "/is_final", schemaPath: "#/$defs/OrchestrationApprovalRequired/properties/is_final/const", keyword: "const", params: { allowedValue: false }, message: "must be equal to constant" };
                                              if (vErrors === null) {
                                                vErrors = [err133];
                                              } else {
                                                vErrors.push(err133);
                                              }
                                              errors++;
                                            }
                                            var valid21 = _errs181 === errors;
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
                      } else {
                        const err134 = { instancePath, schemaPath: "#/$defs/OrchestrationApprovalRequired/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                        if (vErrors === null) {
                          vErrors = [err134];
                        } else {
                          vErrors.push(err134);
                        }
                        errors++;
                      }
                    }
                    var _valid0 = _errs161 === errors;
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
  if (!valid0) {
    const err135 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
    if (vErrors === null) {
      vErrors = [err135];
    } else {
      vErrors.push(err135);
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
