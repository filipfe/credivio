import OpenAI from "openai";

const apiKey = Deno.env.get("OPENAI_API_TOKEN");

if (!apiKey) {
  throw new Error("Environment variables missing: OPENAI_API_TOKEN");
}

const openai = new OpenAI({ apiKey });

export default openai;
