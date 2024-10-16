const now = new Date();

const prompts = {
  system: `You're a financial advisor`,
  user: (input: string, context: string, language: string, timezone: string) =>
    `You will be provided with context and user's input, your task is to use them to generate relevant output in markdown. The output will typically be a financial report or an answer to the input question. The context will contain user's incomes, expenses categorized by label, recurring payments, goals and expense limits categorized by period. All of that information is optional but there has to be at least one thing in the context you should refer to. Be specific, if user's input is irrelevant inform them about it and don't generate more than that in case you can't understand the input.

Today's UTC date - ${now.toISOString()}, in case you need to use it and user's native language or country are provided, calculate the offset to make sure it does not differ

Timezone:
${timezone}

Language:
${language}

Context:
${context}

User's input:
${input}`,
};

export default prompts;
