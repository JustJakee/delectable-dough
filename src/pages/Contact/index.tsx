import { useMemo, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import styles from "./Contact.module.css";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">(
    "email",
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<
    Partial<
      Record<"firstName" | "lastName" | "email" | "phone" | "message", boolean>
    >
  >({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!firstName.trim()) {
      next.firstName = "First name is required.";
    }
    if (!lastName.trim()) {
      next.lastName = "Last name is required.";
    }
    if (contactMethod === "email") {
      if (!email.trim()) {
        next.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        next.email = "Enter a valid email address.";
      }
    }
    if (contactMethod === "phone") {
      if (!phone.trim()) {
        next.phone = "Phone number is required.";
      } else if (!/[0-9]{7,}/.test(phone.replace(/\D/g, ""))) {
        next.phone = "Enter a valid phone number.";
      }
    }
    if (message.trim().length < 10) {
      next.message = "Message must be at least 10 characters.";
    }
    return next;
  }, [contactMethod, email, firstName, lastName, message, phone]);

  const getFieldError = (
    field: "firstName" | "lastName" | "email" | "phone" | "message",
  ) => {
    if (!errors[field]) {
      return "";
    }
    if (submitAttempted || touched[field]) {
      return errors[field];
    }
    return "";
  };

  const handleBlur = (
    field: "firstName" | "lastName" | "email" | "phone" | "message",
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const resetStatusIfNeeded = () => {
    if (status === "error" || status === "success") {
      setStatus("idle");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }
    setSubmitAttempted(true);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      return;
    }
    setStatus("submitting");

    const payload = {
      title: "Website contact form",
      subject: "New website inquiry",
      submitted_at: new Date().toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      contact_method: contactMethod, // "email" | "phone"
      email: email.trim() || "N/A",
      phone: phone.trim() || "N/A",
      message: message.trim(),
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
        payload,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setStatus("success");
        setFirstName("");
        setLastName("");
        setContactMethod("email");
        setEmail("");
        setPhone("");
        setMessage("");
        setTouched({});
        setSubmitAttempted(false);
      })
      .catch(() => {
        setStatus("error");
      });
  };

  const firstNameError = getFieldError("firstName");
  const lastNameError = getFieldError("lastName");
  const emailError = getFieldError("email");
  const phoneError = getFieldError("phone");
  const messageError = getFieldError("message");

  const statusMessage =
    status === "success"
      ? "Thanks! Your message was sent. We'll get back to you shortly."
      : status === "error"
        ? "Something went wrong. Please try again."
        : "";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Send us a message!</h1>
        <p className={styles.subtitle}>
          For pre-orders, events, and general questions, send us a note and
          we'll follow up within a business days.
        </p>
      </header>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="first-name">
                First name
              </label>
              <input
                className={styles.input}
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  resetStatusIfNeeded();
                }}
                onBlur={() => handleBlur("firstName")}
                aria-invalid={Boolean(firstNameError)}
                aria-describedby={
                  firstNameError ? "first-name-error" : undefined
                }
                required
              />
              {firstNameError ? (
                <p className={styles.errorText} id="first-name-error">
                  {firstNameError}
                </p>
              ) : null}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="last-name">
                Last name
              </label>
              <input
                className={styles.input}
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  resetStatusIfNeeded();
                }}
                onBlur={() => handleBlur("lastName")}
                aria-invalid={Boolean(lastNameError)}
                aria-describedby={lastNameError ? "last-name-error" : undefined}
                required
              />
              {lastNameError ? (
                <p className={styles.errorText} id="last-name-error">
                  {lastNameError}
                </p>
              ) : null}
            </div>
          </div>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Preferred contact method</legend>
            <div className={styles.segmented}>
              <label
                className={`${styles.segmentedOption} ${
                  contactMethod === "email" ? styles.segmentedOptionActive : ""
                }`}
              >
                <input
                  className={styles.segmentedInput}
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={contactMethod === "email"}
                  onChange={() => {
                    setContactMethod("email");
                    resetStatusIfNeeded();
                  }}
                  required
                />
                Email
              </label>
              <label
                className={`${styles.segmentedOption} ${
                  contactMethod === "phone" ? styles.segmentedOptionActive : ""
                }`}
              >
                <input
                  className={styles.segmentedInput}
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={contactMethod === "phone"}
                  onChange={() => {
                    setContactMethod("phone");
                    resetStatusIfNeeded();
                  }}
                  required
                />
                Phone
              </label>
            </div>
          </fieldset>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                resetStatusIfNeeded();
              }}
              onBlur={() => handleBlur("email")}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "email-error" : undefined}
              required={contactMethod === "email"}
            />
            {emailError ? (
              <p className={styles.errorText} id="email-error">
                {emailError}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">
              Phone
            </label>
            <input
              className={styles.input}
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                resetStatusIfNeeded();
              }}
              onBlur={() => handleBlur("phone")}
              aria-invalid={Boolean(phoneError)}
              aria-describedby={phoneError ? "phone-error" : undefined}
              required={contactMethod === "phone"}
            />
            {phoneError ? (
              <p className={styles.errorText} id="phone-error">
                {phoneError}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="message">
              Message
            </label>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              rows={5}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                resetStatusIfNeeded();
              }}
              onBlur={() => handleBlur("message")}
              aria-invalid={Boolean(messageError)}
              aria-describedby={messageError ? "message-error" : undefined}
              required
            />
            {messageError ? (
              <p className={styles.errorText} id="message-error">
                {messageError}
              </p>
            ) : null}
          </div>

          <div className={styles.status} role="status" aria-live="polite">
            {statusMessage ? (
              <div
                className={`${styles.statusMessage} ${
                  status === "success"
                    ? styles.statusSuccess
                    : styles.statusError
                }`}
              >
                {statusMessage}
              </div>
            ) : null}
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
