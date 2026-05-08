"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND_IMG } from "@/lib/branding";

interface SorryData { to: string; from: string; apology: string; reasons: string[]; extra: string; }

/* ─── Background ─────────────────────────────────────────────────── */
function PinkBg() {
  return (
    <div className="mesh-bg-pink" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "-10%", left: "-15%", width: "70vw", height: "70vw", borderRadius: "50%", background: "rgba(255,77,126,0.2)", filter: "blur(90px)", animation: "blob-drift 14s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", bottom: "0%", right: "-15%", width: "65vw", height: "65vw", borderRadius: "50%", background: "rgba(255,107,163,0.16)", filter: "blur(90px)", animation: "blob-drift 11s ease-in-out 2s infinite alternate-reverse" }} />
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: `${(i * 47 + 3) % 100}%`, top: `${(i * 71 + 7) % 100}%`, width: `${1 + (i % 3) * 0.8}px`, height: `${1 + (i % 3) * 0.8}px`, borderRadius: "50%", background: ["#FF85A2", "#FF6FA3", "#FFB3D4"][i % 3], opacity: 0.3, animation: `twinkle ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <div key={`k${i}`} style={{ position: "absolute", left: `${(i * 39 + 8) % 100}%`, bottom: "-50px", fontSize: 14 + (i % 3) * 6, opacity: 0.06 + (i % 3) * 0.03, animation: `float-up-emoji ${7 + (i % 4) * 2}s ease-in ${i * 0.9}s infinite` }}>
          {["💋", "💗", "🌸", "💕", "✨", "🩷"][i % 6]}
        </div>
      ))}
    </div>
  );
}

/* ─── Forgiveness burst ─────────────────────────────────────────── */
function ForgivenessBurst() {
  const emojis = ["💋", "💗", "💖", "🌸", "✨", "🩷", "💕", "😘"];
  const particles = Array.from({ length: 64 }, (_, i) => ({
    id: i, emoji: emojis[i % emojis.length], angle: (i / 64) * 360,
    dist: 80 + Math.random() * 160, size: 16 + Math.random() * 20,
    dur: 0.7 + Math.random() * 0.8, delay: Math.random() * 0.4,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
      {[...Array(5)].map((_, burst) => (
        <div key={burst} style={{ position: "absolute", left: `${14 + burst * 16}%`, top: `${14 + (burst % 3) * 22}%` }}>
          {particles.map(p => (
            <motion.div key={p.id} initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.dist, y: Math.sin(p.angle * Math.PI / 180) * p.dist, scale: 1, opacity: 0 }}
              transition={{ duration: p.dur, delay: burst * 0.25 + p.delay, ease: "easeOut" }}
              style={{ position: "absolute", fontSize: p.size }}>{p.emoji}</motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────────── */
function Typewriter({ text, speed = 36, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState(""); const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false); let i = 0;
    const iv = setInterval(() => { i++; setShown(text.slice(0, i)); if (i >= text.length) { clearInterval(iv); setDone(true); onDone?.(); } }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{shown}{!done && <span style={{ animation: "blink 0.8s step-end infinite", color: "#FF6FA3" }}>|</span>}</span>;
}

/* ─── Evil No ────────────────────────────────────────────────────── */
function EvilNoButton({ attempts, onAttempt }: { attempts: number; onAttempt: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  const msgs = ["Nope! 😜", "Too slow! 💨", "Nice try 😇", "The audacity 😂", "Not today! 🏃", "lol bye 💅"];
  useEffect(() => { if (attempts >= 5) setVisible(false); }, [attempts]);
  const flee = useCallback(() => {
    onAttempt();
    setMessage(msgs[attempts % msgs.length]);
    setTimeout(() => setMessage(""), 900);
    setPos({ x: (Math.random() - 0.5) * 250, y: (Math.random() - 0.5) * 180 });
  }, [attempts, onAttempt]);
  const scale = Math.max(0.35, 1 - attempts * 0.13);
  const opacity = Math.max(0.2, 1 - attempts * 0.16);
  if (!visible) return null;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.div animate={{ x: pos.x, y: pos.y }} transition={{ type: "spring", stiffness: 380, damping: 18 }}
        style={{ position: "relative" }} onMouseEnter={flee} onTouchStart={flee}>
        <button onClick={flee} className="sqbtn sqbtn-ghost"
          style={{ transform: `scale(${scale}) rotate(${attempts * 9}deg)`, opacity, fontSize: `${0.88 * scale}rem`, padding: `${13 * scale}px ${24 * scale}px` }}>
          No 😤
        </button>
      </motion.div>
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 0, scale: 0.5 }} animate={{ opacity: 1, y: -44, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: "var(--font-fun)", fontSize: "1rem", color: "#FF85A2", pointerEvents: "none" }}>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mascot ─────────────────────────────────────────────────────── */
function Mascot({ mood }: { mood: "sad" | "hopeful" | "happy" }) {
  const faces = { sad: "🥺", hopeful: "😢", happy: "😍" };
  return (
    <motion.div animate={{ y: [0, -18, 0], rotate: mood === "happy" ? [0, -12, 12, 0] : [0, -4, 4, 0] }}
      transition={{ duration: mood === "happy" ? 0.45 : 1.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ fontSize: "clamp(4rem,15vw,7rem)", display: "block", filter: "drop-shadow(0 0 24px rgba(255,100,180,0.5))" }}>
      {faces[mood]}
    </motion.div>
  );
}

/* ─── Inner page ─────────────────────────────────────────────────── */
function SorryPageInner() {
  const params = useSearchParams();
  const [data, setData] = useState<SorryData | null>(null);
  const [error, setError] = useState(false);
  const [scene, setScene] = useState<"loading" | "apology" | "question" | "forgiven">("loading");
  const [noAttempts, setNoAttempts] = useState(0);
  const [apologyDone, setApologyDone] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    const d = params.get("d");
    if (!d) { setError(true); return; }
    try { const parsed = JSON.parse(decodeURIComponent(atob(d))); setData(parsed); setTimeout(() => setScene("apology"), 600); }
    catch { setError(true); }
  }, [params]);

  const handleForgiven = () => {
    setScene("forgiven"); setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 3500);
  };

  const noGone = noAttempts >= 5;
  const yesScale = Math.min(1.5, 1 + noAttempts * 0.1);

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
      <PinkBg />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 16, animation: "float-bob 2s ease-in-out infinite" }}>💔</div>
        <h2 style={{ fontFamily: "var(--font-fun)", fontSize: "1.4rem", color: "#FF85A2", marginBottom: 12 }}>This link seems broken…</h2>
        <p style={{ fontFamily: "var(--font-display)", color: "rgba(255,200,220,0.55)", fontStyle: "italic" }}>Ask him to send a new one.</p>
      </div>
    </div>
  );

  if (!data || scene === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PinkBg />
      <motion.div style={{ position: "relative", zIndex: 2 }}>
        <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <span style={{ fontSize: "3rem" }}>💗</span>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <PinkBg />
      {showFireworks && <ForgivenessBurst />}
      <AnimatePresence mode="wait">

        {/* ── APOLOGY ── */}
        {scene === "apology" && (
          <motion.div key="apology" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px", position: "relative", zIndex: 2 }}>

            <motion.img initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
              src={BRAND_IMG.sorry} alt=""
              style={{ height: 52, width: "auto", marginBottom: 16, objectFit: "contain", filter: "drop-shadow(0 6px 20px rgba(255,77,126,0.4))", animation: "float-bob 3s ease-in-out infinite" }} />
            <Mascot mood="sad" />

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ marginTop: 24, marginBottom: 8 }}>
              <div style={{ fontFamily: "var(--font-round)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,162,196,0.55)", marginBottom: 8 }}>a message for</div>
              <div style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(2.4rem,9vw,4.5rem)", color: "#FF85A2", textShadow: "0 0 32px rgba(255,107,163,0.5)", lineHeight: 1.1 }}>{data.to} 💗</div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
              style={{ maxWidth: 520, width: "100%", margin: "24px auto 0" }}>
              <div className="jelly-card" style={{ padding: "32px 26px", borderColor: "rgba(255,107,163,0.18)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,2.6vw,1.2rem)", lineHeight: 1.95, color: "rgba(255,230,240,0.88)", fontStyle: "italic" }}>
                  <Typewriter text={data.apology} speed={32} onDone={() => setApologyDone(true)} />
                </div>
                <div style={{ marginTop: 20, fontFamily: "var(--font-fun)", fontSize: "1.1rem", color: "rgba(255,107,163,0.7)", textAlign: "right" }}>— {data.from} 💋</div>
              </div>
            </motion.div>

            {apologyDone && data.reasons?.filter(Boolean).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                style={{ maxWidth: 480, width: "100%", marginTop: 24 }}>
                <div style={{ fontFamily: "var(--font-round)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,133,162,0.5)", marginBottom: 16, textAlign: "center" }}>✦ Why I'm Sorry ✦</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.reasons.filter(Boolean).map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.18 }}
                      className="jelly-card" style={{ padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left", borderColor: "rgba(255,107,163,0.15)" }}>
                      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>💗</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "rgba(255,230,240,0.78)", lineHeight: 1.65, fontStyle: "italic" }}>{r}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {apologyDone && (
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="sqbtn sqbtn-rose"
                onClick={() => setScene("question")}
                style={{ marginTop: 36, fontSize: "1rem", padding: "18px 44px", animation: "jelly-pulse 2.5s ease-in-out 1s infinite" }}>
                Read My Question 💋
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── QUESTION ── */}
        {scene === "question" && (
          <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px", position: "relative", zIndex: 2 }}>

            <Mascot mood={noAttempts > 2 ? "hopeful" : "sad"} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: 24, marginBottom: 44 }}>
              <h2 style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1.8rem,6.5vw,3rem)", color: "#FF85A2", textShadow: "0 0 30px rgba(255,133,162,0.5)", lineHeight: 1.3, marginBottom: 10 }}>Are you still mad at me?</h2>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "rgba(255,200,225,0.4)", fontStyle: "italic" }}>choose carefully 👀</p>
            </motion.div>

            <AnimatePresence>
              {noAttempts > 0 && !noGone && (
                <motion.div key={noAttempts} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ marginBottom: 20, fontFamily: "var(--font-display)", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,162,196,0.7)" }}>
                  {["The 'No' button doesn't want to be clicked 🙈", "It keeps running away! 🏃💨", "Maybe the universe is giving you a sign? ✨", "Okay it's definitely trying to tell you something 😭", "One more try and it might just disappear… 👀"][Math.min(noAttempts - 1, 4)]}
                </motion.div>
              )}
              {noGone && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ marginBottom: 20, fontFamily: "var(--font-fun)", fontSize: "1rem", color: "#FF85A2" }}>
                  The 'No' button has left the chat 😇✨
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap", position: "relative", minHeight: 110 }}>
              <motion.button className="sqbtn sqbtn-rose" onClick={handleForgiven}
                animate={{ scale: yesScale }} whileHover={{ scale: yesScale * 1.07 }} whileTap={{ scale: yesScale * 0.94 }}
                style={{ padding: "18px 44px", fontSize: "1rem", whiteSpace: "nowrap" }}>
                Okay fine 😤💕
              </motion.button>
              <EvilNoButton attempts={noAttempts} onAttempt={() => setNoAttempts(n => n + 1)} />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              style={{ marginTop: 44, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {["I'm not mad, just disappointed 😞", "Fine. But you owe me 💅", "Only because you're cute 🥺"].map(label => (
                <button key={label} className="sqbtn sqbtn-ghost" onClick={handleForgiven}
                  style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", fontStyle: "italic", padding: "11px 18px" }}>
                  {label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── FORGIVEN ── */}
        {scene === "forgiven" && (
          <motion.div key="forgiven" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px", position: "relative", zIndex: 2 }}>

            <Mascot mood="happy" />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1.8rem,7vw,3.5rem)", color: "#FF85A2", textShadow: "0 0 40px rgba(255,133,162,0.6)", marginTop: 24, marginBottom: 14 }}>SHE SAID YES!! 🎉💋</h1>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem,3.5vw,1.6rem)", color: "rgba(255,220,235,0.8)", fontStyle: "italic", marginBottom: 32 }}>{data.to} has officially forgiven you ✨</p>
            </motion.div>

            {data.extra && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                style={{ maxWidth: 480, width: "100%", marginBottom: 32 }}>
                <div className="jelly-card" style={{ padding: "32px 26px", borderColor: "rgba(255,107,163,0.2)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,2.5vw,1.15rem)", color: "rgba(255,230,240,0.85)", lineHeight: 1.85, fontStyle: "italic" }}>{data.extra}</div>
                  <div style={{ marginTop: 18, fontFamily: "var(--font-fun)", fontSize: "1.1rem", color: "#FF85A2", textAlign: "right" }}>— {data.from}, forever yours 💋</div>
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
              {["💋", "💗", "😍", "🌸", "💖", "✨", "💋"].map((e, i) => (
                <motion.span key={i} animate={{ y: [0, -14, 0], scale: [1, 1.25, 1] }} transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  style={{ fontSize: "2rem", display: "inline-block" }}>{e}</motion.span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <img src={BRAND_IMG.logo} alt="LoveYouAI" style={{ height: 30, width: "auto", opacity: 0.5, objectFit: "contain" }} />
              <p style={{ fontFamily: "var(--font-round)", fontSize: "0.58rem", fontWeight: 700, color: "rgba(255,150,200,0.2)", letterSpacing: "0.1em" }}>LOVEYOUAI · no more fights · just kisses 💋</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SorryPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <span style={{ fontSize: "3rem" }}>💗</span>
        </motion.div>
      </div>
    }>
      <SorryPageInner />
    </Suspense>
  );
}
