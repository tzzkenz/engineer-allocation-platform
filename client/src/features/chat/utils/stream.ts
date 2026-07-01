export const streamChatResponse = async (
  prompt: string,
  onStreamData: (text: string, type?: string) => void,
  signal?: AbortSignal
) => {
  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + "/agent/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ message: prompt }),
      signal: signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let done = false;
    let buffer = "";
    let accumulatedText = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();

      done = readerDone;
      buffer += decoder.decode(value);

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) continue;
        if (trimmedLine == "data: [DONE]") break;

        if (trimmedLine.startsWith("data:")) {
          try {
            const json = JSON.parse(trimmedLine.replace("data:", ""));

            if (json.content) {
              accumulatedText += json.content;
              onStreamData(accumulatedText, "text");
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }

    return accumulatedText;
  } catch (err) {
    console.log(err);
  }
};
