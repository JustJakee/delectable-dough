export type AvailabilityType =
  | "year_round"
  | "seasonal"
  | "holiday"
  | "special_request"
  | "out_of_season";

export type Availability = {
  type: AvailabilityType;
  details?: string;
};

export type Price = {
  amount: string;
  label?: string;
  notes?: string;
};

export type Variant = {
  name: string;
  prices?: Price[];
  sizes?: string[];
  minimumOrder?: string;
  availability?: Availability;
  notes?: string[];
};

export type MenuItem = {
  name: string;
  description?: string;
  variants?: Variant[];
  prices?: Price[];
  minimumOrder?: string;
  sizes?: string[];
  availability?: Availability;
  notes?: string[];
};

export type MenuSection = {
  title: string;
  description?: string;
  items: MenuItem[];
};

export type Menu = {
  id: string;
  title: string;
  description: string;
  sections: MenuSection[];
};
