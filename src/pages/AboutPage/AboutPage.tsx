import { useNavigate } from "react-router-dom";
import StorySplit from "./StorySplit";
import Testimonials from "./Testimonials";
import styles from "./AboutPage.module.css";

type AboutPageProps = {
  onStartOrder?: () => void;
  onViewMenu?: () => void;
  onContact?: () => void;
};

export default function AboutPage({
  onStartOrder,
  onViewMenu,
  onContact,
}: AboutPageProps) {
  const navigate = useNavigate();

  const handleStartOrder = onStartOrder ?? (() => navigate("/contact"));
  const handleViewMenu = onViewMenu ?? (() => navigate("/menu"));
  const handleContact = onContact ?? (() => navigate("/contact"));

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>About Delectable Dough</p>
        <h1 className={styles.pageTitle}>
          Handmade <span className={styles.noWrap}>bakes with</span> a family
          story in every layer.
        </h1>
        <p className={styles.heroSubtitle}>
          From rolled strudel to sweet trays, we bake with patience, warm
          butter, and a whole lot of heart.
        </p>
        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={handleViewMenu}
          >
            View Our Products
          </button>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={handleStartOrder}
          >
            Start an Order
          </button>
        </div>
      </header>
      <StorySplit />
      <Testimonials />
      <section className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={styles.finalCtaCard}>
          <div className={styles.finalCtaCopy}>
            <p className={styles.eyebrow}>Ready to order?</p>
            <h2 id="final-cta-title" className={styles.sectionTitle}>
              Let us bake for your next gathering.
            </h2>
            <p>
              We can make you that special holiday gift, sweet tray, or
              condolence tray. Let us make your special occasion a SWEET MEMORY.
              We look forward to serving you!
            </p>
          </div>
          <div className={styles.finalCtaActions}>
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={handleStartOrder}
            >
              Start an Order
            </button>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={handleContact}
            >
              Contact
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
