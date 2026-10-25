import Image from "next/image";
import type { News } from "@/types/news";
import css from "./NewsItem.module.css";

type Props = {
  news: News;
};

export default function NewsItem({ news }: Props) {
  const date = new Date(news.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <li className={css.item}>
      <div className={css.imageWrapper}>
        <Image
          src={news.imgUrl}
          alt={news.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className={css.image}
          unoptimized
        />
      </div>

      <h2 className={css.title}>{news.title}</h2>

      <p className={css.description}>{news.text}</p>

      <div className={css.footer}>
        <time dateTime={news.date}>{date}</time>

        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className={css.link}
        >
          Read more
        </a>
      </div>
    </li>
  );
}
