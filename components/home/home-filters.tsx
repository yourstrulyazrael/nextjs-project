"use client";

import { createContext, useContext, useState } from "react";

export type HomeFilters = {
  category: string;
  guests: number;
  date: string;
  time: string;
  duration: number;
};

export const defaultFilters: HomeFilters = {
  category: "All",
  guests: 1,
  date: "",
  time: "",
  duration: 1,
};

type HomeFiltersContextValue = {
  filters: HomeFilters;
  setFilters: React.Dispatch<React.SetStateAction<HomeFilters>>;
};

const HomeFiltersContext = createContext<HomeFiltersContextValue | null>(null);

export function HomeFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<HomeFilters>(defaultFilters);
  return (
    <HomeFiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </HomeFiltersContext.Provider>
  );
}

export function useHomeFilters() {
  const ctx = useContext(HomeFiltersContext);
  if (!ctx) throw new Error("useHomeFilters must be used within a HomeFiltersProvider");
  return ctx;
}
