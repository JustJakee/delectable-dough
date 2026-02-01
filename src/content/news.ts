export type NewsItem = {
  title: string;
  date: string;
  excerpt: string;
};

export const newsItems: NewsItem[] = [
  {
    title: "Citrus season pastries return",
    date: "January 18, 2026",
    excerpt: "Blood orange tarts, yuzu cream puffs, and lemon olive oil cake."
  },
  {
    title: "Holiday pre-orders open",
    date: "December 6, 2025",
    excerpt: "Reserve croissant boxes, stollen, and festive breakfast trays."
  },
  {
    title: "Saturday bread club",
    date: "October 12, 2025",
    excerpt: "Weekly loaves with rotating heritage grains and cultured butter."
  }
];
