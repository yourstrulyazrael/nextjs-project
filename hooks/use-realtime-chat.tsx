"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  RealtimeChannel,
  SupabaseClient,
} from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
  supabaseClient?: SupabaseClient;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({
  roomName,
  username,
  supabaseClient,
}: UseRealtimeChatProps) {
  const [fallbackClient] = useState(() => createClient());
  const supabase = supabaseClient ?? fallbackClient;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let active = true;

    const newChannel = supabase.channel(roomName);

    setChannel(newChannel);
    setIsConnected(false);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, ({ payload }) => {
        if (!active || !payload || typeof payload !== "object") return;

        const message = payload as ChatMessage;

        if (
          typeof message.id !== "string" ||
          typeof message.content !== "string" ||
          typeof message.createdAt !== "string" ||
          typeof message.user?.name !== "string"
        ) {
          return;
        }

        setMessages((current) => {
          if (current.some((item) => item.id === message.id)) {
            return current;
          }

          return [...current, message].sort((a, b) =>
            a.createdAt.localeCompare(b.createdAt)
          );
        });
      })
      .subscribe((status) => {
        if (!active) return;

        setIsConnected(status === "SUBSCRIBED");

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("Supabase Realtime status:", status);
        }
      });

    return () => {
      active = false;
      setIsConnected(false);

      setChannel((current) =>
        current === newChannel ? null : current
      );

      void supabase.removeChannel(newChannel);
    };
  }, [roomName, supabase]);

  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      const trimmedContent = content.trim();

      if (!channel || !isConnected || !trimmedContent) {
        return false;
      }

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content: trimmedContent,
        user: { name: username },
        createdAt: new Date().toISOString(),
      };

      try {
        const status = await channel.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        });

        if (status !== "ok") {
          console.error("Broadcast failed:", status);
          return false;
        }

        setMessages((current) => {
          if (current.some((item) => item.id === message.id)) {
            return current;
          }

          return [...current, message].sort((a, b) =>
            a.createdAt.localeCompare(b.createdAt)
          );
        });

        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      }
    },
    [channel, isConnected, username]
  );

  return { messages, sendMessage, isConnected };
}