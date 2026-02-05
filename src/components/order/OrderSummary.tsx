import type { RefObject } from "react";
import type { LineItem } from "../../types/menu";
import styles from "../../pages/OrderPage.module.css";

type OrderSummaryProps = {
  lineItems: LineItem[];
  subtotal: number;
  onEdit: (lineId: string) => void;
  onRemove: (lineId: string) => void;
  onCheckout?: () => void;
  checkoutLabel?: string;
  checkoutDisabled?: boolean;
  showEmptyHint?: boolean;
  emptyHintText?: string;
  checkoutButtonRef?: RefObject<HTMLButtonElement | null>;
  idPrefix: string;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function OrderSummary({
  lineItems,
  subtotal,
  onEdit,
  onRemove,
  onCheckout,
  checkoutLabel = "Checkout",
  checkoutDisabled,
  showEmptyHint,
  emptyHintText = "Add at least one item to checkout.",
  checkoutButtonRef,
  idPrefix,
}: OrderSummaryProps) {
  const summaryId = `${idPrefix}-order-summary`;
  const menuCount = new Set(lineItems.map((item) => item.menuTitle)).size;

  return (
    <section className={styles.summaryPanel} aria-labelledby={summaryId}>
      <div className={styles.summaryHeader}>
        <h3 id={summaryId} className={styles.summaryTitle}>
          Order Summary
        </h3>
        <p className={styles.summaryMeta}>
          {lineItems.length} item{lineItems.length === 1 ? "" : "s"}
        </p>
      </div>
      {lineItems.length === 0 ? (
        <p className={styles.summaryEmpty}>
          Your cart is empty. Add an item to get started.
        </p>
      ) : (
        <ul className={styles.summaryList}>
          {lineItems.map((item) => (
            <li key={item.lineId} className={styles.summaryItem}>
              <div>
                <p className={styles.summaryItemName}>{item.itemName}</p>
                <p className={styles.summaryItemMeta}>
                  {menuCount > 1 && item.source === "catalog"
                    ? `${item.menuTitle} - `
                    : ""}
                  {item.sizeLabel ? `${item.sizeLabel} - ` : ""}Qty{" "}
                  {item.quantity}
                  {item.flavor ? ` - ${item.flavor}` : ""}
                </p>
                {item.notes ? (
                  <p className={styles.summaryItemNotes}>{item.notes}</p>
                ) : null}
              </div>
              <div className={styles.summaryItemActions}>
                <p className={styles.summaryItemTotal}>
                  {formatMoney(item.unitPrice * item.quantity)}
                </p>
                <div className={styles.summaryButtons}>
                  {item.source === "catalog" ? (
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => onEdit(item.lineId)}
                    >
                      Edit
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => onRemove(item.lineId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.summarySubtotal}>
        <span>Subtotal</span>
        <strong>{formatMoney(subtotal)}</strong>
      </div>
      {showEmptyHint && lineItems.length === 0 ? (
        <p className={styles.summaryHint}>{emptyHintText}</p>
      ) : null}
      {onCheckout ? (
        <button
          type="button"
          className={styles.checkoutButton}
          onClick={onCheckout}
          disabled={checkoutDisabled}
          aria-disabled={checkoutDisabled}
          aria-haspopup="dialog"
          data-disabled={checkoutDisabled}
          ref={checkoutButtonRef}
        >
          {checkoutLabel}
        </button>
      ) : null}
    </section>
  );
}
