import NewsItem from "@/components/NewsItem/NewsItem";
import type { News } from "@/types/news";

import css from "./NewsList.module.css";

type Props = {
  news: News[];
};

export default function NewsList({ news }: Props) {
  if (news.length === 0) {
    return <p>No news found.</p>;
  }

  return (
    <ul className={css.list}>
      {news.map((item) => (
        <NewsItem key={item._id} news={item} />
      ))}
    </ul>
  );
}
