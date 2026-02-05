import type { RefObject } from "react";
import styles from "../../pages/OrderPage.module.css";

type MobileCartBarProps = {
  itemCount: number;
  subtotal: number;
  onOpen: () => void;
  showHint?: boolean;
  hintText?: string;
  buttonRef?: RefObject<HTMLButtonElement>;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function MobileCartBar({
  itemCount,
  subtotal,
  onOpen,
  showHint,
  hintText = "Add at least one item to continue.",
  buttonRef,
}: MobileCartBarProps) {
  return (
    <div className={styles.mobileCartWrap}>
      {showHint ? <p className={styles.cartHint}>{hintText}</p> : null}
      <div className={styles.mobileCartBar}>
        <div>
          <p className={styles.cartCount}>
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </p>
          <p className={styles.cartSubtotal}>{formatMoney(subtotal)}</p>
        </div>
        <button
          type="button"
          className={styles.cartButton}
          onClick={onOpen}
          ref={buttonRef}
          aria-haspopup="dialog"
        >
          View cart / Checkout
        </button>
      </div>
    </div>
  );
}
