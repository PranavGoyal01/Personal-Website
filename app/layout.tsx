import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Pranav Goyal — Engineer, Researcher, Builder",
  description:
    "Explore Pranav Goyal’s work in software engineering, AI research, quantitative finance, and leadership. Computer Science at Stevens, class of 2028.",
  openGraph: {
    title: "Pranav Goyal",
    description: "Software engineering · AI research · Quantitative finance",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
