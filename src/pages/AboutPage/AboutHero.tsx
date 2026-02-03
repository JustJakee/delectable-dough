import styles from "./AboutPage.module.css";

type AboutHeroProps = {
  onStartOrder: () => void;
  onViewMenu: () => void;
};

export default function AboutHero({
  onStartOrder,
  onViewMenu,
}: AboutHeroProps) {
  return (
    <header className={styles.heroSection} aria-labelledby="about-hero-title">
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>About Delectable Dough</p>
        <h1 id="about-hero-title" className={styles.heroTitle}>
          Handmade bakes with a family story in every layer.
        </h1>
        <p className={styles.heroSubtitle}>
          From rolled strudel to sweet trays, we bake with patience, warm
          butter, and a whole lot of heart.
        </p>
        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={onViewMenu}
          >
            View Our Products
          </button>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={onStartOrder}
          >
            Start an Order
          </button>
        </div>
      </div>
    </header>
  );
}
