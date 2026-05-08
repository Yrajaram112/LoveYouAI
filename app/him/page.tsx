"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Geometric grid background ─────────────────────────────────── */
function MasculineBg({ mode = "default" }: { mode?: "default" | "sorry" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const accentColor = mode === "sorry" ? "rgba(185,28,28,0.22)" : "rgba(29,78,216,0.2)";
  const accentColor2 = mode === "sorry" ? "rgba(220,38,38,0.14)" : "rgba(14,116,144,0.14)";

  return (
    <div className="him-bg">
      {/* Deep glow blobs */}
      <div style={{
        position: "absolute", top: "-5%", right: "-10%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: accentColor,
        filter: "blur(100px)", animation: "him-drift 18s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-10%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: accentColor2,
        filter: "blur(100px)", animation: "him-drift 14s ease-in-out 3s infinite alternate-reverse",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "35%",
        width: "40vw", height: "40vw", borderRadius: "50%",
        background: "rgba(245,158,11,0.07)",
        filter: "blur(80px)", animation: "him-drift 22s ease-in-out 7s infinite alternate",
      }} />

      {/* Geometric grid lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Diagonal accent line */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="#60a5fa" strokeWidth="1.5" />
        <line x1="-10%" y1="80%" x2="90%" y2="-10%" stroke="#60a5fa" strokeWidth="0.8" />
      </svg>

      {/* Floating sparks — ember-like */}
      {mounted && Array.from({ length: 20 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 43 + 11) % 100}%`,
          top: `${(i * 67 + 7) % 100}%`,
          width: `${1.2 + (i % 3) * 0.6}px`,
          height: `${1.2 + (i % 3) * 0.6}px`,
          borderRadius: "50%",
          background: ["#60a5fa", "#f59e0b", "#ef4444", "#94a3b8", "#38bdf8"][i % 5],
          opacity: 0.35,
          animation: `him-spark ${3.5 + (i % 4)}s ease-in-out ${i * 0.45}s infinite`,
        }} />
      ))}
    </div>
  );
}

type Mode = "pick" | "love-form" | "sorry-form" | "submitting" | "love-done" | "sorry-done";

function HimField({ label, color = "blue", children }: { label: string; color?: "blue" | "red" | "amber"; children: React.ReactNode }) {
  const colors = { blue: "rgba(96,165,250,0.85)", red: "rgba(239,68,68,0.85)", amber: "rgba(245,158,11,0.85)" };
  return (
    <div>
      <label className="him-label" style={{ color: colors[color] }}>{label}</label>
      {children}
    </div>
  );
}

export default function HimPage() {
  const [mode, setMode] = useState<Mode>("pick");
  const [loveLink, setLoveLink] = useState("");
  const [sorryLink, setSorryLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Love letter fields — different from her version
  const [love, setLove] = useState({
    to: "", from: "", message: "", challenge: "", memory: "", date: "", dream: "", vibe: "",
  });
  const setL = (k: string, v: string) => setLove(f => ({ ...f, [k]: v }));

  // Sorry fields — different theme
  const [sorry, setSorry] = useState({
    to: "", from: "", apology: "", wrongs: ["", "", ""], promise: "", comeback: "",
  });
  const setS = (k: string, v: string | string[]) => setSorry(f => ({ ...f, [k]: v }));

  const submitLove = async () => {
    setError(""); setSubmitting(true); setMode("submitting");
    try {
      const payload = {
        to: love.to, from: love.from,
        message: love.message,
        memory: love.memory,
        date: love.date,
        song: love.dream,
        // store challenge/vibe in extra field via message enrichment
        extra: [love.challenge ? `💪 Challenge: ${love.challenge}` : "", love.vibe ? `🎵 Our Vibe: ${love.vibe}` : ""].filter(Boolean).join("\n"),
        route: "him",
      };
      const res = await fetch("/api/him/love", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await new Promise(r => setTimeout(r, 2200));
      setLoveLink(`${window.location.origin}/him/open/${data.id}`);
      setMode("love-done");
    } catch (e: any) { setError(e.message); setMode("love-form"); }
    setSubmitting(false);
  };

  const submitSorry = async () => {
    setError(""); setSubmitting(true); setMode("submitting");
    try {
      const res = await fetch("/api/him/sorry", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: sorry.to, from: sorry.from, apology: sorry.apology, reasons: sorry.wrongs.filter(Boolean), extra: sorry.promise, comeback: sorry.comeback }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await new Promise(r => setTimeout(r, 2200));
      setSorryLink(`${window.location.origin}/him/sorry/${data.id}`);
      setMode("sorry-done");
    } catch (e: any) { setError(e.message); setMode("sorry-form"); }
    setSubmitting(false);
  };

  const copy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const isSorry = mode === "sorry-form" || mode === "sorry-done";
  const spring = { type: "spring" as const, stiffness: 300, damping: 28 };
  const pageEnter = {
    initial: { opacity: 0, y: 36, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -18, scale: 0.97 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <MasculineBg mode={isSorry ? "sorry" : "default"} />

      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <AnimatePresence mode="wait">

          {/* ══ PICK MODE ══ */}
          {mode === "pick" && (
            <motion.div key="pick" {...pageEnter} style={{ textAlign: "center", maxWidth: 520, width: "100%" }}>

              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(29,78,216,0.15)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 100, padding: "8px 20px", marginBottom: 28 }}>
                  <span style={{ fontSize: "1.1rem" }}>⚡</span>
                  <span style={{ fontFamily: "var(--him-font-label)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(147,197,253,0.7)", textTransform: "uppercase" }}>For Him · Built Different</span>
                  <span style={{ fontSize: "1.1rem" }}>🔥</span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <h1 style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(2.6rem,10vw,4.8rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: 14, letterSpacing: "-0.03em" }}>
                  <span style={{ background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HE</span>
                  <span style={{ color: "#ef4444" }}> ♥</span>
                  <span style={{ background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> DESERVES</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IT TOO</span>
                </h1>
                <p style={{ fontFamily: "var(--him-font-body)", fontSize: "clamp(0.9rem,2.5vw,1.05rem)", color: "rgba(148,163,184,0.65)", marginBottom: 10, fontStyle: "italic" }}>
                  A love letter. A peace offering. Built into a link.
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
                style={{ width: 72, height: 2, background: "linear-gradient(90deg, #3b82f6, #ef4444)", margin: "0 auto 40px", borderRadius: 2 }} />

              {/* Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>

                {/* Love Letter Card */}
                <motion.button
                  initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ...spring }}
                  whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setMode("love-form")}
                  style={{ background: "linear-gradient(145deg, rgba(29,78,216,0.2), rgba(14,116,144,0.12))", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 20, padding: "26px 16px 22px", cursor: "pointer", color: "inherit", textAlign: "center", backdropFilter: "blur(16px)", boxShadow: "0 16px 48px rgba(29,78,216,0.15), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "2.8rem", marginBottom: 14, animation: "him-float 3.5s ease-in-out infinite", filter: "drop-shadow(0 4px 16px rgba(96,165,250,0.5))" }}>💌</div>
                  <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.8rem", fontWeight: 800, color: "#60a5fa", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Love Letter ⚡</div>
                  <div style={{ fontFamily: "var(--him-font-body)", fontSize: "0.78rem", color: "rgba(148,163,184,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>Tell him he's the one person you'd choose every single time</div>
                </motion.button>

                {/* He's Pissed Card */}
                <motion.button
                  initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, ...spring }}
                  whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setMode("sorry-form")}
                  style={{ background: "linear-gradient(145deg, rgba(185,28,28,0.2), rgba(220,38,38,0.1))", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: "26px 16px 22px", cursor: "pointer", color: "inherit", textAlign: "center", backdropFilter: "blur(16px)", boxShadow: "0 16px 48px rgba(185,28,28,0.15), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "2.8rem", marginBottom: 14, animation: "him-float 4s ease-in-out 0.5s infinite", filter: "drop-shadow(0 4px 16px rgba(239,68,68,0.5))" }}>🔥</div>
                  <div style={{ fontFamily: "var(--him-font-label)", fontSize: "0.8rem", fontWeight: 800, color: "#ef4444", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>He's Mad 🥊</div>
                  <div style={{ fontFamily: "var(--him-font-body)", fontSize: "0.78rem", color: "rgba(148,163,184,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>The "No" button ghosted. He can't stay mad forever 😤</div>
                </motion.button>
              </div>

              {/* Feature chips */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
                {["⚡ AI-crafted", "🔗 Shareable link", "🥊 Interactive"].map(t => (
                  <span key={t} className="him-chip">{t}</span>
                ))}
              </motion.div>

              {/* Back to her version */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                <Link href="/create" style={{ fontFamily: "var(--him-font-label)", fontSize: "0.65rem", fontWeight: 700, color: "rgba(148,163,184,0.25)", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
                  ← Back to Her Version 💌
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* ══ LOVE FORM ══ */}
          {mode === "love-form" && (
            <motion.div key="love-form" {...pageEnter} style={{ width: "100%", maxWidth: 540 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: "3rem", marginBottom: 12, animation: "him-float 3s ease-in-out infinite", filter: "drop-shadow(0 4px 24px rgba(96,165,250,0.6))" }}>💌</div>
                <h2 style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.6rem,5vw,2.2rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 6 }}>
                  <span style={{ background: "linear-gradient(135deg, #60a5fa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Build His World</span>
                </h2>
                <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.9rem", color: "rgba(148,163,184,0.5)", fontStyle: "italic" }}>Words that hit different. Every field is a layer of him.</p>
              </div>

              <div className="him-card" style={{ padding: "28px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <HimField label="His Name ◆" color="blue">
                    <input className="him-input" placeholder="e.g. Marcus" value={love.to} onChange={e => setL("to", e.target.value)} />
                  </HimField>
                  <HimField label="Your Name ◆" color="blue">
                    <input className="him-input" placeholder="e.g. Sarah" value={love.from} onChange={e => setL("from", e.target.value)} />
                  </HimField>
                </div>

                <HimField label="Your Message to Him ◆" color="blue">
                  <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.75rem", color: "rgba(148,163,184,0.3)", fontStyle: "italic", marginBottom: 8 }}>Typed out letter by letter as he reads. Make it land hard. 🔥</p>
                  <textarea className="him-input" placeholder="Tell him the moment you knew. The way he laughs, the way he carries himself, what it feels like when he's yours…" value={love.message} onChange={e => setL("message", e.target.value)} rows={4} style={{ resize: "vertical" }} />
                </HimField>

                <HimField label="The Challenge You Two Conquered ◆" color="blue">
                  <input className="him-input" placeholder="e.g. Long distance for 8 months and still chose each other every day" value={love.challenge} onChange={e => setL("challenge", e.target.value)} />
                </HimField>

                <HimField label="A Memory Only You Two Have ◆" color="amber">
                  <textarea className="him-input" placeholder="That 3AM drive when… / The stupid argument that ended with both of you laughing…" value={love.memory} onChange={e => setL("memory", e.target.value)} rows={3} style={{ resize: "vertical" }} />
                </HimField>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <HimField label="Together Since ◆" color="amber">
                    <input type="date" className="him-input" style={{ colorScheme: "dark" }} value={love.date} onChange={e => setL("date", e.target.value)} />
                  </HimField>
                  <HimField label="Your Anthem ◆" color="amber">
                    <input className="him-input" placeholder="e.g. Slow Dancing in a Burning Room" value={love.dream} onChange={e => setL("dream", e.target.value)} />
                  </HimField>
                </div>

                <HimField label="The Vibe Between You Two ◆" color="blue">
                  <input className="him-input" placeholder="e.g. Chaos and calm. Loud laughs and quiet nights. Complete opposites somehow." value={love.vibe} onChange={e => setL("vibe", e.target.value)} />
                </HimField>

                {error && <div style={{ color: "#ef4444", fontFamily: "var(--him-font-label)", fontSize: "0.78rem", textAlign: "center", fontWeight: 700 }}>{error}</div>}

                <div style={{ display: "flex", gap: 10, justifyContent: "center", paddingTop: 4 }}>
                  <button className="him-btn him-btn-ghost" onClick={() => setMode("pick")}>← Back</button>
                  <motion.button className="him-btn him-btn-blue" onClick={submitLove}
                    disabled={!love.to || !love.from || !love.message}
                    whileHover={love.to && love.from && love.message ? { scale: 1.05, y: -3 } : {}}
                    whileTap={love.to && love.from && love.message ? { scale: 0.93 } : {}}
                    style={{ opacity: love.to && love.from && love.message ? 1 : 0.35, cursor: love.to && love.from && love.message ? "pointer" : "not-allowed" }}>
                    ◆ Generate His Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ SORRY FORM ══ */}
          {mode === "sorry-form" && (
            <motion.div key="sorry-form" {...pageEnter} style={{ width: "100%", maxWidth: 540 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: "3rem", marginBottom: 12, animation: "him-float 3.5s ease-in-out infinite", filter: "drop-shadow(0 4px 24px rgba(239,68,68,0.6))" }}>🔥</div>
                <h2 style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.6rem,5vw,2.2rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 6 }}>
                  <span style={{ background: "linear-gradient(135deg, #ef4444, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Apology. Unfiltered.</span>
                </h2>
                <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.9rem", color: "rgba(148,163,184,0.5)", fontStyle: "italic" }}>He's got walls up. This link goes through them.</p>
              </div>

              <div className="him-card" style={{ padding: "28px 22px", display: "flex", flexDirection: "column", gap: 18, borderColor: "rgba(239,68,68,0.15)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <HimField label="His Name 🔥" color="red">
                    <input className="him-input him-input-red" placeholder="e.g. Marcus" value={sorry.to} onChange={e => setS("to", e.target.value)} />
                  </HimField>
                  <HimField label="Your Name 🔥" color="red">
                    <input className="him-input him-input-red" placeholder="e.g. Sarah" value={sorry.from} onChange={e => setS("from", e.target.value)} />
                  </HimField>
                </div>

                <HimField label="Your Apology — No Bullshit 🥊" color="red">
                  <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.75rem", color: "rgba(148,163,184,0.3)", fontStyle: "italic", marginBottom: 8 }}>Types out letter by letter. He'll read every word. Don't hold back. 🔥</p>
                  <textarea className="him-input him-input-red" placeholder="I need you to know I messed up. Not because I have to say it — because I mean it. You deserved better from me and I know that now…" value={sorry.apology} onChange={e => setS("apology", e.target.value)} rows={4} style={{ resize: "vertical" }} />
                </HimField>

                <HimField label="What I Got Wrong (up to 3) ⚡" color="red">
                  <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.75rem", color: "rgba(148,163,184,0.3)", fontStyle: "italic", marginBottom: 8 }}>These drop in one by one. Brutal honesty hits hardest.</p>
                  {[0, 1, 2].map(i => (
                    <input key={i} className="him-input him-input-red" style={{ marginBottom: i < 2 ? 10 : 0 }}
                      placeholder={["I prioritized everything else when you should've been first", "I said things I didn't mean and didn't take them back", "I made you feel like you had to earn what you already deserved"][i]}
                      value={sorry.wrongs[i]}
                      onChange={e => { const r = [...sorry.wrongs]; r[i] = e.target.value; setS("wrongs", r); }} />
                  ))}
                </HimField>

                <HimField label="What I Promise ◆" color="amber">
                  <p style={{ fontFamily: "var(--him-font-body)", fontSize: "0.75rem", color: "rgba(148,163,184,0.3)", fontStyle: "italic", marginBottom: 8 }}>Shown when he decides to let it go. Mean it.</p>
                  <textarea className="him-input" placeholder="I promise to show up differently. To say what I mean and mean what I say. You've always been worth it…" value={sorry.promise} onChange={e => setS("promise", e.target.value)} rows={3} style={{ resize: "vertical" }} />
                </HimField>

                <HimField label="After He Forgives You… 🔥" color="red">
                  <input className="him-input him-input-red" placeholder="e.g. Dinner's on me. And I'm not letting you go home. 😤" value={sorry.comeback} onChange={e => setS("comeback", e.target.value)} />
                </HimField>

                {error && <div style={{ color: "#ef4444", fontFamily: "var(--him-font-label)", fontSize: "0.78rem", textAlign: "center", fontWeight: 700 }}>{error}</div>}

                <div style={{ display: "flex", gap: 10, justifyContent: "center", paddingTop: 4 }}>
                  <button className="him-btn him-btn-ghost" onClick={() => setMode("pick")}>← Back</button>
                  <motion.button className="him-btn him-btn-red" onClick={submitSorry}
                    disabled={!sorry.to || !sorry.from || !sorry.apology}
                    whileHover={sorry.to && sorry.from && sorry.apology ? { scale: 1.05, y: -3 } : {}}
                    whileTap={sorry.to && sorry.from && sorry.apology ? { scale: 0.93 } : {}}
                    style={{ opacity: sorry.to && sorry.from && sorry.apology ? 1 : 0.35, cursor: sorry.to && sorry.from && sorry.apology ? "pointer" : "not-allowed" }}>
                    🔥 Generate Apology Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ SUBMITTING ══ */}
          {mode === "submitting" && (
            <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: "2.8rem", display: "block", marginBottom: 20 }}>⚡</motion.div>
              <p style={{ fontFamily: "var(--him-font-label)", fontSize: "1rem", color: "rgba(96,165,250,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 800 }}>Forging your link…</p>
            </motion.div>
          )}

          {/* ══ DONE SCREENS ══ */}
          {(mode === "love-done" || mode === "sorry-done") && (() => {
            const isLove = mode === "love-done";
            const link = isLove ? loveLink : sorryLink;
            return (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: "center", maxWidth: 520, width: "100%" }}>

                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 0.9, 1.05, 1] }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                  style={{ fontSize: "4rem", marginBottom: 20, filter: "drop-shadow(0 8px 28px rgba(96,165,250,0.5))" }}>
                  {isLove ? "💌" : "🔥"}
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ fontFamily: "var(--him-font-display)", fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>
                  <span style={{ background: isLove ? "linear-gradient(135deg,#60a5fa,#38bdf8)" : "linear-gradient(135deg,#ef4444,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {isLove ? "His Link is Ready ◆" : "Apology Locked & Loaded 🔥"}
                  </span>
                </motion.h2>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  style={{ fontFamily: "var(--him-font-body)", fontSize: "0.95rem", color: "rgba(148,163,184,0.5)", fontStyle: "italic", marginBottom: 28 }}>
                  {isLove ? `Send this to ${love.to} — he won't forget it.` : `Send to ${sorry.to} — the "No" button is rigged 😤`}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="him-card" style={{ padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, borderColor: isLove ? "rgba(96,165,250,0.2)" : "rgba(239,68,68,0.2)" }}>
                  <div style={{ flex: 1, fontFamily: "var(--him-font-label)", fontSize: "0.68rem", color: "rgba(148,163,184,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left", fontWeight: 700, letterSpacing: "0.05em" }}>
                    {link}
                  </div>
                  <motion.button className={`him-btn ${isLove ? "him-btn-blue" : "him-btn-red"}`}
                    onClick={() => copy(link)} whileTap={{ scale: 0.9 }}
                    style={{ flexShrink: 0, padding: "10px 18px", fontSize: "0.8rem" }}>
                    {copied ? "◆ Copied!" : "Copy"}
                  </motion.button>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className={`him-btn ${isLove ? "him-btn-blue" : "him-btn-red"}`}
                    onClick={() => window.open(link, "_blank")}>
                    Preview →
                  </button>
                  <button className="him-btn him-btn-ghost" onClick={() => setMode("pick")}>
                    Create Another
                  </button>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                  style={{ marginTop: 24, fontFamily: "var(--him-font-body)", fontSize: "0.8rem", color: "rgba(148,163,184,0.18)", fontStyle: "italic" }}>
                  Link works on any device, forever 🌙
                </motion.p>
              </motion.div>
            );
          })()}

        </AnimatePresence>
      </div>
    </div>
  );
}
