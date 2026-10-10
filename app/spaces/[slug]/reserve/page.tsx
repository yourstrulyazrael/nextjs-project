import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import {
  ReservationRequestForm,
  type ReservationDefaults,
} from "@/components/reservations/reservation-request-form";
import { SiteHeader } from "@/components/site-header";
import { getSpace, spaces, type Space } from "@/lib/spaces";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function generateStaticParams() {
  return spaces.map((s) => ({ slug: s.slug }));
}

async function ReserveContent({ space, searchParams }: { space: Space; searchParams: SearchParams }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?next=/spaces/${space.slug}/reserve`);

  // Prefill from the homepage search / chosen slot, e.g. ?date=2026-10-20&time=09:00&guests=4
  const sp = await searchParams;
  const param = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : "");
  const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n || min, min), max);

  const defaults: ReservationDefaults = {
    date: /^\d{4}-\d{2}-\d{2}$/.test(param("date")) ? param("date") : "",
    time: /^\d{2}:\d{2}$/.test(param("time")) ? param("time") : "",
    duration: clamp(Number(param("duration")), 1, 12),
    guests: clamp(Number(param("guests")), 1, space.capacity),
    name: user.user_metadata?.full_name ?? "",
  };

  return <ReservationRequestForm space={space} defaults={defaults} />;
}

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const space = getSpace((await params).slug);
  if (!space) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref={`/spaces/${space.slug}`} backLabel="Back to space" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
          <ReserveContent space={space} searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
