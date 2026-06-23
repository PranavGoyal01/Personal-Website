import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pranav Goyal",
  description:
    "CS @ Stevens Institute of Technology. Incoming Quant Analyst at SSMIF. Builder of AI-enabled products. Minors in Quantitative Finance and Cybersecurity.",
  keywords: ["Pranav Goyal", "Stevens", "Computer Science", "Quantitative Finance", "AI", "Software Engineer"],
  authors: [{ name: "Pranav Goyal" }],
  openGraph: {
    title: "Pranav Goyal",
    description: "CS @ Stevens · Incoming Quant Analyst · Builder",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
