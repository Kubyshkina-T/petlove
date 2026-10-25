"use client";

import Link from "next/link";
import LogOutBtn from "@/components/LogOutBtn/LogOutBtn";
import css from "./UserNav.module.css";

type Props = {
  name: string;
};

export default function UserNav({ name }: Props) {
  return (
    <div className={css.userNav}>
      <LogOutBtn className={css.logout} label="LOG OUT" />

      <Link href="/profile" className={css.profile}>
        <svg className={css.userIcon} aria-hidden="true">
          <use href="/icons/sprite.svg#icon-user" />
        </svg>

        <span>{name}</span>
      </Link>
    </div>
  );
}
