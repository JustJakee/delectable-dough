import type { Menu } from "./menuTypes";

export const menus: Menu[] = [
  {
    id: "strudel",
    title: "Strudel",
    description:
      "Classic and seasonal strudel by the slice or loaf, available in a variety of flavors.",
    sections: [
      {
        title: "Strudel",
        items: [
          {
            name: "Strudel",
            minimumOrder: "1/2 loaf (6 slices)",
            sizes: ["Whole loaf (12 slices)"],
            prices: [
              { label: "Regular size", amount: "$2.33 per slice" },
              { label: "Party size", amount: "$1.75 per slice" },
            ],
            variants: [
              { name: "Old Fashioned Apple" },
              { name: "Cherry-liscious (Cherry)" },
              { name: "Blueberry Lemon" },
              { name: "Chocolate Cranberry" },
              { name: "Triple Chocolate-Caramel" },
              { name: "Peachy Peach" },
              { name: "Apricot Almond" },
              {
                name: "Pumpkin Cheese",
                availability: { type: "seasonal", details: "fall" },
              },
              { name: "Chocolate Cherry" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "vegan-gluten-free",
    title: "Vegan / Gluten Free Menu",
    description:
      "Vegan and gluten-free favorites with customizable flavors and sizes.",
    sections: [
      {
        title: "Cookie Sandwiches",
        items: [
          {
            name: "Cookie Sandwiches",
            minimumOrder: "1/2 dozen",
            prices: [{ amount: "$4.99 each" }],
            variants: [
              { name: "Oatmeal Cream Pie" },
              { name: "Sugar Cookie Sandwich" },
              { name: "Chocolate Chip Cookie Sandwich" },
            ],
          },
        ],
      },
      {
        title: "Cupcakes",
        items: [
          {
            name: "Cupcakes",
            minimumOrder: "Regular size: 1 dozen; Large size: 1/2 dozen",
            sizes: ["Regular", "Large"],
            prices: [
              { label: "Regular (Vegan or GF)", amount: "$3.25 / $3.50" },
              { label: "Regular (Vegan & GF)", amount: "$3.75" },
              { label: "Large (Vegan or GF)", amount: "$3.99" },
              { label: "Large (Vegan & GF)", amount: "$4.25" },
            ],
            variants: [
              { name: "Chocolate" },
              { name: "Vanilla" },
              { name: "Oreo" },
              { name: "Carrot Cake" },
              { name: "Red Velvet" },
              { name: "Lemon" },
            ],
          },
        ],
      },
      {
        title: "Muffins",
        items: [
          {
            name: "Muffins",
            minimumOrder: "Regular size: 1 dozen; Large size: 1/2 dozen",
            sizes: ["Regular", "Large"],
            prices: [
              { label: "Regular (Vegan or GF)", amount: "$3.25 / $3.50" },
              { label: "Regular (Vegan & GF)", amount: "$3.75" },
              { label: "Large (Vegan or GF)", amount: "$3.99" },
              { label: "Large (Vegan & GF)", amount: "$4.25" },
            ],
            variants: [
              { name: "Blueberry" },
              { name: "Chocolate Chip" },
              { name: "Banana" },
              { name: "Apple Cinnamon" },
              { name: "Pumpkin" },
            ],
          },
        ],
      },
      {
        title: "Vegan / GF Cakes",
        items: [
          {
            name: "Vegan / GF Cakes",
            availability: { type: "special_request" },
            notes: ["Call ahead for flavors, sizes, and pricing."],
          },
        ],
      },
    ],
  },
  {
    id: "gooey-butter-cakes",
    title: "Gooey Butter Cakes",
    description: "8x8 gooey butter cakes in classic and seasonal flavors.",
    sections: [
      {
        title: "Gooey Butter Cakes",
        items: [
          {
            name: "Gooey Butter Cake",
            sizes: ["8x8"],
            variants: [
              { name: "Original" },
              { name: "Chocolate Chip" },
              { name: "Chocolate / Chocolate" },
              { name: "Cinnamon Crumble" },
              {
                name: "Pumpkin",
                availability: { type: "seasonal", details: "fall" },
              },
            ],
            notes: ["Some flavors available gluten free."],
          },
        ],
      },
    ],
  },
  {
    id: "sweet-trays",
    title: "Sweet Trays",
    description:
      "Preset trays or build-your-own dessert spreads for gatherings.",
    sections: [
      {
        title: "Preset Trays",
        items: [
          {
            name: "Simple Favorites Tray",
            sizes: ['16"'],
          },
          {
            name: "Good Morning Tray",
          },
          {
            name: "Traditional Tray",
            sizes: ['16"'],
          },
          {
            name: "Gourmet Tray",
            sizes: ['16"'],
          },
          {
            name: "Strudel Lover's Tray",
            sizes: ['12"'],
          },
        ],
      },
      {
        title: "Build Your Own",
        items: [
          {
            name: "Sweet Tray / Sweet Table / Dessert Bar",
            minimumOrder: "1 dozen per item",
            notes: [
              "Vegan & Gluten Free options available for certain items.",
              "Additional fees apply.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "traditional-seasonal",
    title: "Traditional / Seasonal Items",
    description: "Holiday favorites and traditional bakes.",
    sections: [
      {
        title: "Hamantaschen (Holiday - Purim)",
        items: [
          {
            name: "Hamantaschen",
            availability: { type: "holiday", details: "Purim" },
            variants: [
              { name: "Apple" },
              { name: "Apricot" },
              { name: "Cherry" },
              { name: "Chocolate" },
              { name: "Poppy Seed" },
              { name: "Prune" },
              { name: "Strawberry" },
              { name: "Strawberry Funfetti" },
            ],
            notes: [
              "All flavors available in Regular, Gluten Free, and Vegan.",
            ],
          },
        ],
      },
      {
        title: "Rugelach",
        items: [
          {
            name: "Rugelach",
            minimumOrder: "1 dozen",
            prices: [{ amount: "$1.25 each" }],
            variants: [
              { name: "Apricot Pecan" },
              { name: "Cinnamon Pecan" },
              { name: "Chocolate" },
              { name: "Strawberry Pecan" },
            ],
          },
        ],
      },
      {
        title: "Kamish Bread",
        items: [
          {
            name: "Kamish Bread",
            minimumOrder: "1 dozen slices",
            prices: [
              { label: 'Regular (1" x 3")', amount: "$15.00" },
              { label: 'Party Size (3/4" x 2")', amount: "$13.20" },
            ],
            variants: [
              { name: "Cinnamon Nut" },
              { name: "Chocolate Chip" },
              { name: "White Chocolate Cranberry Pistachio" },
            ],
          },
        ],
      },
      {
        title: "Honey Cake",
        items: [
          {
            name: "Honey Cake",
            sizes: ["9x4 loaf"],
          },
        ],
      },
    ],
  },
  {
    id: "passover-desserts",
    title: "Passover Desserts",
    description: "Seasonal Passover desserts.",
    sections: [
      {
        title: "Seasonal Menu",
        description: "Seasonal offerings. Pricing to be announced.",
        items: [],
      },
    ],
  },
  {
    id: "specialty-holiday-items",
    title: "Specialty Holiday Items",
    description: "Limited-time holiday trays and treats.",
    sections: [
      {
        title: "Holiday Specials",
        items: [
          {
            name: "Mother's Day Tray",
            availability: { type: "holiday", details: "Mother's Day" },
          },
          {
            name: "Chanukah Cookies",
            availability: { type: "holiday", details: "Chanukah" },
          },
          {
            name: "Caboodle of Strudel",
            availability: { type: "holiday" },
          },
        ],
      },
    ],
  },
  {
    id: "a-la-carte-items",
    title: "A La Carte Items",
    description: "Individual items for custom trays and dessert tables.",
    sections: [
      {
        title: "Brownies & Bars",
        items: [
          {
            name: "Brownie Bites",
            prices: [
              { label: "Fudge Iced", amount: "$1.15" },
              { label: "2x2 Squares", amount: "$1.25" },
              { label: "Triple Layer", amount: "$1.40" },
            ],
          },
          {
            name: "Gooey Butter Squares",
            prices: [
              { label: '2"x2"', amount: "$1.35" },
              { label: '1.5"x1.5"', amount: "$1.25" },
            ],
          },
          {
            name: "Lemon Bars",
            prices: [
              { label: '2"x2"', amount: "$1.35" },
              { label: '1.5"x1.5"', amount: "$1.25" },
            ],
          },
          {
            name: "Pecan Pie Bars",
            prices: [
              { label: '2"x2"', amount: "$1.40" },
              { label: '1.5"x1.5"', amount: "$1.30" },
            ],
          },
          {
            name: "Shortbread Crumble Bars",
            prices: [
              { label: '2"x2"', amount: "$1.35" },
              { label: '1.5"x1.5"', amount: "$1.25" },
            ],
          },
        ],
      },
      {
        title: "Dipped Treats",
        items: [
          {
            name: "Chocolate Dipped Oreos",
            prices: [
              { label: "Regular", amount: "$1.25" },
              { label: "Large", amount: "$2.75" },
            ],
          },
          {
            name: "Chocolate Dipped Pretzels",
            prices: [
              { label: "Regular", amount: "$0.80" },
              { label: "Large", amount: "$1.10" },
            ],
          },
        ],
      },
      {
        title: "Cookies & Cupcakes",
        items: [
          {
            name: "Cookies",
            prices: [{ amount: "$0.95 each" }],
          },
          {
            name: "Cupcakes",
            prices: [
              { label: "Mini", amount: "$1.67" },
              { label: "Regular", amount: "$3.00" },
            ],
          },
        ],
      },
      {
        title: "Pastry Bites",
        items: [
          {
            name: "Cream Puffs",
            prices: [
              { label: "Regular", amount: "$2.99" },
              { label: "Mini", amount: "$1.30" },
            ],
          },
          {
            name: "Rugelach",
            prices: [{ amount: "$1.25 each" }],
          },
          {
            name: "Mini Cheesecakes",
            prices: [{ amount: "$2.50 each" }],
          },
        ],
      },
    ],
  },
];
