"use client";
import { use, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { readClient } from "@/lib/sanity";

const HIM_SORRY_QUERY = `*[_type == "himSorry" && _id == $id][0]{
  _id, to, from, apology, reasons, extra, comeback, forgiven, forgivenAt
}`;

interface HimSorryData {
  _id: string; to: string; from: string; apology: string;
  reasons?: string[]; extra?: string; comeback?: string;
  forgiven: boolean; forgivenAt?: string;
}

/* ─── Crimson Background ─────────────────────────────────────── */
function CrimsonBg() {
  const [sparks, setSparks] = useState<any[]>([]);
  useEffect(() => {
    setSparks(Array.from({ length: 20 }, (_, i) => ({
      id: i, left: `${(i * 47 + 3) % 100}%`, top: `${(i * 71 + 7) % 100}%`,
      size: 1 + (i % 3) * 0.7,
      color: ["#ef4444", "#f59e0b", "#dc2626", "#94a3b8", "#fbbf24"][i % 5],
      dur: 3 + (i % 4), delay: i * 0.4,
    })));
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse 80% 60% at 75% 5%, rgba(185,28,28,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 10% 90%, rgba(220,38,38,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 55%, rgba(245,158,11,0.07) 0%, transparent 60%), #0a0606" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="rg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ef4444" strokeWidth="0.6" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#rg)" />
      </svg>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
      {sparks.map(s => (
        <div key={s.id} style={{ position: "absolute", left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%", background: s.color, opacity: 0.28, animation: `him-spark ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* ─── Floating Embers (fire + apology emojis) ────────────────── */
function SorryEmbers() {
  const EMOJIS = ["🔥", "💔", "❤️‍🔥", "😤", "⚡", "💥", "😤", "🥺", "🤜", "🤛"];
  const [embers, setEmbers] = useState<any[]>([]);
  useEffect(() => {
    const make = (id: number) => ({
      id, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 90 + 5, size: 12 + Math.random() * 18,
      dur: 6 + Math.random() * 5, delay: Math.random() * 3,
      opacity: 0.35 + Math.random() * 0.4, rot: Math.random() * 50 - 25,
    });
    setEmbers(Array.from({ length: 22 }, (_, i) => make(i)));
    let counter = 22;
    const iv = setInterval(() => { setEmbers(prev => [...prev.slice(-28), make(counter++)]); }, 1800);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {embers.map(e => (
        <motion.div key={e.id}
          initial={{ y: "105vh", x: `${e.x}vw`, rotate: e.rot, opacity: 0, scale: 0.5 }}
          animate={{ y: "-15vh", rotate: e.rot + 30, opacity: [0, e.opacity, e.opacity, 0], scale: [0.5, 1, 1, 0.6] }}
          transition={{ duration: e.dur, delay: e.delay, ease: "easeOut" }}
          style={{ position: "absolute", bottom: 0, fontSize: e.size, filter: "drop-shadow(0 2px 8px rgba(239,68,68,0.5))" }}>
          {e.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Forgiveness Burst — masculine version ──────────────────── */
function ForgivenessBurst() {
  const EMOJIS = ["❤️‍🔥", "⚡", "💙", "🔥", "✨", "💛", "🥊", "💪", "🤝", "❤️"];
  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#38bdf8", "#60a5fa", "white", "#fbbf24", "#dc2626"];
  const particles = Array.from({ length: 64 }, (_, i) => ({
    id: i, emoji: EMOJIS[i % EMOJIS.length],
    angle: (i / 64) * 360,
    dist: 80 + Math.random() * 150,
    size: 14 + Math.random() * 20,
    dur: 0.65 + Math.random() * 0.75,
    delay: Math.random() * 0.35,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
      {[...Array(5)].map((_, burst) => (
        <div key={burst} style={{ position: "absolute", left: `${15 + burst * 16}%`, top: `${15 + (burst % 3) * 25}%` }}>
          {particles.map(p => (
            <motion.div key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.dist, y: Math.sin(p.angle * Math.PI / 180) * p.dist, scale: 1, opacity: 0 }}
              transition={{ duration: p.dur, delay: burst * 0.28 + p.delay, ease: "easeOut" }}
              style={{ position: "absolute", fontSize: p.size }}>{p.emoji}</motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────── */
function Typewriter({ text, speed = 40, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false); let i = 0;
    const iv = setInterval(() => {
      i++; setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{shown}{!done && <span style={{ animation: "blink-him 0.8s step-end infinite", color: "#ef4444" }}>|</span>}</span>;
}

/* ─── Stubborn No Button ─────────────────────────────────────── */
function StubbornNo({ attempts, onAttempt }: { attempts: number; onAttempt: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [msg, setMsg] = useState("");
  const msgs = ["Nope. 😤", "Too slow 💨", "Blocked 🚫", "Negative 🥊", "Error: No. 💀", "Jog on 🏃", "404: Nah 💀", "Keep trying 😂"];

  const dodge = () => {
    onAttempt();
    const vw = window.innerWidth; const vh = window.innerHeight;
    setPos({ x: (Math.random() - 0.5) * vw * 0.55, y: (Math.random() - 0.5) * vh * 0.38 });
    setMsg(msgs[attempts % msgs.length]);
    setTimeout(() => setMsg(""), 1100);
    if (attempts >= 5) setVisible(false);
  };

  if (!visible) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ fontFamily: "var(--him-font-label)", fontSize: "0.72rem", fontWeight: 800, color: "rgba(245,158,11,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 20px" }}>
      Yeah… "Nah" left the chat 💀
    </motion.div>
  );
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {msg && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: -30 }} exit={{ opacity: 0 }}
          style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--him-font-label)", fontSize: "0.68rem", fontWeight: 800, color: "#f59e0b", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: "0.08em" }}>
          {msg}
        </motion.div>
      )}
      <motion.button
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        onMouseEnter={dodge} onTouchStart={dodge}
        style={{ fontFamily: "var(--him-font-label)", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 12, padding: "13px 26px", cursor: "pointer", color: "rgba(148,163,184,0.3)" }}>
        Stay Mad 🙄
      </motion.button>
    </div>
  );
}

type Screen = "loading" | "sealed" | "opening" | "reveal" | "forgiven";

export default function HimSorryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<HimSorryData | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const [apologyDone, setApologyDone] = useState(false);
  const [reasonIdx, setReasonIdx] = useState(0);
  const [showForgiven, setShowForgiven] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [patching, setPatching] = useState(false);

  useEffect(() => {
    readClient.fetch(HIM_SORRY_QUERY, { id })
      .then((d: HimSorryData) => {
        if (d) { setData(d); if (d.forgiven) setShowForgiven(true); }
        setScreen("sealed");
      })
      .catch(() => setScreen("sealed"));
  }, [id]);

  // Reveal reasons one by one after apology typed
  useEffect(() => {
    if (!apologyDone || !data?.reasons?.length) return;
    if (reasonIdx >= (data.reasons?.length ?? 0)) return;
    const t = setTimeout(() => setReasonIdx(i => i + 1), 1100);
    return () => clearTimeout(t);
  }, [apologyDone, reasonIdx, data]);

  const handleOpen = () => {
    setScreen("opening");
    setTimeout(() => setScreen("reveal"), 900);
  };

  const handleForgive = async () => {
    setPatching(true);
    try {
      await fetch("/api/him/forgiven", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    } catch {}
    setPatching(false);
    setShowBurst(true);
    setTimeout(() => { setShowBurst(false); setShowForgiven(true); }, 2200);
  };

  const spring = { type: "spring" as const, stiffness: 260, damping: 24 };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <CrimsonBg />
      <SorryEmbers />
      {showBurst && <ForgivenessBurst />}

      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <AnimatePresence mode="wait">

          {screen === "loading" && (
            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔥</motion.div>
              <p style={{ fontFamily: "var(--him-font-label)", fontSize: "0.8rem", color: "rgba(239,68,68,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>Loading…</p>
            </motion.div>
          )}

          {screen === "sealed" && data && (
            <motion.div key="sealed"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>

              <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(185,28,28,0.15)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 100, padding: "6px 18px", marginBottom: 26 }}>
                  <span>🔥</span>
                  <span style={{ fontFamily: "var(--him-font-label)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(239,68,68,0.55)", textTransform: "uppercase" }}>She has something to say</span>
                  <span>⚡</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, ...spring }}
                whileHover={{ scale: 1.06, rotate: 4 }}
                style={{ fontSize: "7rem", marginBottom: 20, cursor: "pointer", filter: "drop-shadow(0 12px 40px rgba(239,68,68,0.55))", animation: "him-float 3.5s ease-in-out infinite", display: "inline-block" }}
                onClick={handleOpen}>
                🔥
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.8rem,6vw,2.8rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.1 }}>
                <span style={{ background: "linear-gradient(135deg,#ef4444,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{data.from} needs you</span>
                <br />
                <span style={{ background: "linear-gradient(135deg,#f1f5f9,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>to hear this, {data.to} ⚡</span>
              </motion.h2>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                style={{ fontFamily: "var(--him-font-body)", fontSize: "0.88rem", color: "rgba(148,163,184,0.38)", fontStyle: "italic", marginBottom: 30 }}>
                It took guts to send this. Open it.
              </motion.p>

              <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, ...spring }}
                whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.93 }}
                onClick={handleOpen}
                className="him-btn him-btn-red" style={{ padding: "16px 40px", fontSize: "0.95rem" }}>
                🔥 Open It
              </motion.button>
            </motion.div>
          )}

          {screen === "opening" && (
            <motion.div key="opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} style={{ textAlign: "center" }}>
              <motion.div
                animate={{ scale: [1, 1.3, 0.9, 1.2, 0], rotate: [0, 12, -8, 6, 0], opacity: [1, 1, 1, 1, 0] }}
                transition={{ duration: 0.85 }}
                style={{ fontSize: "6rem", filter: "drop-shadow(0 12px 40px rgba(239,68,68,0.7))" }}>
                🔥
              </motion.div>
            </motion.div>
          )}

          {screen === "reveal" && data && (
            <motion.div key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", maxWidth: 560 }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 0.9, 1] }} transition={{ duration: 0.7 }}
                  style={{ fontSize: "3rem", marginBottom: 12, filter: "drop-shadow(0 8px 24px rgba(239,68,68,0.5))" }}>❤️‍🔥</motion.div>
                <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.5rem,5vw,2rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 6, lineHeight: 1.1 }}>
                  <span style={{ background: "linear-gradient(135deg,#ef4444,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>From {data.from}</span>
                  <span style={{ color: "#ef4444" }}> ♥ </span>
                  <span style={{ background: "linear-gradient(135deg,#f1f5f9,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>to {data.to}</span>
                </motion.h2>
              </div>

              {/* Apology */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="him-card" style={{ padding: "28px 24px", marginBottom: 14, borderColor: "rgba(239,68,68,0.12)" }}>
                <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(239,68,68,0.45)", textTransform: "uppercase", marginBottom: 16 }}>🔥 The Apology</div>
                <p style={{ fontFamily: "var(--him-font-body)", fontSize: "clamp(1rem,2.5vw,1.1rem)", color: "#f1f5f9", lineHeight: 1.8, fontStyle: "italic" }}>
                  <Typewriter text={data.apology} speed={38} onDone={() => setApologyDone(true)} />
                </p>
              </motion.div>

              {/* Reasons drop in */}
              <AnimatePresence>
                {apologyDone && data.reasons && data.reasons.length > 0 && (
                  <motion.div key="reasons" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="him-card" style={{ padding: "22px 20px", marginBottom: 14, borderColor: "rgba(245,158,11,0.12)" }}>
                    <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(245,158,11,0.5)", textTransform: "uppercase", marginBottom: 14 }}>⚡ What I Got Wrong</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {data.reasons.slice(0, reasonIdx).map((r, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ color: "#ef4444", fontWeight: 900, fontSize: "0.9rem", flexShrink: 0, marginTop: 2 }}>◆</span>
                          <span style={{ fontFamily: "var(--him-font-body)", fontSize: "0.9rem", color: "rgba(241,245,249,0.65)", lineHeight: 1.65, fontStyle: "italic" }}>{r}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Promise (extra) */}
              <AnimatePresence>
                {apologyDone && data.extra && !showForgiven && (
                  <motion.div key="promise"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="him-card" style={{ padding: "22px 20px", marginBottom: 14, borderColor: "rgba(96,165,250,0.12)" }}>
                    <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(96,165,250,0.45)", textTransform: "uppercase", marginBottom: 12 }}>◆ My Promise</div>
                    <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.92rem", color: "rgba(241,245,249,0.62)", lineHeight: 1.75, fontStyle: "italic" }}>
                      {data.extra}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgiveness choice */}
              <AnimatePresence>
                {apologyDone && !showForgiven && (
                  <motion.div key="choice"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="him-card"
                    style={{ padding: "24px 20px", textAlign: "center", borderColor: "rgba(239,68,68,0.12)" }}>
                    <p style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.1rem,3vw,1.5rem)", fontWeight: 900, letterSpacing: "-0.01em", marginBottom: 6 }}>
                      <span style={{ background: "linear-gradient(135deg,#ef4444,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your call, {data.to}.</span>
                    </p>
                    <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.82rem", color: "rgba(148,163,184,0.35)", fontStyle: "italic", marginBottom: 22 }}>
                      The other button has somewhere to be. 😤
                    </p>
                    <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                      <motion.button className="him-btn him-btn-red"
                        whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.9 }}
                        onClick={handleForgive} disabled={patching}
                        style={{ padding: "14px 32px", opacity: patching ? 0.6 : 1 }}>
                        {patching ? "…" : "❤️‍🔥 We Good"}
                      </motion.button>
                      <StubbornNo attempts={noAttempts} onAttempt={() => setNoAttempts(n => n + 1)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgiven state */}
              <AnimatePresence>
                {showForgiven && (
                  <motion.div key="forgiven"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="him-card"
                    style={{ padding: "28px 24px", textAlign: "center", borderColor: "rgba(239,68,68,0.25)", animation: "him-glow-pulse-red 2.5s ease-in-out infinite" }}>
                    <div style={{ fontSize: "2.8rem", marginBottom: 14 }}>❤️‍🔥⚡❤️‍🔥</div>
                    <h3 style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.4rem,4vw,1.9rem)", fontWeight: 900, letterSpacing: "-0.01em", marginBottom: 10 }}>
                      <span style={{ background: "linear-gradient(135deg,#ef4444,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>We're back. 🔥</span>
                    </h3>
                    {data.comeback && (
                      <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.95rem", color: "rgba(241,245,249,0.6)", fontStyle: "italic", lineHeight: 1.7, marginBottom: 14 }}>
                        {data.comeback}
                      </p>
                    )}
                    <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.8rem", color: "rgba(148,163,184,0.3)", fontStyle: "italic" }}>
                      That's all she needed — and all it took. 🌙
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
                style={{ textAlign: "center", fontFamily: "var(--him-font-body)", fontSize: "0.7rem", color: "rgba(148,163,184,0.14)", fontStyle: "italic", marginTop: 24 }}>
                Made with 🔥 on LoveYouAI
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
