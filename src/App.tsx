import { useEffect, useRef, useState } from "react";

const CONTENT = {
  name: "Tanvir Anjum",
  title: "Professional Video Editor",
  tagline: "Cutting frames, tuning rigs, chasing the perfect render.",
  about:
    "I'm a passionate tech enthusiast with a strong interest in PC hardware, gaming, and performance optimization. I enjoy researching components, solving technical challenges, and building systems that deliver the best value and efficiency. I'm currently developing my skills in video editing with Adobe Premiere Pro and After Effects, aiming to create high-quality content. I enjoy learning new technologies, continuously improving my skills, and taking on projects that challenge my creativity and problem-solving abilities.",
  focus: [
    {
      label: "Video editing",
      detail: "Adobe Premiere Pro & After Effects — cuts, color, motion graphics.",
    },
    {
      label: "PC hardware",
      detail: "Component research, builds, and performance tuning for value and efficiency.",
    },
    {
      label: "Problem solving",
      detail: "Technical troubleshooting and a steady habit of learning new tools.",
    },
  ],
  contact: [
    { label: "Telegram", handle: "@png656", href: "https://t.me/png656" },
    {
      label: "Discord",
      handle: "@png656",
      href: "https://discord.com/users/438416538077364274",
    },
  ],
};

const THEME = {
  bg: "#0a0a0a",
  bgAlt: "#111110",
  surface: "#161513",
  border: "#2a2724",
  text: "#f2ede6",
  textDim: "#948d82",
  accent: "#ff5a1f",
  accentDim: "#a83e16",
};

type Dot = { id: number; x: number; y: number };

function useCursorTrail(active: boolean): Dot[] {
  const [dots, setDots] = useState<Dot[]>([]);
  const idRef = useRef(0);
  const posRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", handleChange);

    if (reducedMotionRef.current) {
      return () => mq.removeEventListener("change", handleChange);
    }

    function handleMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMove);

    function tick() {
      if (posRef.current) {
        idRef.current += 1;
        const id = idRef.current;
        const { x, y } = posRef.current;
        posRef.current = null;
        setDots((prev) => [...prev.slice(-24), { id, x, y }]);
        setTimeout(() => {
          setDots((prev) => prev.filter((d) => d.id !== id));
        }, 700);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      mq.removeEventListener("change", handleChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return dots;
}

export default function App() {
  const dots = useCursorTrail(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.text,
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        overflow: "hidden",
        cursor: reducedMotion ? "auto" : "none",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .ta-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: transparent;
          border: 2px solid ${THEME.accent};
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          animation: ta-fade 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        @keyframes ta-fade {
          0% { opacity: 0.75; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.15); }
        }
        .ta-link {
          color: ${THEME.text};
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .ta-link:hover {
          color: ${THEME.accent};
          border-color: ${THEME.accent};
        }
        .ta-card {
          border: 1px solid ${THEME.border};
          background: ${THEME.surface};
          padding: 28px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .ta-card:hover {
          border-color: ${THEME.accentDim};
          transform: translateY(-2px);
        }
      `}</style>

      {dots.map((d) => (
        <span key={d.id} className="ta-dot" style={{ left: d.x, top: d.y }} />
      ))}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 6%",
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid ${THEME.border}`,
        }}
      >
        <span style={{ fontWeight: 700, letterSpacing: "0.04em" }}>
          TANVIR<span style={{ color: THEME.accent }}>.</span>
        </span>
      </header>

      <section
        style={{
          padding: "min(14vh, 140px) 6% 80px",
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: THEME.accent,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Portfolio
        </p>
        <h1
          style={{
            fontSize: "clamp(36px, 7vw, 68px)",
            lineHeight: 1.05,
            margin: "0 0 20px",
            fontWeight: 700,
          }}
        >
          {CONTENT.name}
        </h1>
        <h2
          style={{
            fontSize: "clamp(18px, 2.6vw, 26px)",
            fontWeight: 400,
            color: THEME.textDim,
            margin: "0 0 24px",
          }}
        >
          {CONTENT.title}
        </h2>
        <p style={{ fontSize: 16, color: THEME.textDim, maxWidth: 520, margin: "0 auto" }}>
          {CONTENT.tagline}
        </p>
      </section>

      <section
        id="about"
        style={{
          padding: "60px 6%",
          borderTop: `1px solid ${THEME.border}`,
          background: THEME.bgAlt,
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: THEME.accent,
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            About
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: THEME.text }}>
            {CONTENT.about}
          </p>
        </div>
      </section>

      <section id="focus" style={{ padding: "70px 6%" }}>
        <p
          style={{
            color: THEME.accent,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 30,
          }}
        >
          Focus
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {CONTENT.focus.map((f) => (
            <div className="ta-card" key={f.label}>
              <h3 style={{ margin: "0 0 10px", fontSize: 18, color: THEME.text }}>
                {f.label}
              </h3>
              <p style={{ margin: 0, color: THEME.textDim, fontSize: 14.5, lineHeight: 1.6 }}>
                {f.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contact"
        style={{
          padding: "80px 6% 100px",
          borderTop: `1px solid ${THEME.border}`,
          background: THEME.bgAlt,
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: THEME.accent,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Contact
        </p>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", margin: "0 0 30px", fontWeight: 700 }}>
          Let's talk.
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "center" }}>
          {CONTENT.contact.map((c) => (
            <a key={c.label} href={c.href} className="ta-link" style={{ fontSize: 16 }}>
              <span style={{ color: THEME.textDim, marginRight: 8 }}>{c.label}</span>
              {c.handle}
            </a>
          ))}
        </div>
      </section>

      <footer
        style={{
          padding: "24px 6%",
          borderTop: `1px solid ${THEME.border}`,
          color: THEME.textDim,
          fontSize: 12.5,
        }}
      >
        © {new Date().getFullYear()} {CONTENT.name}
      </footer>
    </div>
  );
}
