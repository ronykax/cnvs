import type { Metadata } from "next";
import { Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

const font = Nanum_Pen_Script({ weight: "400" });

export const metadata: Metadata = {
  description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  title: "corky — digital corkboard",
};

export default function ({ children }: LayoutProps<"/">) {
  return (
    <html className="antialiased" lang="en" suppressHydrationWarning>
      <body className={font.className}>{children}</body>
    </html>
  );
}
