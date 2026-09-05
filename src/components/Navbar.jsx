import { useState } from "react";

const LINKS = [
  { href: "#about", label: "about" },
  { href: "#chat", label: "chat" },
  { href: "#projects", label: "projects" },
  { href: "#skills", label: "skills" },
];

export default function Navbar({ name = "Yash Raj" }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand / Logo */}
        <a href="#top" className="font-display text-sm font-semibold tracking-tight text-white transition-colors hover:text-[#60a5fa]">
          <span className="text-[#fb923c]">&gt;</span> {name}
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-gray-400 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Download Resume CTA */}
        <div className="hidden md:block">
          <a
            href="/resume.pdf"
            download=" Resume.pdf"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.03] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-white transition-all duration-300 hover:border-[#fb923c] hover:bg-[#fb923c] hover:text-black active:scale-95 shadow-md hover:shadow-orange-500/20"
          >
            <span>Resume</span>
            <span className="text-xs">↓</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="text-white md:hidden p-1"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-5 md:hidden backdrop-blur-lg">
          <ul className="flex flex-col gap-2 font-mono text-sm uppercase tracking-widest text-gray-400">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-white/10">
            <a
              href="/resume.pdf"
              download="Yash_Raj_Resume.pdf"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#fb923c] bg-[#fb923c]/10 py-2.5 font-mono text-xs uppercase tracking-widest text-[#fb923c] transition-all hover:bg-[#fb923c] hover:text-black"
            >
              <span>Download Resume</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
