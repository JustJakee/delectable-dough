import type { FormEvent } from "react";
import styles from "../../pages/OrderPage.module.css";

type CheckoutDetailsProps = {
  fulfillmentType: "pickup" | "delivery";
  dateNeeded: string;
  address?: string;
  contactMethod: "email" | "phone";
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  additionalNotes?: string;
  onChangeFulfillmentType: (value: "pickup" | "delivery") => void;
  onChangeDate: (value: string) => void;
  onChangeAddress: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeContactMethod: (value: "email" | "phone") => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeNotes: (value: string) => void;
  onBlurDate: () => void;
  onBlurAddress: () => void;
  onBlurFirstName: () => void;
  onBlurLastName: () => void;
  onBlurEmail: () => void;
  onBlurPhone: () => void;
  errors: {
    dateNeeded?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryMinimum?: string;
  };
  showErrors: {
    dateNeeded: boolean;
    name: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
    deliveryMinimum: boolean;
  };
  status: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
  successMessage?: string;
  disableSubmit: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CheckoutDetails({
  fulfillmentType,
  dateNeeded,
  address,
  contactMethod,
  firstName,
  lastName,
  email,
  phone,
  additionalNotes,
  onChangeFulfillmentType,
  onChangeDate,
  onChangeAddress,
  onChangeFirstName,
  onChangeLastName,
  onChangeContactMethod,
  onChangeEmail,
  onChangePhone,
  onChangeNotes,
  onBlurDate,
  onBlurAddress,
  onBlurFirstName,
  onBlurLastName,
  onBlurEmail,
  onBlurPhone,
  errors,
  showErrors,
  status,
  errorMessage,
  successMessage,
  disableSubmit,
  onSubmit,
}: CheckoutDetailsProps) {
  const dateId = "date-needed";
  const addressId = "delivery-address";
  const firstNameId = "first-name";
  const lastNameId = "last-name";
  const emailId = "email";
  const phoneId = "phone";
  const notesId = "order-notes";

  return (
    <section
      className={styles.checkoutSection}
      aria-labelledby="checkout-title"
    >
      <h2 id="checkout-title" className={styles.sectionHeading}>
        Finish your request
      </h2>
      <form className={styles.checkoutForm} onSubmit={onSubmit}>
        <div className={styles.formSection}>
          <h3 className={styles.formHeading}>Fulfillment</h3>
          <fieldset className={styles.fieldset}>
            <legend>Pickup or delivery</legend>
            <div className={styles.segmentedGroup}>
              <label
                className={`${styles.segmentedOption} ${
                  fulfillmentType === "pickup"
                    ? styles.segmentedOptionActive
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="pickup"
                  checked={fulfillmentType === "pickup"}
                  onChange={() => onChangeFulfillmentType("pickup")}
                  className={styles.segmentedInput}
                />
                <span className={styles.segmentedText}>Pickup</span>
              </label>
              <label
                className={`${styles.segmentedOption} ${
                  fulfillmentType === "delivery"
                    ? styles.segmentedOptionActive
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={fulfillmentType === "delivery"}
                  onChange={() => onChangeFulfillmentType("delivery")}
                  className={styles.segmentedInput}
                />
                <span className={styles.segmentedText}>Delivery</span>
              </label>
            </div>
          </fieldset>
          {showErrors.deliveryMinimum && errors.deliveryMinimum ? (
            <p className={styles.deliveryWarning}>{errors.deliveryMinimum}</p>
          ) : null}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor={dateId}>
              Date needed
            </label>
            <input
              id={dateId}
              type="date"
              className={styles.input}
              value={dateNeeded}
              onChange={(event) => onChangeDate(event.target.value)}
              onBlur={onBlurDate}
              aria-describedby={
                showErrors.dateNeeded && errors.dateNeeded
                  ? `${dateId}-error`
                  : undefined
              }
            />
            {showErrors.dateNeeded && errors.dateNeeded ? (
              <p className={styles.errorText} id={`${dateId}-error`}>
                {errors.dateNeeded}
              </p>
            ) : null}
          </div>
          {fulfillmentType === "delivery" ? (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor={addressId}>
                Delivery address
              </label>
              <input
                id={addressId}
                type="text"
                className={styles.input}
                value={address ?? ""}
                onChange={(event) => onChangeAddress(event.target.value)}
                onBlur={onBlurAddress}
                aria-describedby={
                  showErrors.address && errors.address
                    ? `${addressId}-error`
                    : undefined
                }
              />
              {showErrors.address && errors.address ? (
                <p className={styles.errorText} id={`${addressId}-error`}>
                  {errors.address}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.formHeading}>Customer details</h3>
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
                onBlur={onBlurFirstName}
                aria-describedby={
                  showErrors.name && errors.name
                    ? `${lastNameId}-error`
                    : undefined
                }
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
                onBlur={onBlurLastName}
                aria-describedby={
                  showErrors.name && errors.name
                    ? `${lastNameId}-error`
                    : undefined
                }
              />
            </div>
          </div>
          {showErrors.name && errors.name ? (
            <p className={styles.errorText} id={`${lastNameId}-error`}>
              {errors.name}
            </p>
          ) : null}

          <fieldset className={styles.fieldset}>
            <legend>Preferred contact method</legend>
            <div className={styles.segmentedGroup}>
              <label
                className={`${styles.segmentedOption} ${
                  contactMethod === "email" ? styles.segmentedOptionActive : ""
                }`}
              >
                <input
                  type="radio"
                  name="contact-method"
                  value="email"
                  checked={contactMethod === "email"}
                  onChange={() => onChangeContactMethod("email")}
                  className={styles.segmentedInput}
                />
                <span className={styles.segmentedText}>Email</span>
              </label>
              <label
                className={`${styles.segmentedOption} ${
                  contactMethod === "phone" ? styles.segmentedOptionActive : ""
                }`}
              >
                <input
                  type="radio"
                  name="contact-method"
                  value="phone"
                  checked={contactMethod === "phone"}
                  onChange={() => onChangeContactMethod("phone")}
                  className={styles.segmentedInput}
                />
                <span className={styles.segmentedText}>Phone</span>
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
                onBlur={onBlurEmail}
                aria-describedby={
                  showErrors.email && errors.email
                    ? `${emailId}-error`
                    : undefined
                }
              />
              {showErrors.email && errors.email ? (
                <p className={styles.errorText} id={`${emailId}-error`}>
                  {errors.email}
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
                onBlur={onBlurPhone}
                aria-describedby={
                  showErrors.phone && errors.phone
                    ? `${phoneId}-error`
                    : undefined
                }
              />
              {showErrors.phone && errors.phone ? (
                <p className={styles.errorText} id={`${phoneId}-error`}>
                  {errors.phone}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.formHeading}>Order notes</h3>
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
        </div>

        {errorMessage ? (
          <p className={styles.errorText} role="status" aria-live="polite">
            {errorMessage}
          </p>
        ) : null}
        {status === "success" && successMessage ? (
          <p className={styles.successText} role="status">
            {successMessage}
          </p>
        ) : null}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={disableSubmit || status === "submitting"}
        >
          {status === "submitting" ? "Sending..." : "Submit order request"}
        </button>
      </form>
    </section>
  );
}
