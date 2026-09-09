import type { Response } from "./contract";
declare function validate(data: unknown): data is Response;
export default validate;
