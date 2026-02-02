import { Link, useParams } from "react-router-dom";
import { menus } from "../../content/menus";
import type {
  Availability,
  MenuItem,
  Price,
  Variant,
} from "../../content/menuTypes";
import styles from "./MenuDetail.module.css";

const availabilityLabels: Record<Availability["type"], string> = {
  year_round: "Year-round",
  seasonal: "Seasonal",
  holiday: "Holiday",
  special_request: "Special request",
  out_of_season: "Out of season",
};

const formatAvailability = (availability?: Availability) => {
  if (!availability) {
    return undefined;
  }

  const label = availabilityLabels[availability.type];
  return availability.details ? `${label} - ${availability.details}` : label;
};

const formatPrice = (price: Price) =>
  price.label ? `${price.label}: ${price.amount}` : price.amount;

const formatVariant = (variant: Variant) => {
  const details: string[] = [];
  const availability = formatAvailability(variant.availability);

  if (availability) {
    details.push(availability);
  }

  if (variant.sizes?.length) {
    details.push(`Sizes: ${variant.sizes.join(", ")}`);
  }

  if (variant.minimumOrder) {
    details.push(`Minimum order: ${variant.minimumOrder}`);
  }

  if (variant.prices?.length) {
    details.push(`Prices: ${variant.prices.map(formatPrice).join(", ")}`);
  }

  if (variant.notes?.length) {
    details.push(`Notes: ${variant.notes.join(" ")}`);
  }

  return details.length > 0
    ? `${variant.name} (${details.join("; ")})`
    : variant.name;
};

const buildItemLines = (item: MenuItem) => {
  const lines: string[] = [];

  if (item.description) {
    lines.push(item.description);
  }

  if (item.minimumOrder) {
    lines.push(`Minimum order: ${item.minimumOrder}`);
  }

  if (item.sizes?.length) {
    lines.push(`Sizes: ${item.sizes.join(", ")}`);
  }

  if (item.prices?.length) {
    lines.push(`Prices: ${item.prices.map(formatPrice).join(", ")}`);
  }

  if (item.variants?.length) {
    lines.push(`Flavors: ${item.variants.map(formatVariant).join(", ")}`);
  }

  if (item.notes?.length) {
    lines.push(`Notes: ${item.notes.join(" ")}`);
  }

  return lines;
};

export default function MenuDetail() {
  const { menuId } = useParams();
  const menu = menus.find((entry) => entry.id === menuId);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>What We Bake</p>
        <h1>{menu ? menu.title : "Menu not found"}</h1>
        <p>
          {menu
            ? menu.description
            : "We rotate menus often. Please choose a menu from the hub."}
        </p>
        <Link className={styles.link} to="/menu">
          Back to menus
        </Link>
      </header>
      {menu ? (
        <div className={styles.content}>
          <div className={styles.sections}>
            {menu.sections.map((section) => (
              <section key={section.title} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                {section.description ? (
                  <p className={styles.sectionDescription}>
                    {section.description}
                  </p>
                ) : null}
                {section.items.length ? (
                  <ul className={styles.list}>
                    {section.items.map((item) => {
                      const availability = formatAvailability(
                        item.availability,
                      );
                      const lines = buildItemLines(item);

                      return (
                        <li key={item.name} className={styles.item}>
                          <div className={styles.itemHeader}>
                            <span className={styles.itemName}>{item.name}</span>
                            {availability ? (
                              <span className={styles.itemAvailability}>
                                {availability}
                              </span>
                            ) : null}
                          </div>
                          {lines.length ? (
                            <div className={styles.itemMeta}>
                              {lines.map((line, index) => (
                                <p key={`${item.name}-${index}`}>{line}</p>
                              ))}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          <aside className={styles.cta}>
            <h2>Contact to order</h2>
            <p>
              Planning ahead or ordering for a crowd? We will confirm
              availability and timing within two business days.
            </p>
            <Link className={styles.ctaButton} to="/contact">
              Contact to Order
            </Link>
          </aside>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>
            Try strudel, gooey butter cakes, sweet trays, or seasonal
            specialties.
          </p>
        </div>
      )}
    </div>
  );
}
