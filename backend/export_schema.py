import json
from zerocost.models import Contract
print(json.dumps(Contract.model_json_schema(mode="serialization"), ensure_ascii=False, indent=2))
