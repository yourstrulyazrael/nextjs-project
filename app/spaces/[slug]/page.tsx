import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRight, Check, Clock, MapPin, Star, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatTime, getSpace, reserveHref, spaces } from "@/lib/spaces";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return spaces.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const space = getSpace((await params).slug);
  return { title: space ? `${space.name} · ReserveIt` : "Space not found" };
}

export default async function SpacePage({ params }: Props) {
  const space = getSpace((await params).slug);
  if (!space) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref="/#spaces" backLabel="All spaces" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <div className={`relative mb-8 h-56 rounded-xl bg-gradient-to-br md:h-72 ${space.gradient}`}>
          <Badge className="absolute left-4 top-4 bg-background/90 text-foreground hover:bg-background">
            {space.category}
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{space.name}</h1>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-4" /> {space.location}</span>
                <span className="flex items-center gap-1"><Users className="size-4" /> Up to {space.capacity} guests</span>
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" /> {space.rating}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground">{space.description}</p>

            <div>
              <h2 className="mb-3 font-semibold">Amenities</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {space.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Card className="h-fit lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-2xl">
                {formatPrice(space.pricePerHour)}
                <span className="text-base font-normal text-muted-foreground"> / hour</span>
              </CardTitle>
              <CardDescription>Pick an open slot or choose your own time.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Clock className="size-3.5" /> Open slots
                </p>
                <div className="flex flex-wrap gap-2">
                  {space.slots.map((slot) => (
                    <Link
                      key={slot}
                      href={reserveHref(space.slug, { time: slot })}
                      className={cn(badgeVariants({ variant: "outline" }), "px-3 py-1 font-normal hover:bg-accent")}
                    >
                      {formatTime(slot)}
                    </Link>
                  ))}
                </div>
              </div>
              <Button asChild size="lg">
                <Link href={reserveHref(space.slug)}>
                  Reserve this space <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
