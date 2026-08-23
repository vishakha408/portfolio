import { useEffect, useRef } from "react";

/**
 * EmbeddingField — the site's signature visual.
 * A field of particles ("chunks") drifting in space. Particles within
 * a threshold distance draw a connecting line, evoking nearest-neighbor
 * retrieval in a vector database. One particle is tagged "query" and
 * periodically "retrieves" its nearest neighbors with a brighter pulse —
 * a literal, quiet illustration of how the RAG pipeline actually works.
 */
export default function EmbeddingField({ density = 55, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width, height, dpr;
    let particles = [];
    let queryIndex = 0;
    let retrieveTimer = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      const count = Math.round((width * height) / (12000 / density));
      particles = Array.from({ length: Math.max(24, count) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.6,
      }));
      queryIndex = Math.floor(Math.random() * particles.length);
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // drift particles
      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      // connections between nearby particles
      const linkDist = Math.min(width, height) * 0.11;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.16;
            ctx.strokeStyle = `rgba(124, 140, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // periodic "retrieval": query node highlights its nearest neighbors
      retrieveTimer += 1;
      const query = particles[queryIndex];
      if (query) {
        const neighbors = particles
          .map((p, idx) => ({ idx, d: Math.hypot(p.x - query.x, p.y - query.y) }))
          .filter((n) => n.idx !== queryIndex)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3);

        for (const n of neighbors) {
          const p = particles[n.idx];
          ctx.strokeStyle = "rgba(242, 169, 75, 0.35)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(query.x, query.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          ctx.fillStyle = "rgba(242, 169, 75, 0.9)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 1, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "rgba(242, 169, 75, 1)";
        ctx.beginPath();
        ctx.arc(query.x, query.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (retrieveTimer > 260) {
        retrieveTimer = 0;
        queryIndex = Math.floor(Math.random() * particles.length);
      }

      // remaining particles
      for (let i = 0; i < particles.length; i++) {
        if (i === queryIndex) continue;
        const p = particles[i];
        ctx.fillStyle = "rgba(231, 234, 243, 0.5)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(step);
    }

    init();
    step();

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
