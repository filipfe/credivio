import openai from "../../_shared/openai.ts";
import { insertOperations } from "../commands/add.ts";
import supabase from "../supabase.ts";
import { ProcessReturn } from "../types.ts";
import { Profile } from "../types.ts";

export default async function processText(
  message: string,
  user: Profile,
): Promise<ProcessReturn> {
  const { data } = await supabase.rpc("get_telegram_user_labels", {
    p_user_id: user.id,
  });

  const labels = data || [];

  const textPrompt = `Analyze user's message:
"${message}"
Classify each operation either as 'income' or 'expense'. Generate a list of operations:

type Operation = {
  title: string;
  amount: number;
  currency: string;
  type: "income" | "expense";
  label?: string;
};

User's native language: ${user.language_code} - use it for 'title' and 'label' unless user specified otherwise
User's default currency: ${user.currency} - use it in case client didn't mention any other

Important: Only insert 'label' when you classified operation as 'expense'
If there's no matching label, you can come up with one yourself but choose very general naming
If there's no good label to assign, don't include label field in the object

List of available labels:
${labels.length > 0 ? labels.join(",\n") : "None"}

Rules:
- return { operations: Operation[], message?: string } in json
- 'currency' is always 3-digit code
- if user's message is irrelevant, return empty array and formulate a very short message directly to the client about what's wrong, don't be formal`;

  console.log("Generating completion...", textPrompt);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    "response_format": { type: "json_object" },
    messages: [{
      role: "user",
      "content": [
        { type: "text", text: textPrompt },
      ],
    }],
  });

  const response = completion.choices[0].message.content;

  if (typeof response !== "string") {
    console.error("Completion error: Returned a non-string response", {
      completion,
    });

    return {
      reply:
        "Wybacz, nie mogłem przetworzyć twojego zapytania. Może spróbujesz ponownie?",
      operations: [],
    };
  }

  try {
    const data = JSON.parse(response);
    if (!Array.isArray(data.operations) || data.operations.length === 0) {
      return data.message ||
        "Nie mogłem przetworzyć wiadomości, spróbuj innego sformułowania";
    }
    return await insertOperations(
      data.operations,
      user,
    );
  } catch (err) {
    console.log("Parse error: Couldn't parse the completion response", {
      response,
      err,
    });
    return {
      reply:
        "Wybacz, nie mogłem przetworzyć twojego zapytania. Może spróbujesz ponownie?",
      operations: [],
    };
  }
}
