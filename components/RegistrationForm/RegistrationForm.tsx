"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from "./RegistrationForm.module.css";

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(7, "Password must contain at least 7 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export type RegistrationValues = yup.InferType<typeof schema>;

type Props = {
  onSubmit: (data: RegistrationValues) => Promise<void>;
};

export default function RegistrationForm({ onSubmit }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.field}>
        <input
          {...register("name")}
          type="text"
          placeholder="Name"
          autoComplete="name"
          aria-label="Name"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className={css.error}>{errors.name.message}</p>}
      </div>

      <div className={css.field}>
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          autoComplete="email"
          aria-label="Email"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className={css.error}>{errors.email.message}</p>}
      </div>

      <div className={css.field}>
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          aria-label="Password"
          aria-invalid={!!errors.password}
        />

        <button
          type="button"
          className={css.eyeButton}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <svg className={css.eyeIcon} aria-hidden="true">
            <use
              href={`/icons/sprite.svg#icon-${showPassword ? "eye" : "eye-off"}`}
            />
          </svg>
        </button>

        {errors.password && (
          <p className={css.error}>{errors.password.message}</p>
        )}
      </div>

      <div className={css.field}>
        <input
          {...register("confirmPassword")}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          autoComplete="new-password"
          aria-label="Confirm password"
          aria-invalid={!!errors.confirmPassword}
        />

        <button
          type="button"
          className={css.eyeButton}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
        >
          <svg className={css.eyeIcon} aria-hidden="true">
            <use
              href={
                showPassword
                  ? "/icons/sprite.svg#icon-eye"
                  : "/icons/sprite.svg#icon-eye-off"
              }
            />
          </svg>
        </button>

        {errors.confirmPassword && (
          <p className={css.error}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={css.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "LOADING..." : "REGISTRATION"}
      </button>
    </form>
  );
}
