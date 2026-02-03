import { useState } from "react";
import { assetUrls } from "../../content/assets";
import styles from "./AboutPage.module.css";

const highlights = [
  "Hand-rolled strudel dough in small batches.",
  "Family recipes with vegan and gluten-free options.",
  "Custom dessert trays designed for your gathering.",
];

const values = [
  {
    title: "Fresh Baked",
    text: "We bake to order so everything tastes like it just left the oven.",
  },
  {
    title: "Small Batch",
    text: "Quality stays high when each tray is made with care and attention.",
  },
  {
    title: "Made with Love",
    text: "Every recipe carries a family story and a little extra warmth.",
  },
];

const storyPages = [
  [
    "The story of Delectable Dough Baking Company began many years ago. It started from a young girl's passion after experiencing her first baking class. That young girl was me, and I loved creating new recipes for my family and friends.",
    "My father encouraged me to recreate my Bobba's strudel recipe. Bakers of that generation usually did not write down their recipes, so it took many hours of experimentation to perfect.",
    'One day, my dad said, "Jodie, that\'s it! You finally did it." And so, The Strudel Lady was born.',
  ],
  [
    "After several years, the family business Delectable Dough was created. We became acclaimed for our Old Fashioned Apple Strudel and also offered many other traditional sweets and pastries including cinnamon kamish bread, chocolate dipped kamish bread, rugelah, poppy seed cookies, gooey butter, brownies, cinnamon rolls, and many more delectable treats.",
    "Several years went by, and as life goes, many changes took place. For me that meant meeting the love of my life, getting married, and starting a family.",
    "As time went on, it became obvious that running a bakery would be difficult while raising a family. After a lot of family meetings it was decided that we needed to put the bakery on hold for awhile. Well, my boys are now grown and The Strudel Lady and family are ready to bring back scrumptious sweets for all to enjoy.",
  ],
];

const enableStoryPagination = false;

export default function StorySplit() {
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = storyPages.length;
  const currentPage = storyPages[pageIndex];

  const handlePrev = () => {
    setPageIndex((current) => (current - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setPageIndex((current) => (current + 1) % totalPages);
  };

  const visiblePage = enableStoryPagination ? currentPage : storyPages[0];

  return (
    <section className={styles.storySection} aria-labelledby="story-title">
      <div className={styles.storyGrid}>
        <div className={styles.storyCard}>
          <p className={styles.eyebrow}>Meet the Strudel Lady</p>
          <h2 id="story-title" className={styles.sectionTitle}>
            Her Story
          </h2>
          {visiblePage.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {enableStoryPagination ? (
            <div className={styles.storyPager}>
              <div className={styles.storyPagerButtons}>
                <button
                  type="button"
                  className={`${styles.buttonSecondary} ${styles.storyPagerButton}`}
                  onClick={handlePrev}
                  aria-label="Previous story section"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className={`${styles.buttonSecondary} ${styles.storyPagerButton}`}
                  onClick={handleNext}
                  aria-label="Next story section"
                >
                  Next
                </button>
              </div>
              <p className={styles.storyPagerStatus} aria-live="polite">
                Page {pageIndex + 1} of {totalPages}
              </p>
            </div>
          ) : null}
          <ul className={styles.highlightList}>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className={styles.valuesRow}>
            {values.map((value) => (
              <div key={value.title} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueText}>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
        <figure className={styles.storyPortrait}>
          <img
            src={assetUrls.about.bakerPortrait}
            alt="Portrait of the baker behind Delectable Dough."
          />
        </figure>
      </div>
    </section>
  );
}
