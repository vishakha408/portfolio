import { SectionLabel } from "./About.jsx";

const DEFAULT_PROJECTS = [
  {
    title: "HR Data Analysis Dashboard",
    subtitle: "HR Predictive Analytics",
    description:
      "Workforce demographics dashboard in Python and Plotly. Powered by a Random Forest model predicting employee attrition and automating promotion calculations.",
    tags: ["Python", "Machine Learning", "Plotly", "Random Forest"],
    href: "https://github.com/vishakha408/HR-Analytics",
  },
  {
    title: "Stock Analyzer Web App",
    subtitle: "Analyze Stock Trends",
    description:
      "Built a stock analysis web app that generates BUY / HOLD / SELL signals. Integrated yfinance for real-time financial data and did technical analysis with interactive visual charts and used Google Gemini API to generate concise investment insights",
    tags: ["Python", "Flask", "Render", "Gemini API"],
    href: "https://github.com/vishakha408/flask-portfolio",
  },
];

export default function Projects({ projects = DEFAULT_PROJECTS }) {
  return (
    <section id="projects" className="relative w-full bg-black py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">

        {/* Section Header */}
        <div className="reveal">
          <SectionLabel index="03" title="featured work" />
          <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Selected <span className="text-[#60a5fa]">projects</span> &{" "}
            <span className="text-[#fb923c]">systems</span>.
          </h3>
        </div>

        {/* Projects Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <a
              key={p.title}
              href={p.href}
              target={p.href.startsWith("http") ? "_blank" : undefined}
              rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="reveal group flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.02] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#fb923c]/60 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-[#fb923c]/15"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#fb923c]">
                  {p.subtitle}
                </span>

                <div className="mt-1 flex items-center justify-between">
                  <h4 className="text-xl font-extrabold text-white transition-colors duration-300 group-hover:text-[#60a5fa]">
                    {p.title}
                  </h4>
                  <span className="font-mono text-sm text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#fb923c]">
                    ↗
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-300">
                  {p.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-black/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-300 transition-colors duration-200 group-hover:border-[#60a5fa]/40 group-hover:text-[#60a5fa]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
