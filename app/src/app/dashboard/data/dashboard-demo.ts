export const demoBusiness = {
  name: "Artisan Café & Bar",
  location: "Downtown",
  staffCount: 8,
  initial: "A",
} as const;

export const demoEmployees = [
  {
    id: "maria",
    name: "Maria S.",
    role: "Head Server",
    employment: "Full-time",
    tips7d: "$642.00",
    rating: "4.96",
    reviewCount: 84,
    badge: "super-fast" as const,
    onShift: true,
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    depositLast4: "4092",
  },
  {
    id: "alex",
    name: "Alex K.",
    role: "Bartender",
    employment: "Full-time",
    tips7d: "$512.50",
    rating: "4.92",
    reviewCount: 62,
    badge: "great-drinks" as const,
    onShift: true,
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    depositLast4: "1184",
  },
  {
    id: "elena",
    name: "Elena R.",
    role: "Barista",
    employment: "Part-time",
    tips7d: "$420.00",
    rating: "4.88",
    reviewCount: 45,
    badge: "friendly-vibe" as const,
    onShift: false,
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    depositLast4: "7731",
  },
] as const;

export const demoTipDays = [
  { day: "Mon", amount: "$340", height: "45%", peak: false },
  { day: "Tue", amount: "$410", height: "55%", peak: false },
  { day: "Wed", amount: "$390", height: "50%", peak: false },
  { day: "Thu", amount: "$510", height: "70%", peak: false },
  { day: "Fri", amount: "$720", height: "88%", peak: "high" as const },
  { day: "Sat", amount: "$840", height: "100%", peak: "top" as const },
  { day: "Sun", amount: "$610", height: "75%", peak: "high" as const },
] as const;

export const demoFeedback = [
  {
    employee: "Maria S.",
    stars: 5,
    note: "Maria made our evening unforgettable. Great wine suggestion!",
    tip: "+$8.00 Tip",
    when: "4 mins ago",
  },
  {
    employee: "Alex K.",
    stars: 5,
    note: "Super quick bar service even with a packed room.",
    tip: "+$5.00 Tip",
    when: "18 mins ago",
  },
] as const;
