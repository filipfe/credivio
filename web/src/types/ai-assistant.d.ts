type ChatMessage = {
  from: "user" | "assistant";
  content: string | React.ReactNode;
};
