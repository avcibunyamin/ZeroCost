import type { StreamEvent } from "./contract";
declare function validate(data: unknown): data is StreamEvent;
export default validate;
