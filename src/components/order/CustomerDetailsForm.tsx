import styles from "../../pages/OrderPage.module.css";

type CustomerDetailsFormProps = {
  firstName: string;
  lastName: string;
  contactMethod: "email" | "phone";
  email?: string;
  phone?: string;
  additionalNotes?: string;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeContactMethod: (value: "email" | "phone") => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeNotes: (value: string) => void;
  showErrors: boolean;
  nameError?: string;
  emailError?: string;
  phoneError?: string;
  idPrefix: string;
};

export default function CustomerDetailsForm({
  firstName,
  lastName,
  contactMethod,
  email,
  phone,
  additionalNotes,
  onChangeFirstName,
  onChangeLastName,
  onChangeContactMethod,
  onChangeEmail,
  onChangePhone,
  onChangeNotes,
  showErrors,
  nameError,
  emailError,
  phoneError,
  idPrefix,
}: CustomerDetailsFormProps) {
  const firstNameId = `${idPrefix}-first-name`;
  const lastNameId = `${idPrefix}-last-name`;
  const nameErrorId = `${idPrefix}-name-error`;
  const emailId = `${idPrefix}-email`;
  const emailErrorId = `${idPrefix}-email-error`;
  const phoneId = `${idPrefix}-phone`;
  const phoneErrorId = `${idPrefix}-phone-error`;
  const notesId = `${idPrefix}-order-notes`;

  const titleId = `${idPrefix}-customer-title`;

  return (
    <section className={styles.formSection} aria-labelledby={titleId}>
      <h3 id={titleId} className={styles.sectionHeading}>
        Customer details
      </h3>
      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor={firstNameId}>
            First name
          </label>
          <input
            id={firstNameId}
            type="text"
            className={styles.input}
            value={firstName}
            onChange={(event) => onChangeFirstName(event.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor={lastNameId}>
            Last name
          </label>
          <input
            id={lastNameId}
            type="text"
            className={styles.input}
            value={lastName}
            onChange={(event) => onChangeLastName(event.target.value)}
            aria-describedby={nameError ? nameErrorId : undefined}
          />
        </div>
      </div>
      {showErrors && nameError ? (
        <p className={styles.errorText} id={nameErrorId}>
          {nameError}
        </p>
      ) : null}

      <fieldset className={styles.fieldset}>
        <legend>Preferred contact method</legend>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="contact-method"
              value="email"
              checked={contactMethod === "email"}
              onChange={() => onChangeContactMethod("email")}
            />
            Email
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="contact-method"
              value="phone"
              checked={contactMethod === "phone"}
              onChange={() => onChangeContactMethod("phone")}
            />
            Phone
          </label>
        </div>
      </fieldset>

      {contactMethod === "email" ? (
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor={emailId}>
            Email
          </label>
          <input
            id={emailId}
            type="email"
            className={styles.input}
            value={email ?? ""}
            onChange={(event) => onChangeEmail(event.target.value)}
            aria-describedby={emailError ? emailErrorId : undefined}
          />
          {showErrors && emailError ? (
            <p className={styles.errorText} id={emailErrorId}>
              {emailError}
            </p>
          ) : null}
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor={phoneId}>
            Phone
          </label>
          <input
            id={phoneId}
            type="tel"
            className={styles.input}
            value={phone ?? ""}
            onChange={(event) => onChangePhone(event.target.value)}
            aria-describedby={phoneError ? phoneErrorId : undefined}
          />
          {showErrors && phoneError ? (
            <p className={styles.errorText} id={phoneErrorId}>
              {phoneError}
            </p>
          ) : null}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor={notesId}>
          Additional notes
        </label>
        <textarea
          id={notesId}
          className={styles.textarea}
          rows={4}
          value={additionalNotes ?? ""}
          onChange={(event) => onChangeNotes(event.target.value)}
          placeholder="Delivery details, event notes, or special requests."
        />
      </div>
    </section>
  );
}
