import styles from "../../pages/OrderPage.module.css";

type FulfillmentOptionsProps = {
  fulfillmentType: "pickup" | "delivery";
  dateNeeded: string;
  address?: string;
  onChangeType: (value: "pickup" | "delivery") => void;
  onChangeDate: (value: string) => void;
  onChangeAddress: (value: string) => void;
  showErrors: boolean;
  dateError?: string;
  addressError?: string;
  idPrefix: string;
};

export default function FulfillmentOptions({
  fulfillmentType,
  dateNeeded,
  address,
  onChangeType,
  onChangeDate,
  onChangeAddress,
  showErrors,
  dateError,
  addressError,
  idPrefix,
}: FulfillmentOptionsProps) {
  const dateId = `${idPrefix}-date-needed`;
  const addressId = `${idPrefix}-delivery-address`;
  const dateErrorId = `${dateId}-error`;
  const addressErrorId = `${addressId}-error`;

  const titleId = `${idPrefix}-fulfillment-title`;

  return (
    <section className={styles.formSection} aria-labelledby={titleId}>
      <h3 id={titleId} className={styles.sectionHeading}>
        Fulfillment
      </h3>
      <fieldset className={styles.fieldset}>
        <legend>Pickup or delivery</legend>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="fulfillment"
              value="pickup"
              checked={fulfillmentType === "pickup"}
              onChange={() => onChangeType("pickup")}
            />
            Pickup
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="fulfillment"
              value="delivery"
              checked={fulfillmentType === "delivery"}
              onChange={() => onChangeType("delivery")}
            />
            Delivery
          </label>
        </div>
      </fieldset>

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
          aria-describedby={dateError ? dateErrorId : undefined}
        />
        {showErrors && dateError ? (
          <p className={styles.errorText} id={dateErrorId}>
            {dateError}
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
            aria-describedby={addressError ? addressErrorId : undefined}
          />
          {showErrors && addressError ? (
            <p className={styles.errorText} id={addressErrorId}>
              {addressError}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
