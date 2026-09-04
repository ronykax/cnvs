import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";

const font = Varela_Round({ weight: "400" });

export const metadata: Metadata = {
  description: "an infinite canvas for your thoughts, ideas, and messy notes.",
  title: "cnvs — infinite canvas",
};

export default function ({ children }: LayoutProps<"/">) {
  return (
    <html className="antialiased" lang="en" suppressHydrationWarning>
      <body className={font.className}>{children}</body>
    </html>
  );
}
