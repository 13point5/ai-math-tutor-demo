import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2, MessageCircleIcon } from "lucide-react";

interface Conversation {
  id: string;
  role: string; // "user" or "assistant"
  text: string; // User or assistant message
  timestamp: string; // ISO string for message time
  isFinal: boolean; // Whether the transcription is final
  status?: "speaking" | "processing" | "final"; // Status for real-time conversation states
}

interface ConversationPanelProps {
  conversation: Conversation[];
}

export function ConversationPanel({ conversation }: ConversationPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message when conversation changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Check if the assistant is currently typing (last message is from assistant and not final)
  const isAssistantTyping =
    conversation.length > 0 &&
    conversation[conversation.length - 1].role === "assistant" &&
    !conversation[conversation.length - 1].isFinal;

  return (
    <div className="w-100 h-full bg-white rounded-lg shadow-md flex flex-col overflow-hidden border border-gray-200">
      <div className="px-4 py-3 bg-purple-600 text-white font-medium flex justify-between items-center">
        <h3 className="flex items-center gap-2">
          <MessageCircleIcon className="w-4 h-4" />
          Conversation
        </h3>

        {isAssistantTyping && (
          <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full animate-pulse">
            Tutor is typing...
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        {conversation.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            <p>No conversation yet. Start the session to begin.</p>
          </div>
        ) : (
          conversation.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-3 rounded-lg max-w-[90%]",
                message.role === "user"
                  ? "bg-neutral-100 self-end"
                  : "bg-purple-100 self-start"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  {message.role === "user" ? "You" : "Tutor"}

                  {message.status !== "final" && !message.isFinal && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </div>
              <div className="text-sm whitespace-pre-wrap">
                {formatMessage(message.text)}
                {message.role === "assistant" && !message.isFinal && (
                  <span className="inline-flex">
                    <span className="typing-dot animate-bounce">.</span>
                    <span
                      className="typing-dot animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    >
                      .
                    </span>
                    <span
                      className="typing-dot animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    >
                      .
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

const formatMessage = (message: string) => {
  // Remove everything after the `--------` delimiter
  // Also remove the `Student says:` prefix
  return message.split("--------")[0].replace("Student says:", "").trim();
};
