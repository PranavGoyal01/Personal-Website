"use client";
interface Props {
  onIndexClick: () => void;
  indexOpen: boolean;
}
export default function Nav({ onIndexClick, indexOpen }: Props) {
  return (
    <header className="site-header">
      <a href="/" className="brand">
        <span className="monogram">PG</span>
        <span>Pranav Goyal</span>
      </a>
      <nav aria-label="Main navigation">
        <button
          onClick={onIndexClick}
          aria-expanded={indexOpen}
          aria-controls="portfolio-index"
        >
          {indexOpen ? "Close index" : "Explore index"}
        </button>
        <a href="mailto:pgoyal1@stevens.edu">Say hello →</a>
      </nav>
    </header>
  );
}
