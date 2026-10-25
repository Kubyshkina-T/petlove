"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import type { Notice } from "@/types/notice";
import css from "./ModalNotice.module.css";

type Props = {
  notice: Notice | null;
  onClose: () => void;
};

export default function ModalNotice({ notice, onClose }: Props) {
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

  const birthday = new Date(`${notice.birthday}T00:00:00Z`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    },
  );

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
              sizes="(max-width: 767px) 100vw, 300px"
              className={css.image}
            />
          </div>

          <div className={css.info}>
            <div className={css.heading}>
              <h2 id="notice-modal-title" className={css.title}>
                {notice.title}
              </h2>

              <span className={css.popularity}>
                <svg className={css.star} aria-hidden="true">
                  <use href="/icons/sprite.svg#icon-star" />
                </svg>
                {notice.popularity}
              </span>
            </div>

            <dl className={css.details}>
              <div>
                <dt>Name</dt>
                <dd>{notice.name}</dd>
              </div>

              <div>
                <dt>Birthday</dt>
                <dd>{birthday}</dd>
              </div>

              <div>
                <dt>Sex</dt>
                <dd>{notice.sex}</dd>
              </div>

              <div>
                <dt>Species</dt>
                <dd>{notice.species}</dd>
              </div>

              <div>
                <dt>Category</dt>
                <dd>{notice.category}</dd>
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
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
