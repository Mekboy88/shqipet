
import React from "react";
import { Smile, Heart } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface ReactionPopupProps {
  children: React.ReactNode;
}

const ReactionPopup: React.FC<ReactionPopupProps> = ({ children }) => {
  const reactions = [
    { emoji: "👍", name: "Pëlqej", color: "bg-blue-500", hoverClass: "hover:scale-125" },
    { emoji: "❤️", name: "Dashuroj", color: "bg-red-500", hoverClass: "hover:scale-125" },
    { emoji: "😆", name: "Haha", color: "bg-yellow-400", hoverClass: "hover:scale-125" },
    { emoji: "😮", name: "Uau", color: "bg-yellow-400", hoverClass: "hover:scale-125" },
    { emoji: "😢", name: "I trishtuar", color: "bg-yellow-400", hoverClass: "hover:scale-125" },
    { emoji: "😡", name: "I zemëruar", color: "bg-orange-600", hoverClass: "hover:scale-125" }
  ];

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent 
        className="p-0 border rounded-full flex w-auto shadow-lg bg-white slide-up-animation"
        sideOffset={5} 
        align="start"
        side="top"
        alignOffset={0}
      >
        <div className="flex items-center py-1.5 px-3 gap-2 reaction-container pl-5">
          {reactions.map((reaction, index) => (
            <button
              key={index}
              className={`reaction-emoji transition-all ${reaction.hoverClass} hover:transform duration-100 p-1.5`}
              title={reaction.name}
            >
              <div className="reaction-emoji-inner text-3xl relative">
                {reaction.emoji}
                <span className="reaction-name absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {reaction.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ReactionPopup;
