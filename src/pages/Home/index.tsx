import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { assetUrls } from "../../content/assets";
import { products } from "../../data/products";
import queryProducts from "../../lib/products/queryProducts";
import OrderingSteps from "../AboutPage/OrderingSteps";
import styles from "./Home.module.css";

const categories = [
  {
    label: "Strudel",
    icon: assetUrls.icons.strudel
  },
  {
    label: "Cookies",
    icon: assetUrls.icons.cookies
  },
  {
    label: "Pies",
    icon: assetUrls.icons.pies
  },
  {
    label: "Cakes",
    icon: assetUrls.icons.cakes
  },
  {
    label: "Pastries",
    icon: assetUrls.icons.pastries
  },
  {
    label: "Cupcakes",
    icon: assetUrls.icons.cupcakes
  }
];

const filterOptions = [
  { id: "best", label: "Best sellers" },
  { id: "favorite", label: "Baker's favorite" }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const pageSize = 6;

  useEffect(() => {
    setPage(1);
    setOpenId(null);
  }, [searchTerm, activeTag]);

  useEffect(() => {
    setOpenId(null);
  }, [page]);

  useEffect(() => {
    if (!openId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenId(null);
        lastTriggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openId]);

  const { filteredProducts, pagedProducts, totalPages } = useMemo(
    () =>
      queryProducts({
        products,
        searchTerm,
        activeTag,
        page,
        pageSize
      }),
    [products, searchTerm, activeTag, page, pageSize]
  );

  const handlePrev = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNext = () => {
    setPage((current) => Math.min(totalPages, current + 1));
  };

  const handleToggleDetails = (
    id: string,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    lastTriggerRef.current = event.currentTarget;
    setOpenId((current) => (current === id ? null : id));
  };

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
              <li key={category.label} className={styles.categoryItem}>
                <img
                  className={styles.categoryIcon}
                  src={category.icon}
                  alt=""
                  aria-hidden="true"
                />
                <span className={styles.categoryLabel}>{category.label}</span>
                {category.label === "Strudel" ? (
                  <>
                    <i
                      className={`${styles.signatureIcon} fa-solid fa-star`}
                      aria-hidden="true"
                      title="Signature item"
                    />
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
                    aria-pressed={isActive}
                    onClick={() =>
                      setActiveTag((prev) =>
                        prev === option.id ? null : option.id
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
          <>
            <div className={styles.productGrid}>
              {pagedProducts.map((product) => (
                <article key={product.id} className={styles.productCard}>
                  <div className={styles.productImageWrap}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className={styles.productMeta}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <Link className={styles.orderButton} to="/contact">
                      Contact Us
                    </Link>
                  </div>
                  {product.variantGroups?.length ? (
                    <div className={styles.detailsRow}>
                      <button
                        type="button"
                        className={styles.detailsButton}
                        aria-haspopup="dialog"
                        aria-expanded={openId === product.id}
                        aria-controls={`${product.id}-details`}
                        onClick={(event) =>
                          handleToggleDetails(product.id, event)
                        }
                      >
                        Other Flavors Available
                      </button>
                      {openId === product.id ? (
                        <div
                          id={`${product.id}-details`}
                          className={styles.popover}
                          role="dialog"
                          aria-label={`${product.name} details`}
                        >
                          {product.variantGroups.map((group) => (
                            <div
                              key={group.label}
                              className={styles.popoverGroup}
                            >
                              <p className={styles.popoverTitle}>
                                {group.label}
                              </p>
                              <ul className={styles.popoverList}>
                                {group.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                              {group.link ? (
                                <Link
                                  className={styles.popoverLink}
                                  to={group.link.href}
                                >
                                  {group.link.text}
                                </Link>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <nav
              className={styles.pagination}
              aria-label="Product pagination"
            >
              <button
                type="button"
                className={styles.paginationButton}
                onClick={handlePrev}
                disabled={page === 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              <p className={styles.paginationStatus}>
                Page {page} of {totalPages}
              </p>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={handleNext}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          </>
        )}
      </section>
    </div>
  );
}
