import { Select, Tag } from "antd";
import type { Menu } from "../../types/menu";
import styles from "./MenuSelector.module.css";

type StatusKey =
  | "outOfSeason"
  | "callToRequest"
  | "specialRequest"
  | "holiday"
  | "specialOffer"
  | "available";

const STATUS_LABELS: Record<StatusKey, string> = {
  outOfSeason: "Out of season",
  callToRequest: "Call to request",
  specialRequest: "Special request",
  holiday: "Holiday",
  specialOffer: "Special offer",
  available: "Available",
};

const parseDate = (value?: string) =>
  value ? new Date(`${value}T12:00:00`) : null;

const formatShortDate = (value?: string) => {
  if (!value) {
    return "";
  }
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getSeasonLabel = (menu: Menu) => {
  const start = formatShortDate(menu.activeFrom);
  const end = formatShortDate(menu.activeTo);
  if (start && end) {
    return `${start}\u2013${end}`;
  }
  if (start) {
    return `From ${start}`;
  }
  if (end) {
    return `Until ${end}`;
  }
  return "";
};

const isOutOfSeason = (menu: Menu) => {
  const start = parseDate(menu.activeFrom);
  const end = parseDate(menu.activeTo);
  if (!start && !end) {
    return false;
  }
  const today = new Date();
  if (start && today < start) {
    return true;
  }
  if (end && today > end) {
    return true;
  }
  return false;
};

const hasTag = (menu: Menu, tag: string) =>
  Boolean((menu as { tags?: string[] }).tags?.includes(tag));

const isHoliday = (menu: Menu) =>
  hasTag(menu, "holiday") ||
  menu.badge?.toLowerCase().includes("holiday") ||
  menu.title.toLowerCase().includes("holiday");

const isSpecialOffer = (menu: Menu) =>
  hasTag(menu, "special-offer") || menu.badge?.toLowerCase().includes("offer");

const getStatusTags = (menu: Menu): StatusKey[] => {
  const tags: StatusKey[] = [];
  if (isOutOfSeason(menu)) {
    tags.push("outOfSeason");
  }
  if (menu.orderMode === "viewOnly") {
    tags.push("callToRequest");
  }
  if (menu.orderMode === "requestOnly") {
    tags.push("specialRequest");
  }
  if (isHoliday(menu)) {
    tags.push("holiday");
  }
  if (isSpecialOffer(menu)) {
    tags.push("specialOffer");
  }
  if (tags.length === 0) {
    tags.push("available");
  }
  return tags.slice(0, 2);
};

type MenuSelectorProps = {
  menus: Menu[];
  selectedMenuId: string;
  selectedMenu: Menu;
  status: "available" | "requestOnly" | "viewOnly" | "outOfSeason";
  getStatus: (
    menu: Menu,
  ) => "available" | "requestOnly" | "viewOnly" | "outOfSeason";
  onSelect: (menuId: string) => void;
};

const getMinimumPill = (note?: string) => {
  if (!note) {
    return "";
  }
  const cleaned = note.replace(/minimum order[:]?/i, "").trim();
  const trimmed = cleaned.replace(/\.$/, "");
  return `Min ${trimmed}`;
};

export default function MenuSelector(props: MenuSelectorProps) {
  const { menus, selectedMenuId, selectedMenu, status, getStatus, onSelect } =
    props;
  const showSpecialRequest =
    status === "requestOnly" || status === "outOfSeason";
  const showViewOnly = status === "viewOnly";
  const selectedTags = getStatusTags(selectedMenu);
  const minimumPill = getMinimumPill(selectedMenu.minimumOrderNote);
  const availabilityDetail =
    getSeasonLabel(selectedMenu) ||
    selectedMenu.availabilityNote ||
    "Year-round";
  const minimumDetail = selectedMenu.minimumOrderNote || "No minimum";

  return (
    <div className={styles.menuSelector}>
      <Select
        className={styles.select}
        popupClassName={styles.dropdown}
        value={selectedMenuId}
        onChange={(value) => onSelect(value)}
        optionLabelProp="label"
        aria-labelledby="menu-select-label"
      >
        {menus.map((menu) => {
          const baseStatus = getStatus(menu);
          const outOfSeason = baseStatus === "outOfSeason";
          const disabled = outOfSeason || baseStatus === "viewOnly";
          const statusTags = getStatusTags(menu);
          const optionTags = statusTags.filter((tag) => tag !== "available");
          const seasonLabel = getSeasonLabel(menu);
          const optionMeta =
            seasonLabel || menu.description || menu.availabilityNote || "";

          const selectedLabel = (
            <span className={styles.selectedLabel}>
              <span className={styles.selectedTitle}>{menu.title}</span>
              <span className={styles.selectedTags}>
                {optionTags.map((tag) => (
                  <Tag
                    key={`${menu.id}-selected-${tag}`}
                    className={`${styles.statusTag} ${styles[`status${tag}`]}`}
                  >
                    {STATUS_LABELS[tag]}
                  </Tag>
                ))}
              </span>
            </span>
          );

          return (
            <Select.Option
              key={menu.id}
              value={menu.id}
              label={selectedLabel}
              disabled={disabled}
            >
              <div className={styles.optionRow}>
                <div className={styles.optionText}>
                  <span className={styles.optionTitle}>{menu.title}</span>
                  {optionMeta ? (
                    <span className={styles.optionMeta}>{optionMeta}</span>
                  ) : null}
                </div>
                <div className={styles.optionTags}>
                  {optionTags.map((tag) => (
                    <Tag
                      key={`${menu.id}-${tag}`}
                      className={`${styles.statusTag} ${styles[`status${tag}`]}`}
                    >
                      {STATUS_LABELS[tag]}
                    </Tag>
                  ))}
                </div>
              </div>
            </Select.Option>
          );
        })}
      </Select>

      <section className={styles.menuInfoCard} aria-label="Menu information">
        {selectedMenu.description ? (
          <p className={styles.menuInfoDescription}>
            {selectedMenu.description}
          </p>
        ) : null}
        <div className={styles.menuInfoDetails}>
          <div className={styles.menuInfoDetail}>
            <span className={styles.menuInfoLabel}>Availability</span>
            <span className={styles.menuInfoValue}>{availabilityDetail}</span>
          </div>
          <div className={styles.menuInfoDetail}>
            <span className={styles.menuInfoLabel}>Minimum</span>
            <span className={styles.menuInfoValue}>{minimumDetail}</span>
          </div>
        </div>
        {showViewOnly ? (
          <p className={styles.menuInfoNotice}>
            Call or email to request this menu.
          </p>
        ) : null}
        {!showViewOnly && showSpecialRequest ? (
          <p className={styles.menuInfoNotice}>
            We&apos;ll confirm availability and follow up with an invoice.
          </p>
        ) : null}
      </section>
    </div>
  );
}
