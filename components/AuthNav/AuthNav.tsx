import Link from "next/link";
import css from "./AuthNav.module.css";

export default function AuthNav() {
  return (
    <nav className={css.authNav} aria-label="Authentication">
      <Link href="/login" className={`${css.link} ${css.login}`}>
        LOG IN
      </Link>

      <Link href="/register" className={`${css.link} ${css.register}`}>
        REGISTRATION
      </Link>
    </nav>
  );
}
