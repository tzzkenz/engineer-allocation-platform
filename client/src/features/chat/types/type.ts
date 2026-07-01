export type MessageRole = "ai" | "user";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
};
