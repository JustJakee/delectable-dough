import { assetUrls } from "../content/assets";

export type ProductVariantGroup = {
  label: string;
  items: string[];
  link?: {
    href: string;
    text: string;
  };
};

export type Product = {
  id: string;
  name: string;
  image: string;
  tags: string[];
  oneLiner?: string;
  category?: string;
  gallery?: string[];
  variantGroups?: ProductVariantGroup[];
  cta?: {
    label?: string;
    href: string;
  };
};

export const products: Product[] = [
  {
    id: "apple-strudel",
    name: "Old Fashioned Apple Strudel",
    image: assetUrls.products.strudel,
    gallery: assetUrls.products.strudelGallery,
    tags: ["best"],
    category: "strudel",
    oneLiner: "Rolled by hand with tart apples and buttery layers.",
    variantGroups: [
      {
        label: "Also available::",
        items: [
          "Cherry-liscious",
          "Blueberry Lemon",
          "Chocolate Cranberry",
          "Triple Chocolate-Caramel",
        ],
        link: {
          href: "/contact",
          text: "Questions about other flavors? Contact Us!",
        },
      },
    ],
    cta: { href: "/contact", label: "Learn more" },
  },
  {
    id: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    image: assetUrls.products.chocolateChip,
    tags: ["best"],
    category: "cookies",
    oneLiner: "Soft centers, golden edges, and extra chocolate.",
    variantGroups: [
      {
        label: "Also available:",
        items: ["Sugar", "Sprinkle", "Oatmeal"],
        link: {
          href: "/contact",
          text: "Questions about other flavors? Contact Us!",
        },
      },
    ],
    gallery: [assetUrls.products.sugarCookie],
  },
  {
    id: "kamish-bread",
    name: "Kamish Bread",
    image: assetUrls.products.kamish,
    tags: ["favorite"],
    category: "breads",
    oneLiner: "Soft slices with cinnamon and sweet spice.",
    variantGroups: [
      {
        label: "Also available:",
        items: ["Chocolate Chip"],
        link: {
          href: "/contact",
          text: "Questions about other flavors? Contact Us!",
        },
      },
    ],
    gallery: [assetUrls.products.kamishChocolateChip],
  },
  {
    id: "choc-pretzels",
    name: "Chocolate Covered pretzels",
    image: assetUrls.products.pretzels,
    tags: ["best"],
    category: "pastries",
    oneLiner: "Crunchy, dipped pretzels with a sweet finish.",
  },
  {
    id: "choc-oreos",
    name: "Chocolate Covered Oreos",
    image: assetUrls.products.oreos,
    tags: ["favorite"],
    category: "cakes",
    oneLiner: "Double Stuffed Oreos Dipped and Drizzled with Chocolate.",
  },
  {
    id: "brownies",
    name: "Brownies",
    image: assetUrls.products.brownie,
    tags: ["best"],
    category: "cakes",
    oneLiner: "Delicate, chewy cookies in assorted flavors.",
  },
];
