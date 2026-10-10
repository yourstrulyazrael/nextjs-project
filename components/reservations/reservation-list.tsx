import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { CancelReservationButton } from "@/components/reservations/cancel-reservation-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUpcomingReservations } from "@/lib/reservations";
import { formatTimeRange } from "@/lib/spaces";

/** Server component: lists the signed-in user's upcoming reservations. */
export async function ReservationList({ allowCancel = false }: { allowCancel?: boolean }) {
  const { reservations, error } = await getUpcomingReservations();

  if (error) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        Couldn&apos;t load reservations: {error}
      </Card>
    );
  }

  if (reservations.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="font-medium">You have no upcoming reservations.</p>
        <Button asChild size="sm">
          <Link href="/#spaces">Find a space</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reservations.map((r) => {
        const date = new Date(`${r.date}T00:00`);
        return (
          <Card key={r.id}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-center">
                <span className="text-xs uppercase text-muted-foreground">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-lg font-bold leading-none">{date.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/spaces/${r.space_slug}`} className="font-medium hover:underline">
                  {r.space_name}
                </Link>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="size-3.5" /> {formatTimeRange(r.start_time, r.duration_hours)}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="size-3.5" /> {r.guests} guests
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={r.status === "Confirmed" ? "default" : "secondary"}>{r.status}</Badge>
                {allowCancel && <CancelReservationButton id={r.id} />}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
