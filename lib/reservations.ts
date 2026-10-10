import { createClient } from "@/lib/supabase/server";

export type Reservation = {
  id: string;
  space_slug: string;
  space_name: string;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM" or "HH:MM:SS"
  duration_hours: number;
  guests: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  total_price: number;
};

/** The signed-in user's reservations from today onward, soonest first. */
export async function getUpcomingReservations(): Promise<{
  reservations: Reservation[];
  error: string | null;
}> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("reservations")
    .select("id, space_slug, space_name, date, start_time, duration_hours, guests, status, total_price")
    .gte("date", today)
    .neq("status", "Cancelled")
    .order("date")
    .order("start_time");

  return { reservations: (data as Reservation[]) ?? [], error: error?.message ?? null };
}
