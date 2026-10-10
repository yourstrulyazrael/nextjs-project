"use client";

import Link from "next/link";
import { useUser } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Shows the server-rendered list (children) to signed-in users, a sign-in prompt otherwise. */
export function UpcomingReservations({ children }: { children: React.ReactNode }) {
  const user = useUser();

  if (!user) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="font-medium">Sign in to see your upcoming reservations.</p>
        <Button asChild size="sm">
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </Card>
    );
  }

  return children;
}
