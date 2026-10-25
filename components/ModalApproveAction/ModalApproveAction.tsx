"use client";

import { useEffect, useId } from "react";
import css from "./ModalApproveAction.module.css";

type Props = {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function ModalApproveAction({
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={css.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={css.closeButton}
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M18 6 6 18M6 6l12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={css.iconCircle} aria-hidden="true">
          <span className={css.catPlaceholder}>🐈</span>
        </div>

        <h2 className={css.title} id={titleId}>
          Already leaving?
        </h2>

        <div className={css.actions}>
          <button
            type="button"
            className={css.confirmButton}
            onClick={() => void onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? "Leaving..." : "Yes"}
          </button>

          <button
            type="button"
            className={css.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
