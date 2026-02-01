import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>About</h1>
        <p>
          Delectable Dough is a small bakery focused on slow fermentation, real
          butter, and bright seasonal flavors.
        </p>
      </header>
      <section className={styles.story}>
        <div>
          <h2>Our approach</h2>
          <p>
            We proof dough overnight, fold by hand, and bake in short runs to
            keep each batch crisp and warm.
          </p>
        </div>
        <div>
          <h2>The bake team</h2>
          <p>
            A tight crew of bakers, pastry chefs, and baristas who care about the
            details, from flour sourcing to final glaze.
          </p>
        </div>
        <div>
          <h2>Community table</h2>
          <p>
            Partnering with local farmers and hosting weekend tastings throughout
            the year.
          </p>
        </div>
      </section>
    </div>
  );
}
