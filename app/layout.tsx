import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Petlove",
  description: "Petlove application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#262626",
              borderRadius: "16px",
              padding: "14px 18px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#F6B83D",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
            },
          }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
