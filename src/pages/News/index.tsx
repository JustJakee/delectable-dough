import { assetUrls } from "../../content/assets";
import styles from "./News.module.css";

export default function News() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="news-title">
        <h1 id="news-title" className={styles.title}>
          OUR HOME BAKERY IS OPEN!
        </h1>
        <div className={styles.imageWrap}>
          <img
            src={assetUrls.bakeryUpdate}
            alt="Delectable Dough home bakery now open"
          />
        </div>
      </section>
    </div>
  );
}
