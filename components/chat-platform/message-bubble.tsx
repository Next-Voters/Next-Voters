import React, { FC } from "react";
import PoliticalPerspective from "@/components/chat-platform/political-perspective";
import { Message } from "@/types/chat-platform/message";

interface MessageBubbleProps {
  message: Message;
  isFromMe: boolean;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message, isFromMe }) => {
  if (isFromMe && message.type === "reg") {
    return (
      <div className="flex justify-end mb-5">
        <div className="py-3 px-4.5 px-5 rounded-2xl rounded-br-md max-w-[75%] bg-brand text-white shadow-sm">
          <p className="text-[14px] leading-relaxed">{message.message}</p>
        </div>
      </div>
    );
  }

  if (message.type === "agent") {
    const getPartyColor = (partyName: string, index: number): "blue" | "red" => {
      const name = partyName.toLowerCase();
      if (name.includes("democratic")) return "blue";
      if (name.includes("republican")) return "red";
      if (name.includes("liberal")) return "red";
      if (name.includes("conservative")) return "blue";
      return index % 2 === 0 ? "blue" : "red";
    };

    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {message.parties.map((party, index) => (
          <PoliticalPerspective
            key={index}
            title={party.partyName}
            partyStance={party.partyStance}
            supportingDetails={party.supportingDetails}
            color={getPartyColor(party.partyName, index)}
            citations={party.citations}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default MessageBubble;
