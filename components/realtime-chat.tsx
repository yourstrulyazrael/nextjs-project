"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/components/chat-message";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import {
  useRealtimeChat,
  type ChatMessage,
} from "@/hooks/use-realtime-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RealtimeChatProps {
  supabaseClient?: SupabaseClient;
  roomName: string;
  username: string;
  onMessage?: (messages: ChatMessage[]) => void;
  messages?: ChatMessage[];
}

export const RealtimeChat = ({
  supabaseClient,
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll();

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
    supabaseClient,
  });

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const allMessages = useMemo(() => {
    const uniqueMessages = new Map<string, ChatMessage>();

    for (const message of [...initialMessages, ...realtimeMessages]) {
      uniqueMessages.set(message.id, message);
    }

    return Array.from(uniqueMessages.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  }, [initialMessages, realtimeMessages]);

  useEffect(() => {
    onMessage?.(allMessages);
  }, [allMessages, onMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  const handleSendMessage = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const content = newMessage.trim();

      if (!content || !isConnected || isSending) return;

      setIsSending(true);
      setSendError("");

      try {
        const sent = await sendMessage(content);

        if (sent) {
          setNewMessage("");
        } else {
          setSendError("Message could not be sent. Please try again.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setSendError("An error occurred while sending your message.");
      } finally {
        setIsSending(false);
      }
    },
    [newMessage, isConnected, isSending, sendMessage]
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground antialiased">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{roomName}</p>
          <p className="text-xs text-muted-foreground">
            Signed in as {username}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-yellow-500"
            )}
          />
          <span
            className={cn(
              "text-xs",
              isConnected ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {allMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            {isConnected
              ? "No messages yet. Start the conversation!"
              : "Connecting to the chat room..."}
          </div>
        ) : (
          <div className="space-y-1">
            {allMessages.map((message, index) => {
              const previousMessage =
                index > 0 ? allMessages[index - 1] : null;

              const showHeader =
                !previousMessage ||
                previousMessage.user.name !== message.user.name;

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.user.name === username}
                    showHeader={showHeader}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {sendError && (
        <p role="alert" className="px-4 pb-2 text-sm text-destructive">
          {sendError}
        </p>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex w-full gap-2 border-t border-border p-4"
      >
        <Input
          className="min-w-0 flex-1 rounded-full bg-background text-sm"
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder={
            isConnected ? "Type a message..." : "Connecting to chat..."
          }
          disabled={!isConnected || isSending}
          autoComplete="off"
          maxLength={2000}
          aria-label="Message"
        />

        <Button
          className="size-10 shrink-0 rounded-full"
          type="submit"
          disabled={!isConnected || !newMessage.trim() || isSending}
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
};