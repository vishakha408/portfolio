import { SectionLabel } from "./About.jsx";

const SKILL_CATEGORIES = [
  {
    title: "Languages",
    accent: "#60a5fa",
    skills: ["Python", "SQL", "HTML / CSS"],
  },
  {
    title: "Frameworks & Backend",
    accent: "#fb923c",
    skills: ["Flask", "RESTful APIs"],
  },
  {
    title: "AI & Data Science",
    accent: "#60a5fa",
    skills: ["Pandas & NumPy", "Scikit-Learn", "Gemini API", "Plotly"],
  },
  {
    title: "Databases & Tools",
    accent: "#fb923c",
    skills: ["MySQL", "Git & GitHub", "GitHub Actions", "Docker"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative w-full bg-black py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">

        {/* Section Header */}
        <div className="reveal">
          <SectionLabel index="04" title="technical stack" />
          <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Core <span className="text-[#fb923c]">skills</span> &{" "}
            <span className="text-[#60a5fa]">technologies</span>.
          </h3>
        </div>

        {/* Skills Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_CATEGORIES.map((cat, i) => (
            <div
              key={cat.title}
              className="reveal group rounded-2xl border border-white/15 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#60a5fa]/50 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-[#60a5fa]/10"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  {cat.title}
                </h4>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.accent }}
                />
              </div>

              <ul className="space-y-3">
                {cat.skills.map((skill) => (
                  <li
                    key={skill}
                    className="font-mono text-xs text-gray-300 flex items-center gap-2.5 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#fb923c] flex-shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
