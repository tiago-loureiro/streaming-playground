import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const textEncoder = new TextEncoder();

  async function send() {
    let a = 0n;
    let b = 1n;
    for (let i = 0; i < 1000; i++) {
      writer.write(textEncoder.encode("# " + a + "\n"));
      b = a + b;
      a = b - a;
      await new Promise((r) => setTimeout(r, 100));
    }
    writer.close();
  }
  send();

  return new Response(readable, {
    headers: { "content-type": "text/plain" },
  });
};
