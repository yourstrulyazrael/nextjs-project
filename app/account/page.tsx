import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ArrowLeft, CalendarCheck, KeyRound } from "lucide-react";
import { ProfileForm } from "@/components/account/profile-form";
import { SignOutButton } from "@/components/account/sign-out-button";
import { ReservationList } from "@/components/home/upcoming-reservations";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

function formatDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
}

async function AccountContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/account");

  const email = user.email ?? "";
  const name: string = user.user_metadata?.full_name ?? "";
  const initials = (name || email).slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back{name ? `, ${name}` : ""}
          </h1>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>

      <section id="reservations" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming reservations</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/#spaces">Book a space</Link>
          </Button>
        </div>
        <ReservationList />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>How your name appears on reservations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm email={email} initialName={name} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage how you sign in.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <dl className="grid grid-cols-2 gap-y-2">
              <dt className="text-muted-foreground">Member since</dt>
              <dd>{formatDate(user.created_at)}</dd>
              <dt className="text-muted-foreground">Last sign in</dt>
              <dd>{formatDate(user.last_sign_in_at)}</dd>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/update-password">
                  <KeyRound /> Change password
                </Link>
              </Button>
              <SignOutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CalendarCheck className="size-5" />
            <span>ReserveIt</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft /> Home
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        {/* Reading the session is request-specific, so it streams in behind this boundary. */}
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
          <AccountContent />
        </Suspense>
      </main>
    </div>
  );
}
