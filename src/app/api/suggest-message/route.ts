import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Please provide exactly three open-ended, friendly, and non-sensitive questions. Format them as a single string with each question separated by ' || '. Start your response immediately with the first question, and do not include any other text.";

    const result = streamText({
      model: google("gemini-2.5-flash"),
      maxOutputTokens: 400,
      prompt,
      onError({ error }) {
    console.error("Gemini error:", error);
  },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of (await result).textStream) {
            controller.enqueue(encoder.encode(part));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to generate text from Gemini." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
