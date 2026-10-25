"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import css from "./LoginForm.module.css";

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Enter a valid Email"),
  password: yup
    .string()
    .required("Password is required")
    .min(7, "Password must contain at least 7 characters"),
});

export type LoginValues = yup.InferType<typeof schema>;

type LoginFormProps = {
  onSubmit: (data: LoginValues) => Promise<void>;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const password = useWatch({
    control,
    name: "password",
  });

  const isPasswordValid =
    Boolean(touchedFields.password) &&
    !errors.password &&
    typeof password === "string" &&
    password.length >= 7;

  const handleLogin = async (data: LoginValues) => {
    setServerError("");

    try {
      await onSubmit(data);
    } catch {
      setServerError("Login failed. Please try again.");
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(handleLogin)} noValidate>
      <div className={css.field}>
        <div className={css.inputWrapper}>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={css.input}
          />

          {errors.email && (
            <svg className={css.errorIcon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-button-close" />
            </svg>
          )}
        </div>

        {errors.email && (
          <p id="login-email-error" className={css.error} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className={css.field}>
        <div className={css.inputWrapper}>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password
                ? "login-password-error"
                : isPasswordValid
                  ? "login-password-success"
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
          <p id="login-password-error" className={css.error} role="alert">
            {errors.password.message}
          </p>
        )}

        {isPasswordValid && (
          <p id="login-password-success" className={css.success}>
            Password is secure
          </p>
        )}
      </div>
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
        {isSubmitting ? "LOADING..." : "LOG IN"}
      </button>
    </form>
  );
}
