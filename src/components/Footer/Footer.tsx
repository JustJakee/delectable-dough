import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>Delectable Dough</p>
          <p className={styles.tagline}>Acclaimed for our Old-Fashioned Apple Strudel.</p>
        </div>
        <div>
          <p className={styles.label}>Visit</p>
          <p>123 Flour Street, Nashville, TN</p>
          <p>Tue-Sun, 7am-2pm</p>
        </div>
        <div>
          <p className={styles.label}>Contact</p>
          <p>
            <a href="mailto:hello@delectabledough.com">DelectableDoughBakingCo@gmail.com</a>
          </p>
          <p>(314) 537-2341</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>Wholesale and event orders welcome. Reach out for seasonal menus.</p>
      </div>
    </footer>
  );
}
