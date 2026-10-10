"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { createClient } from "@/lib/supabase/client";
import { RealtimeChat } from "@/components/realtime-chat";

export default function ChatPage() {
  const [supabase] = useState(() => createClient());
  const [username, setUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("");

  function handleJoinChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = username.trim();

    if (!name) return;

    setActiveUsername(name);
  }

  function handleLeaveChat() {
    setActiveUsername("");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col">
        <header className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Project Lobby
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect and chat with your project team in real time.
            </p>
          </div>

          {activeUsername && (
            <button
              type="button"
              onClick={handleLeaveChat}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              Leave Chat
            </button>
          )}
        </header>

        {!activeUsername ? (
          <section className="m-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">
              Join the conversation
            </h2>

            <p className="mb-5 text-sm text-muted-foreground">
              Choose a username to enter the project lobby.
            </p>

            <form onSubmit={handleJoinChat} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                maxLength={30}
                required
                autoComplete="nickname"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <button
                type="submit"
                disabled={!username.trim()}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Join Chat
              </button>
            </form>
          </section>
        ) : (
          <section className="flex h-[70vh] min-h-[400px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <RealtimeChat
              key={activeUsername}
              supabaseClient={supabase}
              roomName="room:lobby"
              username={activeUsername}
            />
          </section>
        )}
      </div>
    </main>
  );
}