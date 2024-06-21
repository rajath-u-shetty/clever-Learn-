import { Message } from "ai/react";
import { ChatMessage } from "./ChatMessage";

export function ChatList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-1 flex-col">
      {messages.map((message) => {
        console.log(message.role);
        if (message.role != "system") {
          return <ChatMessage message={message} key={message.id} />;
        }
      })}
    </div>
  );
}
