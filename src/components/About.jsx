export default function About({
  photoSrc = "/profile.jpeg",
  facts = [
    { label: "based in", value: "Kolkata, India" },
    { label: "focus", value: "Machine Learning · Backend Dev" },
    { label: "stack", value: "Python · Flask · SQL" },
    { label: "open to", value: "Internships & SDE Roles" },
  ],
}) {
  return (
    <section id="about" className="relative w-full bg-black py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">

        {/* Section Label */}
        <div className="reveal">
          <SectionLabel index="01" title="about me" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[280px_1fr] md:gap-16 items-start">

          {/* Photo Card */}
          <div className="reveal delay-100 mx-auto md:mx-0">
            <div className="group relative aspect-[3/4] w-64 overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-[#60a5fa]/50 hover:shadow-2xl hover:shadow-[#60a5fa]/10 md:w-full">
              <img
                src={photoSrc}
                alt="Portrait"
                className="h-full w-full object-cover object-top grayscale contrast-110 brightness-100 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/80 px-3 py-2 backdrop-blur-md flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#4ade80]">
                  ● verified profile
                </span>
                <span className="font-mono text-[10px] tracking-widest text-[#60a5fa]">
                  AI & ML
                </span>
              </div>
            </div>
          </div>

          {/* Tri-Color Styled Bio & Facts */}
          <div className="reveal delay-200">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineering <span className="text-[#60a5fa]">intelligence</span> from{" "}
              <span className="text-[#fb923c]">code & data</span>.
            </h3>

            <p className="mt-6 text-base leading-relaxed text-gray-300 sm:text-lg">
              I'm a B.Tech student in <span className="font-semibold text-white">Computer Science Engineering (AI & ML)</span> at Techno Main Salt Lake, Kolkata. I specialize in building full-stack applications with <span className="text-[#60a5fa] font-medium">Python</span> & <span className="text-[#60a5fa] font-medium">Flask</span>, alongside data-driven systems in <span className="text-[#fb923c] font-medium">Jupyter & Machine Learning</span>.
            </p>

            <p className="mt-4 text-base leading-relaxed text-gray-300">
              I turn messy datasets into real-world decisions — using <span className="text-white font-medium">Pandas, Scikit-learn, Streamlit, and Plotly</span> to build solutions that actually get deployed, not just demoed.
            </p>

            {/* Facts Grid */}
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 pt-8 border-t border-white/10">
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className="reveal"
                  style={{ transitionDelay: `${50 + i * 50}ms` }}
                >
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-[#fb923c]">
                    {f.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-white">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

        </div>
      </div>
    </section>
  );
}

export function SectionLabel({ index, title }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-sm font-bold text-[#fb923c]">{index}</span>
      <span className="h-[1px] flex-1 max-w-[3rem] bg-gradient-to-r from-[#fb923c] to-[#60a5fa]" />
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-white">
        {title}
      </h2>
    </div>
  );
}
