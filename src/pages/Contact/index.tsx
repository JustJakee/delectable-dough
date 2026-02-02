import type { FormEvent } from "react";
import styles from "./Contact.module.css";

export default function Contact() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Leave us a message!</h1>
        <p>
          For pre-orders, events, and general questions, send us a note and we
          will follow up within a business days.
        </p>
      </header>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="name">
            Name
          </label>
          <input className={styles.input} id="name" name="name" type="text" />

          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
          />

          <label className={styles.label} htmlFor="details">
            Details
          </label>
          <textarea
            className={styles.textarea}
            id="details"
            name="details"
            rows={5}
          />

          <button className={styles.button} type="submit">
            Send request
          </button>
        </form>

      </div>
    </div>
  );
}
