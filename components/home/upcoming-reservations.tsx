"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { upcoming } from "@/components/home/data";
import { useUser } from "@/components/session-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UpcomingReservations() {
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

  return <ReservationList />;
}

export function ReservationList() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {upcoming.map((r) => (
        <Card key={r.space + r.date}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-center">
              <span className="text-xs uppercase text-muted-foreground">{r.date.split(" ")[0]}</span>
              <span className="text-lg font-bold leading-none">{r.date.split(" ")[1]}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{r.space}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-3.5" /> {r.time}
              </p>
            </div>
            <Badge variant={r.status === "Confirmed" ? "default" : "secondary"}>{r.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
