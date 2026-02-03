import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { assetUrls } from "../../content/assets";
import { products } from "../../data/products";
import queryProducts from "../../lib/products/queryProducts";
import styles from "./MenuHub.module.css";

const filterOptions = [
  { id: "best", label: "Best sellers" },
  { id: "favorite", label: "Baker's favorite" }
];

export default function MenuHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sliderIndex, setSliderIndex] = useState<Record<string, number>>({});
  const pageSize = 24;
  const placeholderGallery = [
    "https://placehold.net/800x600.png",
    "https://placehold.net/800x600.png",
    "https://placehold.net/800x600.png"
  ];

  useEffect(() => {
    setPage(1);
    setExpandedId(null);
  }, [searchTerm, activeTag]);

  useEffect(() => {
    setExpandedId(null);
  }, [page]);

  useEffect(() => {
    if (!expandedId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setExpandedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedId]);

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

  const handleToggleExpand = (id: string) => {
    setExpandedId((current) => {
      const next = current === id ? null : id;
      if (next && sliderIndex[id] === undefined) {
        setSliderIndex((prev) => ({ ...prev, [id]: 0 }));
      }
      return next;
    });
  };

  const handlePrevImage = (id: string, galleryLength: number) => {
    setSliderIndex((prev) => {
      const current = prev[id] ?? 0;
      const next = (current - 1 + galleryLength) % galleryLength;
      return { ...prev, [id]: next };
    });
  };

  const handleNextImage = (id: string, galleryLength: number) => {
    setSliderIndex((prev) => {
      const current = prev[id] ?? 0;
      const next = (current + 1) % galleryLength;
      return { ...prev, [id]: next };
    });
  };

  const handleSelectImage = (id: string, index: number) => {
    setSliderIndex((prev) => ({ ...prev, [id]: index }));
  };

  return (
    <div className={styles.page}>
      <section className={styles.catalog} aria-labelledby="catalog-title">
        <div className={styles.catalogHeader}>
          <h2 id="catalog-title" className={styles.catalogTitle}>
            Explore the bakery lineup
          </h2>
          <p className={styles.catalogSubtitle}>
            Browse our products and seasonal offerings.
          </p>
        </div>
        <div className={styles.searchBlock}>
          <label className={styles.searchLabel} htmlFor="catalog-search">
            Search the catalog
          </label>
          <input
            id="catalog-search"
            className={styles.searchInput}
            type="search"
            placeholder="Search products"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className={styles.filters} role="group" aria-label="Product filters">
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

        {filteredProducts.length === 0 ? (
          <p className={styles.emptyState}>No products match that search.</p>
        ) : (
          <>
            <div className={styles.grid}>
              {pagedProducts.map((product) => {
                const ctaLabel = product.cta?.label ?? "Learn more";
                const ctaHref = product.cta?.href ?? "/contact";
                const isExpanded = expandedId === product.id;
                const tagLabels = product.tags.reduce<string[]>((labels, tag) => {
                  if (tag === "best") {
                    labels.push("Best seller");
                  } else if (tag === "favorite") {
                    labels.push("Baker's favorite");
                  }
                  return labels;
                }, []);
                const isPlaceholderImage =
                  !product.image || product.image === assetUrls.productPlaceholder;
                const gallery =
                  product.gallery && product.gallery.length > 0
                    ? product.gallery
                    : placeholderGallery;
                const galleryLength = gallery.length;
                const activeSlide =
                  (sliderIndex[product.id] ?? 0) % galleryLength;

                return (
                  <article key={product.id} className={styles.card}>
                    <div
                      className={`${styles.cardMedia} ${
                        isPlaceholderImage ? styles.cardMediaPlaceholder : ""
                      }`}
                    >
                      {!isPlaceholderImage ? (
                        <img src={product.image} alt={product.name} />
                      ) : null}
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardText}>
                        <h3 className={styles.cardTitle}>{product.name}</h3>
                        {product.oneLiner ? (
                          <p className={styles.cardOneLiner}>
                            {product.oneLiner}
                          </p>
                        ) : null}
                        {tagLabels.length ? (
                          <div className={styles.tagRow}>
                            {tagLabels.map((label) => (
                              <span key={label} className={styles.tagBadge}>
                                {label}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.cardActions}>
                        {ctaLabel === "Order now" ? (
                          <Link className={styles.orderButton} to={ctaHref}>
                            {ctaLabel}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className={styles.learnMoreButton}
                            aria-expanded={isExpanded}
                            aria-controls={`${product.id}-details`}
                            onClick={() => handleToggleExpand(product.id)}
                          >
                            {isExpanded ? "Hide details" : ctaLabel}
                          </button>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <div
                        id={`${product.id}-details`}
                        className={styles.cardDetails}
                      >
                        {product.variantGroups?.length ? (
                          <div className={styles.detailGroup}>
                            {product.variantGroups.map((group) => (
                              <div
                                key={group.label}
                                className={styles.detailBlock}
                              >
                                <p className={styles.detailTitle}>
                                  {group.label}
                                </p>
                                <ul className={styles.detailList}>
                                  {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                                {group.link ? (
                                  <Link
                                    className={styles.detailLink}
                                    to={group.link.href}
                                  >
                                    {group.link.text}
                                  </Link>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                        <div className={styles.slider}>
                          <div className={styles.sliderMedia}>
                            <img
                              src={gallery[activeSlide]}
                              alt={`${product.name} gallery ${activeSlide + 1}`}
                            />
                          </div>
                          <div className={styles.sliderControls}>
                            <button
                              type="button"
                              className={styles.sliderButton}
                              onClick={() =>
                                handlePrevImage(product.id, galleryLength)
                              }
                              aria-label="Previous product image"
                            >
                              Previous
                            </button>
                            <div
                              className={styles.sliderDots}
                              role="group"
                              aria-label="Image carousel"
                            >
                              {gallery.map((_, index) => (
                                <button
                                  key={`${product.id}-dot-${index}`}
                                  type="button"
                                  className={`${styles.sliderDot} ${
                                    index === activeSlide
                                      ? styles.sliderDotActive
                                      : ""
                                  }`}
                                  aria-label={`Go to image ${index + 1}`}
                                  aria-current={
                                    index === activeSlide ? "true" : undefined
                                  }
                                  onClick={() =>
                                    handleSelectImage(product.id, index)
                                  }
                                />
                              ))}
                            </div>
                            <button
                              type="button"
                              className={styles.sliderButton}
                              onClick={() =>
                                handleNextImage(product.id, galleryLength)
                              }
                              aria-label="Next product image"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
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
