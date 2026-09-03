export const SITE_NAME = "NEONVERSE";
export const SITE_TAGLINE = "Future-Proof Electronics";

export const CATEGORIES = [
  "Audio",
  "Keyboards",
  "Wearables",
  "VR & Gaming",
  "Accessories",
  "Displays",
  "Laptops",
] as const;

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc" | "newest";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

export const PER_PAGE = 8;
