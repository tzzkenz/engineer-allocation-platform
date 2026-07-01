import { useRef, useState } from "react";

import type { Message } from "../types/type";
import { streamChatResponse } from "../utils/stream";

export const useChat = (initialValue?: Message) => {
  const [messages, setMessages] = useState<Message[]>(initialValue ? [initialValue] : []);
  const [isStreaming, setIsStreaming] = useState(false);

  const signalRef = useRef<AbortController | null>(null);

  const onStreamData = (text: string, type?: string) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[prev.length - 1] = {
        id: prev[prev.length - 1].id,
        role: prev[prev.length - 1].role,
        content: text,
        timestamp: new Date(),
      };

      return newMessages;
    });
  };

  const sendMessage = async (message: string) => {
    if (signalRef.current) signalRef.current.abort();

    signalRef.current = new AbortController();

    setMessages((prev) => [
      ...prev,
      {
        id: new Date().getTime().toString(),
        role: "user",
        content: message,
        timestamp: new Date(),
      },
      {
        id: new Date().getTime().toString() + "z",
        role: "ai",
        content: "",
        timestamp: new Date(),
      },
    ]);

    try {
      setIsStreaming(true);
      await streamChatResponse(message, onStreamData, signalRef.current.signal);
    } catch (err) {
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    isStreaming,
    messages,
    sendMessage,
  };
};
