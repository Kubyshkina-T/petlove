import Link from "next/link";
import css from "./Pagination.module.css";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: string;
  queryParams?: Record<string, string | undefined>;
};
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  query = "",
  queryParams = {},
}: Props) {
  if (totalPages <= 1) return null;

  const createHref = (page: number) => {
    const params = new URLSearchParams();

    if (query) params.set("keyword", query);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set("page", String(page));

    return `${basePath}?${params.toString()}`;
  };
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + 2);
  const firstVisible = Math.max(1, end - 2);

  const pages = Array.from(
    { length: end - firstVisible + 1 },
    (_, index) => firstVisible + index,
  );

  const firstPage = currentPage === 1;
  const lastPage = currentPage === totalPages;

  return (
    <nav className={css.pagination} aria-label="Pagination">
      <div className={css.group}>
        <Link
          href={createHref(1)}
          className={`${css.arrow} ${firstPage ? css.disabled : ""}`}
          aria-label="First page"
          aria-disabled={firstPage}
          tabIndex={firstPage ? -1 : undefined}
        >
          {"<<"}
        </Link>

        <Link
          href={createHref(Math.max(1, currentPage - 1))}
          className={`${css.arrow} ${firstPage ? css.disabled : ""}`}
          aria-label="Previous page"
          aria-disabled={firstPage}
          tabIndex={firstPage ? -1 : undefined}
        >
          {"<"}
        </Link>
      </div>

      <div className={css.group}>
        {firstVisible > 1 && <span className={css.ellipsis}>...</span>}

        {pages.map((page) => (
          <Link
            key={page}
            href={createHref(page)}
            className={`${css.page} ${currentPage === page ? css.active : ""}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Link>
        ))}

        {end < totalPages && <span className={css.ellipsis}>...</span>}
      </div>

      <div className={css.group}>
        <Link
          href={createHref(Math.min(totalPages, currentPage + 1))}
          className={`${css.arrow} ${lastPage ? css.disabled : ""}`}
          aria-label="Next page"
          aria-disabled={lastPage}
          tabIndex={lastPage ? -1 : undefined}
        >
          {">"}
        </Link>

        <Link
          href={createHref(totalPages)}
          className={`${css.arrow} ${lastPage ? css.disabled : ""}`}
          aria-label="Last page"
          aria-disabled={lastPage}
          tabIndex={lastPage ? -1 : undefined}
        >
          {">>"}
        </Link>
      </div>
    </nav>
  );
}
