"use client";
import Link from "next/link";
interface Props {
  onIndexClick: () => void;
  indexOpen: boolean;
  onAboutClick: () => void;
}
export default function Nav({ onIndexClick, indexOpen, onAboutClick }: Props) {
  return (
    <header className="site-header">
      <button className="brand" onClick={onAboutClick}>
        Pranav Goyal
      </button>
      <nav aria-label="Main navigation">
        <button
          onClick={onIndexClick}
          aria-expanded={indexOpen}
          aria-controls="portfolio-index"
        >
          {indexOpen ? "Close index" : "Index"}
        </button>
        <Link href="/edit">Update profile</Link>
        <a href="mailto:pgoyal1@stevens.edu">Contact</a>
      </nav>
    </header>
  );
}
