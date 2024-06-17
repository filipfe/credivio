import OpenAI from "openai";
import { corsHeaders } from "../_shared/cors.ts";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { createClient } from "supabase";
import { ChatCompletionContentPart } from "https://deno.land/x/openai@v4.51.0/resources/chat/completions.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_TOKEN") });

type UploadedFile = {
  signedUrl?: string;
  path?: string;
  error?: string;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const NGROK_URL = Deno.env.get("NGROK_URL");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !ANON_KEY) {
    return new Response(
      `Environment variables missing: ${
        SUPABASE_URL ? "ANON_KEY" : "SUPABASE_URL"
      }`,
      { status: 400 },
    );
  }

  try {
    const form = await multiParser(req);

    if (!form) {
      return new Response("Request error: No files have been found", {
        status: 400,
      });
    }

    const files = form.files as Record<string, FormFile>;

    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      "global": {
        "headers": {
          "Authorization": req.headers.get("Authorization") || "",
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(
        `Auth error: ${error?.message || "User not found"}`,
        { status: 422 },
      );
    }

    const uploadedFiles: UploadedFile[] = [];

    for (const uuid in files) {
      const file = files[uuid];
      const { data: upload, error: uploadError } = await supabase.storage.from(
        "docs",
      )
        .upload(
          `${user.id}/${uuid}-${file.filename}`,
          file.content,
          {
            contentType: file.contentType,
            cacheControl: "3600",
            upsert: false,
          },
        );
      if (upload) {
        const { data, error: shareError } = await supabase.storage.from("docs")
          .createSignedUrl(
            upload.path,
            3600,
          );
        const url = data ? new URL(data.signedUrl) : null;
        const pathname = url ? url.pathname : null;
        const signedUrl = data
          ? (NGROK_URL
            ? `${NGROK_URL}${pathname}${url?.search || ""}`
            : data.signedUrl)
          : undefined;
        uploadedFiles.push({
          path: upload.path,
          signedUrl,
          error: shareError?.message,
        });
      } else {
        uploadedFiles.push({ error: uploadError?.message });
      }
    }

    const content: ChatCompletionContentPart[] = uploadedFiles.filter((file) =>
      file.signedUrl
    ).map((file) => ({
      type: "image_url",
      image_url: {
        url: file.signedUrl!,
      },
    }));

    console.log("Generating completion...", { uploadedFiles });

    const textPrompt =
      `Extract finance information from the receipts and invoices. Analyze context and classify operation either as 'income' or 'expense'. Generate a list of operations:

type Operation = {
  id: string;
  issued_at: string;
  title: string;
  amount: number;
  currency: string;
  type: "income" | "expense";
};

Rules:
- return { operations: Operation[] } in json
- for each image 'id' is available here: ${
        Object.keys(files)
      }, on the image index
- 'title' should be in the same language as the document
- 'currency' is always 3-digit code`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      "response_format": { type: "json_object" },
      messages: [{
        role: "user",
        "content": [
          { type: "text", text: textPrompt },
          ...content,
        ],
      }],
    });
    const response = completion.choices[0].message.content;

    console.log({ completion });

    console.log("Generated the following response: ", response);

    return new Response(
      response,
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err) {
    console.log({ err });
    return new Response(
      `Internal server error: ${err}`,
      { status: 500 },
    );
  }
});
