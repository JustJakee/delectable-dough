export type MenuSection = {
  title: string;
  items: string[];
};

export type Menu = {
  id: string;
  title: string;
  description: string;
  sections: MenuSection[];
};

export const menus: Menu[] = [
  {
    id: "daily-pastries",
    title: "Daily Pastries",
    description:
      "Hand-laminated classics, morning buns, and rotating sweets baked fresh each day.",
    sections: [
      {
        title: "Croissants & viennoiserie",
        items: [
          "Butter croissant",
          "Brown butter almond croissant",
          "Chocolate rye twist",
          "Cardamom knot"
        ]
      },
      {
        title: "Morning buns & brioche",
        items: [
          "Orange blossom morning bun",
          "Cinnamon sugar bun",
          "Lemon cream brioche",
          "Citrus glaze swirl"
        ]
      },
      {
        title: "Seasonal tarts",
        items: [
          "Seasonal fruit danish",
          "Roasted plum hand pie",
          "Apple strudel slice",
          "Honey almond tart"
        ]
      }
    ]
  },
  {
    id: "seasonal-cakes",
    title: "Seasonal Cakes",
    description:
      "Whole cakes for celebrations with 48 hours notice and seasonal fruit.",
    sections: [
      {
        title: "Layer cakes",
        items: [
          "Chocolate tahini layer cake",
          "Vanilla bean shortcake",
          "Blackberry almond torte"
        ]
      },
      {
        title: "Tea cakes",
        items: [
          "Olive oil citrus cake",
          "Spiced pear chiffon",
          "Rosemary lemon loaf"
        ]
      }
    ]
  },
  {
    id: "savory-bakes",
    title: "Savory Bakes",
    description: "Savory slices, hand pies, and lunch-ready bakes.",
    sections: [
      {
        title: "Hand pies & galettes",
        items: [
          "Wild mushroom galette",
          "Spinach feta hand pie",
          "Roasted squash galette"
        ]
      },
      {
        title: "Focaccia & quiche",
        items: [
          "Roasted tomato focaccia slice",
          "Caramelized onion quiche",
          "Herb potato bun"
        ]
      }
    ]
  },
  {
    id: "catering",
    title: "Catering",
    description: "Boxed assortments and pastry boards for events of all sizes.",
    sections: [
      {
        title: "Boxed assortments",
        items: [
          "Mini croissant assortment",
          "Morning bun mix",
          "Savory bite box"
        ]
      },
      {
        title: "Boards & grazing",
        items: [
          "Pastry board with jams",
          "Tea-time tart selection",
          "Afternoon coffee bundle"
        ]
      }
    ]
  }
];
