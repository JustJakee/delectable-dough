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

  const selections: MatrixSelection[] = [];

  matrix.rows.forEach((row) => {
    matrix.columns.forEach((column) => {
      const quantity = getValue(row.id, column.id);
      if (quantity > 0) {
        selections.push({
          rowId: row.id,
          rowLabel: row.label,
          columnId: column.id,
          columnLabel: column.label,
          quantity,
          unitPrice: column.price,
        });
      }
    });
  });

  const canAdd = selections.length > 0 && !disabled;

  return (
    <section
      className={styles.matrixSection}
      aria-label={`${matrix.title} grid`}
    >
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
      {matrix.rows.map((row) => (
        <div key={row.id} className={styles.matrixRow} style={gridStyle}>
          <div className={styles.matrixRowLabel}>{row.label}</div>
          {matrix.columns.map((column) => {
            const inputId = `${menuId}-${row.id}-${column.id}`;
            return (
              <div key={column.id} className={styles.matrixCell}>
                <label className={styles.matrixCellLabel} htmlFor={inputId}>
                  <span>{column.label}</span>
                  <span className={styles.matrixCellPrice}>
                    {formatMoney(column.price)}
                  </span>
                </label>
                <input
                  id={inputId}
                  type="number"
                  min={0}
                  className={styles.matrixInput}
                  value={getValue(row.id, column.id)}
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
              </div>
            );
          })}
        </div>
      ))}
      <div className={styles.matrixActions}>
        <button
          type="button"
          className={`${styles.addButton} ${styles.matrixAddButton}`}
          onClick={() => onAddSelections(selections)}
          disabled={!canAdd}
        >
          {disabled ? "Unavailable online" : "Add selected to order"}
        </button>
      </div>
    </section>
  );
}
