import { Link } from "react-router-dom";
import { menus } from "../../content/menus";
import styles from "./MenuHub.module.css";

export default function MenuHub() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>What We Bake</h1>
        <p>Browse our menu collection and seasonal offerings.</p>
      </header>
      <div className={styles.grid}>
        {menus.map((menu) => (
          <article key={menu.id} className={styles.card}>
            <h2>{menu.title}</h2>
            <p>{menu.description}</p>
            <Link className={styles.link} to={`/menu/${menu.id}`}>
              View menu
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
