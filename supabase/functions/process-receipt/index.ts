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

const URL = Deno.env.get("SUPABASE_URL");
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const textPrompt =
  `Extract finance information from the receipts and invoices. Analyze context and classify operation either as 'income' or 'expense'. You should return an array of operations for each processed image in JSON format. Refer to these types:

type OperationType = "expense" | "income";

type Operation = {
  issued_at: string;
  title: string;
  amount: string;
  currency: string;
  type: OperationType;
};`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!URL || !ANON_KEY) {
    return new Response(
      `Environment variables missing: ${URL ? "ANON_KEY" : "URL"}`,
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

    const supabase = createClient(URL, ANON_KEY, {
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
        uploadedFiles.push({
          path: upload.path,
          signedUrl: data?.signedUrl,
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

    // console.log("Generating completion...", { uploadedFiles });

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   "response_format": { type: "json_object" },
    //   messages: [{
    //     role: "user",
    //     "content": [
    //       { type: "text", text: textPrompt },
    //       ...content,
    //     ],
    //   }],
    // });
    // const response = completion.choices[0].message.content;

    // console.log({ completion });

    // console.log("Generated the following response: ", response);

    const response = {};

    return new Response(
      JSON.stringify(response),
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
