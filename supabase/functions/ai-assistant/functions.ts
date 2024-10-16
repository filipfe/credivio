import { FunctionDefinition } from "https://deno.land/x/openai@v4.51.0/resources/shared.ts";
import { OperationsType } from "./types.ts";

export const get_incomes: FunctionDefinition = {
  name: "get_incomes",
  description: "Gather user's incomes from given period of time",
  parameters: {
    type: "object",
    properties: {
      from: {
        type: "string",
        description: "Start date in YYYY-MM-DD format",
      },
      to: {
        type: "string",
        description: "End date in YYYY-MM-DD format",
      },
    },
    required: ["from", "to"],
    additionalProperties: false,
  },
};

export const get_expenses: FunctionDefinition = {
  name: "get_expenses",
  description: "Gather user's expenses from given period of time",
  parameters: {
    type: "object",
    properties: {
      from: {
        type: "string",
        description: "Start date in YYYY-MM-DD format",
      },
      to: {
        type: "string",
        description: "End date in YYYY-MM-DD format",
      },
    },
    required: ["from", "to"],
    additionalProperties: false,
  },
};

export const get_recurring_payments: FunctionDefinition = {
  name: "get_recurring_payments",
  description: "Gather user's active recurring payments",
};

const functions: Record<`get_${OperationsType}`, FunctionDefinition> = {
  get_incomes,
  get_expenses,
  get_recurring_payments,
};

export default functions;
