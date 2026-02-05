import type { Menu } from "../types/menu";

export const menus: Menu[] = [
  {
    id: "standard-trays",
    title: "Sensational Sweet Trays",
    description:
      "Flyer favorites for gatherings, offices, and family celebrations.",
    badge: "Standard",
    availabilityNote: "Available year-round. Seasonal swaps upon request.",
    minimumOrderNote: "Minimum order: 1 tray.",
    orderMode: "online",
    template: "catalog",
    items: [
      {
        id: "strudel-lovers",
        name: "Strudel Lover's",
        description:
          "All strudel, all the time. A signature mix anchored by Old Fashioned Apple.",
        servingNote: '12" serves 10-12 - 16" serves 20-25',
        sizes: [
          { id: "tray-12", label: '12" Tray', price: 48 },
          { id: "tray-16", label: '16" Tray', price: 78 },
        ],
        defaultSizeId: "tray-12",
        kind: "preset",
        allowNotes: true,
      },
      {
        id: "simple-favorites",
        name: "Simple Favorites",
        description:
          "Crowd-pleasing classics with a mix of bars, cookies, and sweet bites.",
        servingNote: '12" serves 12-14 - 16" serves 22-26',
        sizes: [
          { id: "tray-12", label: '12" Tray', price: 42 },
          { id: "tray-16", label: '16" Tray', price: 72 },
        ],
        defaultSizeId: "tray-12",
        kind: "preset",
        allowNotes: true,
      },
      {
        id: "good-morning",
        name: "Good Morning",
        description:
          "Breakfast-inspired treats with muffins, coffee cake, and morning pastries.",
        servingNote: '12" serves 10-12 - 16" serves 18-22',
        sizes: [
          { id: "tray-12", label: '12" Tray', price: 44 },
          { id: "tray-16", label: '16" Tray', price: 74 },
        ],
        defaultSizeId: "tray-12",
        kind: "preset",
        allowNotes: true,
      },
      {
        id: "gourmet",
        name: "Gourmet",
        description:
          "An elevated assortment with dipped cookies, petit bars, and decadent bites.",
        servingNote: '12" serves 10-12 - 16" serves 20-24',
        sizes: [
          { id: "tray-12", label: '12" Tray', price: 52 },
          { id: "tray-16", label: '16" Tray', price: 86 },
        ],
        defaultSizeId: "tray-12",
        kind: "preset",
        allowNotes: true,
      },
      {
        id: "traditional",
        name: "Traditional",
        description:
          "A classic spread of traditional pastries with a Delectable Dough twist.",
        servingNote: '12" serves 12-14 - 16" serves 22-26',
        sizes: [
          { id: "tray-12", label: '12" Tray', price: 46 },
          { id: "tray-16", label: '16" Tray', price: 76 },
        ],
        defaultSizeId: "tray-12",
        kind: "preset",
        allowNotes: true,
      },
    ],
  },
  {
    id: "holiday-hamantaschen",
    title: "Holiday Hamantaschen",
    description: "Mix and match classic fillings across regular, gluten-free, or vegan dough.",
    badge: "Seasonal",
    availabilityNote: "Available February 16th to March 16th.",
    orderMode: "online",
    template: "matrix",
    activeFrom: "2026-02-16",
    activeTo: "2026-03-16",
    matrix: {
      title: "Hamantaschen",
      rows: [
        { id: "apple", label: "Apple" },
        { id: "apricot", label: "Apricot" },
        { id: "poppy", label: "Poppy Seed" },
        { id: "chocolate", label: "Chocolate" },
      ],
      columns: [
        { id: "regular", label: "Regular", price: 3 },
        { id: "gluten-free", label: "Gluten-Free", price: 3.5 },
        { id: "vegan", label: "Vegan", price: 3.5 },
      ],
    },
  },
    {
    id: "holiday-hamantaschen-test",
    title: "Holiday Hamantaschen 2",
    description: "Mix and match classic fillings across regular, gluten-free, or vegan dough.",
    badge: "Seasonal",
    availabilityNote: "Available February 16th to March 16th.",
    orderMode: "online",
    template: "matrix",
    activeFrom: "2026-02-02",
    activeTo: "2026-03-16",
    matrix: {
      title: "Hamantaschen",
      rows: [
        { id: "apple", label: "Apple" },
        { id: "apricot", label: "Apricot" },
        { id: "poppy", label: "Poppy Seed" },
        { id: "chocolate", label: "Chocolate" },
      ],
      columns: [
        { id: "regular", label: "Regular", price: 3 },
        { id: "gluten-free", label: "Gluten-Free", price: 3.5 },
        { id: "vegan", label: "Vegan", price: 3.5 },
      ],
    },
  },
];
