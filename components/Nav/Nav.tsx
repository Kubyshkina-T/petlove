"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./Nav.module.css";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={css.nav}>
      <Link
        href="/news"
        className={`${css.link} ${pathname === "/news" ? css.active : ""}`}
      >
        News
      </Link>

      <Link
        href="/notices"
        className={`${css.link} ${pathname === "/notices" ? css.active : ""}`}
      >
        Find pet
      </Link>

      <Link
        href="/friends"
        className={`${css.link} ${pathname === "/friends" ? css.active : ""}`}
      >
        Our friends
      </Link>
    </nav>
  );
}
