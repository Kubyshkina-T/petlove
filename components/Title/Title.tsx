// import css from "@/components/Title/Title.module.css";

// export default function Title({ children, className }: { children?: React.ReactNode; className?: string }) {
//   if (children) return <h1 className={className}>{children}</h1>;
//   return (
//     <div className={css.wrapper}>
//       <div className={css.titleWrapper}>
//         <h1 className={css.title}>
//           Take good <span className={css.titleAccent}>care</span> of your small
//           pets
//         </h1>
//         <div className={css.descriptionWrapper}>
//           <p className={css.titleDescription}>
//             Choosing a pet for your home is a choice that is meant to enrich
//             your life with immeasurable joy and tenderness.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import type { ReactNode } from "react";
import css from "./Title.module.css";

type TitleProps = {
  children: ReactNode;
  className?: string;
};

export default function Title({ children, className = "" }: TitleProps) {
  return <h1 className={`${css.title} ${className}`}>{children}</h1>;
}
