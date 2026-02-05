import type { LineItem, OrderState } from "../types/menu";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatLine = (item: LineItem) => {
  const total = item.unitPrice * item.quantity;
  const sizeText = item.sizeLabel ? ` (${item.sizeLabel})` : "";
  const flavorText = item.flavor ? ` | Flavor: ${item.flavor}` : "";
  const notesText = item.notes ? ` | Notes: ${item.notes}` : "";
  return `- ${item.itemName}${sizeText} x${item.quantity} - ${formatMoney(
    total,
  )}${flavorText}${notesText}`;
};

export const formatOrderEmail = (order: OrderState) => {
  const subtotal = order.lineItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  if (order.lineItems.length === 0) {
    return [
      "Order Items:",
      "- No items",
      "",
      `Subtotal: ${formatMoney(subtotal)}`,
      order.additionalNotes ? `Notes: ${order.additionalNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  const grouped = order.lineItems.reduce<Record<string, LineItem[]>>(
    (acc, item) => {
      const key = item.menuTitle || "Selected Menu";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {},
  );

  const sections = Object.entries(grouped).flatMap(([menuTitle, items]) => [
    `Menu: ${menuTitle}`,
    ...items.map(formatLine),
    "",
  ]);

  return [
    "Order Items:",
    ...sections,
    `Subtotal: ${formatMoney(subtotal)}`,
    order.additionalNotes ? `Notes: ${order.additionalNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};
