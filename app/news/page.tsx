import Title from "@/components/Title/Title";
import SearchField from "@/components/SearchField/SearchField";
import NewsList from "@/components/NewsList/NewsList";
import Pagination from "@/components/Pagination/Pagination";
import type { NewsResponse } from "@/types/news";
import css from "./page.module.css";

type Props = {
  searchParams: Promise<{
    keyword?: string;
    page?: string;
  }>;
};

async function getNews(keyword: string, page: number): Promise<NewsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: "6",
  });

  if (keyword) params.set("keyword", keyword);

  const response = await fetch(
    `https://petlove.b.goit.study/api/news?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return (await response.json()) as NewsResponse;
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;

  const keyword = params.keyword?.trim() ?? "";
  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  let data: NewsResponse | null = null;
  let error = false;

  try {
    data = await getNews(keyword, page);
  } catch {
    error = true;
  }

  return (
    <main className={css.page}>
      <div className={css.heading}>
        <Title>News</Title>

        <SearchField key={keyword} initialValue={keyword} basePath="/news" />
      </div>

      {error ? (
        <p role="alert">Failed to load news. Please try again.</p>
      ) : data ? (
        <>
          <NewsList news={data.results} />

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            basePath="/news"
            query={keyword}
          />
        </>
      ) : null}
    </main>
  );
}
