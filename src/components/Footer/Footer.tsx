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
          <p className={styles.label}>Visit Our Socials</p>
          <ul className={styles.socials}>
            <li>
              <a
                href="https://www.facebook.com/DelectableDough/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Delectable Dough on Facebook"
              >
                <i
                  className={`fa-brands fa-facebook ${styles.socialIcon}`}
                  aria-hidden="true"
                />
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/delectabledough"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Delectable Dough on Instagram"
              >
                <i
                  className={`fa-brands fa-instagram ${styles.socialIcon}`}
                  aria-hidden="true"
                />
                Instagram
              </a>
            </li>
          </ul>
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
        <p>Wholesale and event orders welcome. Reach out for seasonal menus or special requests.</p>
        <p>
          © 2026 Copyright{" "}
          <a
            href="https://linkedin.com/in/jake-bertish"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jake Bertish
          </a>
        </p>
      </div>
    </footer>
  );
}
