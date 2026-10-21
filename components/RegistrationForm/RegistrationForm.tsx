"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import css from "./RegistrationForm.module.css";

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const schema = yup.object({
  name: yup.string().trim().required("Name is required"),

  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Enter a valid Email"),

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

type RegistrationFormProps = {
  onSubmit: (data: RegistrationValues) => Promise<void>;
};

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });
  const name = useWatch({ control, name: "name" });
  const email = useWatch({ control, name: "email" });

  const isNameValid =
    Boolean(touchedFields.name) && Boolean(name?.trim()) && !errors.name;

  const isEmailValid =
    Boolean(touchedFields.email) &&
    emailRegex.test(email ?? "") &&
    !errors.email;

  const isPasswordValid =
    Boolean(touchedFields.password) &&
    typeof password === "string" &&
    password.length >= 7 &&
    !errors.password;

  const isConfirmPasswordValid =
    Boolean(touchedFields.confirmPassword) &&
    Boolean(confirmPassword) &&
    confirmPassword === password &&
    !errors.confirmPassword;

  const handleRegister = async (data: RegistrationValues) => {
    setServerError("");

    try {
      await onSubmit(data);
    } catch {
      setServerError("Registration failed. Please try again.");
    }
  };

  return (
    <form
      className={css.form}
      onSubmit={handleSubmit(handleRegister)}
      noValidate
    >
      {/* Name */}
      <div className={css.field}>
        <div className={css.inputWrapper}>
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            aria-label="Name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            className={`${css.input} ${isNameValid ? css.valid : ""}`}
          />

          {errors.name && (
            <svg className={css.fieldIcon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-button-close" />
            </svg>
          )}

          {isNameValid && (
            <svg
              className={`${css.fieldIcon} ${css.successIcon}`}
              aria-hidden="true"
            >
              <use href="/icons/sprite.svg#icon-check" />
            </svg>
          )}
        </div>

        {errors.name && (
          <p id="register-name-error" className={css.error} role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className={css.field}>
        <div className={css.inputWrapper}>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            className={`${css.input} ${isEmailValid ? css.valid : ""}`}
          />

          {errors.email && (
            <svg className={css.fieldIcon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-button-close" />
            </svg>
          )}

          {isEmailValid && (
            <svg
              className={`${css.fieldIcon} ${css.successIcon}`}
              aria-hidden="true"
            >
              <use href="/icons/sprite.svg#icon-check" />
            </svg>
          )}
        </div>

        {errors.email && (
          <p id="register-email-error" className={css.error} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className={css.field}>
        <div className={css.inputWrapper}>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            aria-label="Password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password
                ? "register-password-error"
                : isPasswordValid
                  ? "register-password-success"
                  : undefined
            }
            className={`${css.input} ${isPasswordValid ? css.valid : ""}`}
          />

          <div className={css.inputActions}>
            {errors.password && (
              <svg className={css.errorIcon} aria-hidden="true">
                <use href="/icons/sprite.svg#icon-button-close" />
              </svg>
            )}

            {isPasswordValid && (
              <svg className={css.successIcon} aria-hidden="true">
                <use href="/icons/sprite.svg#icon-check" />
              </svg>
            )}

            <button
              type="button"
              className={css.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
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
          </div>
        </div>

        {errors.password && (
          <p id="register-password-error" className={css.error} role="alert">
            {errors.password.message}
          </p>
        )}

        {isPasswordValid && (
          <p id="register-password-success" className={css.success}>
            Password is secure
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className={css.field}>
        <div className={css.inputWrapper}>
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            aria-label="Confirm password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "register-confirm-error" : undefined
            }
            className={`${css.input} ${
              isConfirmPasswordValid ? css.valid : ""
            }`}
          />

          <div className={css.inputActions}>
            {errors.confirmPassword && (
              <svg className={css.errorIcon} aria-hidden="true">
                <use href="/icons/sprite.svg#icon-button-close" />
              </svg>
            )}

            {isConfirmPasswordValid && (
              <svg className={css.successIcon} aria-hidden="true">
                <use href="/icons/sprite.svg#icon-check" />
              </svg>
            )}

            <button
              type="button"
              className={css.eyeButton}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
            >
              <svg className={css.eyeIcon} aria-hidden="true">
                <use
                  href={
                    showConfirmPassword
                      ? "/icons/sprite.svg#icon-eye"
                      : "/icons/sprite.svg#icon-eye-off"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {errors.confirmPassword && (
          <p id="register-confirm-error" className={css.error} role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Server notification */}
      {serverError && (
        <div className={css.notification} role="alert">
          <span>{serverError}</span>
          <button
            type="button"
            onClick={() => setServerError("")}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

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
