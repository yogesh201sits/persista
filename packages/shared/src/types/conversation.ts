export interface Message {
  role: "system" | "user" | "assistant";

  content: string;
}

export interface Conversation {
  messages: Message[];
}
