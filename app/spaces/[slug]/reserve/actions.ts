"use server";

import { revalidatePath } from "next/cache";
import { formatTimeRange, getSpace } from "@/lib/spaces";
import { createClient } from "@/lib/supabase/server";

export type ReservationInput = {
  slug: string;
  date: string;
  time: string;
  duration: number;
  guests: number;
  name: string;
  phone: string;
  purpose: string;
};

export type ReservationResult = { ok: true } | { ok: false; error: string };

// Venue timezone, used to decide what "today" is regardless of where the server runs.
const VENUE_TIMEZONE = "Asia/Manila";

/** Validates a reservation request against the space catalog and saves it as Pending. */
export async function createReservation(input: ReservationInput): Promise<ReservationResult> {
  const space = getSpace(input.slug);
  if (!space) return { ok: false, error: "That space no longer exists." };

  const name = input.name.trim();
  const phone = input.phone.trim();
  const purpose = input.purpose.trim();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: VENUE_TIMEZONE });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return { ok: false, error: "Please choose a date." };
  if (input.date < today) return { ok: false, error: "Please choose today or a future date." };
  if (!/^\d{2}:\d{2}$/.test(input.time)) return { ok: false, error: "Please choose a start time." };
  if (!Number.isInteger(input.duration) || input.duration < 1 || input.duration > 12) {
    return { ok: false, error: "Duration must be between 1 and 12 hours." };
  }
  if (!Number.isInteger(input.guests) || input.guests < 1) {
    return { ok: false, error: "Please enter at least 1 guest." };
  }
  if (input.guests > space.capacity) {
    return { ok: false, error: `${space.name} fits up to ${space.capacity} guests.` };
  }
  if (!name) return { ok: false, error: "Please enter a contact name." };
  if (phone.replace(/\D/g, "").length < 7) return { ok: false, error: "Please enter a valid contact number." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session expired. Please sign in again." };

  const { error } = await supabase.from("reservations").insert({
    space_slug: space.slug,
    space_name: space.name,
    date: input.date,
    start_time: input.time,
    duration_hours: input.duration,
    guests: input.guests,
    contact_name: name,
    contact_phone: phone,
    purpose: purpose || null,
    // Priced on the server so the client can't change it.
    total_price: space.pricePerHour * input.duration,
  });

  if (error) {
    // exclusion_violation from reservations_no_overlap
    if (error.code === "23P01") {
      return {
        ok: false,
        error: `${space.name} is already booked during ${formatTimeRange(input.time, input.duration)} on that day. Please pick another time.`,
      };
    }
    console.error("createReservation failed", error);
    return { ok: false, error: "We couldn't save your reservation. Please try again." };
  }

  revalidatePath("/account");
  revalidatePath("/");
  return { ok: true };
}
