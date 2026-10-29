"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import { uploadImage } from "@/lib/uploadImage";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
]);

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
    message: "Please upload a valid image.",
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
  const uploadId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [selectedPhotoName, setSelectedPhotoName] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
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

  const avatarURL = useWatch({
    control,
    name: "avatar",
  });

  const isBusy = isSubmitting || isUploadingAvatar;

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });

    setSelectedPhotoName("");
    setPreviewFailed(false);
  }, [isOpen, reset, user.name, user.email, user.phone, user.avatar]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isBusy) {
        onClose();
      }

      if (event.key === "Tab" && dialogRef.current) {
        const elements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled):not([type="hidden"]), a[href]',
          ),
        ).filter((element) => {
          return element.getClientRects().length > 0;
        });

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
  }, [isOpen, isBusy, onClose]);

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || uploadingRef.current || isSubmitting) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error("Please select a PNG, JPG, JPEG, GIF, BMP or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      toast.error("Photo size must be between 1 byte and 5 MB.");
      event.target.value = "";
      return;
    }

    uploadingRef.current = true;
    setIsUploadingAvatar(true);
    setPreviewFailed(false);

    try {
      const imageUrl = await uploadImage(file);

      setValue("avatar", imageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setSelectedPhotoName(file.name);
      toast.success("Photo uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not upload avatar. Please try again.",
      );
    } finally {
      uploadingRef.current = false;
      setIsUploadingAvatar(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const submitForm = async (data: EditUserValues) => {
    if (uploadingRef.current) {
      toast.error("Please wait until the photo is uploaded.");
      return;
    }

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
        if (event.target === event.currentTarget && !isBusy) {
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
        aria-busy={isBusy}
      >
        <button
          ref={closeRef}
          type="button"
          className={css.closeButton}
          onClick={onClose}
          disabled={isBusy}
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
          <div className={css.avatarSection}>
            <div className={css.avatarPreview}>
              {avatarURL && avatarRegex.test(avatarURL) && !previewFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={avatarURL}
                  src={avatarURL}
                  alt="Your avatar"
                  className={css.avatarImage}
                  onError={() => setPreviewFailed(true)}
                />
              ) : (
                <svg className={css.avatarPlaceholder} aria-hidden="true">
                  <use href="/icons/sprite.svg#icon-user" />
                </svg>
              )}
            </div>

            <input
              ref={fileInputRef}
              id={uploadId}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
              className={css.fileInput}
              onChange={(event) => void handleAvatarChange(event)}
              disabled={isBusy}
              aria-label="Choose profile photo"
            />

            <button
              type="button"
              className={css.uploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
            >
              {isUploadingAvatar
                ? "Uploading..."
                : selectedPhotoName || "Upload photo"}
            </button>

            <input type="hidden" {...register("avatar")} />

            {errors.avatar && (
              <span className={css.error} role="alert">
                {errors.avatar.message}
              </span>
            )}
          </div>

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

          <button type="submit" className={css.saveButton} disabled={isBusy}>
            {isSubmitting
              ? "SAVING..."
              : isUploadingAvatar
                ? "UPLOADING..."
                : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
