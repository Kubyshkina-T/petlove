import Link from "next/link";
import css from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href="/home" className={css.logo} aria-label="PetLove Home">
      petl
      <svg className={css.heart} aria-hidden="true">
        <use href="/icons/sprite.svg#icon-heart" />
      </svg>
      ve
    </Link>
  );
}
