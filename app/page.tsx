import Link from "next/link";
import { Suspense } from "react";

import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Search,
  ShieldCheck,
} from "lucide-react";
import { AuthNavButton } from "@/components/home/auth-nav-button";
import { HomeFiltersProvider } from "@/components/home/home-filters";
import { ReservationForm } from "@/components/home/reservation-form";
import { SpacesExplorer } from "@/components/home/spaces-explorer";
import { UpcomingReservations } from "@/components/home/upcoming-reservations";
import { ReservationList } from "@/components/reservations/reservation-list";
import { SessionProvider, type SessionUser } from "@/components/session-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

// Read the session per request (never at module scope, or every visitor
// would share whatever user existed when the module first loaded).
async function getSessionUser(): Promise<SessionUser> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  return claims ? { id: claims.sub, email: claims.email } : null;
}

const steps = [
  { icon: Search, title: "Find a space", text: "Filter by type, date, and group size to see what's open." },
  { icon: CalendarDays, title: "Pick a time slot", text: "Choose from live availability — no double bookings." },
  { icon: CheckCircle2, title: "Get confirmed", text: "Receive instant confirmation and reminders before you arrive." },
];

export default function HomePage() {
  // Not awaited: client components resolve it inside <Suspense> so the rest
  // of the page can render immediately.
  const userPromise = getSessionUser();

  return (
    <SessionProvider userPromise={userPromise}>
      <HomeFiltersProvider>
        <div className="min-h-screen flex flex-col">
          {/* Navigation */}
          <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <CalendarCheck className="size-5" />
                <span>ReserveIt</span>
              </Link>
              <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                <Link href="#spaces" className="hover:text-foreground">Spaces</Link>
                <Link href="#how-it-works" className="hover:text-foreground">How it works</Link>
                <Link href="#my-reservations" className="hover:text-foreground">My reservations</Link>
              </div>
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <Suspense
                  fallback={
                    <Button variant="outline" size="sm" disabled>
                      Sign in
                    </Button>
                  }
                >
                  <AuthNavButton />
                </Suspense>
              </div>
            </nav>
          </header>

          <main className="flex-1">
            {/* Hero + search */}
            <section className="border-b bg-gradient-to-b from-muted/60 to-background">
              <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
                <div className="flex flex-col gap-5">
                  <Badge variant="secondary" className="w-fit">
                    Real-time availability
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Reserve the right space, right when you need it.
                  </h1>
                  <p className="max-w-lg text-lg text-muted-foreground">
                    Book meeting rooms, event halls, and sports courts in seconds. See open
                    slots, confirm instantly, and manage everything in one place.
                  </p>
                  <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><ShieldCheck className="size-4" /> Instant confirmation</span>
                    <span className="flex items-center gap-2"><Clock className="size-4" /> Free cancellation up to 24h</span>
                  </div>
                </div>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Make a reservation</CardTitle>
                    <CardDescription>Check availability for your preferred date and time.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReservationForm />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Stats */}
            <section className="border-b">
              <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 text-center md:grid-cols-4">
                {[
                  ["48", "Bookable spaces"],
                  ["12k+", "Reservations made"],
                  ["98%", "On-time check-ins"],
                  ["4.8★", "Average rating"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="text-3xl font-bold">{value}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured spaces */}
            <section id="spaces" className="mx-auto max-w-6xl px-5 py-16">
              <SpacesExplorer />
            </section>

            {/* How it works */}
            <section id="how-it-works" className="border-y bg-muted/40">
              <div className="mx-auto max-w-6xl px-5 py-16">
                <h2 className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl">
                  How it works
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {steps.map(({ icon: Icon, title, text }, i) => (
                    <div key={title} className="flex flex-col items-center gap-3 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-semibold">
                        {i + 1}. {title}
                      </h3>
                      <p className="max-w-xs text-sm text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Upcoming reservations */}
            <section id="my-reservations" className="mx-auto max-w-6xl px-5 py-16">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Your upcoming reservations</h2>
                <Button asChild variant="link" className="px-0">
                  <Link href="/account">View all</Link>
                </Button>
              </div>
              <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-muted" />}>
                <UpcomingReservations>
                  <ReservationList />
                </UpcomingReservations>
              </Suspense>
            </section>
          </main>

          <footer className="border-t">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row">
              <span className="flex items-center gap-2">
                <CalendarCheck className="size-4" /> ReserveIt
              </span>
              <span>© 2026 ReserveIt. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </HomeFiltersProvider>
    </SessionProvider>
  );
}
