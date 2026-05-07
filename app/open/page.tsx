"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────
interface LoveData {
  to: string; from: string; msg: string; mem: string;
  date: string; song: string; photo: string; photoKey?: string;
}

// ── Star Field (cosmic background) ─────────────────────────────────────────
function CosmicBackground() {
  const stars = Array.from({ length: 220 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2.8 + 0.4,
    dur: Math.random() * 5 + 2, delay: Math.random() * 6,
  }));
  const shooters = Array.from({ length: 10 }, (_, i) => ({
    id: i, x: Math.random() * 80, y: Math.random() * 40,
    delay: i * 4 + Math.random() * 3, dur: 1 + Math.random() * 0.8,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s) => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: s.size > 2 ? "#f5c842" : "white",
          opacity: s.size > 2 ? 0.6 : 1,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
      {shooters.map((s) => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: 2, height: 90, opacity: 0,
          background: "linear-gradient(to bottom, transparent, #f5c842, white)",
          transformOrigin: "top center", transform: "rotate(-42deg)",
          animation: `shoot ${s.dur}s ease-in ${s.delay}s infinite`,
        }} />
      ))}
      <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "70vw", height: "70vw", borderRadius: "50%", background: "radial-gradient(circle, #12124e 0%, transparent 70%)", filter: "blur(60px)", animation: "nebula-drift 12s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-15%", width: "65vw", height: "65vw", borderRadius: "50%", background: "radial-gradient(circle, #5a0e3a 0%, transparent 70%)", filter: "blur(60px)", animation: "nebula-drift 10s ease-in-out infinite alternate-reverse" }} />
      <div style={{ position: "absolute", top: "40%", left: "30%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, #2d1b69 0%, transparent 70%)", filter: "blur(50px)", animation: "nebula-drift 9s ease-in-out 2s infinite alternate" }} />
    </div>
  );
}

// ── Continuous floating hearts ──────────────────────────────────────────────
function FloatingHearts({ active }: { active: boolean }) {
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    dur: 7 + Math.random() * 9, delay: Math.random() * 12,
    size: 14 + Math.random() * 22, opacity: 0.07 + Math.random() * 0.13,
  }));
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {hearts.map((h) => (
        <div key={h.id} style={{
          position: "absolute", left: `${h.x}%`, bottom: "-60px",
          fontSize: h.size, opacity: h.opacity, color: "#f5c842",
          animation: `float-up ${h.dur}s ease-in ${h.delay}s infinite`,
        }}>♥</div>
      ))}
    </div>
  );
}

