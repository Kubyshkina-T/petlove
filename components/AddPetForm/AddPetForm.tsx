"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import { uploadImage } from "@/lib/uploadImage";
import css from "./AddPetForm.module.css";

const imageRegex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
];

const schema = yup.object({
  name: yup.string().trim().required("Pet's name is required."),

  title: yup.string().trim().required("Title is required."),

  imgURL: yup
    .string()
    .trim()
    .required("Please upload a photo.")
    .matches(imageRegex, "Enter a valid image URL."),

  species: yup.string().required("Select a type of pet."),

  birthday: yup
    .string()
    .required("Birthday is required.")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid birthday.")
    .test("valid-date", "Enter a valid birthday.", (value) => {
      if (!value) return true;

      const date = new Date(`${value}T00:00:00Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value &&
        date.getTime() <= Date.now()
      );
    }),

  sex: yup.string().required("Select your pet's gender."),
});

export type AddPetValues = yup.InferType<typeof schema>;

type Props = {
  onSubmit: (data: AddPetValues) => Promise<void>;
  onCancel: () => void;
};

const sexOptions = [
  {
    value: "female",
    label: "Female",
    icon: "icon-female",
  },
  {
    value: "male",
    label: "Male",
    icon: "icon-male",
  },
  {
    value: "unknown",
    label: "Unknown",
    icon: "icon-healthicons",
  },
];

export default function AddPetForm({ onSubmit, onCancel }: Props) {
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [selectedPhotoName, setSelectedPhotoName] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddPetValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      title: "",
      imgURL: "",
      species: "",
      birthday: "",
      sex: "",
    },
  });

  const selectedSex = useWatch({
    control,
    name: "sex",
  });

  const imageURL = useWatch({
    control,
    name: "imgURL",
  });

  const showPreview =
    Boolean(imageURL) && imageRegex.test(imageURL.trim()) && !previewFailed;

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || isUploadingPhoto || isSubmitting) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please select a PNG, JPG, JPEG, GIF, BMP or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Photo size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setIsUploadingPhoto(true);
    setSelectedPhotoName(file.name);
    setPreviewFailed(false);

    // Clear the previous URL so an old photo cannot be submitted
    // if uploading the new photo fails.
    setValue("imgURL", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    try {
      const uploadedURL = await uploadImage(file);

      setValue("imgURL", uploadedURL, {
        shouldValidate: true,
        shouldDirty: true,
      });

      toast.success("Photo uploaded successfully.");
    } catch (error) {
      setSelectedPhotoName("");

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not upload photo. Please try again.",
      );
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const submitForm = async (data: AddPetValues) => {
    if (isUploadingPhoto) {
      toast.error("Please wait until the photo is uploaded.");
      return;
    }

    try {
      await onSubmit(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not add pet. Please try again.",
      );
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(submitForm)} noValidate>
      <fieldset className={css.sexGroup}>
        <legend className={css.visuallyHidden}>Pet gender</legend>

        {sexOptions.map((option) => (
          <label
            key={option.value}
            className={`${css.sexOption} ${
              selectedSex === option.value ? css.sexActive : ""
            }`}
            title={option.label}
          >
            <input type="radio" value={option.value} {...register("sex")} />

            <svg className={css.sexIcon} aria-hidden="true">
              <use href={`/icons/sprite.svg#${option.icon}`} />
            </svg>

            <span className={css.visuallyHidden}>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {errors.sex && (
        <p className={css.error} role="alert">
          {errors.sex.message}
        </p>
      )}

      <div className={css.avatar}>
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={imageURL}
            src={imageURL.trim()}
            alt="Pet preview"
            className={css.avatarImage}
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <svg className={css.pawIcon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-lapa" />
          </svg>
        )}
      </div>

      <div className={css.photoRow}>
        <input
          className={css.input}
          type="text"
          value={selectedPhotoName}
          placeholder="Choose a photo"
          aria-label="Selected photo"
          readOnly
        />

        <label className={css.uploadHint} htmlFor="pet-photo-upload">
          {isUploadingPhoto ? "Uploading..." : "Upload photo"}

          <svg aria-hidden="true">
            <use href="/icons/sprite.svg#icon-upload-cloud" />
          </svg>
        </label>

        <input
          id="pet-photo-upload"
          className={css.visuallyHidden}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
          onChange={(event) => void handlePhotoChange(event)}
          disabled={isUploadingPhoto || isSubmitting}
          aria-label="Upload pet photo"
        />

        <input type="hidden" {...register("imgURL")} />
      </div>

      {isUploadingPhoto && (
        <p className={css.error} role="status">
          Uploading photo...
        </p>
      )}

      {errors.imgURL && !isUploadingPhoto && (
        <p className={css.error} role="alert">
          {errors.imgURL.message}
        </p>
      )}

      <input
        className={css.input}
        type="text"
        placeholder="Title"
        aria-label="Pet title"
        aria-invalid={!!errors.title}
        {...register("title")}
      />

      {errors.title && (
        <p className={css.error} role="alert">
          {errors.title.message}
        </p>
      )}

      <input
        className={css.input}
        type="text"
        placeholder="Pet's Name"
        aria-label="Pet name"
        aria-invalid={!!errors.name}
        {...register("name")}
      />

      {errors.name && (
        <p className={css.error} role="alert">
          {errors.name.message}
        </p>
      )}

      <div className={css.fieldsRow}>
        <div className={css.dateWrapper}>
          <input
            className={`${css.input} ${css.dateInput}`}
            type="date"
            aria-label="Birthday"
            aria-invalid={!!errors.birthday}
            max={new Date().toISOString().slice(0, 10)}
            {...register("birthday")}
          />

          <svg className={css.calendarIcon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-calendar" />
          </svg>
        </div>

        <div className={css.selectWrapper}>
          <select
            className={`${css.input} ${css.petSelect}`}
            aria-label="Type of pet"
            aria-invalid={!!errors.species}
            {...register("species")}
            onFocus={() => setIsSpeciesOpen(true)}
            onBlur={() => setIsSpeciesOpen(false)}
          >
            <option value="">Type of pet</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="monkey">Monkey</option>
            <option value="bird">Bird</option>
            <option value="fish">Fish</option>
            <option value="turtle">Turtle</option>
          </select>

          <svg className={css.selectIcon} aria-hidden="true">
            <use
              href={
                isSpeciesOpen
                  ? "/icons/sprite.svg#icon-chevron-up"
                  : "/icons/sprite.svg#icon-chevron-down"
              }
            />
          </svg>
        </div>
      </div>

      {errors.birthday && (
        <p className={css.error} role="alert">
          {errors.birthday.message}
        </p>
      )}

      {errors.species && (
        <p className={css.error} role="alert">
          {errors.species.message}
        </p>
      )}

      <div className={css.actions}>
        <button
          className={css.back}
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isUploadingPhoto}
        >
          Back
        </button>

        <button
          className={css.submit}
          type="submit"
          disabled={isSubmitting || isUploadingPhoto}
        >
          {isSubmitting ? "SAVING..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
