import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Footer from "./components/Footer.jsx";

const PROFILE = {
  name: "Vishakha Damani",
  role: "SOFTWARE DEVELOPER & AI/ML ENGINEER",
  tagline: "I build robust full-stack software and intelligent systems.",
  photoSrc: "/profile.png",
};

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            // Removes the class when scrolled past so it triggers again on next scroll
            entry.target.classList.remove("active");
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px 60px 0px", // Pre-triggers 60px before scrolling into view
      }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-blue-500/30">
      <Navbar name={PROFILE.name} />
      <main>
        <Hero
          name={PROFILE.name}
          role={PROFILE.role}
          tagline={PROFILE.tagline}
          photoSrc={PROFILE.photoSrc}
        />
        {/* 1. About */}
        <About photoSrc={PROFILE.photoSrc} />
        {/* 2. Chat */}
        <ChatWidget />
        {/* 3. Projects */}
        <Projects />
        {/* 4. Skills */}
        <Skills />
      </main>
      <Footer name={PROFILE.name} />
    </div>
  );
}
