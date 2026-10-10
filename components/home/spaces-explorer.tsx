"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Star, Users } from "lucide-react";
import { defaultFilters, useHomeFilters } from "@/components/home/home-filters";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { categories, formatPrice, formatTime, reserveHref, spaces } from "@/lib/spaces";

export function SpacesExplorer() {
  const { filters, setFilters } = useHomeFilters();

  const visible = spaces.filter(
    (s) =>
      (filters.category === "All" || s.category === filters.category) &&
      s.capacity >= filters.guests,
  );

  const heading = filters.date
    ? `Available on ${new Date(`${filters.date}T00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}`
    : "Available today";

  // Carry the search form's details over to the reservation form.
  const prefill = {
    date: filters.date,
    time: filters.time,
    duration: filters.duration > 1 ? filters.duration : undefined,
    guests: filters.guests > 1 ? filters.guests : undefined,
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{heading}</h2>
          <p className="text-muted-foreground">
            {filters.guests > 1
              ? `Spaces that fit ${filters.guests} guests.`
              : "Popular spaces with open slots right now."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              variant={filters.category === c ? "default" : "outline"}
              size="sm"
              aria-pressed={filters.category === c}
              onClick={() => setFilters((f) => ({ ...f, category: c }))}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <p className="font-medium">No spaces match your search.</p>
          <Button variant="outline" size="sm" onClick={() => setFilters(defaultFilters)}>
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            // The title link stretches over the whole card (after:inset-0), so clicking
            // anywhere opens the details; slot chips and Reserve sit above it (z-10).
            <Card
              key={s.slug}
              className="relative flex flex-col overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-lg"
            >
              <div className={`relative h-40 bg-gradient-to-br ${s.gradient}`}>
                <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background">
                  {s.category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">
                    <Link
                      href={`/spaces/${s.slug}`}
                      className="outline-none after:absolute after:inset-0 after:content-['']"
                    >
                      {s.name}
                    </Link>
                  </CardTitle>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Star className="size-4 fill-amber-400 text-amber-400" /> {s.rating}
                  </span>
                </div>
                <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {s.location}</span>
                  <span className="flex items-center gap-1"><Users className="size-3.5" /> Up to {s.capacity}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Open slots
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.slots.map((slot) => (
                    <Link
                      key={slot}
                      href={reserveHref(s.slug, { ...prefill, time: slot })}
                      className={cn(badgeVariants({ variant: "outline" }), "relative z-10 font-normal hover:bg-accent")}
                    >
                      {formatTime(slot)}
                    </Link>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="font-semibold">{formatPrice(s.pricePerHour)} / hr</span>
                <Button asChild size="sm" className="relative z-10">
                  <Link href={reserveHref(s.slug, prefill)}>
                    Reserve <ArrowRight />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
