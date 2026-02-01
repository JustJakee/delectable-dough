import { Link, useParams } from "react-router-dom";
import { menus } from "../../content/menus";
import styles from "./MenuDetail.module.css";

export default function MenuDetail() {
  const { menuId } = useParams();
  const menu = menus.find((entry) => entry.id === menuId);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Menu</p>
        <h1>{menu ? menu.title : "Menu not found"}</h1>
        <p>
          {menu
            ? menu.description
            : "We rotate menus often. Please choose a menu from the hub."}
        </p>
        <Link className={styles.link} to="/menu">
          Back to menus
        </Link>
      </header>
      {menu ? (
        <div className={styles.content}>
          <div className={styles.sections}>
            {menu.sections.map((section) => (
              <section key={section.title} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <ul className={styles.list}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <aside className={styles.cta}>
            <h2>Contact to order</h2>
            <p>
              Planning ahead or ordering for a crowd? We will confirm availability
              and timing within two business days.
            </p>
            <Link className={styles.ctaButton} to="/contact">
              Contact to Order
            </Link>
          </aside>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Try daily pastries, seasonal cakes, savory bakes, or catering.</p>
        </div>
      )}
    </div>
  );
}
