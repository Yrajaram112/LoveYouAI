"use client";
import { use, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { readClient, LOVE_QUERY } from "@/lib/sanity";
import { BRAND_IMG } from "@/lib/branding";

interface LoveData {
  _id: string; to: string; from: string; message: string;
  memory: string; date: string; song: string; createdAt: string;
  photo?: { asset?: { url: string } };
}

/* ─── Blob Background ────────────────────────────────────────────── */
function BlobBg() {
  return (
    <div className="mesh-bg" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "0%", left: "-15%", width: "65vw", height: "65vw", borderRadius: "50%", background: "rgba(255,77,126,0.16)", filter: "blur(90px)", animation: "blob-drift 16s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "-15%", width: "60vw", height: "60vw", borderRadius: "50%", background: "rgba(199,125,255,0.14)", filter: "blur(90px)", animation: "blob-drift 13s ease-in-out 3s infinite alternate-reverse" }} />
      <div style={{ position: "absolute", top: "45%", left: "30%", width: "40vw", height: "40vw", borderRadius: "50%", background: "rgba(255,179,71,0.09)", filter: "blur(70px)", animation: "blob-drift 20s ease-in-out 6s infinite alternate" }} />
      {Array.from({ length: 28 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: `${(i * 41 + 5) % 100}%`, top: `${(i * 67 + 9) % 100}%`, width: `${1.2 + (i % 3) * 0.9}px`, height: `${1.2 + (i % 3) * 0.9}px`, borderRadius: "50%", background: ["#FF85A2", "#FFB347", "#C77DFF", "white", "#FFD6E0"][i % 5], opacity: 0.4, animation: `twinkle ${2.5 + (i % 5)}s ease-in-out ${i * 0.3}s infinite` }} />
      ))}
    </div>
  );
}

