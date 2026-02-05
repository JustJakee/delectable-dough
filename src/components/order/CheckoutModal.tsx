import { useEffect, useRef, type FormEvent, type RefObject } from "react";
import type { LineItem } from "../../types/menu";
import OrderSummary from "./OrderSummary";
import styles from "./CheckoutModal.module.css";
import orderStyles from "../../pages/OrderPage.module.css";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  lineItems: LineItem[];
  subtotal: number;
  onEdit: (lineId: string) => void;
  onRemove: (lineId: string) => void;
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
  disableSubmit: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const focusableSelector =
  "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export default function CheckoutModal({
  isOpen,
  onClose,
  returnFocusRef,
  lineItems,
  subtotal,
  onEdit,
  onRemove,
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
  disableSubmit,
  onSubmit,
}: CheckoutModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (panel) {
      const focusable = panel.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        panel.focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const currentPanel = panelRef.current;
      if (!currentPanel) {
        return;
      }
      const focusable = Array.from(
        currentPanel.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((node) => !node.hasAttribute("disabled"));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      const target = returnFocusRef?.current ?? previouslyFocusedRef.current;
      target?.focus();
    };
  }, [isOpen, onClose, returnFocusRef]);

  if (!isOpen) {
    return null;
  }

  const dateId = "modal-date-needed";
  const addressId = "modal-delivery-address";
  const firstNameId = "modal-first-name";
  const lastNameId = "modal-last-name";
  const emailId = "modal-email";
  const phoneId = "modal-phone";
  const notesId = "modal-order-notes";

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className={styles.modalHeader}>
          <h2 id="checkout-modal-title" className={styles.modalTitle}>
            Checkout
          </h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        {status === "success" ? (
          <div className={styles.successPanel}>
            <p className={orderStyles.successText} role="status">
              Your order request was sent! We will follow up soon.
            </p>
            <button
              type="button"
              className={orderStyles.submitButton}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className={styles.modalBody} onSubmit={onSubmit}>
            <OrderSummary
              lineItems={lineItems}
              subtotal={subtotal}
              onEdit={onEdit}
              onRemove={onRemove}
              idPrefix="modal"
            />

            <section className={orderStyles.formSection}>
              <h3 className={orderStyles.formHeading}>Fulfillment</h3>
              <fieldset className={orderStyles.fieldset}>
                <legend>Pickup or delivery</legend>
                <div className={orderStyles.segmentedGroup}>
                  <label
                    className={`${orderStyles.segmentedOption} ${
                      fulfillmentType === "pickup"
                        ? orderStyles.segmentedOptionActive
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      value="pickup"
                      checked={fulfillmentType === "pickup"}
                      onChange={() => onChangeFulfillmentType("pickup")}
                      className={orderStyles.segmentedInput}
                    />
                    <span className={orderStyles.segmentedText}>Pickup</span>
                  </label>
                  <label
                    className={`${orderStyles.segmentedOption} ${
                      fulfillmentType === "delivery"
                        ? orderStyles.segmentedOptionActive
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      value="delivery"
                      checked={fulfillmentType === "delivery"}
                      onChange={() => onChangeFulfillmentType("delivery")}
                      className={orderStyles.segmentedInput}
                    />
                    <span className={orderStyles.segmentedText}>Delivery</span>
                  </label>
                </div>
              </fieldset>
              {showErrors.deliveryMinimum && errors.deliveryMinimum ? (
                <p className={orderStyles.deliveryWarning}>
                  {errors.deliveryMinimum}
                </p>
              ) : null}
              <div className={orderStyles.inputGroup}>
                <label className={orderStyles.inputLabel} htmlFor={dateId}>
                  Date needed
                </label>
                <input
                  id={dateId}
                  type="date"
                  className={orderStyles.input}
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
                  <p className={orderStyles.errorText} id={`${dateId}-error`}>
                    {errors.dateNeeded}
                  </p>
                ) : null}
              </div>
              {fulfillmentType === "delivery" ? (
                <div className={orderStyles.inputGroup}>
                  <label className={orderStyles.inputLabel} htmlFor={addressId}>
                    Delivery address
                  </label>
                  <input
                    id={addressId}
                    type="text"
                    className={orderStyles.input}
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
                    <p
                      className={orderStyles.errorText}
                      id={`${addressId}-error`}
                    >
                      {errors.address}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>

            <section className={orderStyles.formSection}>
              <h3 className={orderStyles.formHeading}>Customer details</h3>
              <div className={orderStyles.inputRow}>
                <div className={orderStyles.inputGroup}>
                  <label
                    className={orderStyles.inputLabel}
                    htmlFor={firstNameId}
                  >
                    First name
                  </label>
                  <input
                    id={firstNameId}
                    type="text"
                    className={orderStyles.input}
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
                <div className={orderStyles.inputGroup}>
                  <label
                    className={orderStyles.inputLabel}
                    htmlFor={lastNameId}
                  >
                    Last name
                  </label>
                  <input
                    id={lastNameId}
                    type="text"
                    className={orderStyles.input}
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
                <p className={orderStyles.errorText} id={`${lastNameId}-error`}>
                  {errors.name}
                </p>
              ) : null}

              <fieldset className={orderStyles.fieldset}>
                <legend>Preferred contact method</legend>
                <div className={orderStyles.segmentedGroup}>
                  <label
                    className={`${orderStyles.segmentedOption} ${
                      contactMethod === "email"
                        ? orderStyles.segmentedOptionActive
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact-method"
                      value="email"
                      checked={contactMethod === "email"}
                      onChange={() => onChangeContactMethod("email")}
                      className={orderStyles.segmentedInput}
                    />
                    <span className={orderStyles.segmentedText}>Email</span>
                  </label>
                  <label
                    className={`${orderStyles.segmentedOption} ${
                      contactMethod === "phone"
                        ? orderStyles.segmentedOptionActive
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact-method"
                      value="phone"
                      checked={contactMethod === "phone"}
                      onChange={() => onChangeContactMethod("phone")}
                      className={orderStyles.segmentedInput}
                    />
                    <span className={orderStyles.segmentedText}>Phone</span>
                  </label>
                </div>
              </fieldset>

              {contactMethod === "email" ? (
                <div className={orderStyles.inputGroup}>
                  <label className={orderStyles.inputLabel} htmlFor={emailId}>
                    Email
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    className={orderStyles.input}
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
                    <p
                      className={orderStyles.errorText}
                      id={`${emailId}-error`}
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className={orderStyles.inputGroup}>
                  <label className={orderStyles.inputLabel} htmlFor={phoneId}>
                    Phone
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    className={orderStyles.input}
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
                    <p
                      className={orderStyles.errorText}
                      id={`${phoneId}-error`}
                    >
                      {errors.phone}
                    </p>
                  ) : null}
                </div>
              )}
            </section>

            <section className={orderStyles.formSection}>
              <h3 className={orderStyles.formHeading}>Additional notes</h3>
              <div className={orderStyles.inputGroup}>
                <label className={orderStyles.inputLabel} htmlFor={notesId}>
                  Order notes
                </label>
                <textarea
                  id={notesId}
                  className={orderStyles.textarea}
                  rows={4}
                  value={additionalNotes ?? ""}
                  onChange={(event) => onChangeNotes(event.target.value)}
                  placeholder="Delivery details, event notes, or special requests."
                />
              </div>
            </section>

            {errorMessage ? (
              <p
                className={orderStyles.errorText}
                role="status"
                aria-live="polite"
              >
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className={orderStyles.submitButton}
              disabled={disableSubmit}
            >
              {status === "submitting" ? "Sending..." : "Submit order request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
