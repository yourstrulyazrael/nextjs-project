import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories = ["All", "Meeting rooms", "Event halls", "Sports courts", "Study pods"];

const spaces = [
  {
    name: "Conference Room A",
    category: "Meeting rooms",
    location: "Main Building, 3F",
    capacity: 12,
    rating: 4.8,
    price: "₱500 / hr",
    slots: ["9:00 AM", "1:00 PM", "3:30 PM"],
    gradient: "from-sky-500/80 to-indigo-600/80",
  },
  {
    name: "Grand Function Hall",
    category: "Event halls",
    location: "Annex Building, GF",
    capacity: 200,
    rating: 4.9,
    price: "₱4,500 / hr",
    slots: ["10:00 AM", "6:00 PM"],
    gradient: "from-amber-500/80 to-rose-600/80",
  },
  {
    name: "Indoor Basketball Court",
    category: "Sports courts",
    location: "Sports Complex",
    capacity: 30,
    rating: 4.7,
    price: "₱800 / hr",
    slots: ["7:00 AM", "4:00 PM", "8:00 PM"],
    gradient: "from-emerald-500/80 to-teal-600/80",
  },
];

const upcoming = [
  { space: "Conference Room A", date: "Oct 14", time: "9:00 – 11:00 AM", status: "Confirmed" },
  { space: "Study Pod 4", date: "Oct 16", time: "2:00 – 4:00 PM", status: "Pending" },
];

const steps = [
  { icon: Search, title: "Find a space", text: "Filter by type, date, and group size to see what's open." },
  { icon: CalendarDays, title: "Pick a time slot", text: "Choose from live availability — no double bookings." },
  { icon: CheckCircle2, title: "Get confirmed", text: "Receive instant confirmation and reminders before you arrive." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/home" className="flex items-center gap-2 font-semibold">
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
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Sign in</Link>
            </Button>
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
                <form action="/home" method="get" className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="type">Space type</Label>
                    <select
                      id="type"
                      name="type"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-background">
                          {c === "All" ? "Any space" : c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Start time</Label>
                    <Input id="time" name="time" type="time" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input id="duration" name="duration" type="number" min={1} max={12} defaultValue={1} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="guests">Guests</Label>
                    <Input id="guests" name="guests" type="number" min={1} defaultValue={2} />
                  </div>
                  <Button type="submit" size="lg" className="sm:col-span-2">
                    <Search /> Check availability
                  </Button>
                </form>
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
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Available today</h2>
              <p className="text-muted-foreground">Popular spaces with open slots right now.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c, i) => (
                <Button key={c} variant={i === 0 ? "default" : "outline"} size="sm">
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spaces.map((s) => (
              <Card key={s.name} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                <div className={`relative h-40 bg-gradient-to-br ${s.gradient}`}>
                  <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background">
                    {s.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{s.name}</CardTitle>
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
                      <Badge key={slot} variant="outline" className="font-normal">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="font-semibold">{s.price}</span>
                  <Button size="sm">
                    Reserve <ArrowRight />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
            <Button variant="link" className="px-0">View all</Button>
          </div>
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
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row">
          <span className="flex items-center gap-2">
            <CalendarCheck className="size-4" /> ReserveIt
          </span>
          <span>© {new Date().getFullYear()} ReserveIt. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
