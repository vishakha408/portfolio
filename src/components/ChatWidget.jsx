import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "./About.jsx";

const API_URL = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

const SUGGESTIONS = [
  "What projects have you built?",
  "Why should we hire you?",
  "What are your core technical skills?",
];

const WELCOME = {
  role: "assistant",
  content:
    "Hi! I'm an AI assistant grounded in Vishakha's resume, skills, and projects. Ask me anything about his technical experience.",
  sources: [],
};

export default function ChatWidget() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(text) {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.answer ?? "I didn't get a usable answer from the backend.",
          sources: data.sources ?? [],
        },
      ]);
    } catch (err) {
      setError("Backend unreachable — showing demo response.");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          demo: true,
          content:
            "This is a placeholder response. Once your backend server is active, I'll answer directly from your resume and projects using the vector retriever.",
          sources: ["resume.pdf", "projects.txt"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chat" className="relative w-full bg-black py-28 overflow-hidden">
      <div className="mx-auto max-w-4xl px-6">

        {/* Section Header */}
        <div className="reveal">
          <SectionLabel index="02" title="interactive chat" />
          <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ask <span className="text-[#60a5fa]">anything</span> about my{" "}
            <span className="text-[#fb923c]">work</span>.
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Answers are retrieved in real-time from vector embeddings over my resume and project files.
          </p>
        </div>

        {/* Console Box */}
        <div className="reveal delay-100 mt-10 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.02] shadow-2xl backdrop-blur-md">

          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-black/90 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#60a5fa]">
                rag_pipeline <span className="text-white">::</span> faiss
              </span>
            </div>
            {error && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#fb923c]">
                {error}
              </span>
            )}
          </div>

          {/* Messages Feed */}
          <div
            ref={scrollRef}
            className="scrollbar-thin flex h-[400px] flex-col gap-4 overflow-y-auto bg-black/40 px-5 py-6"
          >
            {messages.map((m, i) => (
              <Bubble key={i} message={m} />
            ))}
            {loading && <TypingBubble />}
          </div>

          {/* Prompt Suggestions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 border-t border-white/10 bg-black/60 px-5 py-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-gray-300 transition-all duration-200 hover:border-[#60a5fa] hover:bg-[#60a5fa]/10 hover:text-white"
                >
                  <span className="text-[#fb923c] mr-1.5">›</span>{s}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-3 border-t border-white/10 bg-black/80 px-5 py-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, technical skills, background..."
              className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-gray-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-[#fb923c] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-200 hover:bg-[#f97316] hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30 shadow-lg shadow-orange-500/20"
            >
              Ask →
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}

function Bubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "border border-[#60a5fa]/30 bg-[#60a5fa]/15 text-white font-medium"
            : "border border-white/10 bg-white/[0.04] text-gray-200"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.sources?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5">
            {message.sources.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[#fb923c]/30 bg-[#fb923c]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#fb923c]"
              >
                ↳ {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-[#60a5fa]"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
