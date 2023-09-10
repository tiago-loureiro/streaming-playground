<script lang="ts">
  import { onMount } from "svelte";

  let reply = "";

  onMount(() => {
    (async () => {
      const response = await fetch("/api");

      const chunks: string[] = [];
      if (response.ok && response.body) {
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        for (;;) {
          const { value, done } = await reader.read();
          chunks.unshift(value ?? "");
          reply = chunks.join("").trim();
          if (done) break;
        }
      }
    })();
  });
</script>

<h1>Streaming Playground</h1>

<pre>{reply}</pre>
