import { OPENAI_API_KEY } from "$env/static/private";
import type { RequestHandler } from "./$types";
import OpenAI from "openai";

export const GET: RequestHandler = async () => {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Give me a software related title of an article" }],
    model: "gpt-3.5-turbo",
  });
  const title = completion.choices[0].message.content?.replace(/"/g, "");

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Write an article in markdown with title "${title}"` }],
    stream: true,
  });

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const textEncoder = new TextEncoder();

  async function send() {
    for await (const part of stream) {
      writer.write(textEncoder.encode(part.choices[0]?.delta?.content || ""));
    }
    writer.close();
  }
  send();

  return new Response(readable, {
    headers: { "content-type": "text/plain" },
  });
};
