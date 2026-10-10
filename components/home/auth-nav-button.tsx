"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useUser } from "@/components/session-provider";
import { Button } from "@/components/ui/button";

export function AuthNavButton() {
  const user = useUser();

  return user ? (
    <Button asChild size="sm">
      <Link href="/account">
        <LayoutDashboard /> Dashboard
      </Link>
    </Button>
  ) : (
    <Button asChild variant="outline" size="sm">
      <Link href="/auth/login">Sign in</Link>
    </Button>
  );
}
