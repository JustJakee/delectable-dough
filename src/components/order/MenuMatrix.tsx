import type { CSSProperties } from "react";
import type { MenuMatrix } from "../../types/menu";
import styles from "../../pages/OrderPage.module.css";

type MatrixSelection = {
  rowId: string;
  rowLabel: string;
  columnId: string;
  columnLabel: string;
  quantity: number;
  unitPrice: number;
};

type MenuMatrixProps = {
  menuId: string;
  matrix: MenuMatrix;
  quantities: Record<string, number>;
  onChangeQuantity: (rowId: string, columnId: string, quantity: number) => void;
  onAddSelections: (selections: MatrixSelection[]) => void;
  disabled?: boolean;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function MenuMatrix({
  menuId,
  matrix,
  quantities,
  onChangeQuantity,
  onAddSelections,
  disabled,
}: MenuMatrixProps) {
  const gridStyle = {
    "--matrix-cols": matrix.columns.length,
  } as CSSProperties;
  const matrixLabel = matrix.title.toLowerCase();

  const getValue = (rowId: string, columnId: string) =>
    quantities[`${menuId}:${rowId}:${columnId}`] ?? 0;

  const getRowSelections = (rowId: string, rowLabel: string) => {
    const rowSelections: MatrixSelection[] = [];
    matrix.columns.forEach((column) => {
      const quantity = getValue(rowId, column.id);
      if (quantity > 0) {
        rowSelections.push({
          rowId,
          rowLabel,
          columnId: column.id,
          columnLabel: column.label,
          quantity,
          unitPrice: column.price,
        });
      }
    });
    return rowSelections;
  };

  return (
    <section
      className={styles.matrixSection}
      aria-label={`${matrix.title} grid`}
    >
      <div className={styles.matrixCard}>
        <div className={styles.matrixHeaderRow} style={gridStyle}>
          <span />
          {matrix.columns.map((column) => (
            <div key={column.id} className={styles.matrixHeaderCell}>
              <span className={styles.matrixHeaderLabel}>{column.label}</span>
              <span className={styles.matrixHeaderPrice}>
                {formatMoney(column.price)}
              </span>
            </div>
          ))}
        </div>
        {matrix.rows.map((row) => {
          const rowSelections = getRowSelections(row.id, row.label);
          const showRowAction = rowSelections.length > 0 && !disabled;

          return (
            <div key={row.id} className={styles.matrixRow} style={gridStyle}>
              <div className={styles.matrixRowLabel}>{row.label}</div>
              {matrix.columns.map((column) => {
                const inputId = `${menuId}-${row.id}-${column.id}`;
                const value = getValue(row.id, column.id);
                const decrementDisabled = disabled || value <= 0;
                return (
                  <div key={column.id} className={styles.matrixCell}>
                    <label className={styles.matrixCellLabel} htmlFor={inputId}>
                      <span>{column.label}</span>
                      <span className={styles.matrixCellPrice}>
                        {formatMoney(column.price)}
                      </span>
                    </label>
                    <div className={styles.matrixQuantityControl}>
                      <button
                        type="button"
                        className={styles.matrixQuantityButton}
                        onClick={() =>
                          onChangeQuantity(
                            row.id,
                            column.id,
                            Math.max(0, value - 1),
                          )
                        }
                        disabled={decrementDisabled}
                        aria-label={`Decrease ${row.label} ${column.label}`}
                      >
                        -
                      </button>
                      <input
                        id={inputId}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        className={styles.matrixInput}
                        value={value}
                        onChange={(event) =>
                          onChangeQuantity(
                            row.id,
                            column.id,
                            Math.max(0, Number(event.target.value) || 0),
                          )
                        }
                        disabled={disabled}
                        aria-label={`${row.label} ${matrixLabel} quantity for ${column.label}`}
                      />
                      <button
                        type="button"
                        className={styles.matrixQuantityButton}
                        onClick={() =>
                          onChangeQuantity(row.id, column.id, value + 1)
                        }
                        disabled={disabled}
                        aria-label={`Increase ${row.label} ${column.label}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
              {showRowAction ? (
                <div className={styles.matrixRowActions}>
                  <button
                    type="button"
                    className={styles.matrixRowButton}
                    onClick={() => onAddSelections(rowSelections)}
                  >
                    Add {row.label}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
