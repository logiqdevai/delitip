export const demoEmployee = {
  name: "Maria S.",
  role: "Head Server",
  business: "Artisan Café & Bar",
  photo:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80",
  tipLink: "delitip.com/maria-s",
  depositLast4: "4092",
  availableBalance: 142.5,
  tipsToday: 14,
  weeklyTips: "$642.00",
  weeklyTipsDelta: "+22.4%",
  weeklyTipCount: 84,
  avgTipPerTable: "$7.64",
  rating: "4.96",
  ratingCount: 84,
  topPraise: { label: "Super Fast", count: 48 },
} as const;

export const demoShiftTips = [
  {
    table: "Table 08",
    amount: "$8.00",
    shortAmount: "+$8",
    when: "4 mins ago",
    method: "Apple Pay",
    note: "Great wine suggestion!",
  },
  {
    table: "Table 12",
    amount: "$5.00",
    shortAmount: "+$5",
    when: "28 mins ago",
    method: "Credit Card",
    note: "Super friendly vibe",
  },
  {
    table: "Table 04",
    amount: "$10.00",
    shortAmount: "+$10",
    when: "1 hour ago",
    method: "Google Pay",
    note: "Amazing anniversary service",
  },
  {
    table: "Table 08",
    amount: "$6.00",
    shortAmount: "+$6",
    when: "2 hours ago",
    method: "Apple Pay",
    note: "Fast and attentive",
  },
] as const;

export const demoDailyEarnings = [
  { day: "M", amount: "$85", height: "50%", peak: false },
  { day: "T", amount: "$110", height: "65%", peak: false },
  { day: "W", amount: "$95", height: "55%", peak: false },
  { day: "T", amount: "$0", height: "5%", peak: "off" as const },
  { day: "F", amount: "$140", height: "80%", peak: "high" as const },
  { day: "S", amount: "$180", height: "100%", peak: "top" as const },
  { day: "S", amount: "$142", height: "85%", peak: "high" as const },
] as const;

export const demoBadgeCounts = [
  { id: "super-fast", label: "Super Fast", count: 48 },
  { id: "friendly-vibe", label: "Friendly Vibe", count: 36 },
  { id: "great-recommendation", label: "Great Recommendation", count: 22 },
  { id: "super-attentive", label: "Super Attentive", count: 19 },
] as const;

export const demoEmployeeReviews = [
  {
    table: "Table 08",
    tip: "$8.00",
    note: "Maria made our anniversary lunch unforgettable. Her wine recommendation paired perfectly with our meal!",
    when: "Today at 1:45 PM",
  },
  {
    table: "Table 12",
    tip: "$5.00",
    note: "Super welcoming energy even during rush hour. Fastest check turnaround I've seen.",
    when: "Today at 12:20 PM",
  },
] as const;

export const qrCells = [
  true,
  true,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  true,
  true,
  false,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
] as const;
