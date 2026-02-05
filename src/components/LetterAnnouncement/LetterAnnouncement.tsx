import { assetUrls } from "../../content/assets";
import styles from "./LetterAnnouncement.module.css";

export default function LetterAnnouncement() {
  return (
    <section className={styles.section} aria-labelledby="announcement-title">
      <header className={styles.heading}>
        <h1 id="announcement-title" className={styles.title}>
          OUR HOME BAKERY IS OPEN!
        </h1>
      </header>
      <div className={styles.panel}>
        <article className={styles.letter} aria-label="Letter announcement">
          <h2 className={styles.salutation}>To our Valued Customers,</h2>
          <p>
            The past 6 years of being a part of The Baker&apos;s Hub and The
            Trolley Stop Bakery has been an amazing experience. During this time
            we have strived to provide customers with scrumptious sweets for all
            occasions as well as superior customer service. We thank you for
            your support of our small local business.
          </p>
          <p>
            After much thought and consideration we have made the decision that
            Delectable Dough&apos;s last day at The Trolley Stop Bakery will be May
            31st. We are excited to announce that beginning June 15, 2024
            Delectable Dough will be moving to a home-based bakery.
          </p>
          <p>
            This new model will allow us to focus on custom orders, including
            sweet trays, special holiday gifts, party favors, condolence trays,
            and traditional favorites.
          </p>
          <p>
            We will continue to offer vegan and gluten free options. Pick up and
            delivery service will be available. We hope you will continue to let
            us make your special occasion a SWEET MEMORY! We look forward to
            serving you!
          </p>
          <p className={styles.closing}>Thank you!</p>
          <p className={styles.signature}>Jodie</p>
          <img
            className={styles.stamp}
            src={assetUrls.logoStamp}
            alt="Delectable Dough Baking Co. logo"
          />
        </article>
      </div>
    </section>
  );
}
