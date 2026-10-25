"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import css from "./ModalEditUser.module.css";

export type EditUserValues = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

type Props = {
  isOpen: boolean;
  user: EditUserValues;
  onClose: () => void;
  onSave: (data: EditUserValues) => Promise<void>;
};

export default function ModalEditUser({
  isOpen,
  user,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<EditUserValues>(user);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    setForm(user);
    setError("");

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !savingRef.current) {
        onClose();
      }

      if (event.key === "Tab" && dialogRef.current) {
        const elements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not(:disabled), input:not(:disabled)",
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

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, user, onClose]);

  const updateField = (field: keyof EditUserValues, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email.");
      return;
    }

    if (form.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(form.phone.trim())) {
      setError("Enter a valid phone number.");
      return;
    }

    if (form.avatar.trim()) {
      try {
        const url = new URL(form.avatar.trim());

        if (url.protocol !== "https:") {
          throw new Error();
        }
      } catch {
        setError("Enter a valid HTTPS image URL.");
        return;
      }
    }
    savingRef.current = true;
    setIsSaving(true);

    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={css.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !savingRef.current) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
      >
        <button
          ref={closeRef}
          type="button"
          className={css.closeButton}
          onClick={onClose}
          disabled={isSaving}
          aria-label="Close modal"
        >
          <svg aria-hidden="true">
            <use href="/icons/sprite.svg#icon-button-close" />
          </svg>
        </button>

        <h2 id="edit-user-title" className={css.title}>
          Edit information
        </h2>

        <form className={css.form} onSubmit={handleSubmit} noValidate>
          <label className={css.field}>
            <span>Name</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              autoComplete="name"
              required
            />
          </label>

          <label className={css.field}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className={css.field}>
            <span>Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+380..."
              autoComplete="tel"
            />
          </label>

          <label className={css.field}>
            <span>Avatar URL</span>
            <input
              type="url"
              value={form.avatar}
              onChange={(event) => updateField("avatar", event.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </label>

          {error && (
            <p className={css.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={css.saveButton} disabled={isSaving}>
            {isSaving ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
