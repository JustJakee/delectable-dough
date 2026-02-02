import { useState } from "react";
import { NavLink } from "react-router-dom";
import { assetUrls } from "../../content/assets";
import styles from "./Header.module.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "News", to: "/news" },
  { label: "What We Bake", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((open) => !open);
  const handleClose = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} onClick={handleClose}>
          <img
            className={styles.logo}
            src={assetUrls.logo}
            alt="Delectable Dough"
          />
        </NavLink>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={handleToggle}
        >
          Menu
        </button>
        <nav
          id="primary-navigation"
          aria-label="Primary"
          className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    isActive ? styles.navLinkActive : styles.navLink
                  }
                  onClick={handleClose}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
