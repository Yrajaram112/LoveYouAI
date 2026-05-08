"use client";
import { use, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { readClient } from "@/lib/sanity";

const HIM_LOVE_QUERY = `*[_type == "himLove" && _id == $id][0]{
  _id, to, from, message, memory, date, song, extra, createdAt,
  photo{ asset->{ url } }
}`;

interface HimLoveData {
  _id: string; to: string; from: string; message: string;
  memory?: string; date?: string; song?: string; extra?: string;
  createdAt: string;
  photo?: { asset?: { url: string } };
}

/* ─── Dark Masculine Background ──────────────────────────────── */
function MasculineBg() {
  const [sparks, setSparks] = useState<any[]>([]);
  useEffect(() => {
    setSparks(Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${(i * 43 + 11) % 100}%`,
      top: `${(i * 67 + 7) % 100}%`,
      size: 1.2 + (i % 3) * 0.6,
      color: ["#60a5fa", "#f59e0b", "#ef4444", "#94a3b8", "#38bdf8"][i % 5],
      dur: 3.5 + (i % 4),
      delay: i * 0.45,
    })));
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse 80% 60% at 75% 5%, rgba(29,78,216,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 10% 90%, rgba(14,116,144,0.16) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 55%, rgba(245,158,11,0.06) 0%, transparent 60%), #060a14" }}>
      {/* Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="0.8" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
      {/* Diagonal accent */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="#60a5fa" strokeWidth="1.5" />
      </svg>
      {sparks.map(s => (
        <div key={s.id} style={{ position: "absolute", left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%", background: s.color, opacity: 0.3, animation: `him-spark ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* ─── Floating Embers ──────────────────────────────────────────── */
function FloatingEmbers() {
  const EMOJIS = ["⚡", "🔥", "💙", "❤️", "✨", "💛", "🥊", "🌙", "⭐", "💪"];
  const [embers, setEmbers] = useState<any[]>([]);
  useEffect(() => {
    const make = (id: number) => ({
      id, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 90 + 5,
      size: 14 + Math.random() * 20,
      dur: 6 + Math.random() * 5,
      delay: Math.random() * 3,
      opacity: 0.4 + Math.random() * 0.45,
      rot: Math.random() * 50 - 25,
    });
    setEmbers(Array.from({ length: 24 }, (_, i) => make(i)));
    let counter = 24;
    const iv = setInterval(() => {
      setEmbers(prev => [...prev.slice(-30), make(counter++)]);
    }, 1600);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {embers.map(e => (
        <motion.div key={e.id}
          initial={{ y: "105vh", x: `${e.x}vw`, rotate: e.rot, opacity: 0, scale: 0.5 }}
          animate={{ y: "-15vh", rotate: e.rot + 35, opacity: [0, e.opacity, e.opacity, 0], scale: [0.5, 1, 1, 0.7] }}
          transition={{ duration: e.dur, delay: e.delay, ease: "easeOut" }}
          style={{ position: "absolute", bottom: 0, fontSize: e.size, filter: "drop-shadow(0 2px 8px rgba(59,130,246,0.4))" }}>
          {e.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Shield Burst — masculine celebration ──────────────────── */
function ShieldBurst() {
  const EMOJIS = ["⚡", "🔥", "💙", "❤️", "✨", "💛", "⭐", "🥊", "💪", "🌙"];
  const colors = ["#3b82f6", "#ef4444", "#f59e0b", "#38bdf8", "#60a5fa", "#fbbf24", "white", "#94a3b8"];
  const waves = [0, 0.5, 1.0, 1.6, 2.2, 2.8];
  const positions = [
    { x: "12%", y: "18%" }, { x: "50%", y: "12%" }, { x: "82%", y: "22%" },
    { x: "22%", y: "52%" }, { x: "72%", y: "48%" }, { x: "8%", y: "72%" },
    { x: "85%", y: "68%" }, { x: "45%", y: "38%" }, { x: "58%", y: "72%" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10, overflow: "hidden" }}>
      {waves.map((wd, w) =>
        positions.map((pos, b) => {
          const emojiCount = 10;
          const dotCount = 16;
          return (
            <div key={`w${w}b${b}`} style={{ position: "absolute", left: pos.x, top: pos.y }}>
              {Array.from({ length: emojiCount }, (_, i) => {
                const angle = (i / emojiCount) * 360 + b * 20;
                const dist = 60 + Math.random() * 80;
                return (
                  <motion.div key={`e${i}`}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                    animate={{ x: Math.cos(angle * Math.PI / 180) * dist, y: Math.sin(angle * Math.PI / 180) * dist, scale: [0, 1.1, 0.8, 0], opacity: [0, 1, 1, 0], rotate: 360 }}
                    transition={{ duration: 1.2, delay: wd + b * 0.13, ease: "easeOut" }}
                    style={{ position: "absolute", fontSize: 14 + (i % 3) * 5 }}>
                    {EMOJIS[(i + b + w) % EMOJIS.length]}
                  </motion.div>
                );
              })}
              {Array.from({ length: dotCount }, (_, i) => {
                const angle = (i / dotCount) * 360 + b * 10;
                const dist = 40 + Math.random() * 60;
                return (
                  <motion.div key={`d${i}`}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0.9 }}
                    animate={{ x: Math.cos(angle * Math.PI / 180) * dist, y: Math.sin(angle * Math.PI / 180) * dist, scale: [0, 1, 0], opacity: [0.9, 0.7, 0] }}
                    transition={{ duration: 0.9, delay: wd + b * 0.13 + 0.05, ease: "easeOut" }}
                    style={{ position: "absolute", width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: "50%", background: colors[(i + b) % colors.length] }} />
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────── */
function Typewriter({ text, speed = 38, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++; setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{shown}{!done && <span style={{ animation: "blink-him 0.8s step-end infinite", color: "#60a5fa" }}>|</span>}</span>;
}

/* ─── Bold No Button — harder to click ──────────────────────── */
function StubborNoButton({ attempts, onAttempt }: { attempts: number; onAttempt: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [msg, setMsg] = useState("");
  const msgs = ["Too slow ⚡", "Nah bruh 😤", "Can't dodge forever 🥊", "The audacity 💀", "Run faster 🏃‍♂️", "Getting tired? 😅", "Give up already 😂", "Nice try bro 💀"];
  const handleMouse = () => {
    onAttempt();
    const vw = window.innerWidth; const vh = window.innerHeight;
    const nx = (Math.random() - 0.5) * (vw * 0.6);
    const ny = (Math.random() - 0.5) * (vh * 0.4);
    setPos({ x: nx, y: ny });
    setMsg(msgs[attempts % msgs.length]);
    setTimeout(() => setMsg(""), 1200);
    if (attempts >= 5) { setVisible(false); }
  };
  if (!visible) return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      style={{ fontFamily: "var(--him-font-label)", fontSize: "0.75rem", fontWeight: 800, color: "rgba(245,158,11,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 20px" }}>
      Yeah… the "No" button left 😂
    </motion.div>
  );
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {msg && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: -32 }} exit={{ opacity: 0 }}
          style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--him-font-label)", fontSize: "0.7rem", fontWeight: 800, color: "#f59e0b", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: "0.08em" }}>
          {msg}
        </motion.div>
      )}
      <motion.button
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        onMouseEnter={handleMouse} onTouchStart={handleMouse}
        style={{ fontFamily: "var(--him-font-label)", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 12, padding: "13px 26px", cursor: "pointer", color: "rgba(148,163,184,0.35)" }}>
        Nah 🙄
      </motion.button>
    </div>
  );
}

type Screen = "loading" | "sealed" | "opening" | "reveal" | "burst";

export default function HimOpenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<HimLoveData | null>(null);
  const [error, setError] = useState("");
  const [screen, setScreen] = useState<Screen>("loading");
  const [msgDone, setMsgDone] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    readClient.fetch(HIM_LOVE_QUERY, { id })
      .then((d: HimLoveData) => { if (d) setData(d); else setError("Not found."); setScreen("sealed"); })
      .catch(() => { setError("Failed to load."); setScreen("sealed"); });
  }, [id]);

  const handleOpen = () => {
    setScreen("opening");
    setTimeout(() => setScreen("reveal"), 900);
  };

  const handleAccept = () => {
    setAccepted(true);
    setScreen("burst");
  };

  const spring = { type: "spring" as const, stiffness: 260, damping: 24 };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <MasculineBg />
      <FloatingEmbers />

      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <AnimatePresence mode="wait">

          {/* Loading */}
          {screen === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ fontSize: "2.5rem", display: "block", marginBottom: 16 }}>⚡</motion.div>
              <p style={{ fontFamily: "var(--him-font-label)", fontSize: "0.8rem", color: "rgba(96,165,250,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>Loading…</p>
            </motion.div>
          )}

          {/* Sealed — the envelope moment */}
          {screen === "sealed" && data && (
            <motion.div key="sealed"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>

              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.15)", border: "1px solid rgba(96,165,250,0.18)", borderRadius: 100, padding: "6px 18px", marginBottom: 26 }}>
                  <span style={{ fontSize: "0.8rem" }}>⚡</span>
                  <span style={{ fontFamily: "var(--him-font-label)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(96,165,250,0.6)", textTransform: "uppercase" }}>This was made for you</span>
                  <span style={{ fontSize: "0.8rem" }}>🔥</span>
                </div>
              </motion.div>

              {/* Envelope */}
              <motion.div
                initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, ...spring }}
                whileHover={{ scale: 1.06, rotate: 3 }}
                style={{ fontSize: "7rem", marginBottom: 20, cursor: "pointer", filter: "drop-shadow(0 12px 40px rgba(59,130,246,0.5))", animation: "him-float 3.5s ease-in-out infinite", display: "inline-block" }}
                onClick={handleOpen}>
                💌
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.8rem,6vw,2.8rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.1 }}>
                <span style={{ background: "linear-gradient(135deg,#f1f5f9,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{data.from} made this</span>
                <br />
                <span style={{ background: "linear-gradient(135deg,#60a5fa,#38bdf8,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>for you, {data.to} ⚡</span>
              </motion.h2>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                style={{ fontFamily: "var(--him-font-body)", fontSize: "0.9rem", color: "rgba(148,163,184,0.4)", fontStyle: "italic", marginBottom: 30 }}>
                Tap to open it.
              </motion.p>

              <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, ...spring }}
                whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.93 }}
                onClick={handleOpen}
                className="him-btn him-btn-blue" style={{ padding: "16px 40px", fontSize: "0.95rem" }}>
                ◆ Open It
              </motion.button>
            </motion.div>
          )}

          {/* Opening animation */}
          {screen === "opening" && (
            <motion.div key="opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} style={{ textAlign: "center" }}>
              <motion.div
                animate={{ scale: [1, 1.25, 0.9, 1.2, 0], rotate: [0, 10, -8, 5, 0], opacity: [1, 1, 1, 1, 0] }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
                style={{ fontSize: "6rem", filter: "drop-shadow(0 12px 40px rgba(59,130,246,0.7))" }}>
                💌
              </motion.div>
            </motion.div>
          )}

          {/* Reveal */}
          {screen === "reveal" && data && (
            <motion.div key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", maxWidth: 560 }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 0.95, 1] }} transition={{ duration: 0.7 }}
                  style={{ fontSize: "3.2rem", marginBottom: 12, filter: "drop-shadow(0 8px 24px rgba(59,130,246,0.5))" }}>💙</motion.div>
                <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.5rem,5vw,2rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>
                  <span style={{ background: "linear-gradient(135deg,#60a5fa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>From {data.from}</span>
                  <span style={{ color: "#ef4444" }}> ♥</span>
                  <span style={{ background: "linear-gradient(135deg,#f1f5f9,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> to {data.to}</span>
                </motion.h2>
                {data.date && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{ fontFamily: "var(--him-font-label)", fontSize: "0.65rem", fontWeight: 700, color: "rgba(245,158,11,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Together since {formatDate(data.date)}
                  </motion.p>
                )}
              </div>

              {/* Main message card */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
                className="him-card" style={{ padding: "28px 24px", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(96,165,250,0.45)", textTransform: "uppercase", marginBottom: 16 }}>◆ Her Message</div>
                <p style={{ fontFamily: "var(--him-font-body)", fontSize: "clamp(1rem,2.5vw,1.12rem)", color: "#f1f5f9", lineHeight: 1.8, fontStyle: "italic" }}>
                  <Typewriter text={data.message} speed={36} onDone={() => setMsgDone(true)} />
                </p>
              </motion.div>

              {/* Extra details — only after message typed */}
              <AnimatePresence>
                {msgDone && (
                  <motion.div key="details"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}>

                    <div style={{ display: "grid", gridTemplateColumns: data.memory && data.song ? "1fr 1fr" : "1fr", gap: 12, marginBottom: 16 }}>
                      {data.memory && (
                        <div className="him-card" style={{ padding: "18px 16px" }}>
                          <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(245,158,11,0.5)", textTransform: "uppercase", marginBottom: 10 }}>🌙 Our Memory</div>
                          <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.85rem", color: "rgba(241,245,249,0.65)", lineHeight: 1.65, fontStyle: "italic" }}>{data.memory}</p>
                        </div>
                      )}
                      {data.song && (
                        <div className="him-card" style={{ padding: "18px 16px" }}>
                          <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(245,158,11,0.5)", textTransform: "uppercase", marginBottom: 10 }}>🎵 Our Anthem</div>
                          <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.9rem", color: "rgba(241,245,249,0.7)", lineHeight: 1.6, fontStyle: "italic" }}>"{data.song}"</p>
                        </div>
                      )}
                    </div>

                    {/* Extra (challenge / vibe) */}
                    {data.extra && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="him-card" style={{ padding: "18px 16px", marginBottom: 16, borderColor: "rgba(96,165,250,0.12)" }}>
                        <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(96,165,250,0.45)", textTransform: "uppercase", marginBottom: 10 }}>⚡ The Layers</div>
                        {data.extra.split("\n").filter(Boolean).map((line, i) => (
                          <p key={i} style={{ fontFamily: "var(--him-font-body)", fontSize: "0.88rem", color: "rgba(241,245,249,0.6)", lineHeight: 1.65, fontStyle: "italic", marginBottom: 4 }}>{line}</p>
                        ))}
                      </motion.div>
                    )}

                    {/* Accept / Reject */}
                    {!accepted && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="him-card" style={{ padding: "24px 20px", textAlign: "center" }}>
                        <p style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.1rem,3vw,1.5rem)", fontWeight: 900, letterSpacing: "-0.01em", marginBottom: 6 }}>
                          <span style={{ background: "linear-gradient(135deg,#60a5fa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Are you hers, {data.to}?</span>
                        </p>
                        <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.82rem", color: "rgba(148,163,184,0.35)", fontStyle: "italic", marginBottom: 20 }}>
                          Choose wisely. 😏
                        </p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                          <motion.button className="him-btn him-btn-blue"
                            whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.9 }}
                            onClick={handleAccept}
                            style={{ padding: "14px 32px" }}>
                            ◆ Always 💙
                          </motion.button>
                          <StubborNoButton attempts={noAttempts} onAttempt={() => setNoAttempts(n => n + 1)} />
                        </div>
                      </motion.div>
                    )}

                    {accepted && (
                      <motion.div key="accepted"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="him-card"
                        style={{ padding: "24px 20px", textAlign: "center", borderColor: "rgba(96,165,250,0.2)", animation: "him-glow-pulse 2s ease-in-out infinite" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>💙⚡💙</div>
                        <p style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.3rem,4vw,1.8rem)", fontWeight: 900, letterSpacing: "-0.01em", marginBottom: 6 }}>
                          <span style={{ background: "linear-gradient(135deg,#60a5fa,#38bdf8,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>That's what she thought 🔥</span>
                        </p>
                        <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.88rem", color: "rgba(148,163,184,0.45)", fontStyle: "italic" }}>
                          She knew you'd say yes. She always knows. 🌙
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                style={{ textAlign: "center", fontFamily: "var(--him-font-body)", fontSize: "0.72rem", color: "rgba(148,163,184,0.15)", fontStyle: "italic", marginTop: 24 }}>
                Made with ⚡ on LoveYouAI
              </motion.p>
            </motion.div>
          )}

          {/* Burst */}
          {screen === "burst" && <ShieldBurst />}

        </AnimatePresence>
      </div>
    </div>
  );
}
