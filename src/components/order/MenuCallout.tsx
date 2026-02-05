import type { Menu } from "../../types/menu";
import styles from "../../pages/OrderPage.module.css";

type MenuCalloutProps = {
  menu: Menu;
  status: "available" | "requestOnly" | "viewOnly" | "outOfSeason";
  statusLabel: string;
};

const CONTACT_EMAIL = "DelectableDoughBakingCo@gmail.com";

export default function MenuCallout({
  menu,
  status,
  statusLabel,
}: MenuCalloutProps) {
  const showSpecialRequestNote =
    status === "requestOnly" || status === "outOfSeason";
  const isViewOnly = status === "viewOnly";

  return (
    <aside className={styles.menuCallout} aria-live="polite">
      <div className={styles.menuCalloutHeader}>
        <span className={styles.menuStatus}>{statusLabel}</span>
        {menu.badge ? (
          <span className={styles.menuBadge}>{menu.badge}</span>
        ) : null}
      </div>
      <h3 className={styles.menuTitle}>{menu.title}</h3>
      {menu.description ? (
        <p className={styles.menuDescription}>{menu.description}</p>
      ) : null}
      {menu.minimumOrderNote ? (
        <p className={`${styles.menuNote} ${styles.menuMinimumNote}`}>
          {menu.minimumOrderNote}
        </p>
      ) : null}
      {menu.availabilityNote ? (
        <p className={styles.menuNote}>{menu.availabilityNote}</p>
      ) : null}
      {showSpecialRequestNote ? (
        <p className={styles.menuNotice}>
          We will confirm availability and follow up with an invoice.
        </p>
      ) : null}
      {isViewOnly ? (
        <div className={styles.menuNotice}>
          <p>
            Online ordering is not available for this menu. Call or email us to
            request it.
          </p>
          <a className={styles.linkButton} href={`mailto:${CONTACT_EMAIL}`}>
            Email us to request it
          </a>
        </div>
      ) : null}
    </aside>
  );
}
