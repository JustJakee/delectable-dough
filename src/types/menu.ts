export type MenuItemSize = {
  id: string;
  label: string;
  price: number;
};

type MenuItemBase = {
  id: string;
  name: string;
  description?: string;
  servingNote?: string;
  sizes: MenuItemSize[];
  defaultSizeId: string;
  allowNotes: boolean;
  imageUrl?: string;
};

export type PresetItem = MenuItemBase & {
  kind: "preset";
};

export type FlavorSelectableItem = MenuItemBase & {
  kind: "flavor";
  flavorOptions: string[];
};

export type MenuItem = PresetItem | FlavorSelectableItem;

export type MenuTemplate = "catalog" | "matrix";

export type OrderMode = "online" | "requestOnly" | "viewOnly";

export type MenuMatrixColumn = {
  id: string;
  label: string;
  price: number;
};

export type MenuMatrixRow = {
  id: string;
  label: string;
};

export type MenuMatrix = {
  title: string;
  rows: MenuMatrixRow[];
  columns: MenuMatrixColumn[];
};

type MenuBase = {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  accentColor?: string;
  availabilityNote?: string;
  minimumOrderNote?: string;
  orderMode: OrderMode;
  activeFrom?: string;
  activeTo?: string;
  template?: MenuTemplate;
};

export type CatalogMenu = MenuBase & {
  template?: "catalog";
  items: MenuItem[];
  matrix?: never;
};

export type MatrixMenu = MenuBase & {
  template: "matrix";
  items?: MenuItem[];
  matrix: MenuMatrix;
};

export type Menu = CatalogMenu | MatrixMenu;

export type LineItemSource = "catalog" | "matrix";

export type LineItem = {
  lineId: string;
  menuId: string;
  menuTitle: string;
  itemId?: string;
  itemName: string;
  sizeId?: string;
  sizeLabel?: string;
  unitPrice: number;
  quantity: number;
  flavor?: string;
  notes?: string;
  source: LineItemSource;
};

export type OrderTouched = {
  dateNeeded: boolean;
  address: boolean;
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
  fulfillmentType: boolean;
  contactMethod: boolean;
};

export type OrderState = {
  selectedMenuId: string;
  draftItemId?: string;
  draftSizeId?: string;
  draftQuantity: number;
  draftFlavor?: string;
  draftNotes?: string;
  lineItems: LineItem[];
  matrixQuantities: Record<string, number>;
  editingLineId?: string;
  fulfillmentType: "pickup" | "delivery";
  dateNeeded: string;
  address?: string;
  firstName: string;
  lastName: string;
  contactMethod: "email" | "phone";
  email?: string;
  phone?: string;
  additionalNotes?: string;
  checkoutOpen: boolean;
  checkoutAttempted: boolean;
  touched: Partial<OrderTouched>;
  submitAttempted: boolean;
  status: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
};
