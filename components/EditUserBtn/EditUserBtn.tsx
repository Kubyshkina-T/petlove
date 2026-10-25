"use client";

import css from "@/app/profile/page.module.css";

type Props = {
  onClick: () => void;
};

export default function EditUserBtn({ onClick }: Props) {
  return (
    <button
      type="button"
      className={css.editButton}
      onClick={onClick}
      aria-label="Edit profile"
    >
      <svg aria-hidden="true">
        <use href="/icons/sprite.svg#icon-edit-2" />
      </svg>
    </button>
  );
}
