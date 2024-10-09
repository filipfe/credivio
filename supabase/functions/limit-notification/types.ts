export type Breakpoint = {
  value: number;
  messages: {
    [language_code: string]: (limit: Limit) => string;
  };
};
