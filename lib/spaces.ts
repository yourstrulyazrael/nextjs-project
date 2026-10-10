export const categories = ["All", "Meeting rooms", "Event halls", "Sports courts", "Study pods"];

export type Space = {
  slug: string;
  name: string;
  category: string;
  location: string;
  capacity: number;
  rating: number;
  pricePerHour: number;
  /** Open start times, 24-hour "HH:MM". */
  slots: string[];
  gradient: string;
  description: string;
  amenities: string[];
};

export const spaces: Space[] = [
  {
    slug: "conference-room-a",
    name: "Conference Room A",
    category: "Meeting rooms",
    location: "Main Building, 3F",
    capacity: 12,
    rating: 4.8,
    pricePerHour: 500,
    slots: ["09:00", "13:00", "15:30"],
    gradient: "from-sky-500/80 to-indigo-600/80",
    description:
      "A bright, quiet meeting room with a 12-seat table, ideal for team meetings, client presentations, and interviews.",
    amenities: ["65\" display with HDMI", "Whiteboard", "Video conferencing kit", "Air conditioning", "Wi-Fi"],
  },
  {
    slug: "grand-function-hall",
    name: "Grand Function Hall",
    category: "Event halls",
    location: "Annex Building, GF",
    capacity: 200,
    rating: 4.9,
    pricePerHour: 4500,
    slots: ["10:00", "18:00"],
    gradient: "from-amber-500/80 to-rose-600/80",
    description:
      "Our largest venue for seminars, receptions, and celebrations, with a stage and flexible seating for up to 200 guests.",
    amenities: ["Stage and podium", "Sound system", "Projector and screen", "Tables and chairs", "Catering area"],
  },
  {
    slug: "indoor-basketball-court",
    name: "Indoor Basketball Court",
    category: "Sports courts",
    location: "Sports Complex",
    capacity: 30,
    rating: 4.7,
    pricePerHour: 800,
    slots: ["07:00", "16:00", "20:00"],
    gradient: "from-emerald-500/80 to-teal-600/80",
    description:
      "A full-size covered court with wooden flooring, suitable for games, practice sessions, and intramurals.",
    amenities: ["Full-size court", "Scoreboard", "Locker rooms", "Bleachers", "Night lighting"],
  },
  {
    slug: "study-pod-4",
    name: "Study Pod 4",
    category: "Study pods",
    location: "Library, 2F",
    capacity: 4,
    rating: 4.6,
    pricePerHour: 150,
    slots: ["08:00", "10:00", "14:00", "16:00"],
    gradient: "from-violet-500/80 to-fuchsia-600/80",
    description:
      "A soundproofed pod for small-group study and focused work, steps away from the library stacks.",
    amenities: ["Power outlets", "Wall-mounted screen", "Whiteboard wall", "Wi-Fi"],
  },
];

export function getSpace(slug: string) {
  return spaces.find((s) => s.slug === slug);
}

export function formatPrice(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

/** "13:30" -> "1:30 PM" */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "09:00", 2 -> "9:00 AM – 11:00 AM" */
export function formatTimeRange(start: string, hours: number) {
  const [h, m] = start.split(":").map(Number);
  const endMinutes = h * 60 + m + hours * 60;
  const end = `${Math.floor(endMinutes / 60) % 24}:${String(endMinutes % 60).padStart(2, "0")}`;
  return `${formatTime(start)} – ${formatTime(end)}`;
}

/** Link to the reservation form, prefilled with any known details. */
export function reserveHref(
  slug: string,
  prefill: { date?: string; time?: string; duration?: number; guests?: number } = {},
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(prefill)) {
    if (value) params.set(key, String(value));
  }
  const query = params.toString();
  return `/spaces/${slug}/reserve${query ? `?${query}` : ""}`;
}
