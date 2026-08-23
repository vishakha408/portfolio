export default function Footer({
  name = "Vishakha Damani",
  links = [
    { label: "GitHub", href: "https://github.com/vishakha408" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vishakhadamani" },
    { label: "Email", href: "mailto:vishakhadamani408@gmail.com" },
  ],
}) {
  return (
    <footer className="border-t border-base-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-display text-xs text-ink-dim">
          © {new Date().getFullYear()} {name} · built with a RAG pipeline of its own
        </p>
        <div className="flex gap-6 font-display text-xs uppercase tracking-widest text-ink-muted">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-spark-amber">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
