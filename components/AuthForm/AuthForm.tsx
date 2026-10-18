"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from "./AuthForm.module.css";

const email = yup.string().required("Email is required").matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Enter a valid Email");
const password = yup.string().required("Password is required").min(7, "Password must contain at least 7 characters");
const schema = yup.object({
  name: yup.string().defined().when("$registration", { is: true, then: value => value.trim().required("Name is required") }),
  email,
  password,
  confirmPassword: yup.string().defined().when("$registration", { is: true, then: value => value.required("Confirm your password").oneOf([yup.ref("password")], "Passwords must match") }),
});
type Values = yup.InferType<typeof schema>;

export default function AuthForm({ registration = false }: { registration?: boolean }) {
  const router = useRouter();
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState("");
  const inFlight = useRef(false);
  const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields } } = useForm<Values>({
    resolver: yupResolver(schema), context: { registration }, mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(""), 7000);
    return () => window.clearTimeout(timeout);
  }, [notification]);
  async function submit(values: Values) {
    if (inFlight.current) return;
    inFlight.current = true;
    setNotification("");
    try {
      const response = await fetch("https://petlove.b.goit.study/api/users/" + (registration ? "signup" : "signin"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(registration ? { name: values.name } : {}), email: values.email, password: values.password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || (response.status === 409 ? "This email is already registered" : response.status === 401 ? "Email or password is incorrect" : "Unable to sign in. Please try again."));
      if (typeof data?.token !== "string" || !data.token) throw new Error("The server did not return an authorization token");
      const { token, ...user } = data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("auth-change"));
      router.replace("/profile");
    } catch (error) {
      setNotification(error instanceof Error ? error.message : "Connection error. Please try again.");
    } finally { inFlight.current = false; }
  }
  const fields: { name: keyof Values; label: string; autoComplete: string }[] = [
    ...(registration ? [{ name: "name" as const, label: "Name", autoComplete: "name" }] : []),
    { name: "email", label: "Email", autoComplete: "email" },
    { name: "password", label: "Password", autoComplete: registration ? "new-password" : "current-password" },
    ...(registration ? [{ name: "confirmPassword" as const, label: "Confirm password", autoComplete: "new-password" }] : []),
  ];
  return <>
    {notification && <div className={css.notification} role="alert"><span>{notification}</span><button type="button" onClick={() => setNotification("")} aria-label="Dismiss notification">×</button></div>}
    <form noValidate onSubmit={handleSubmit(submit)} aria-busy={isSubmitting} className={`${css.form} ${registration ? css.registration : ""}`}>
      <div className={css.fields}>{fields.map(({ name, label, autoComplete }) => {
        const secret = name === "password" || name === "confirmPassword";
        const error = errors[name]?.message;
        const valid = touchedFields[name] && !error;
        const id = `${registration ? "register" : "login"}-${name}`;
        return <div key={name} className={css.field}>
          <label className={css.srOnly} htmlFor={id}>{label}</label>
          <div className={css.control}>
            <input {...register(name)} id={id} placeholder={label} type={secret && !visible[name] ? "password" : name === "email" ? "email" : "text"} autoComplete={autoComplete} autoCapitalize={name === "name" ? "words" : "none"} spellCheck={false} aria-invalid={!!error} aria-describedby={error || (valid && name === "password") ? `${id}-message` : undefined} className={`${css.input} ${error ? css.invalid : valid ? css.valid : ""}`} disabled={isSubmitting} />
            {secret && <button className={css.eye} type="button" onClick={() => setVisible(value => ({ ...value, [name]: !value[name] }))} aria-label={`${visible[name] ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={!!visible[name]}><svg aria-hidden="true"><use href={`/icons/sprite.svg#icon-eye${visible[name] ? "" : "-off"}`} /></svg></button>}
            {valid && <svg className={`${css.check} ${secret ? css.secretCheck : ""}`} aria-hidden="true"><use href="/icons/sprite.svg#icon-check" /></svg>}
          </div>
          {error ? <p className={css.error} id={`${id}-message`}>{error}</p> : valid && name === "password" ? <p className={css.success} id={`${id}-message`}>Password is secure</p> : null}
        </div>;
      })}</div>
      <button className={css.submit} type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait…" : registration ? "Registration" : "Log In"}</button>
      <p className={css.switch}>{registration ? "Already have an account?" : "Don’t have an account?"} <Link href={registration ? "/login" : "/register"}>{registration ? "Login" : "Register"}</Link></p>
    </form>
  </>;
}
