export const categories = ["All", "Meeting rooms", "Event halls", "Sports courts", "Study pods"];

export const spaces = [
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

export const upcoming = [
  { space: "Conference Room A", date: "Oct 14", time: "9:00 – 11:00 AM", status: "Confirmed" },
  { space: "Study Pod 4", date: "Oct 16", time: "2:00 – 4:00 PM", status: "Pending" },
];
