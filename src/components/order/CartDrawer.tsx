import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import styles from "../../pages/OrderPage.module.css";

type CartDrawerProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onContinue: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

const focusableSelector =
  "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export default function CartDrawer({
  isOpen,
  title,
  onClose,
  onContinue,
  returnFocusRef,
  children,
}: CartDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusPanel = () => {
      const panel = panelRef.current;
      if (!panel) {
        return;
      }
      const focusable = panel.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        panel.focus();
      }
    };

    focusPanel();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const panel = panelRef.current;
      if (!panel) {
        return;
      }
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((node) => !node.hasAttribute("disabled"));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const target = returnFocusRef?.current ?? previouslyFocusedRef.current;
      target?.focus();
    };
  }, [isOpen, onClose, returnFocusRef]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`${styles.drawerBackdrop} ${styles.drawerBackdropOpen}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`${styles.drawerPanel} ${styles.drawerPanelOpen}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className={styles.drawerHeader}>
          <h3 id="cart-drawer-title" className={styles.drawerTitle}>
            {title}
          </h3>
          <button type="button" className={styles.linkButton} onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.drawerBody}>{children}</div>
        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.continueButton}
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
