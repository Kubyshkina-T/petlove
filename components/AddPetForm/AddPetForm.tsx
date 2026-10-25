"use client";

import { useState } from "react";
import css from "./AddPetForm.module.css";

export type AddPetValues = {
  name: string;
  title: string;
  imgURL: string;
  species: string;
  birthday: string;
  sex: string;
};

type Props = {
  onSubmit: (data: AddPetValues) => Promise<void>;
  onCancel: () => void;
};

const initialValues: AddPetValues = {
  name: "",
  title: "",
  imgURL: "",
  species: "",
  birthday: "",
  sex: "",
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
  const [form, setForm] = useState<AddPetValues>(initialValues);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);

  const updateField = (field: keyof AddPetValues, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const values = {
      name: form.name.trim(),
      title: form.title.trim(),
      imgURL: form.imgURL.trim(),
      species: form.species,
      birthday: form.birthday,
      sex: form.sex,
    };

    if (Object.values(values).some((value) => !value)) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^https:\/\/\S+\.(png|jpe?g|gif|bmp|webp)$/i.test(values.imgURL)) {
      setError(
        "Photo URL must end with .png, .jpg, .jpeg, .gif, .bmp or .webp.",
      );
      return;
    }

    const birthdayDate = new Date(`${values.birthday}T00:00:00Z`);

    if (
      Number.isNaN(birthdayDate.getTime()) ||
      birthdayDate.toISOString().slice(0, 10) !== values.birthday ||
      birthdayDate.getTime() > Date.now()
    ) {
      setError("Enter a valid birthday.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not add pet. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <fieldset className={css.sexGroup}>
        <legend className={css.visuallyHidden}>Pet gender</legend>

        {sexOptions.map((option) => (
          <label
            key={option.value}
            className={`${css.sexOption} ${
              form.sex === option.value ? css.sexActive : ""
            }`}
            title={option.label}
          >
            <input
              type="radio"
              name="sex"
              value={option.value}
              checked={form.sex === option.value}
              onChange={() => updateField("sex", option.value)}
            />

            <svg className={css.sexIcon} aria-hidden="true">
              <use href={`/icons/sprite.svg#${option.icon}`} />
            </svg>

            <span className={css.visuallyHidden}>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <div className={css.avatar}>
        {form.imgURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.imgURL}
            alt="Pet preview"
            className={css.avatarImage}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
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
          type="url"
          placeholder="Enter URL"
          aria-label="Pet photo URL"
          value={form.imgURL}
          onChange={(event) => updateField("imgURL", event.target.value)}
        />

        <span
          className={css.uploadHint}
          title="Photo uploading is not connected yet"
        >
          Upload photo
          <svg aria-hidden="true">
            <use href="/icons/sprite.svg#icon-upload-cloud" />
          </svg>
        </span>
      </div>

      <input
        className={css.input}
        type="text"
        placeholder="Title"
        aria-label="Pet title"
        value={form.title}
        onChange={(event) => updateField("title", event.target.value)}
      />

      <input
        className={css.input}
        type="text"
        placeholder="Pet's Name"
        aria-label="Pet name"
        value={form.name}
        onChange={(event) => updateField("name", event.target.value)}
      />

      <div className={css.fieldsRow}>
        <div className={css.dateWrapper}>
          <input
            className={`${css.input} ${css.dateInput}`}
            type="date"
            aria-label="Birthday"
            value={form.birthday}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => updateField("birthday", event.target.value)}
          />

          <svg className={css.calendarIcon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-calendar" />
          </svg>
        </div>

        <div className={css.selectWrapper}>
          <select
            className={`${css.input} ${css.petSelect}`}
            aria-label="Type of pet"
            value={form.species}
            onFocus={() => setIsSpeciesOpen(true)}
            onBlur={() => setIsSpeciesOpen(false)}
            onChange={(event) => {
              updateField("species", event.target.value);
              setIsSpeciesOpen(false);
            }}
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

      {error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}

      <div className={css.actions}>
        <button
          className={css.back}
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Back
        </button>

        <button className={css.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "SAVING..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
