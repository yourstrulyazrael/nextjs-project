"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function CancelReservationButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await createClient()
      .from("reservations")
      .update({ status: "Cancelled" })
      .eq("id", id);
    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
  };

  if (!confirming) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
        Cancel
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-1">
        <Button variant="destructive" size="sm" onClick={cancel} disabled={isLoading}>
          {isLoading ? "Cancelling..." : "Confirm"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={isLoading}>
          Keep
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
