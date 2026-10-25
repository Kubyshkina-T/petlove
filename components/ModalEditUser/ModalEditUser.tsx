"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

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

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const avatarRegex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/;

const phoneRegex = /^\+38\d{10}$/;

const schema = yup.object({
  name: yup.string().defined(),

  email: yup.string().defined().matches(emailRegex, {
    message: "Enter a valid email.",
    excludeEmptyString: true,
  }),

  phone: yup.string().defined().matches(phoneRegex, {
    message: "Enter a phone number in the format +380XXXXXXXXX.",
    excludeEmptyString: true,
  }),

  avatar: yup.string().defined().matches(avatarRegex, {
    message: "Enter a valid image URL.",
    excludeEmptyString: true,
  }),
});

export default function ModalEditUser({
  isOpen,
  user,
  onClose,
  onSave,
}: Props) {
  const titleId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    },
  });

  // Fill the form with the current profile information.
  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });
  }, [isOpen, reset, user.name, user.email, user.phone, user.avatar]);

  // Manage focus, Escape and page scrolling.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, isSubmitting, onClose]);

  const submitForm = async (data: EditUserValues) => {
    try {
      await onSave({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        avatar: data.avatar.trim(),
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save changes. Please try again.",
      );
    }
  };

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={css.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
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
      >
        <button
          ref={closeRef}
          type="button"
          className={css.closeButton}
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close modal"
        >
          <svg aria-hidden="true">
            <use href="/icons/sprite.svg#icon-button-close" />
          </svg>
        </button>

        <h2 id={titleId} className={css.title}>
          Edit information
        </h2>

        <form
          className={css.form}
          onSubmit={handleSubmit(submitForm)}
          noValidate
        >
          <label className={css.field}>
            <span>Name</span>
            <input
              {...register("name")}
              type="text"
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <span className={css.error} role="alert">
                {errors.name.message}
              </span>
            )}
          </label>

          <label className={css.field}>
            <span>Email</span>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className={css.error} role="alert">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className={css.field}>
            <span>Phone</span>
            <input
              {...register("phone")}
              type="tel"
              placeholder="+380XXXXXXXXX"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <span className={css.error} role="alert">
                {errors.phone.message}
              </span>
            )}
          </label>

          <label className={css.field}>
            <span>Avatar URL</span>
            <input
              {...register("avatar")}
              type="url"
              placeholder="https://example.com/photo.jpg"
              aria-invalid={!!errors.avatar}
            />
            {errors.avatar && (
              <span className={css.error} role="alert">
                {errors.avatar.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            className={css.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
