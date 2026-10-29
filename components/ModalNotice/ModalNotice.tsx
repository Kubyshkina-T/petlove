"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import type { Notice } from "@/types/notice";
import css from "./ModalNotice.module.css";

type Props = {
  notice: Notice | null;
  onClose: () => void;
  onFavorite: (notice: Notice) => void | Promise<void>;
  isFavorite: boolean;
  isFavoriteLoading: boolean;
};

type NoticeWithContact = Notice & {
  user?: {
    email?: string;
    phone?: string;
  };
  email?: string;
  phone?: string;
};

export default function ModalNotice({
  notice,
  onClose,
  onFavorite,
  isFavorite,
  isFavoriteLoading,
}: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notice) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab" && dialogRef.current) {
        const elements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href]",
          ),
        );

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [notice, onClose]);

  if (!notice || typeof document === "undefined") {
    return null;
  }

  const birthday = new Date(
    `${notice.birthday.slice(0, 10)}T00:00:00Z`,
  ).toLocaleDateString("en-GB", {
    timeZone: "UTC",
  });

  const contactHref = notice.user?.email
    ? `mailto:${notice.user.email}`
    : notice.user?.phone
      ? `tel:${notice.user.phone}`
      : null;

  const category =
    notice.category.charAt(0).toUpperCase() +
    notice.category.slice(1).toLowerCase();

  return createPortal(
    <div
      className={css.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-modal-title"
        aria-describedby="notice-modal-description"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className={css.closeIcon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-button-close" />
          </svg>
        </button>

        <div className={css.content}>
          <div className={css.imageWrapper}>
            <Image
              src={notice.imgURL}
              alt={notice.title}
              fill
              sizes="150px"
              className={css.image}
            />

            <span className={css.category}>{category}</span>
          </div>

          <div className={css.info}>
            <h2 id="notice-modal-title" className={css.title}>
              {notice.title}
            </h2>

            <div
              className={css.popularity}
              aria-label={`Popularity: ${notice.popularity}`}
            >
              <svg className={css.star} aria-hidden="true">
                <use href="/icons/sprite.svg#icon-star" />
              </svg>

              <span>{notice.popularity}</span>
            </div>

            <dl className={css.details}>
              <div className={css.detail}>
                <dt>Name</dt>
                <dd>{notice.name}</dd>
              </div>

              <div className={css.detail}>
                <dt>Birthday</dt>
                <dd>{birthday}</dd>
              </div>

              <div className={css.detail}>
                <dt>Sex</dt>
                <dd>{notice.sex}</dd>
              </div>

              <div className={css.detail}>
                <dt>Species</dt>
                <dd>{notice.species}</dd>
              </div>
            </dl>

            <p id="notice-modal-description" className={css.comment}>
              {notice.comment}
            </p>

            <p className={css.price}>
              {typeof notice.price === "number"
                ? `$${notice.price.toFixed(2)}`
                : "Free"}
            </p>

            <div className={css.actions}>
              <button
                type="button"
                className={css.favoriteButton}
                onClick={() => void onFavorite(notice)}
                disabled={isFavoriteLoading}
                aria-pressed={isFavorite}
              >
                <span>{isFavorite ? "Remove from" : "Add to"}</span>

                <svg
                  className={`${css.heartIcon} ${
                    isFavorite ? css.heartActive : ""
                  }`}
                  aria-hidden="true"
                >
                  <use href="/icons/sprite.svg#icon-heart" />
                </svg>
              </button>

              {contactHref ? (
                <a href={contactHref} className={css.contactButton}>
                  Contact
                </a>
              ) : (
                <button type="button" className={css.contactButton} disabled>
                  Contact
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
