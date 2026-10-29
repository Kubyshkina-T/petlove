"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AsyncSelect from "react-select/async";
import type { SingleValue } from "react-select";

import css from "./NoticesFilters.module.css";

const API = "https://petlove.b.goit.study/api";

type Option = {
  value: string;
  label: string;
};

type City = {
  _id: string;
  cityEn: string;
  stateEn?: string;
};

type SortType = "popular" | "unpopular" | "cheap" | "expensive";

const sortOptions: { value: SortType; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "unpopular", label: "Unpopular" },
  { value: "cheap", label: "Cheap" },
  { value: "expensive", label: "Expensive" },
];

async function getOptions(endpoint: string): Promise<Option[]> {
  const response = await fetch(`${API}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Failed to load ${endpoint}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) return [];

  return data.flatMap((item): Option[] => {
    if (typeof item === "string") {
      return [{ value: item, label: item }];
    }

    if (
      item &&
      typeof item === "object" &&
      "value" in item &&
      typeof item.value === "string"
    ) {
      return [
        {
          value: item.value,
          label: item.value,
        },
      ];
    }

    return [];
  });
}

export default function NoticesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState<Option[]>([]);
  const [sexOptions, setSexOptions] = useState<Option[]>([]);
  const [speciesOptions, setSpeciesOptions] = useState<Option[]>([]);
  const [selectedCity, setSelectedCity] = useState<Option | null>(null);
  const [error, setError] = useState("");

  const currentParams = searchParams.toString();

  const category = searchParams.get("category") ?? "";
  const sex = searchParams.get("sex") ?? "";
  const species = searchParams.get("species") ?? "";
  const locationId = searchParams.get("locationId") ?? "";
  const sort = searchParams.get("sort") as SortType | null;

  useEffect(() => {
    setKeyword(searchParams.get("keyword") ?? "");
  }, [currentParams, searchParams]);

  useEffect(() => {
    let active = true;

    async function loadFilters() {
      try {
        const [categoriesData, sexData, speciesData] = await Promise.all([
          getOptions("/notices/categories"),
          getOptions("/notices/sex"),
          getOptions("/notices/species"),
        ]);

        if (!active) return;

        setCategories(categoriesData);
        setSexOptions(sexData);
        setSpeciesOptions(speciesData);
      } catch {
        if (active) setError("Failed to load filters.");
      }
    }

    void loadFilters();

    return () => {
      active = false;
    };
  }, []);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(currentParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");

    router.push(`/notices?${params.toString()}`);
  };

  const loadCities = async (input: string): Promise<Option[]> => {
    const keyword = input.trim();

    if (keyword.length < 3) return [];

    try {
      const params = new URLSearchParams({ keyword });

      const response = await fetch(`${API}/cities/?${params.toString()}`);

      if (!response.ok) return [];

      const cities: City[] = await response.json();

      return cities.map((city) => ({
        value: city._id,
        label: city.stateEn ? `${city.cityEn}, ${city.stateEn}` : city.cityEn,
      }));
    } catch {
      return [];
    }
  };

  const handleCityChange = (option: SingleValue<Option>) => {
    setSelectedCity(option);
    updateFilters({ locationId: option?.value ?? "" });
  };

  const handleSortChange = (value: SortType) => {
    const nextValue = sort === value ? "" : value;
    updateFilters({ sort: nextValue });
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedCity(null);
    router.push("/notices?page=1");
  };

  return (
    <section className={css.filters} aria-label="Filter notices">
      <form
        className={css.fields}
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          updateFilters({ keyword: keyword.trim() });
        }}
      >
        <div className={css.searchWrapper}>
          <input
            className={css.control}
            type="text"
            placeholder="Search"
            aria-label="Search pets"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          {keyword && (
            <button
              type="button"
              className={css.clearButton}
              onClick={() => {
                setKeyword("");
                updateFilters({ keyword: "" });
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button
            className={css.searchButton}
            type="submit"
            aria-label="Search"
          >
            <svg className={css.icon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-search" />
            </svg>
          </button>
        </div>

        <select
          className={css.control}
          aria-label="Category"
          value={category}
          onChange={(event) => updateFilters({ category: event.target.value })}
        >
          <option value="">Category</option>
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={css.control}
          aria-label="Gender"
          value={sex}
          onChange={(event) => updateFilters({ sex: event.target.value })}
        >
          <option value="">By gender</option>
          {sexOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={css.control}
          aria-label="Species"
          value={species}
          onChange={(event) => updateFilters({ species: event.target.value })}
        >
          <option value="">By type</option>
          {speciesOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <AsyncSelect<Option, false>
          instanceId="pet-location"
          className={css.location}
          classNamePrefix="location"
          placeholder="Location"
          isClearable
          cacheOptions
          defaultOptions={false}
          loadOptions={loadCities}
          value={
            selectedCity?.value === locationId
              ? selectedCity
              : locationId
                ? { value: locationId, label: locationId }
                : null
          }
          onChange={handleCityChange}
          noOptionsMessage={({ inputValue }) =>
            inputValue.length < 3
              ? "Enter at least 3 characters"
              : "No cities found"
          }
        />
      </form>

      <div className={css.bottom}>
        <div className={css.sorting}>
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className={`${css.sortOption} ${
                sort === option.value ? css.active : ""
              }`}
            >
              <input
                type="checkbox"
                checked={sort === option.value}
                onChange={() => handleSortChange(option.value)}
                className={css.visuallyHidden}
              />
              {option.label}
            </label>
          ))}
        </div>

        <button type="button" className={css.reset} onClick={handleReset}>
          Reset
        </button>
      </div>

      {error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
