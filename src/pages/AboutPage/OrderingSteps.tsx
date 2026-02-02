import styles from "./AboutPage.module.css";

const steps = [
  {
    title: "Browse the menu",
    text: "Explore seasonal bakes, classic strudel, and sweet trays.",
  },
  {
    title: "Send an order request",
    text: "Tell us your date, headcount, and any dietary needs.",
  },
  {
    title: "Receive an invoice",
    text: "We confirm availability and follow up with pricing details.",
  },
  {
    title: "Enjoy fresh baked treats",
    text: "Pick up or schedule delivery for a warm, easy celebration.",
  },
];

export default function OrderingSteps() {
  return (
    <section
      className={styles.orderingSection}
      aria-labelledby="ordering-title"
    >
      <header className={styles.sectionHeader}>
        <p className={styles.eyebrow}>How Ordering Works</p>
        <h2 id="ordering-title" className={styles.sectionTitle}>
          Planning is simple and personal.
        </h2>
        <p className={styles.sectionSubtitle}>
          We handle each order with care and confirm every detail with you.
        </p>
      </header>
      <ol className={styles.stepsList}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.stepCard}>
            <span className={styles.stepNumber}>Step {index + 1}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
          </li>
        ))}
      </ol>
      <p className={styles.deliveryNote}>
        Delivery is available on orders over $25. No shipping.
      </p>
    </section>
  );
}
