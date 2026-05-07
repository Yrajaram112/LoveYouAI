"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { BRAND_IMG } from "@/lib/branding";

// ── Types ───────────────────────────────────────────────────────────────────
interface SorryData {
  to: string; from: string; apology: string;
  reasons: string[]; extra: string;
}

// ── Pink particle background ─────────────────────────────────────────────────
function PinkUniverse() {
  const kisses = Array.from({ length: 22 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    dur: 6 + Math.random() * 8, delay: Math.random() * 10,
    size: 14 + Math.random() * 22, opacity: 0.06 + Math.random() * 0.1,
    emoji: ["💋", "💗", "🌸", "💕", "✨", "💖", "🩷"][Math.floor(Math.random() * 7)],
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Nebula */}
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "70vw", height: "70vw", borderRadius: "50%", background: "radial-gradient(circle, #ff6eb4 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.12, animation: "nebula-drift 11s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "65vw", height: "65vw", borderRadius: "50%", background: "radial-gradient(circle, #ff4da6 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.1, animation: "nebula-drift 9s ease-in-out infinite alternate-reverse" }} />
      <div style={{ position: "absolute", top: "35%", right: "15%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, #ffb3d9 0%, transparent 70%)", filter: "blur(60px)", opacity: 0.08, animation: "nebula-drift 7s ease-in-out 1s infinite alternate" }} />
      {/* Stars — pink tinted */}
      {Array.from({ length: 100 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5,
          borderRadius: "50%", background: `hsl(${320 + Math.random() * 40}, 100%, ${80 + Math.random() * 20}%)`,
          animation: `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
        }} />
      ))}
      {/* Floating kiss emojis */}
      {kisses.map((k) => (
        <div key={k.id} style={{
          position: "absolute", left: `${k.x}%`, bottom: "-60px",
          fontSize: k.size, opacity: k.opacity,
          animation: `float-up ${k.dur}s ease-in ${k.delay}s infinite`,
        }}>{k.emoji}</div>
      ))}
    </div>
  );
}

// ── Fireworks / kiss confetti on forgiveness ─────────────────────────────────
function ForgivenessBurst() {
  const emojis = ["💋", "💗", "💖", "🌸", "✨", "🩷", "💕", "😘"];
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    angle: (i / 80) * 360,
    dist: 100 + Math.random() * 180,
    size: 18 + Math.random() * 24,
    dur: 0.7 + Math.random() * 0.8,
    delay: Math.random() * 0.4,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
      {[...Array(6)].map((_, burst) => (
        <div key={burst} style={{ position: "absolute", left: `${15 + burst * 14}%`, top: `${15 + (burst % 3) * 25}%` }}>
          {particles.map((p) => (
            <motion.div key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
                y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
                scale: 1, opacity: 0,
              }}
              transition={{ duration: p.dur, delay: burst * 0.25 + p.delay, ease: "easeOut" }}
              style={{ position: "absolute", fontSize: p.size }}>
              {p.emoji}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Bouncing sad/happy mascot ────────────────────────────────────────────────
function Mascot({ mood }: { mood: "sad" | "hopeful" | "happy" }) {
  const faces = { sad: "🥺", hopeful: "😢", happy: "😍" };
  return (
    <motion.div
      animate={{ y: [0, -18, 0], rotate: mood === "happy" ? [0, -10, 10, 0] : [0, -3, 3, 0] }}
      transition={{ duration: mood === "happy" ? 0.4 : 1.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ fontSize: "clamp(4rem, 14vw, 7rem)", display: "block", filter: "drop-shadow(0 0 20px rgba(255,100,180,0.4))" }}>
      {faces[mood]}
    </motion.div>
  );
}

// ── Typewriter ───────────────────────────────────────────────────────────────
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
  }, [text]);
  return <span>{shown}{!done && <span style={{ animation: "blink 0.8s step-end infinite", color: "#ff6eb4" }}>|</span>}</span>;
}

// ── The Evil "No" Button ─────────────────────────────────────────────────────
function EvilNoButton({ attempts, onAttempt }: { attempts: number; onAttempt: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  const btnRef = useRef<HTMLDivElement>(null);

  const escapeMessages = [
    "Nope! 😜", "Too slow! 💨", "Nice try 😇", "The audacity 😂",
    "Not today! 🏃‍♂️", "Catch me if you can! 🌸", "lol bye 💅",
  ];

  useEffect(() => {
    if (attempts >= 5) { setVisible(false); }
  }, [attempts]);

  const flee = useCallback(() => {
    onAttempt();
    const msgs = escapeMessages;
    setMessage(msgs[attempts % msgs.length]);
    setTimeout(() => setMessage(""), 900);

    // Teleport to a random spot — but keep on screen
    const newX = (Math.random() - 0.5) * 280;
    const newY = (Math.random() - 0.5) * 200;
    setPos({ x: newX, y: newY });
  }, [attempts, onAttempt]);

  // On mobile: onTouchStart to flee before they tap
  // On desktop: onMouseEnter to flee

  const scale = Math.max(0.35, 1 - attempts * 0.13);
  const opacity = Math.max(0.2, 1 - attempts * 0.16);

  if (!visible) return null;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.div ref={btnRef}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{ position: "relative" }}
        onMouseEnter={flee}
        onTouchStart={flee}
      >
        <button onClick={flee}
          style={{
            padding: `${10 * scale}px ${24 * scale}px`,
            borderRadius: 50,
            border: "1px solid rgba(255,100,150,0.3)",
            background: "rgba(255,100,150,0.08)",
            color: `rgba(255,150,180,${opacity})`,
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            fontSize: `${0.75 * scale}rem`,
            letterSpacing: "0.1em",
            transform: `scale(${scale}) rotate(${attempts * 8}deg)`,
            transition: "all 0.3s",
            userSelect: "none",
            opacity,
          }}>
          No 😤
        </button>
      </motion.div>
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 0, scale: 0.5 }} animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: "'Dancing Script', cursive", fontSize: "1rem", color: "#ff6eb4", pointerEvents: "none" }}>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MAIN SORRY PAGE ──────────────────────────────────────────────────────────
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
    try {
      const parsed = JSON.parse(decodeURIComponent(atob(d)));
      setData(parsed);
      setTimeout(() => setScene("apology"), 600);
    } catch { setError(true); }
  }, [params]);

  const handleForgiven = () => {
    setScene("forgiven");
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 3500);
  };

  const noGone = noAttempts >= 5;
  const yesScale = Math.min(1.5, 1 + noAttempts * 0.1);

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#120008", padding: 40 }}>
      <PinkUniverse />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>💔</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(255,200,220,0.6)", fontStyle: "italic" }}>
          This link seems broken… ask him to send a new one.
        </p>
      </div>
    </div>
  );

  if (!data || scene === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#120008" }}>
      <PinkUniverse />
      <motion.div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <span style={{ fontSize: "3rem" }}>💗</span>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0008", position: "relative", overflowX: "hidden" }}>
      <PinkUniverse />
      {showFireworks && <ForgivenessBurst />}

      <AnimatePresence mode="wait">

        {/* ── APOLOGY SCENE ── */}
        {scene === "apology" && (
          <motion.div key="apology" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px", position: "relative", zIndex: 2 }}>

            <motion.img initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
              src={BRAND_IMG.sorry} alt=""
              style={{ height: 54, width: "auto", marginBottom: 12, objectFit: "contain", filter: "drop-shadow(0 0 14px rgba(255,110,180,0.35))" }} />

            <Mascot mood="sad" />

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ marginTop: 28, marginBottom: 12 }}>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1rem, 3.5vw, 1.4rem)", letterSpacing: "0.2em", color: "rgba(255,182,210,0.6)", textTransform: "uppercase", marginBottom: 8 }}>
                a message for
              </h1>
              <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(2.4rem, 8vw, 4rem)", color: "#ff6eb4", textShadow: "0 0 30px rgba(255,110,180,0.5), 0 0 60px rgba(255,110,180,0.2)", lineHeight: 1.1 }}>
                {data.to} 💗
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
              style={{ maxWidth: 540, margin: "28px auto 0" }}>
              <div style={{ background: "rgba(255,110,180,0.04)", border: "1px solid rgba(255,110,180,0.15)", borderRadius: 20, padding: "36px 32px", backdropFilter: "blur(20px)" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)", lineHeight: 1.9, color: "rgba(255,220,235,0.88)", fontStyle: "italic" }}>
                  <Typewriter text={data.apology} speed={32} onDone={() => setApologyDone(true)} />
                </div>
                <div style={{ marginTop: 24, fontFamily: "'Dancing Script', cursive", fontSize: "1.2rem", color: "rgba(255,110,180,0.7)", textAlign: "right" }}>
                  — {data.from} 💋
                </div>
              </div>
            </motion.div>

            {/* Reasons list */}
            {apologyDone && data.reasons?.filter(Boolean).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                style={{ maxWidth: 500, width: "100%", marginTop: 28 }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(255,150,200,0.5)", textTransform: "uppercase", marginBottom: 16 }}>
                  reasons I'm sorry
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.reasons.filter(Boolean).map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(255,110,180,0.05)", border: "1px solid rgba(255,110,180,0.12)", borderRadius: 12, padding: "12px 16px", textAlign: "left" }}>
                      <span style={{ fontSize: "1rem", flexShrink: 0 }}>💗</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(255,220,235,0.75)", lineHeight: 1.6 }}>{r}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {apologyDone && (
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
                onClick={() => setScene("question")}
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                style={{ marginTop: 40, padding: "16px 44px", borderRadius: 50, border: "none", background: "linear-gradient(135deg, #ff6eb4, #ff3d9a)", color: "white", fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 0 30px rgba(255,110,180,0.4)", fontWeight: 700 }}>
                Read My Question 💋
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── QUESTION SCENE ── */}
        {scene === "question" && (
          <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px", position: "relative", zIndex: 2 }}>

            <Mascot mood={noAttempts > 2 ? "hopeful" : "sad"} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ marginTop: 28, marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.8rem, 6vw, 3rem)", color: "#ff6eb4", textShadow: "0 0 30px rgba(255,110,180,0.5)", lineHeight: 1.3, marginBottom: 12 }}>
                Are you still mad at me?
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(255,200,225,0.45)", fontStyle: "italic" }}>
                choose carefully 👀
              </p>
            </motion.div>

            {/* No-attempts taunts */}
            <AnimatePresence>
              {noAttempts > 0 && !noGone && (
                <motion.div key={noAttempts} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ marginBottom: 20, fontFamily: "'Dancing Script', cursive", fontSize: "1rem", color: "rgba(255,150,200,0.7)" }}>
                  {[
                    "The 'No' button doesn't want to be clicked 🙈",
                    "It keeps running away! Weird… 🏃‍♂️💨",
                    "Maybe the universe is giving you a sign? ✨",
                    "Okay it's definitely trying to tell you something 😭",
                    "One more try and it might just disappear… 👀",
                  ][Math.min(noAttempts - 1, 4)]}
                </motion.div>
              )}
              {noGone && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ marginBottom: 20, fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem", color: "#ff6eb4" }}>
                  The 'No' button has left the chat 😇✨
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap", position: "relative", minHeight: 120 }}>

              {/* YES button — gets bigger as No is avoided */}
              <motion.button
                onClick={handleForgiven}
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.08 }}
                whileTap={{ scale: yesScale * 0.95 }}
                style={{
                  padding: "18px 48px", borderRadius: 50, border: "none",
                  background: "linear-gradient(135deg, #ff6eb4, #ff3d9a)",
                  color: "white", fontFamily: "'Cinzel', serif",
                  fontSize: "1rem", letterSpacing: "0.12em",
                  cursor: "pointer", fontWeight: 700,
                  boxShadow: `0 0 ${20 + noAttempts * 8}px rgba(255,110,180,${0.4 + noAttempts * 0.08})`,
                  whiteSpace: "nowrap",
                }}>
                Okay fine 😤💕
              </motion.button>

              {/* No button — runs away */}
              <EvilNoButton attempts={noAttempts} onAttempt={() => setNoAttempts((n) => n + 1)} />
            </div>

            {/* Extra options */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {["I'm not mad, just disappointed 😞", "Fine. But you owe me 💅", "Only because you're cute 🥺"].map((label) => (
                <button key={label} onClick={handleForgiven}
                  style={{ padding: "10px 20px", borderRadius: 50, border: "1px solid rgba(255,110,180,0.25)", background: "rgba(255,110,180,0.06)", color: "rgba(255,200,220,0.65)", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontStyle: "italic", transition: "all 0.3s" }}
                  onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = "rgba(255,110,180,0.5)"; (e.target as HTMLButtonElement).style.color = "#ff9dc8"; }}
                  onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = "rgba(255,110,180,0.25)"; (e.target as HTMLButtonElement).style.color = "rgba(255,200,220,0.65)"; }}>
                  {label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── FORGIVEN SCENE ── */}
        {scene === "forgiven" && (
          <motion.div key="forgiven" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px", position: "relative", zIndex: 2 }}>

            <Mascot mood="happy" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 6vw, 3.5rem)", color: "#ff6eb4", textShadow: "0 0 40px rgba(255,110,180,0.6), 0 0 80px rgba(255,110,180,0.3)", letterSpacing: "0.06em", marginTop: 24, marginBottom: 16 }}>
                SHE SAID YES!! 🎉💋
              </h1>
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.2rem, 4vw, 1.8rem)", color: "rgba(255,200,230,0.8)", marginBottom: 36 }}>
                {data.to} has officially forgiven you ✨
              </p>
            </motion.div>

            {data.extra && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
                style={{ maxWidth: 500, marginBottom: 36 }}>
                <div style={{ background: "rgba(255,110,180,0.06)", border: "1px solid rgba(255,110,180,0.2)", borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(20px)" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(255,220,235,0.85)", lineHeight: 1.85, fontStyle: "italic" }}>
                    {data.extra}
                  </div>
                  <div style={{ marginTop: 20, fontFamily: "'Dancing Script', cursive", fontSize: "1.2rem", color: "#ff6eb4", textAlign: "right" }}>
                    — {data.from}, forever yours 💋
                  </div>
                </div>
              </motion.div>
            )}

            {/* Big kissy emojis */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
              {["💋", "💗", "😍", "🌸", "💖", "✨", "💋"].map((e, i) => (
                <motion.span key={i} animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  style={{ fontSize: "2rem", display: "inline-block" }}>{e}</motion.span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <img src={BRAND_IMG.logo} alt="LoveYouAI" style={{ height: 32, width: "auto", opacity: 0.55, objectFit: "contain" }} />
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,150,200,0.2)", letterSpacing: "0.1em", margin: 0 }}>
                LOVEYOUAI · no more fights · just kisses 💋
              </p>
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
      <div style={{ minHeight: "100vh", background: "#0d0008", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <span style={{ fontSize: "3rem" }}>💗</span>
        </motion.div>
      </div>
    }>
      <SorryPageInner />
    </Suspense>
  );
}
