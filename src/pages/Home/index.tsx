import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { assetUrls } from "../../content/assets";
import OrderingSteps from "../AboutPage/OrderingSteps";
import styles from "./Home.module.css";

const categories = [
  "Strudel",
  "Cookies",
  "Pies",
  "Cakes",
  "Pastries",
  "Cupcakes",
];

const filterOptions = [
  { id: "best", label: "Best sellers" },
  { id: "favorite", label: "Baker's favorite" },
];

const products = [
  {
    id: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    image: assetUrls.productPlaceholder,
    tags: ["best"],
  },
  {
    id: "soft-pretzels",
    name: "Soft pretzels",
    image: assetUrls.productPlaceholder,
    tags: ["best"],
  },
  {
    id: "baguette-rolls",
    name: "Baguette soft breads",
    image: assetUrls.productPlaceholder,
    tags: ["favorite"],
  },
  {
    id: "hazelnut-bars",
    name: "Chocolate hazelnut bars",
    image: assetUrls.productPlaceholder,
    tags: ["favorite"],
  },
  {
    id: "almond-croissant",
    name: "Almond croissant",
    image: assetUrls.productPlaceholder,
    tags: ["best"],
  },
  {
    id: "croissant-au-beurre",
    name: "Croissant au beurre",
    image: assetUrls.productPlaceholder,
    tags: ["favorite"],
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesTag = activeTag ? product.tags.includes(activeTag) : true;
      const matchesTerm = term
        ? product.name.toLowerCase().includes(term)
        : true;
      return matchesTag && matchesTerm;
    });
  }, [searchTerm, activeTag]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroTitleRow}>
          <h1 className={styles.heroTitle}>
            Welcome to{" "}
            <span className={styles.heroTitleAccent}>Delectable Dough</span>!
          </h1>
        </div>
        <div className={styles.heroMedia}>
          <img
            src={assetUrls.heroPlaceholder}
            alt="Delectable Dough strudel on linen"
          />
        </div>
        <aside className={styles.heroCategories}>
          <p className={styles.categoryTitle}>What we bake</p>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li key={category} className={styles.categoryItem}>
                <span className={styles.categoryIcon} aria-hidden="true" />
                <span className={styles.categoryLabel}>{category}</span>
                {category === "Strudel" ? (
                  <>
                    <span
                      className={`${styles.signatureIcon} material-symbols-outlined`}
                      aria-hidden="true"
                      title="Signature"
                    >
                      star_rate
                    </span>
                    <span className={styles.srOnly}>Signature</span>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
          <Link className={styles.categoryLink} to="/menu">
            View full menu
          </Link>
        </aside>
      </section>

      <OrderingSteps />

      <section className={styles.productSection}>
        <div className={styles.productHeader}>
          <div>
            <h2 className={styles.productTitle}>Find Something Sweet:</h2>
          </div>
          <div className={styles.filterRow}>
            <label className={styles.srOnly} htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              className={styles.searchInput}
              type="search"
              placeholder="Search products"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <div
              className={styles.filterGroup}
              role="group"
              aria-label="Product filters"
            >
              {filterOptions.map((option) => {
                const isActive = activeTag === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.filterChip} ${
                      isActive ? styles.filterChipActive : ""
                    }`}
                    onClick={() =>
                      setActiveTag((prev) =>
                        prev === option.id ? null : option.id,
                      )
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className={styles.emptyState}>No products match that search.</p>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.productImageWrap}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.productMeta}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <Link className={styles.orderButton} to="/contact">
                    Order now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
