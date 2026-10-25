"use client";

import css from "@/app/profile/page.module.css";

type Props = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  onEdit: () => void;
};

export default function UserBlock({
  name,
  email,
  phone,
  avatar,
  onEdit,
}: Props) {
  return (
    <>
      <div className={css.avatarSection}>
        <div className={css.avatarPlaceholder}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={`${name}'s avatar`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-user" />
            </svg>
          )}
        </div>

        <button type="button" className={css.uploadButton} onClick={onEdit}>
          Edit photo URL
        </button>
      </div>

      <div className={css.information}>
        <h2 className={css.sectionTitle}>My information</h2>

        <div className={css.infoGrid}>
          <div className={css.infoField}>{name}</div>

          <div className={css.infoField}>{email}</div>

          <div className={css.infoField}>{phone || "Phone not specified"}</div>
        </div>
      </div>
    </>
  );
}
