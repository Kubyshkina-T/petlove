"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import css from "./LoginForm.module.css";

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email address"),
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
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

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
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={css.input}
        />

        {errors.email && <p className={css.error}>{errors.email.message}</p>}
      </div>

      <div className={css.field}>
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className={css.input}
        />

        <button
          type="button"
          className={css.eyeButton}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
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

        {errors.password && (
          <p className={css.error}>{errors.password.message}</p>
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
