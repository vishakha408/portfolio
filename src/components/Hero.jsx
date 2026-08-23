import { useEffect, useState } from "react";
import EmbeddingField from "./EmbeddingField.jsx";

const SPECIALTIES = [
  "backend software.",
  "scalable backend APIs.",
  "intelligent AI systems.",
  "algorithmic solutions.",
];

export default function Hero({
  name = "Vishakha Damani",
  role = "SOFTWARE DEVELOPER & AI/ML ENGINEER",
}) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick write-then-erase typing loop
  useEffect(() => {
    const currentSpecialty = SPECIALTIES[textIndex];

    // Quick typing (32ms) and snappy erasing (18ms)
    const speed = isDeleting ? 18 : 32;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setDisplayedText(currentSpecialty.slice(0, displayedText.length + 1));
        if (displayedText === currentSpecialty) {
          // Pause briefly when full word is typed before erasing
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        // Erasing backward
        setDisplayedText(currentSpecialty.slice(0, displayedText.length - 1));
        if (displayedText === "") {
          // Move to next word immediately once erased
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % SPECIALTIES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex]);

  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full select-none items-center justify-between overflow-hidden bg-black pt-16"
    >
      {/* 1. Background Nodes Field */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <EmbeddingField density={30} className="opacity-25" />
      </div>

      {/* 2. Full-Scale Original Background Portrait */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        {/* <img
          src="/profile.png"
          alt={name}
          className="h-full w-full object-cover object-center grayscale contrast-110 brightness-95"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 85% at 50% 55%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 85% at 50% 55%, black 55%, transparent 100%)",
          }}
        /> */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
      </div>

      {/* 3. Outer Edge Foreground Typography */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col justify-between px-6 py-12 md:flex-row md:items-center md:px-12 lg:px-16">

        {/* Left Side: Statement (Software + AI Engineering) */}
        <div className="max-w-md">

          {/* Status Badge */}
          <div className="animate-hero-badge mb-5 inline-flex items-center gap-2 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#4ade80] backdrop-blur-sm shadow-md shadow-green-500/10">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-[#4ade80]" />
            <span>SYSTEM ONLINE</span>
          </div>

          {/* Heading */}
          <div className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
            <div className="animate-hero-1 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              I build <span className="text-[#60a5fa] glow-blue">robust</span>
            </div>

            {/* Dynamic Typewriter Line */}
            <div className="animate-hero-2 mt-1 min-h-[2.4em] sm:min-h-[1.3em] text-[#fb923c] glow-orange">
              <span>{displayedText}</span>
              <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-white align-middle sm:h-8" />
            </div>
          </div>

          {/* Primary CTA */}
          <div className="animate-hero-cta-1 mt-7">
            <a
              href="#chat"
              className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#fb923c] to-[#f97316] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105 hover:shadow-orange-500/40 active:scale-95"
            >
              <span>CHAT WITH AI</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Right Side: Identity */}
        <div className="mt-10 w-full text-left md:mt-0 md:w-auto md:text-right">
          <span className="animate-hero-1 block text-2xl font-bold tracking-tight text-white sm:text-3xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            I'm
          </span>

          <h2 className="animate-hero-2 mt-0.5 text-4xl font-extrabold tracking-tight text-[#60a5fa] glow-blue sm:text-5xl lg:text-[54px] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            {name}
          </h2>

          <p className="animate-hero-3 mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#fb923c] sm:text-xs drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            {role}
          </p>

          {/* Secondary CTA */}
          <div className="animate-hero-cta-2 mt-7 flex justify-start md:justify-end">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 font-mono text-xs uppercase tracking-widest text-white backdrop-blur-md transition-all duration-200 hover:border-[#60a5fa] hover:bg-[#60a5fa]/10 hover:text-[#60a5fa] active:scale-95 shadow-lg shadow-black/60"
            >
              <span>VIEW PROJECTS</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