/* ─── Ambient Flowers — always floating, random positions ─────────── */
function AmbientFlowers() {
  const [flowers, setFlowers] = useState<any[]>([]);
  useEffect(() => {
    const EMOJIS = ["🌸", "🌹", "🌺", "🌼", "💐", "🪷", "🌷", "🌻"];
    // Initial batch
    const make = (id: number) => ({
      id, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 90 + 5,
      size: 18 + Math.random() * 28,
      dur: 5 + Math.random() * 6,
      delay: Math.random() * 4,
      opacity: 0.55 + Math.random() * 0.45,
      rot: Math.random() * 60 - 30,
    });
    setFlowers(Array.from({ length: 28 }, (_, i) => make(i)));

    // Spawn a new flower at a random spot every ~1.2s
    let counter = 28;
    const iv = setInterval(() => {
      const newFlower = make(counter++);
      setFlowers(prev => [...prev.slice(-35), newFlower]);
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {flowers.map(f => (
        <motion.div key={f.id}
          initial={{ y: "105vh", x: `${f.x}vw`, rotate: f.rot, opacity: 0, scale: 0.4 }}
          animate={{ y: "-15vh", rotate: f.rot + 40, opacity: [0, f.opacity, f.opacity, 0], scale: [0.4, 1, 1, 0.6] }}
          transition={{ duration: f.dur, delay: f.delay, ease: "easeOut" }}
          style={{ position: "absolute", bottom: 0, fontSize: f.size, filter: "drop-shadow(0 2px 8px rgba(255,77,126,0.3))" }}>
          {f.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Mega Fireworks — dense, repeated bursts ────────────────────── */
function MegaFireworks() {
  const EMOJIS = ["🌸", "🌹", "🌺", "🌼", "🪷", "🌷", "💐", "✨", "💕", "🩷", "💖", "⭐", "🌟"];
  const colors = ["#FF85A2", "#FFB347", "#C77DFF", "#4ECDC4", "#FFD166", "#FF6FA3", "#FF4D7E", "white", "#FFC2D4"];

  // Multiple waves of bursts at different times
  const waves = [0, 0.4, 0.8, 1.4, 1.9, 2.5, 3.1];
  const burstPositions = [
    { x: "15%", y: "20%" }, { x: "50%", y: "15%" }, { x: "80%", y: "25%" },
    { x: "25%", y: "55%" }, { x: "70%", y: "50%" }, { x: "10%", y: "70%" },
    { x: "88%", y: "65%" }, { x: "45%", y: "40%" }, { x: "60%", y: "75%" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10, overflow: "hidden" }}>
      {waves.map((waveDelay, w) =>
        burstPositions.map((pos, b) => {
          // Each burst: mix of emoji petals + glowing dots
          const emojiCount = 12;
          const dotCount = 20;
          return (
            <div key={`w${w}b${b}`} style={{ position: "absolute", left: pos.x, top: pos.y }}>
              {/* Emoji petals */}
              {Array.from({ length: emojiCount }, (_, i) => {
                const angle = (i / emojiCount) * 360 + b * 15;
                const dist = 70 + Math.random() * 90;
                const emoji = EMOJIS[(i + b + w) % EMOJIS.length];
                return (
                  <motion.div key={`e${i}`}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                    animate={{ x: Math.cos(angle * Math.PI / 180) * dist, y: Math.sin(angle * Math.PI / 180) * dist, scale: [0, 1.2, 0.8, 0], opacity: [0, 1, 1, 0], rotate: 360 }}
                    transition={{ duration: 1.4, delay: waveDelay + b * 0.12, ease: "easeOut" }}
                    style={{ position: "absolute", fontSize: 16 + (i % 3) * 6 }}>
                    {emoji}
                  </motion.div>
                );
              })}
              {/* Glowing dots */}
              {Array.from({ length: dotCount }, (_, i) => {
                const angle = (i / dotCount) * 360;
                const dist = 40 + Math.random() * 130;
                const color = colors[(i + b) % colors.length];
                return (
                  <motion.div key={`d${i}`}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: Math.cos(angle * Math.PI / 180) * dist, y: Math.sin(angle * Math.PI / 180) * dist, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.9 + Math.random() * 0.5, delay: waveDelay + b * 0.12, ease: "easeOut" }}
                    style={{ position: "absolute", width: 5 + (i % 3) * 3, height: 5 + (i % 3) * 3, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ─── Scroll hint — mobile-friendly pulsing indicator ───────────── */
function ScrollHint({ label = "More below" }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 32 }}>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontFamily: "var(--font-round)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,133,162,0.55)", margin: 0 }}>
        {label}
      </motion.p>
      <motion.div
        animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(255,133,162,0.35)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,77,126,0.08)" }}>
        <span style={{ fontSize: "1rem" }}>↓</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Music notes ────────────────────────────────────────────────── */
function MusicNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  useEffect(() => {
    setNotes(Array.from({ length: 12 }, (_, i) => ({
      id: i, note: ["♪", "♫", "♩", "♬", "𝄞"][i % 5],
      x: 5 + Math.random() * 85, dur: 3 + Math.random() * 3,
      delay: Math.random() * 4, size: 16 + Math.random() * 20,
    })));
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {notes.map(n => (
        <div key={n.id} style={{ position: "absolute", left: `${n.x}%`, bottom: 0, fontSize: n.size, color: "#FFB347", opacity: 0, animation: `music-float ${n.dur}s ease-out ${n.delay}s infinite` }}>{n.note}</div>
      ))}
    </div>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────────── */
function Typewriter({ text, speed = 36, onDone }: { text: string; speed?: number; onDone?: () => void }) {
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
  }, [text]);
  return <span>{shown}{!done && <span style={{ animation: "blink 0.8s step-end infinite", color: "#FF85A2" }}>|</span>}</span>;
}

/* ─── Days Counter ───────────────────────────────────────────────── */
function DaysCounter({ dateStr }: { dateStr: string }) {
  const [count, setCount] = useState(0);
  const target = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)));
  useEffect(() => {
    let c = 0; const step = Math.max(1, Math.ceil(target / 80));
    const iv = setInterval(() => { c = Math.min(c + step, target); setCount(c); if (c >= target) clearInterval(iv); }, 16);
    return () => clearInterval(iv);
  }, [target]);
  const y = Math.floor(target / 365), m = Math.floor((target % 365) / 30), d = target % 30;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(3.5rem,18vw,8rem)", lineHeight: 1, color: "#FF85A2", textShadow: "0 0 40px rgba(255,107,163,0.5), 0 0 80px rgba(255,107,163,0.25)", animation: count < target ? "counter-flash 0.3s ease-in-out infinite" : "none" }}>{count.toLocaleString()}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginTop: 10 }}>days of loving you</div>
      {y > 0 && (
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          {[{ v: y, l: "years" }, { v: m, l: "months" }, { v: d, l: "days" }].map(x => (
            <div key={x.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-fun)", fontSize: "2rem", color: "#FFB347" }}>{x.v}</div>
              <div style={{ fontFamily: "var(--font-round)", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{x.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Section reveal ────────────────────────────────────────────── */
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 60, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── Petal burst on envelope open ──────────────────────────────── */
function PetalBurst({ show }: { show: boolean }) {
  const [petals] = useState(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    emoji: ["🌸", "🌹", "🌺", "🌼", "🪷", "🌷", "✨", "💕", "💫", "⭐"][i % 10],
    tx: (Math.random() - 0.5) * 380,
    ty: -(80 + Math.random() * 280),
    rot: Math.random() * 720 - 360,
    size: 14 + Math.random() * 26,
    dur: 0.8 + Math.random() * 1.1,
  })));
  if (!show) return null;
  return (
    <div style={{ position: "absolute", top: "50%", left: "50%", pointerEvents: "none", zIndex: 20 }}>
      {petals.map(p => (
        <motion.div key={p.id}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.tx, y: p.ty, scale: [0, 1.3, 0.9, 0], rotate: p.rot, opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.dur, ease: "easeOut" }}
          style={{ position: "absolute", fontSize: p.size, transform: "translate(-50%,-50%)" }}>
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────── */
export default function OpenStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<LoveData | null>(null);
  const [error, setError] = useState(false);
  const [scene, setScene] = useState<"loading" | "greeting" | "envelope" | "letter" | "journey">("loading");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [petals, setPetals] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [letterDone, setLetterDone] = useState(false);
  const [envelopeReady, setEnvelopeReady] = useState(false);

  useEffect(() => {
    readClient.fetch(LOVE_QUERY, { id }).then(d => {
      if (!d) { setError(true); return; }
      setData(d);
      setTimeout(() => setScene("greeting"), 800);
    }).catch(() => setError(true));
  }, [id]);

  const openEnvelope = () => {
    if (!envelopeReady) return;
    setEnvelopeOpen(true);
    setPetals(true);
    // Longer stay: 5s before transitioning to letter
    setTimeout(() => setPetals(false), 4000);
    setTimeout(() => setScene("letter"), 5000);
  };

  // Envelope becomes tappable after animation settles
  useEffect(() => {
    if (scene === "envelope") {
      setTimeout(() => setEnvelopeReady(true), 1600);
    }
  }, [scene]);

  useEffect(() => {
    if (letterDone) {
      setTimeout(() => setScene("journey"), 900);
      setTimeout(() => setFireworks(true), 1100);
      setTimeout(() => setFireworks(false), 5500); // longer fireworks
    }
  }, [letterDone]);

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontFamily: "var(--font-round)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,133,162,0.5)", marginBottom: 32, textAlign: "center" }}>
      ✦ {children} ✦
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
      <BlobBg />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 16, animation: "float-bob 2s ease-in-out infinite" }}>💔</div>
        <h2 style={{ fontFamily: "var(--font-fun)", fontSize: "1.4rem", color: "#FF85A2", marginBottom: 12 }}>Link lost in space…</h2>
        <p style={{ fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>Ask him to send you a new one.</p>
      </div>
    </div>
  );

  if (!data || scene === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <BlobBg />
      <motion.div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ fontSize: "2.8rem", marginBottom: 16 }}>💫</motion.div>
        <p style={{ fontFamily: "var(--font-fun)", fontSize: "1rem", color: "rgba(255,133,162,0.6)" }}>Opening your universe…</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <BlobBg />

      {/* Flowers float on all screens */}
      <AmbientFlowers />

      {fireworks && <MegaFireworks />}

      <AnimatePresence mode="wait">

        {/* ── GREETING ── */}
        {scene === "greeting" && (
          <motion.div key="greeting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px 100px", position: "relative", zIndex: 2 }}>

            <motion.img initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
              src={BRAND_IMG.loveLetter} alt=""
              style={{ height: 52, width: "auto", marginBottom: 32, objectFit: "contain", filter: "drop-shadow(0 6px 20px rgba(255,77,126,0.35))", animation: "float-bob 3s ease-in-out infinite" }} />

            {/* Name with rings */}
            <div style={{ position: "relative", marginBottom: 36 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 180, height: 180, borderRadius: "50%", border: `2px solid rgba(255,133,162,${0.22 - i * 0.06})`, animation: `ring-pulse 2.5s ease-out ${i * 0.6}s infinite` }} />
              ))}
              <motion.div initial={{ scale: 0, rotate: -18 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
                <div style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(3rem,14vw,6rem)", color: "#FF85A2", position: "relative", zIndex: 1, textShadow: "0 0 40px rgba(255,133,162,0.5), 0 4px 20px rgba(255,77,126,0.3)", lineHeight: 1.1 }}>{data.to}</div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.9 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,3.5vw,1.3rem)", color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginBottom: 10 }}>Someone rearranged the stars just for you tonight.</p>
              <p style={{ fontFamily: "var(--font-round)", fontSize: "0.76rem", fontWeight: 700, color: "rgba(255,133,162,0.55)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 44 }}>— from {data.from}, with all his heart —</p>
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.7 }}
              className="sqbtn sqbtn-rose"
              onClick={() => setScene("envelope")}
              style={{ animation: "jelly-pulse 2.5s ease-in-out 2.5s infinite", fontSize: "1.05rem", padding: "20px 48px" }}>
              Open Your Letter 💌
            </motion.button>

            {/* Scroll hint */}
            <ScrollHint label="Swipe up to begin" />
          </motion.div>
        )}

        {/* ── ENVELOPE ── */}
        {scene === "envelope" && (
          <motion.div key="envelope" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px 100px", position: "relative", zIndex: 2 }}>

            <motion.p initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginBottom: 16 }}>
              He wrote you something…
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ fontFamily: "var(--font-round)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,133,162,0.45)", marginBottom: 52 }}>
              with all of his heart 🌹
            </motion.p>

            {/* Envelope */}
            <div style={{ position: "relative", cursor: envelopeReady ? "pointer" : "default" }} onClick={openEnvelope}>
              <PetalBurst show={petals} />
              <motion.div
                initial={{ y: -80, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                whileHover={envelopeReady ? { scale: 1.06, rotate: 2, y: -6 } : {}}
                whileTap={envelopeReady ? { scale: 0.97 } : {}}>
                {/* Envelope glow ring */}
                {envelopeReady && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: "absolute", inset: -20, borderRadius: 30, background: "radial-gradient(ellipse, rgba(255,77,126,0.2), transparent 70%)", pointerEvents: "none" }} />
                )}
                <div style={{ width: "min(300px, 80vw)", height: "min(198px, 53vw)", position: "relative", filter: "drop-shadow(0 24px 60px rgba(255,77,126,0.35))" }}>
                  {/* Envelope body */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(255,107,163,0.3), rgba(199,125,255,0.22))", border: "1.5px solid rgba(255,133,162,0.4)", borderRadius: 20, backdropFilter: "blur(20px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)" }} />
                  {/* Top flap */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", overflow: "hidden" }}>
                    <motion.div
                      animate={envelopeOpen ? { rotateX: -180 } : { rotateX: 0 }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200%", background: "linear-gradient(145deg, rgba(255,85,150,0.38), rgba(199,125,255,0.3))", border: "1px solid rgba(255,133,162,0.35)", clipPath: "polygon(0 0,100% 0,50% 100%)", transformOrigin: "top center" }} />
                  </div>
                  {/* Bottom V */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", overflow: "hidden" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200%", background: "linear-gradient(to bottom, rgba(199,125,255,0.22), rgba(255,77,126,0.22))", clipPath: "polygon(0 100%,100% 100%,50% 0)" }} />
                  </div>
                  {/* Wax seal */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(145deg, #FF6FA3, #FF4D7E, #E03269)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 6px 24px rgba(255,77,126,0.6), inset 0 2px 0 rgba(255,255,255,0.3)", zIndex: 2 }}>
                    💌
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Tap hint — pulses and bounces */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
              style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              {!envelopeOpen && (
                <>
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{ fontFamily: "var(--font-round)", fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.18em", color: "rgba(255,133,162,0.7)", textTransform: "uppercase", margin: 0 }}>
                    👆 Tap to open
                  </motion.p>
                  <motion.div
                    animate={{ y: [0, 9, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(255,133,162,0.4)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,77,126,0.1)" }}>
                      <span style={{ fontSize: "1.1rem" }}>↓</span>
                    </div>
                  </motion.div>
                </>
              )}
              {envelopeOpen && (
                <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ fontFamily: "var(--font-fun)", fontSize: "1.1rem", color: "#FF85A2" }}>
                  Opening… 🌸✨
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ── LETTER ── */}
        {scene === "letter" && (
          <motion.div key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 100px", position: "relative", zIndex: 2 }}>
            <div style={{ maxWidth: 580, width: "100%" }}>
              <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2, duration: 1 }}>
                <div className="jelly-card" style={{ padding: "clamp(28px,6vw,48px) clamp(20px,5vw,36px)" }}>
                  <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <div style={{ fontFamily: "var(--font-round)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,133,162,0.45)", marginBottom: 14 }}>A Letter From the Stars</div>
                    <div style={{ width: 56, height: 3, background: "linear-gradient(90deg, #FF4D7E, #C77DFF)", borderRadius: 3, margin: "0 auto" }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-fun)", fontSize: "1rem", color: "rgba(255,133,162,0.85)", marginBottom: 20 }}>My dearest {data.to},</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,2.8vw,1.22rem)", lineHeight: 1.95, color: "rgba(255,249,245,0.86)", letterSpacing: "0.01em" }}>
                    <Typewriter text={data.message} speed={32} onDone={() => setTimeout(() => setLetterDone(true), 900)} />
                  </div>
                  {letterDone && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
                      style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,133,162,0.12)", textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,133,162,0.7)" }}>Forever yours,</div>
                      <div style={{ fontFamily: "var(--font-fun)", fontSize: "1.6rem", color: "#FF85A2", textShadow: "0 0 20px rgba(255,133,162,0.4)" }}>{data.from} ♥</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              {letterDone && <ScrollHint label="There's more below" />}
            </div>
          </motion.div>
        )}

        {/* ── JOURNEY ── */}
        {scene === "journey" && (
          <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} style={{ position: "relative", zIndex: 2 }}>

            {/* Days Counter */}
            {data.date && (
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px", textAlign: "center" }}>
                <Section>
                  <SectionLabel>Our Journey</SectionLabel>
                  <DaysCounter dateStr={data.date} />
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                    style={{ marginTop: 32, fontFamily: "var(--font-display)", fontSize: "1rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>and counting, forever ✨</motion.div>
                  <div style={{ marginTop: 24 }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.span key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, delay: i * 0.22, repeat: Infinity }}
                        style={{ display: "inline-block", margin: "0 6px", fontSize: "1.5rem" }}>🩷</motion.span>
                    ))}
                  </div>
                  <ScrollHint label="Keep scrolling" />
                </Section>
              </div>
            )}

            {/* Memory */}
            {data.memory && (
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px" }}>
                <Section delay={0.15}>
                  <div style={{ maxWidth: 560, textAlign: "center" }}>
                    <SectionLabel>Our Memory</SectionLabel>
                    <div className="jelly-card" style={{ padding: "clamp(28px,6vw,48px) clamp(20px,5vw,40px)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 14, left: 18, fontFamily: "var(--font-fun)", fontSize: "5rem", color: "rgba(255,133,162,0.07)", lineHeight: 1, userSelect: "none" }}>"</div>
                      <div style={{ position: "absolute", bottom: 4, right: 18, fontFamily: "var(--font-fun)", fontSize: "5rem", color: "rgba(255,133,162,0.07)", lineHeight: 1, userSelect: "none", transform: "rotate(180deg)" }}>"</div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,3vw,1.3rem)", lineHeight: 1.9, color: "rgba(255,249,245,0.82)", fontStyle: "italic", position: "relative", zIndex: 1 }}>{data.memory}</p>
                      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 12 }}>
                        {["🌸", "🌹", "🌺", "🌸"].map((e, i) => (
                          <motion.span key={i} animate={{ y: [0, -6, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                            style={{ fontSize: "1.3rem", display: "inline-block" }}>{e}</motion.span>
                        ))}
                      </div>
                    </div>
                    <ScrollHint label="One more thing" />
                  </div>
                </Section>
              </div>
            )}

            {/* Photo */}
            {data.photo?.asset?.url && (
              <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px" }}>
                <Section delay={0.1}>
                  <div style={{ textAlign: "center" }}>
                    <SectionLabel>Us</SectionLabel>
                    <motion.div whileHover={{ rotate: 0, scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.4 }}
                      style={{ display: "inline-block", background: "white", padding: "12px 12px 44px", boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)", transform: "rotate(-3deg)", borderRadius: 4 }}>
                      <img src={data.photo.asset.url} alt="Us" style={{ display: "block", width: "min(260px,70vw)", height: "min(260px,70vw)", objectFit: "cover" }} />
                      <div style={{ textAlign: "center", marginTop: 12, fontFamily: "var(--font-fun)", fontSize: "0.95rem", color: "#444" }}>{data.from} ♥ {data.to}</div>
                    </motion.div>
                    <ScrollHint label="Our song is waiting" />
                  </div>
                </Section>
              </div>
            )}

            {/* Song */}
            {data.song && (
              <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px" }}>
                <Section>
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <SectionLabel>Our Song</SectionLabel>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <MusicNotes />
                      <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }}
                        className="jelly-card" style={{ padding: "clamp(32px,6vw,48px) clamp(36px,10vw,72px)", position: "relative", zIndex: 1 }}>
                        <div style={{ fontSize: "2.8rem", marginBottom: 16 }}>🎵</div>
                        <div style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1.3rem,5vw,2rem)", color: "#FFB347", textShadow: "0 0 20px rgba(255,179,71,0.4)", marginBottom: 10 }}>{data.song}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>every note reminds me of you</div>
                      </motion.div>
                    </div>
                    <ScrollHint label="The finale awaits" />
                  </div>
                </Section>
              </div>
            )}

            {/* Grand Finale */}
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
              <Section>
                <div style={{ maxWidth: 540 }}>
                  {/* Flower garland */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    style={{ fontSize: "clamp(1.4rem,4vw,2rem)", marginBottom: 20, letterSpacing: "0.1em" }}>
                    🌸🌹🌺🌼🪷🌷🌻🌸
                  </motion.div>

                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "4.5rem", marginBottom: 24, display: "block", filter: "drop-shadow(0 8px 24px rgba(255,77,126,0.5))" }}>💕</motion.div>

                  <h2 style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1.8rem,7vw,3.2rem)", color: "#FF85A2", marginBottom: 20, textShadow: "0 0 40px rgba(255,133,162,0.45)" }}>You Are My Universe</h2>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,2.8vw,1.22rem)", color: "rgba(255,255,255,0.5)", fontStyle: "italic", lineHeight: 1.95, marginBottom: 44 }}>
                    In a cosmos of a billion stars,<br />every single one of them points to you.
                  </p>

                  {/* Animated flower row */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
                    {["🌸", "💫", "🌹", "💕", "🌺", "💫", "🌸"].map((e, i) => (
                      <motion.span key={i} animate={{ y: [0, -14, 0], rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
                        style={{ fontSize: "clamp(1.5rem,4vw,2.2rem)", display: "inline-block" }}>{e}</motion.span>
                    ))}
                  </div>

                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem,3vw,1.4rem)", fontStyle: "italic", color: "rgba(255,133,162,0.65)", marginBottom: 8 }}>Made just for you,</div>
                  <div style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1rem,3vw,1.2rem)", color: "rgba(255,255,255,0.45)" }}>— {data.from} —</div>

                  <div style={{ marginTop: 60, paddingTop: 36, borderTop: "1px solid rgba(255,133,162,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <img src={BRAND_IMG.logo} alt="LoveYouAI" style={{ height: 34, width: "auto", opacity: 0.6, objectFit: "contain" }} />
                    <p style={{ fontFamily: "var(--font-round)", fontSize: "0.58rem", fontWeight: 700, color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em" }}>LOVEYOUAI · built with love · no distance too far</p>
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