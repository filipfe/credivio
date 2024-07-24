import { Voice } from "https://deno.land/x/grammy_types@v3.9.0/message.ts";
import processText from "./process-text.ts";

export default async function processVoice(
  voice: Voice,
  user: Profile,
  path?: string,
): Promise<ProcessReturn> {
  const { duration, mime_type } = voice;

  if (duration > 10) {
    return {
      reply:
        "Wybacz, twoja wiadomość jest za długa! Maksymalny czas trwania wiadomości głosowej to 8 sekund",
      operations: [],
    };
  }

  try {
    const blob = await fetch(
      `https://api.telegram.org/file/bot${
        Deno.env.get("TELEGRAM_BOT_TOKEN")
      }/${path}`,
    ).then((res) => res.blob());

    const file = new File([blob], "audiofile", {
      type: mime_type,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");
    formData.append("language", user.language_code.split("-")[0]);

    const transcription = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("OPENAI_API_TOKEN")!}`,
        },
        body: formData,
      },
    );

    if (!transcription.ok) {
      return {
        reply: "Wybacz, nie mogłem przetworzyć twojej wiadomości głosowej",
        operations: [],
      };
    }

    const textMessage = await transcription.text();

    return await processText(textMessage, user);
  } catch (err) {
    console.error(err);
    return {
      reply: "Wystąpił błąd przy przetwarzaniu zapytania, spróbuj ponownie!",
      operations: [],
    };
  }
}
