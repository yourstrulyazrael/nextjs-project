"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setIsLoading(true);
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={signOut} disabled={isLoading}>
      <LogOut /> {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
