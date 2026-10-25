import Title from "@/components/Title/Title";
import NoticesFilters from "@/components/NoticesFilters/NoticesFilters";
import NoticesList from "@/components/NoticesList/NoticesList";
import Pagination from "@/components/Pagination/Pagination";

import type { NoticesResponse } from "@/types/notice";
import css from "./page.module.css";

type QueryParams = {
  keyword?: string;
  category?: string;
  species?: string;
  sex?: string;
  locationId?: string;
  sort?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<QueryParams>;
};

async function getNotices(
  filters: QueryParams,
  page: number,
): Promise<NoticesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: "6",
  });

  const filterKeys = [
    "keyword",
    "category",
    "species",
    "sex",
    "locationId",
  ] as const;

  filterKeys.forEach((key) => {
    const value = filters[key];

    if (value) {
      params.set(key, value);
    }
  });

  // Предварительная схема сортировки.
  // Уточнить направление true/false по результатам API.
  if (filters.sort === "popular") {
    params.set("byPopularity", "true");
  }

  if (filters.sort === "unpopular") {
    params.set("byPopularity", "false");
  }

  if (filters.sort === "cheap") {
    params.set("byPrice", "false");
  }

  if (filters.sort === "expensive") {
    params.set("byPrice", "true");
  }

  const baseUrl = process.env.PETLOVE_API_URL;

  if (!baseUrl) {
    throw new Error("PETLOVE_API_URL is not configured");
  }

  const response = await fetch(`${baseUrl}/notices?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notices");
  }

  return (await response.json()) as NoticesResponse;
}

export default async function NoticesPage({ searchParams }: Props) {
  const filters = await searchParams;
  const requestedPage = Number(filters.page ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  let data: NoticesResponse | null = null;
  let error = false;

  try {
    data = await getNotices(filters, page);
  } catch {
    error = true;
  }

  return (
    <main className={css.page}>
      <Title>Find your favorite pet</Title>

      <NoticesFilters />

      {error ? (
        <p role="alert">Failed to load notices. Please try again.</p>
      ) : data ? (
        <>
          <NoticesList notices={data.results} />

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            basePath="/notices"
            queryParams={{
              keyword: filters.keyword,
              category: filters.category,
              species: filters.species,
              sex: filters.sex,
              locationId: filters.locationId,
              sort: filters.sort,
            }}
          />
        </>
      ) : null}
    </main>
  );
}
