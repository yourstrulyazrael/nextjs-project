"use client";

import { createClient } from "@/lib/supabase/client";
import { createContext, use, useContext, useEffect, useState } from "react";

export type SessionUser = { id: string; email?: string } | null;

type SessionContextValue = {
  userPromise: Promise<SessionUser>;
  // `undefined` until the browser client reports an auth event.
  liveUser: SessionUser | undefined;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<SessionUser>;
  children: React.ReactNode;
}) {
  const [liveUser, setLiveUser] = useState<SessionUser | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    // Fires on sign in, sign out, token refresh, and once on mount with the
    // persisted session, so the UI stays in sync without a page reload.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLiveUser(
        session?.user ? { id: session.user.id, email: session.user.email } : null,
      );
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ userPromise, liveUser }}>
      {children}
    </SessionContext.Provider>
  );
}

/** Must be rendered inside a <Suspense> boundary. */
export function useUser(): SessionUser {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useUser must be used within a SessionProvider");
  const initialUser = use(ctx.userPromise);
  return ctx.liveUser !== undefined ? ctx.liveUser : initialUser;
}
