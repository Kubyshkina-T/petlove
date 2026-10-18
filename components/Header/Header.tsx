"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Logo from "@/components/Logo/Logo";
import Nav from "@/components/Nav/Nav";
import AuthNav from "@/components/AuthNav/AuthNav";
import css from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    closeMenu();
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [pathname]);

  return (
    <header className={css.header}>
      <Logo />

      <div className={css.desktopNav}>
        <Nav />
        <AuthNav />
      </div>

      <button
        type="button"
        className={css.burger}
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <svg className={css.icon} aria-hidden="true">
          <use href="/icons/sprite.svg#icon-burger-menu" />
        </svg>
      </button>

      {isMenuOpen && (
        <div className={css.backdrop} onClick={() => setIsMenuOpen(false)} />
      )}

      <div
        id="mobile-menu"
        className={`${css.mobileMenu} ${isMenuOpen ? css.menuOpen : ""}`}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <button
          type="button"
          className={css.closeButton}
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg className={css.icon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-button-close" />
          </svg>
        </button>

        <div className={css.mobileNav}>
          <Nav />
        </div>

        <div className={css.mobileAuth}>
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
