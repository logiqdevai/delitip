export const clientEmployee = {
  name: "Maria",
  fullName: "Maria S.",
  role: "Server",
  venue: "Artisan Café & Bar",
  table: "Table 14",
  photo:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
  receiptId: "#DLT-8942",
} as const;

export const clientTipPresets = [
  { amount: 3, label: "Quick" },
  { amount: 5, label: "Popular", featured: true },
  { amount: 8, label: "Great!" },
] as const;

export const ClientComplimentTags = {
  SUPER_FAST: "super-fast",
  FRIENDLY_VIBE: "friendly-vibe",
  GREAT_RECOMMENDATION: "great-recommendation",
  ATTENTIVE: "attentive",
} as const;

export type ClientComplimentTag =
  (typeof ClientComplimentTags)[keyof typeof ClientComplimentTags];

export const clientComplimentOptions: {
  id: ClientComplimentTag;
  label: string;
}[] = [
  { id: ClientComplimentTags.SUPER_FAST, label: "Super fast" },
  { id: ClientComplimentTags.FRIENDLY_VIBE, label: "Friendly vibe" },
  { id: ClientComplimentTags.GREAT_RECOMMENDATION, label: "Great recommendation" },
  { id: ClientComplimentTags.ATTENTIVE, label: "Attentive" },
];

export const clientBusinessMetrics = [
  {
    label: "Total Tips Collected",
    value: "$2,845.50",
    delta: "+14.2%",
    note: "Past 7 days across 8 staff",
  },
  {
    label: "Average Tip Rate",
    value: "$4.85",
    delta: "18.4%",
    note: "Per rewarded customer",
  },
  {
    label: "Customer Satisfaction",
    value: "98.2%",
    delta: "★ 4.9 / 5",
    note: "328 verified reviews",
    deltaClass: "text-amber-700 bg-amber-50",
  },
  {
    label: "Tip Distribution Model",
    value: "100% Direct",
    delta: "Automated",
    note: "Employee Share: 100% • House: 0%",
    valueClass: "text-brand-700",
    deltaClass: "text-zinc-700 bg-neutral-fill",
  },
] as const;

export const clientLiveReviews = [
  {
    employee: "Maria S.",
    note: "Maria made our anniversary lunch truly special. Incredible recommendations!",
    tip: "$8.00",
    when: "4 mins ago",
  },
  {
    employee: "Alex K.",
    note: "Fast cocktail service even when the patio was completely full. Super clean!",
    tip: "$5.00",
    when: "18 mins ago",
  },
] as const;
