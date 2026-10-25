import type { ReactNode } from "react";
import css from "./Title.module.css";

type TitleProps = {
  children: ReactNode;
  className?: string;
};

export default function Title({ children, className = "" }: TitleProps) {
  return <h1 className={`${css.title} ${className}`}>{children}</h1>;
}
