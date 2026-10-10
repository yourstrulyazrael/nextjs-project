"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Space, formatPrice, formatTime, formatTimeRange } from "@/lib/spaces";
import { cn } from "@/lib/utils";

export type ReservationDefaults = {
  date: string;
  time: string;
  duration: number;
  guests: number;
  name: string;
};

const fieldClass =
  "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function localDateString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ReservationRequestForm({
  space,
  defaults,
}: {
  space: Space;
  defaults: ReservationDefaults;
}) {
  const [date, setDate] = useState(defaults.date);
  const [time, setTime] = useState(defaults.time);
  const [duration, setDuration] = useState(defaults.duration);
  const [guests, setGuests] = useState(defaults.guests);
  const [name, setName] = useState(defaults.name);
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Computed after mount so it uses the visitor's timezone, not the server's.
  const [today, setToday] = useState<string>();

  useEffect(() => setToday(localDateString(new Date())), []);

  const total = space.pricePerHour * duration;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (today && date < today) return setError("Please choose today or a future date.");
    if (guests > space.capacity) return setError(`${space.name} fits up to ${space.capacity} guests.`);

    setIsSubmitting(true);
    const { error } = await createClient().from("reservations").insert({
      space_slug: space.slug,
      space_name: space.name,
      date,
      start_time: time,
      duration_hours: duration,
      guests,
      contact_name: name.trim(),
      contact_phone: phone.trim(),
      purpose: purpose.trim() || null,
      total_price: total,
    });
    setIsSubmitting(false);

    if (error) return setError(error.message);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader className="items-center">
          <CheckCircle2 className="size-12 text-primary" />
          <CardTitle className="text-2xl">Reservation requested</CardTitle>
          <CardDescription>
            {space.name} on{" "}
            {new Date(`${date}T00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })},{" "}
            {formatTimeRange(time, duration)}. We&apos;ll confirm it shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/account#reservations">View my reservations</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#spaces">Book another space</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reserve {space.name}</CardTitle>
          <CardDescription>Fill in your booking details. You can cancel anytime from your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Start time</Label>
              <Input id="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
              <span className="text-xs text-muted-foreground">Open slots:</span>
              {space.slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  size="sm"
                  variant={time === slot ? "default" : "outline"}
                  className="h-7 px-2 text-xs"
                  onClick={() => setTime(slot)}
                >
                  {formatTime(slot)}
                </Button>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={cn(fieldClass, "h-9")}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h} className="bg-background">
                    {h} {h === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guests">Guests (max {space.capacity})</Label>
              <Input
                id="guests"
                type="number"
                required
                min={1}
                max={space.capacity}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Contact name</Label>
              <Input id="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Contact number</Label>
              <Input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="09XX XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="purpose">Purpose (optional)</Label>
              <textarea
                id="purpose"
                rows={3}
                placeholder="e.g. Weekly team meeting"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={cn(fieldClass, "py-2")}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-500 sm:col-span-2">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="sm:col-span-2" disabled={isSubmitting}>
              <CalendarCheck /> {isSubmitting ? "Submitting..." : "Request reservation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>{space.location}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Space</span>
            <span className="text-right font-medium">{space.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>
              {date
                ? new Date(`${date}T00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span>{time ? formatTimeRange(time, duration) : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span>{formatPrice(space.pricePerHour)} × {duration} hr</span>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-medium">Total</span>
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </div>
          <Badge variant="secondary" className="w-fit">Pay on arrival</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
