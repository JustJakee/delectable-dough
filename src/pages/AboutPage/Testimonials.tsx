import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./AboutPage.module.css";

type Testimonial = {
  name?: string;
  location?: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date?: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Christina Michelle",
    quote:
      "Delectable Dough is the best local baker!! Her selection of vegan options makes her my go to! Support a wonderful, woman owned, local business & you won't be disappointed!",
    rating: 5,
  },
  {
    name: "Janice Roberg",
    quote:
      "I love their strudel and I can't wait to try the honey cake for the High Holidays!",
    rating: 5,
  },
  {
    name: "Amy Shapiro Worth",
    quote: "The best tasty desserts ever!!! Everything is delicious!!!",
    rating: 5,
  },
  {
    quote: "The cookies were excellent.",
    rating: 5,
  },
  {
    quote: "Wonderful sweets - The office devoured them in a day.",
    rating: 5,
  },
  {
    quote: "The strudel was fantastic.",
    rating: 5,
  },
  {
    quote: "The sweet tray was unbelievably delicious.",
    rating: 5,
  },
  {
    quote: "Scrumptious strudel.",
    rating: 5,
  },
  {
    quote: "Beautiful sweet tray.",
    rating: 5,
  },
  {
    quote: "Wonderful pastries.",
    rating: 5,
  },
  {
    quote: "Great stuff - Inhaled not consumed.",
    rating: 5,
  },
  {
    quote: "Outrageous brownies.",
    rating: 5,
  },
  {
    quote: "Downright delicious stuff.",
    rating: 5,
  },
  {
    quote: "Marvelous sweet table.",
    rating: 5,
  },
  {
    quote: "Absolutely without a doubt the best!",
    rating: 5,
  },
];

const getItemsPerPage = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  if (window.innerWidth >= 1024) {
    return 3;
  }

  if (window.innerWidth >= 768) {
    return 2;
  }

  return 1;
};

const formatStars = (rating: Testimonial["rating"]) => "★".repeat(rating);

export default function Testimonials() {
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPageIndex((current) => {
      const total = Math.max(1, Math.ceil(testimonials.length / itemsPerPage));
      return Math.min(current, total - 1);
    });
  }, [itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(testimonials.length / itemsPerPage));

  const visibleTestimonials = useMemo(() => {
    const start = pageIndex * itemsPerPage;
    return testimonials.slice(start, start + itemsPerPage);
  }, [pageIndex, itemsPerPage]);

  const handlePrev = () => {
    setPageIndex((current) => (current - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setPageIndex((current) => (current + 1) % totalPages);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrev();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      className={styles.testimonialsSection}
      aria-labelledby="testimonials-title"
    >
      <header className={styles.sectionHeader}>
        <p className={styles.eyebrow}>Testimonials</p>
        <h2 id="testimonials-title" className={styles.sectionTitle}>
          Kind words from our community.
        </h2>
        <p className={styles.sectionSubtitle}>
          Every order is a collaboration, and we are grateful for the stories
          our customers share.
        </p>
      </header>
      <div
        className={styles.carousel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Testimonials carousel"
      >
        <div className={styles.testimonialGrid}>
          {visibleTestimonials.map((testimonial) => (
            <article
              key={testimonial.quote}
              className={styles.testimonialCard}
              tabIndex={0}
            >
              <div
                className={styles.testimonialRating}
                role="img"
                aria-label={`Rated ${testimonial.rating} out of 5`}
              >
                {formatStars(testimonial.rating)}
              </div>
              <blockquote className={styles.testimonialQuote}>
                "{testimonial.quote}"
              </blockquote>
              {testimonial.name ? (
                <p className={styles.testimonialMeta}>
                  {testimonial.name}
                  {testimonial.location ? (
                    <span className={styles.testimonialLocation}>
                      , {testimonial.location}
                    </span>
                  ) : null}
                </p>
              ) : null}
            </article>
          ))}
        </div>
        <div className={styles.carouselControls}>
          <div className={styles.carouselButtons}>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={handlePrev}
              aria-label="Previous testimonials"
            >
              Previous
            </button>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={handleNext}
              aria-label="Next testimonials"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
