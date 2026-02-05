import { useEffect, useState, type ChangeEvent } from "react";
import type { MenuItem } from "../../types/menu";
import styles from "../../pages/OrderPage.module.css";

type MenuItemCardProps = {
  item: MenuItem;
  isOpen: boolean;
  selectedSizeId?: string;
  quantity: number;
  flavor?: string;
  notes?: string;
  onToggle: (itemId: string) => void;
  onSelectSize: (sizeId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onFlavorChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onAdd: () => void;
  canAdd: boolean;
  isDisabled?: boolean;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function MenuItemCard({
  item,
  isOpen,
  selectedSizeId,
  quantity,
  flavor,
  notes,
  onToggle,
  onSelectSize,
  onQuantityChange,
  onFlavorChange,
  onNotesChange,
  onAdd,
  canAdd,
  isDisabled,
}: MenuItemCardProps) {
  const [showNotes, setShowNotes] = useState(Boolean(notes));
  const [attemptedAdd, setAttemptedAdd] = useState(false);

  useEffect(() => {
    if (notes && !showNotes) {
      setShowNotes(true);
    }
  }, [notes, showNotes]);

  useEffect(() => {
    if (!isOpen && attemptedAdd) {
      setAttemptedAdd(false);
    }
  }, [isOpen, attemptedAdd]);

  const handleQuantityInput = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (Number.isNaN(next)) {
      return;
    }
    onQuantityChange(Math.max(1, next));
  };

  const missingFlavor = item.kind === "flavor" && !flavor;
  const showFlavorError = attemptedAdd && missingFlavor;

  const handleAdd = () => {
    if (!canAdd || isDisabled) {
      setAttemptedAdd(true);
      return;
    }
    setAttemptedAdd(false);
    onAdd();
  };

  return (
    <article className={styles.menuItemCard}>
      <div className={styles.menuItemHeader}>
        <div>
          <h3 className={styles.menuItemTitle}>{item.name}</h3>
          {item.servingNote ? (
            <p className={styles.menuItemServing}>{item.servingNote}</p>
          ) : null}
          {item.description ? (
            <p className={styles.menuItemDescription}>{item.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          className={`${styles.menuItemToggle} ${
            isOpen ? styles.menuItemToggleOpen : ""
          }`}
          aria-expanded={isOpen}
          aria-label={
            isOpen ? `Close ${item.name} options` : `Add ${item.name}`
          }
          onClick={() => onToggle(item.id)}
          disabled={isDisabled}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      {isOpen ? (
        <div className={styles.menuItemDetails}>
          <fieldset className={styles.fieldset}>
            <legend>Size</legend>
            <div className={styles.segmentedGroup}>
              {item.sizes.map((size) => (
                <label
                  key={size.id}
                  className={`${styles.segmentedOption} ${
                    selectedSizeId === size.id
                      ? styles.segmentedOptionActive
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`${item.id}-size`}
                    value={size.id}
                    checked={selectedSizeId === size.id}
                    onChange={() => onSelectSize(size.id)}
                    className={styles.segmentedInput}
                  />
                  <span className={styles.segmentedText}>{size.label}</span>
                  <span className={styles.segmentedPrice}>
                    {formatMoney(size.price)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.quantityRow}>
            <label className={styles.inputLabel} htmlFor={`${item.id}-qty`}>
              Quantity
            </label>
            <div className={styles.quantityControls}>
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                id={`${item.id}-qty`}
                type="number"
                min={1}
                className={styles.quantityInput}
                value={quantity}
                onChange={handleQuantityInput}
              />
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() => onQuantityChange(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {item.kind === "flavor" && item.flavorOptions.length > 0 ? (
            <div className={styles.inputGroup}>
              <label
                className={styles.inputLabel}
                htmlFor={`${item.id}-flavor`}
              >
                Flavor
              </label>
              <select
                id={`${item.id}-flavor`}
                className={styles.select}
                value={flavor ?? ""}
                onChange={(event) => onFlavorChange(event.target.value)}
                required
              >
                <option value="" disabled>
                  Select a flavor
                </option>
                {item.flavorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {showFlavorError ? (
                <p className={styles.errorText}>Choose a flavor to add.</p>
              ) : null}
            </div>
          ) : null}

          {item.allowNotes ? (
            <div className={styles.inputGroup}>
              <button
                type="button"
                className={styles.noteToggle}
                onClick={() => setShowNotes((prev) => !prev)}
              >
                {showNotes ? "Hide note" : "Add a note"}
              </button>
              {showNotes ? (
                <textarea
                  id={`${item.id}-notes`}
                  className={styles.textarea}
                  rows={3}
                  value={notes ?? ""}
                  onChange={(event) => onNotesChange(event.target.value)}
                  placeholder="Allergies, substitutions, or special requests."
                />
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            className={styles.addButton}
            onClick={handleAdd}
            disabled={isDisabled}
          >
            {isDisabled ? "Unavailable online" : "Add"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