// ── Fireworks burst ─────────────────────────────────────────────────────────
function Fireworks({ trigger }: { trigger: boolean }) {
  const particles = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 360;
    const dist = 80 + Math.random() * 120;
    return {
      id: i, angle,
      tx: Math.cos((angle * Math.PI) / 180) * dist,
      ty: Math.sin((angle * Math.PI) / 180) * dist,
      color: ["#f5c842", "#ff6b9d", "#c4b5fd", "#60a5fa", "#ff9999", "white"][Math.floor(Math.random() * 6)],
      size: 4 + Math.random() * 6,
      dur: 0.8 + Math.random() * 0.6,
    };
  });
  if (!trigger) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10, overflow: "hidden" }}>
      {[...Array(5)].map((_, burst) => (
        <div key={burst} style={{ position: "absolute", left: `${20 + burst * 15}%`, top: `${20 + (burst % 3) * 20}%` }}>
          {particles.map((p) => (
            <motion.div key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0 }}
              transition={{ duration: p.dur, delay: burst * 0.3, ease: "easeOut" }}
              style={{ position: "absolute", width: p.size, height: p.size, borderRadius: "50%", background: p.color, boxShadow: `0 0 6px ${p.color}` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Music notes ─────────────────────────────────────────────────────────────
function MusicNotes() {
  const notes = ["♪", "♫", "♩", "♬", "𝄞"];
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i, note: notes[i % notes.length],
    x: 10 + Math.random() * 80, dur: 3 + Math.random() * 3,
    delay: Math.random() * 4, size: 16 + Math.random() * 16,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {items.map((n) => (
        <div key={n.id} style={{
          position: "absolute", left: `${n.x}%`, bottom: 0,
          fontSize: n.size, color: "#f5c842", opacity: 0,
          animation: `music-float ${n.dur}s ease-out ${n.delay}s infinite`,
        }}>{n.note}</div>
      ))}
    </div>
  );
}

// ── Typewriter text ─────────────────────────────────────────────────────────
function Typewriter({ text, speed = 40, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span>
      {displayed}
      {!done && <span style={{ animation: "blink 0.8s step-end infinite", color: "#f5c842" }}>|</span>}
    </span>
  );
}

// ── Days counter ─────────────────────────────────────────────────────────────
function DaysCounter({ dateStr }: { dateStr: string }) {
  const [count, setCount] = useState(0);
  const target = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 80);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [target]);
  const years = Math.floor(target / 365);
  const months = Math.floor((target % 365) / 30);
  const days = target % 30;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Cinzel', serif", fontSize: "clamp(4rem, 12vw, 8rem)", fontWeight: 700,
        color: "#f5c842", lineHeight: 1,
        textShadow: "0 0 40px rgba(245,200,66,0.6), 0 0 80px rgba(245,200,66,0.3)",
        animation: count < target ? "counter-flash 0.3s ease-in-out infinite" : "none",
      }}>{count.toLocaleString()}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
        days of loving you
      </div>
      {years > 0 && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[{ v: years, l: "years" }, { v: months, l: "months" }, { v: days, l: "days" }].map((x) => (
            <div key={x.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#f5c842" }}>{x.v}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>{x.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section wrapper ─────────────────────────────────────────────────────────
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 60, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Petals burst (on envelope open) ─────────────────────────────────────────
function PetalBurst({ show }: { show: boolean }) {
  const petals = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    emoji: ["🌸", "🌹", "✨", "💫", "⭐", "🌺"][i % 6],
    tx: (Math.random() - 0.5) * 300,
    ty: -(80 + Math.random() * 200),
    rot: Math.random() * 720 - 360,
    size: 16 + Math.random() * 20,
    dur: 0.8 + Math.random() * 0.8,
  }));
  if (!show) return null;
  return (
    <div style={{ position: "absolute", top: "50%", left: "50%", pointerEvents: "none", zIndex: 20 }}>
      {petals.map((p) => (
        <motion.div key={p.id}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.tx, y: p.ty, scale: 1, rotate: p.rot, opacity: 0 }}
          transition={{ duration: p.dur, ease: "easeOut" }}
          style={{ position: "absolute", fontSize: p.size, transform: "translate(-50%,-50%)" }}>
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ── THE MAIN OPEN PAGE ──────────────────────────────────────────────────────
function OpenPageInner() {
  const params = useSearchParams();
  const [data, setData] = useState<LoveData | null>(null);
  const [error, setError] = useState(false);
  const [scene, setScene] = useState<"loading" | "greeting" | "envelope" | "letter" | "journey">("loading");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [petalBurst, setPetalBurst] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [letterDone, setLetterDone] = useState(false);

  useEffect(() => {
    const d = params.get("d");
    if (!d) { setError(true); return; }
    try {
      const parsed = JSON.parse(decodeURIComponent(atob(d)));
      // photo is already a compressed data URL baked into the link — just use it
      setData(parsed);
      setTimeout(() => setScene("greeting"), 800);
    } catch { setError(true); }
  }, [params]);

  const openEnvelope = () => {
    setEnvelopeOpen(true);
    setPetalBurst(true);
    setTimeout(() => { setPetalBurst(false); setScene("letter"); }, 1200);
  };

  useEffect(() => {
    if (letterDone) {
      setTimeout(() => setScene("journey"), 1000);
      setTimeout(() => setFireworks(true), 1200);
      setTimeout(() => setFireworks(false), 4000);
    }
  }, [letterDone]);

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
      <CosmicBackground />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: "3rem", marginBottom: 24 }}>💔</div>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.5rem", color: "#f5c842", marginBottom: 16 }}>This link seems lost in space</h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Ask him to send you a new link — maybe he forgot to copy it correctly.</p>
      </div>
    </div>
  );

  if (!data || scene === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CosmicBackground />
      <motion.div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: "2rem", display: "block", marginBottom: 20 }}>✦</motion.div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
          Opening your universe…
        </p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <CosmicBackground />
      <FloatingHearts active={scene === "journey"} />
      <Fireworks trigger={fireworks} />

      <AnimatePresence mode="wait">

        {/* ── GREETING SCENE ── */}
        {scene === "greeting" && (
          <motion.div key="greeting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px", position: "relative", zIndex: 2 }}>

            {/* Glowing ring behind name */}
            <div style={{ position: "relative", marginBottom: 32 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  position: "absolute", top: "50%", left: "50%", width: "200px", height: "200px",
                  borderRadius: "50%", border: `1px solid rgba(245,200,66,${0.3 - i * 0.08})`,
                  animation: `ring-pulse 2.5s ease-out ${i * 0.5}s infinite`,
                }} />
              ))}
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                <div style={{ fontSize: "clamp(3.5rem, 12vw, 6rem)", fontFamily: "'Dancing Script', cursive", color: "#f5c842", position: "relative", zIndex: 1, textShadow: "0 0 40px rgba(245,200,66,0.5), 0 0 80px rgba(245,200,66,0.2)", lineHeight: 1.1 }}>
                  {data.to}
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 3vw, 1.5rem)", color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 12 }}>
                Someone rearranged the stars for you tonight.
              </p>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.8rem", color: "rgba(245,200,66,0.7)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 48 }}>
                — from {data.from}, with all his heart —
              </p>
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.6 }}
              className="cosmic-btn" onClick={() => setScene("envelope")}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              Open Your Letter ✦
            </motion.button>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
              style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>SCROLL DOWN</div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <div style={{ color: "rgba(245,200,66,0.4)", fontSize: "1rem" }}>↓</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ── ENVELOPE SCENE ── */}
        {scene === "envelope" && (
          <motion.div key="envelope" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px", position: "relative", zIndex: 2 }}>

            <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginBottom: 60 }}>
              He wrote you something…
            </motion.p>

            {/* Envelope */}
            <div style={{ position: "relative", cursor: "pointer" }} onClick={openEnvelope}>
              <PetalBurst show={petalBurst} />
              <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, rotate: 1 }}
                style={{ perspective: 600 }}>

                {/* Envelope body */}
                <div style={{ width: 280, height: 190, position: "relative" }}>
                  {/* Body */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1a1a3e, #2d0e3a)", border: "1px solid rgba(245,200,66,0.4)", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(245,200,66,0.1)" }} />
                  {/* V-flap */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "200%",
                      background: "linear-gradient(160deg, #12123a, #3a0e48)",
                      border: "1px solid rgba(245,200,66,0.3)",
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      transformOrigin: "top center",
                      transition: "transform 0.8s ease",
                      transform: envelopeOpen ? "rotateX(-180deg)" : "rotateX(0deg)",
                    }} />
                  </div>
                  {/* Bottom V */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", overflow: "hidden" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200%", background: "linear-gradient(to bottom, #2d1b60, #1a1a40)", clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }} />
                  </div>
                  {/* Seal */}
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle, #f5c842, #c9a227)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", boxShadow: "0 0 20px rgba(245,200,66,0.5)", zIndex: 2 }}>
                    ♥
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.2em", color: "rgba(245,200,66,0.7)" }}>
                TAP THE ENVELOPE
              </motion.p>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                <span style={{ color: "rgba(245,200,66,0.5)", fontSize: "1.2rem" }}>↓</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ── LETTER SCENE ── */}
        {scene === "letter" && (
          <motion.div key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px", position: "relative", zIndex: 2 }}>
            <div style={{ maxWidth: 600, width: "100%" }}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>

                {/* Letter paper */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: 16, padding: "48px 44px", backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.25em", color: "rgba(245,200,66,0.5)", textTransform: "uppercase", marginBottom: 12 }}>A Letter From the Stars</div>
                    <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, #f5c842, transparent)", margin: "0 auto" }} />
                  </div>

                  <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.05rem", color: "rgba(245,200,66,0.9)", marginBottom: 20 }}>
                    My dearest {data.to},
                  </div>

                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.9, color: "rgba(240,240,255,0.85)", letterSpacing: "0.02em" }}>
                    <Typewriter text={data.msg} speed={35} onDone={() => setTimeout(() => setLetterDone(true), 800)} />
                  </div>

                  {letterDone && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                      style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(245,200,66,0.1)", textAlign: "right" }}>
                      <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem", color: "rgba(245,200,66,0.8)" }}>Forever yours,</div>
                      <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.6rem", color: "#f5c842", textShadow: "0 0 20px rgba(245,200,66,0.4)" }}>{data.from} ♥</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── FULL JOURNEY SCENE ── */}
        {scene === "journey" && (
          <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
            style={{ position: "relative", zIndex: 2 }}>

            {/* Section 1: Days Counter */}
            {data.date && (
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
                <Section>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(245,200,66,0.5)", textTransform: "uppercase", marginBottom: 32 }}>
                    ✦ Our Journey ✦
                  </div>
                  <DaysCounter dateStr={data.date} />
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                    style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                    and counting, forever
                  </motion.div>
                  <div style={{ marginTop: 24 }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.span key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                        style={{ display: "inline-block", margin: "0 4px", fontSize: "1.2rem", color: i === 2 ? "#f5c842" : "rgba(245,200,66,0.4)" }}>♥</motion.span>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Section 2: Memory */}
            {data.mem && (
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
                <Section delay={0.2}>
                  <div style={{ maxWidth: 580, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(245,200,66,0.5)", textTransform: "uppercase", marginBottom: 32 }}>
                      ✦ Our Memory ✦
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(245,200,66,0.15)", borderRadius: 20, padding: "48px 40px", position: "relative", overflow: "hidden" }}>
                      {/* Quote marks */}
                      <div style={{ position: "absolute", top: 20, left: 24, fontFamily: "'Cinzel', serif", fontSize: "5rem", color: "rgba(245,200,66,0.08)", lineHeight: 1, userSelect: "none" }}>"</div>
                      <div style={{ position: "absolute", bottom: 10, right: 24, fontFamily: "'Cinzel', serif", fontSize: "5rem", color: "rgba(245,200,66,0.08)", lineHeight: 1, userSelect: "none", transform: "rotate(180deg)" }}>"</div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 3vw, 1.4rem)", lineHeight: 1.85, color: "rgba(240,240,255,0.8)", fontStyle: "italic", position: "relative", zIndex: 1 }}>
                        {data.mem}
                      </p>
                      <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 8 }}>
                        {["🌸", "✨", "🌸"].map((e, i) => <span key={i} style={{ fontSize: "1rem" }}>{e}</span>)}
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* Section 3: Photo polaroid */}
            {data.photo && (
              <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
                <Section delay={0.1}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(245,200,66,0.5)", textTransform: "uppercase", marginBottom: 48 }}>
                      ✦ Us ✦
                    </div>
                    <motion.div whileHover={{ rotate: 0, scale: 1.04 }} transition={{ duration: 0.4 }}
                      style={{ display: "inline-block", background: "white", padding: "14px 14px 50px", boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)", transform: "rotate(-3deg)" }}>
                      <img src={data.photo} alt="Us"
                        style={{ display: "block", width: "min(280px, 70vw)", height: "min(280px, 70vw)", objectFit: "cover" }} />
                      <div style={{ textAlign: "center", marginTop: 12, fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem", color: "#333" }}>
                        {data.from} ♥ {data.to}
                      </div>
                    </motion.div>
                  </div>
                </Section>
              </div>
            )}

            {/* Section 4: Our Song */}
            {data.song && (
              <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
                <Section>
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(245,200,66,0.5)", textTransform: "uppercase", marginBottom: 32 }}>
                      ✦ Our Song ✦
                    </div>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <MusicNotes />
                      <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }}
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: 20, padding: "40px 60px", position: "relative", zIndex: 1 }}>
                        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎵</div>
                        <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#f5c842", textShadow: "0 0 20px rgba(245,200,66,0.4)", marginBottom: 8 }}>
                          {data.song}
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                          every note reminds me of you
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* Section 5: Grand finale */}
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
              <Section>
                <div style={{ maxWidth: 540 }}>
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "4rem", marginBottom: 32, display: "block" }}>
                    ♥
                  </motion.div>
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", color: "#f5c842", letterSpacing: "0.08em", marginBottom: 24, textShadow: "0 0 40px rgba(245,200,66,0.4)" }}>
                    You Are My Universe
                  </h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "rgba(255,255,255,0.6)", fontStyle: "italic", lineHeight: 1.9, marginBottom: 48 }}>
                    In a cosmos of a billion stars,<br />every single one of them points to you.
                  </p>

                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 56, flexWrap: "wrap" }}>
                    {["🌌", "💫", "♥", "💫", "🌌"].map((e, i) => (
                      <motion.span key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                        style={{ fontSize: "1.8rem" }}>{e}</motion.span>
                    ))}
                  </div>

                  <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "rgba(245,200,66,0.7)", marginBottom: 8 }}>
                    Made just for you,
                  </div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1rem, 3vw, 1.3rem)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>
                    — {data.from} —
                  </div>

                  <div style={{ marginTop: 64, paddingTop: 40, borderTop: "1px solid rgba(245,200,66,0.1)" }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
                      FORYOUONLY · built with love · no database · just stars
                    </p>
                  </div>
                </div>
              </Section>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default function OpenPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#02020a" }}>
        <div style={{ fontFamily: "'Cinzel', serif", color: "rgba(245,200,66,0.5)", fontSize: "0.8rem", letterSpacing: "0.2em" }}>
          ✦ LOADING ✦
        </div>
      </div>
    }>
      <OpenPageInner />
    </Suspense>
  );
}
