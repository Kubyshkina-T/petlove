"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Logo from "@/components/Logo/Logo";
import Nav from "@/components/Nav/Nav";
import AuthNav from "@/components/AuthNav/AuthNav";
import UserNav from "@/components/UserNav/UserNav";

import css from "./Header.module.css";

type SessionResponse = {
  isAuthenticated: boolean;
  name: string | null;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const pathname = usePathname();
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    closeMenu();

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [pathname]);

  useEffect(() => {
    let active = true;
    let requestId = 0;

    const checkAuth = async () => {
      const currentRequest = ++requestId;

      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to verify session");
        }

        const data: SessionResponse = await response.json();

        if (!active || currentRequest !== requestId) return;

        setIsAuthenticated(data.isAuthenticated);
        setUserName(data.isAuthenticated ? data.name : null);
      } catch {
        if (!active || currentRequest !== requestId) return;
        setIsAuthenticated(null);
        setUserName(null);
      }
    };

    void checkAuth();
    const handleFocus = () => {
      void checkAuth();
    };

    const handleAuthChanged = () => {
      void checkAuth();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("petlove-auth-changed", handleAuthChanged);

    return () => {
      active = false;
      requestId++;

      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("petlove-auth-changed", handleAuthChanged);
    };
  }, [pathname]);
  const userNavigation =
    isAuthenticated === null ? null : isAuthenticated ? (
      <UserNav name={userName ?? "User"} />
    ) : (
      <AuthNav />
    );

  return (
    <header className={css.header}>
      <Logo />

      <div className={css.desktopNav}>
        <Nav />
        {userNavigation}
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

        <div className={css.mobileAuth}>{userNavigation}</div>
      </div>
    </header>
  );
}
