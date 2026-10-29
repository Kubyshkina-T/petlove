"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import css from "./ModalAttention.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalAttention({ isOpen, onClose }: Props) {
  const titleId = useId();
  const descriptionId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab" && dialogRef.current) {
        const elements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href]",
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
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

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
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeRef}
          type="button"
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg aria-hidden="true">
            <use href="/icons/sprite.svg#icon-button-close" />
          </svg>
        </button>

        <div className={css.dogIcon} aria-hidden="true">
          🐶
        </div>

        <h2 id={titleId} className={css.title}>
          Attention
        </h2>

        <p id={descriptionId} className={css.description}>
          We would like to remind you that certain functionality is available
          only to authorized users. If you have an account, please log in with
          your credentials. If you do not already have an account, you must
          register to access these features.
        </p>

        <div className={css.actions}>
          <Link href="/login" className={css.loginButton} onClick={onClose}>
            Log In
          </Link>

          <Link
            href="/register"
            className={css.registerButton}
            onClick={onClose}
          >
            Registration
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
