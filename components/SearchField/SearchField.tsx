"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import css from "./SearchField.module.css";

type SearchFieldProps = {
  initialValue?: string;
  basePath: string;
};

export default function SearchField({
  initialValue = "",
  basePath,
}: SearchFieldProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const keyword = value.trim();

    if (keyword) params.set("keyword", keyword);
    params.set("page", "1");

    router.push(`${basePath}?${params.toString()}`);
  };

  const handleClear = () => {
    setValue("");
    router.push(`${basePath}?page=1`);
  };

  return (
    <form className={css.form} onSubmit={handleSearch} role="search">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search"
        aria-label="Search"
        className={css.input}
      />

      <div className={css.actions}>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={css.button}
            aria-label="Clear search"
          >
            <svg className={css.icon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-button-close" />
            </svg>
          </button>
        )}

        <button type="submit" className={css.button} aria-label="Search">
          <svg className={css.icon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-search" />
          </svg>
        </button>
      </div>
    </form>
  );
}
