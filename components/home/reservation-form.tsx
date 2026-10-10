"use client";

import { Search } from "lucide-react";
import { categories } from "@/components/home/data";
import { useHomeFilters } from "@/components/home/home-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReservationForm() {
  const { setFilters } = useHomeFilters();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setFilters({
      category: String(data.get("type") ?? "All"),
      date: String(data.get("date") ?? ""),
      time: String(data.get("time") ?? ""),
      duration: Number(data.get("duration")) || 1,
      guests: Number(data.get("guests")) || 1,
    });
    document.getElementById("spaces")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
  );
}
