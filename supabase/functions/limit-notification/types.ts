import { Limit } from "../_shared/types.ts";

export type Breakpoint = {
  value: number;
  messages: {
    [language_code: string]: (limit: Limit) => string;
  };
};
