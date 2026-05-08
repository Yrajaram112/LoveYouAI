"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND_IMG } from "@/lib/branding";

/* ─── Blob mesh background ─────────────────────────────────────────── */
function BlobBg({ pink = false }: { pink?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className={pink ? "mesh-bg-pink" : "mesh-bg"}>
      <div style={{
        position: "absolute", top: "5%", left: "-10%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: pink ? "rgba(255,77,126,0.22)" : "rgba(255,77,126,0.16)",
        filter: "blur(80px)", animation: "blob-drift 16s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "-10%",
        width: "50vw", height: "50vw", borderRadius: "50%",
        background: pink ? "rgba(199,125,255,0.18)" : "rgba(199,125,255,0.14)",
        filter: "blur(80px)", animation: "blob-drift 13s ease-in-out 2s infinite alternate-reverse",
      }} />
      <div style={{
        position: "absolute", top: "45%", right: "20%",
        width: "35vw", height: "35vw", borderRadius: "50%",
        background: "rgba(255,179,71,0.1)",
        filter: "blur(70px)", animation: "blob-drift 18s ease-in-out 4s infinite alternate",
      }} />
      {/* Floating sparkles — client-only to avoid hydration mismatch */}
      {mounted && Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 37 + 7) % 100}%`,
          top: `${(i * 53 + 11) % 100}%`,
          width: `${1.5 + (i % 3) * 0.7}px`,
          height: `${1.5 + (i % 3) * 0.7}px`,
          borderRadius: "50%",
          background: ["#FF85A2", "#FFB347", "#C77DFF", "white"][i % 4],
          opacity: 0.4,
          animation: `twinkle ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
        }} />
      ))}
    </div>
  );
}

type Mode = "pick" | "love-form" | "sorry-form" | "submitting" | "love-done" | "sorry-done";

/* ── Field component — defined outside to preserve input focus ── */
function Field({ label, color = "rose", children }: { label: string; color?: "rose" | "gold"; children: React.ReactNode }) {
  return (
    <div>
      <label className="jelly-label" style={{ color: color === "rose" ? "rgba(255,133,162,0.9)" : "rgba(255,200,100,0.9)" }}>{label}</label>
      {children}
    </div>
  );
}

export default function CreatePage() {
  const [mode, setMode] = useState<Mode>("pick");
  const [loveLink, setLoveLink] = useState("");
  const [sorryLink, setSorryLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [love, setLove] = useState({ to: "", from: "", message: "", memory: "", date: "", song: "", photo: "" });
  const setL = (k: string, v: string) => setLove(f => ({ ...f, [k]: v }));
  const [sorry, setSorry] = useState({ to: "", from: "", apology: "", reasons: ["", "", ""], extra: "" });
  const setS = (k: string, v: string | string[]) => setSorry(f => ({ ...f, [k]: v }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 600;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      setPhotoPreview(dataUrl); setL("photo", dataUrl);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const submitLove = async () => {
    setError(""); setSubmitting(true); setMode("submitting");
    try {
      const res = await fetch("/api/love", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: love.to, from: love.from, message: love.message, memory: love.memory, date: love.date, song: love.song, photoBase64: love.photo || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await new Promise(r => setTimeout(r, 2000));
      setLoveLink(`${window.location.origin}/open/${data.id}`);
      setMode("love-done");
    } catch (e: any) { setError(e.message); setMode("love-form"); }
    setSubmitting(false);
  };

  const submitSorry = async () => {
    setError(""); setSubmitting(true); setMode("submitting");
    try {
      const res = await fetch("/api/sorry", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: sorry.to, from: sorry.from, apology: sorry.apology, reasons: sorry.reasons.filter(Boolean), extra: sorry.extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await new Promise(r => setTimeout(r, 2000));
      setSorryLink(`${window.location.origin}/sorry/${data.id}`);
      setMode("sorry-done");
    } catch (e: any) { setError(e.message); setMode("sorry-form"); }
    setSubmitting(false);
  };

  const copy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const isPink = mode === "sorry-form" || mode === "sorry-done";

  const spring = { type: "spring" as const, stiffness: 320, damping: 26 };
  const pageEnter = { initial: { opacity: 0, y: 40, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.97 }, transition: { duration: 0.5, ease: "easeOut" as const } };



  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <BlobBg pink={isPink} />

      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <AnimatePresence mode="wait">

          {/* ══ PICK MODE ══ */}
          {mode === "pick" && (
            <motion.div key="pick" {...pageEnter} style={{ textAlign: "center", maxWidth: 500, width: "100%" }}>
              {/* Logo */}
              <motion.div initial={{ opacity: 0, y: -20, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <img src={BRAND_IMG.hero} alt="LoveYouAI" style={{ width: "min(260px,72vw)", height: "auto", display: "block", margin: "0 auto 8px", filter: "drop-shadow(0 8px 30px rgba(255,77,126,0.4))", animation: "float-bob 4s ease-in-out infinite" }} />
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,3vw,1.2rem)", color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginBottom: 10 }}>
                A love letter, built into a link.
              </motion.p>

              {/* Divider */}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                style={{ width: 64, height: 3, borderRadius: 3, background: "linear-gradient(90deg, #FF4D7E, #C77DFF)", margin: "0 auto 36px" }} />

              {/* Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                {/* Love Letter Card */}
                <motion.button
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, ...spring }}
                  whileHover={{ y: -8, scale: 1.03 }} whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => setMode("love-form")}
                  style={{ background: "linear-gradient(145deg, rgba(255,107,163,0.18), rgba(199,125,255,0.12))", border: "1.5px solid rgba(255,107,163,0.25)", borderRadius: 26, padding: "28px 18px 24px", cursor: "pointer", color: "inherit", textAlign: "center", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px rgba(255,77,126,0.12), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                  <img src={BRAND_IMG.loveLetter} alt="" style={{ width: "min(100px,26vw)", height: "auto", margin: "0 auto 14px", display: "block", objectFit: "contain", animation: "float-bob 3.5s ease-in-out infinite", filter: "drop-shadow(0 6px 16px rgba(255,77,126,0.35))" }} />
                  <div style={{ fontFamily: "var(--font-round)", fontSize: "0.88rem", fontWeight: 900, color: "#FF85A2", marginBottom: 8, letterSpacing: "0.03em" }}>Love Letter 💌</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", fontStyle: "italic", lineHeight: 1.6 }}>Make her feel like the universe rearranged itself for her</div>
                </motion.button>

                {/* Sorry Card */}
                <motion.button
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, ...spring }}
                  whileHover={{ y: -8, scale: 1.03 }} whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => setMode("sorry-form")}
                  style={{ background: "linear-gradient(145deg, rgba(255,77,126,0.18), rgba(255,107,163,0.1))", border: "1.5px solid rgba(255,77,126,0.25)", borderRadius: 26, padding: "28px 18px 24px", cursor: "pointer", color: "inherit", textAlign: "center", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px rgba(255,77,126,0.12), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                  <img src={BRAND_IMG.sorry} alt="" style={{ width: "min(100px,26vw)", height: "auto", margin: "0 auto 14px", display: "block", objectFit: "contain", animation: "float-bob 4s ease-in-out 0.5s infinite", filter: "drop-shadow(0 6px 16px rgba(255,77,126,0.35))" }} />
                  <div style={{ fontFamily: "var(--font-round)", fontSize: "0.88rem", fontWeight: 900, color: "#FF6FA3", marginBottom: 8, letterSpacing: "0.03em" }}>She's Mad 😤</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", fontStyle: "italic", lineHeight: 1.6 }}>The "No" button literally runs away 😈</div>
                </motion.button>
              </div>

              {/* Feature chips */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
                {["💌 AI-crafted", "🔗 Shareable link", "💥 Interactive"].map(t => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <img src={BRAND_IMG.logo} alt="" style={{ width: 22, height: 22, opacity: 0.28, objectFit: "contain" }} />
                <p style={{ fontFamily: "var(--font-round)", fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em", fontWeight: 700 }}>LOVEYOUAI · pure love, zero cringe</p>
              </motion.div>

              {/* For Him link */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                style={{ marginTop: 18, textAlign: "center" }}>
                <a href="/him" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", background: "rgba(29,78,216,0.1)", border: "1px solid rgba(96,165,250,0.14)", borderRadius: 100, padding: "7px 18px" }}>
                  <span style={{ fontSize: "0.85rem" }}>⚡</span>
                  <span style={{ fontFamily: "var(--font-round)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(96,165,250,0.45)", textTransform: "uppercase" }}>He Deserves One Too →</span>
                  <span style={{ fontSize: "0.85rem" }}>🔥</span>
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 36, cursor: "pointer" }} onClick={() => window.location.href = "/old/create"}>
                <img src={BRAND_IMG.logo} alt="" style={{ width: 22, height: 42, opacity: 0.88, objectFit: "contain" }} />
                <p style={{ fontFamily: "var(--font-round)", fontSize: "0.9rem", color: "rgba(245, 242, 245, 0.15)", letterSpacing: "0.1em", fontWeight: 800 }}>Click here for · Old Version Love</p>
              </motion.div>
            </motion.div>
          )}

          {/* ══ LOVE FORM ══ */}
          {mode === "love-form" && (
            <motion.div key="love-form" {...pageEnter} style={{ width: "100%", maxWidth: 520 }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <img src={BRAND_IMG.loveLetter} alt="" style={{ width: "min(80px,22vw)", height: "auto", margin: "0 auto 12px", display: "block", filter: "drop-shadow(0 6px 20px rgba(255,77,126,0.4))", animation: "float-bob 3s ease-in-out infinite" }} />
                <h2 style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1.5rem,5vw,2rem)", color: "#FF85A2", marginBottom: 6, textShadow: "0 4px 20px rgba(255,77,126,0.4)" }}>Build Her Universe</h2>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Every word becomes a star in her sky</p>
              </div>

              <div className="jelly-card" style={{ padding: "28px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Her Name ✦">
                    <input className="jelly-input" placeholder="e.g. Priya" value={love.to} onChange={e => setL("to", e.target.value)} />
                  </Field>
                  <Field label="Your Name ✦">
                    <input className="jelly-input" placeholder="e.g. Arjun" value={love.from} onChange={e => setL("from", e.target.value)} />
                  </Field>
                </div>

                <Field label="Your Love Message ✦">
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", fontStyle: "italic", marginBottom: 8 }}>This types out letter by letter, like a message from the stars ✨</p>
                  <textarea className="jelly-input" placeholder="Tell her how the stars rearranged themselves the day you met her…" value={love.message} onChange={e => setL("message", e.target.value)} rows={4} style={{ resize: "vertical" }} />
                </Field>

                <Field label="A Memory Only You Two Share ✦">
                  <textarea className="jelly-input" placeholder="That rainy evening when… / The first time you laughed at my terrible joke…" value={love.memory} onChange={e => setL("memory", e.target.value)} rows={3} style={{ resize: "vertical" }} />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Together Since ✦">
                    <input type="date" className="jelly-input" style={{ colorScheme: "dark" }} value={love.date} onChange={e => setL("date", e.target.value)} />
                  </Field>
                  <Field label="Your Song ✦">
                    <input className="jelly-input" placeholder="e.g. Perfect – Ed Sheeran" value={love.song} onChange={e => setL("song", e.target.value)} />
                  </Field>
                </div>

                {/* Photo upload */}
                <Field label="A Photo of You Two ✦">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => fileRef.current?.click()}
                      className="sqbtn sqbtn-ghost"
                      style={{ padding: "11px 18px", fontSize: "0.85rem", borderRadius: 14 }}>
                      📷 Choose Photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
                    {photoPreview
                      ? <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,133,162,0.5)", flexShrink: 0 }}><img src={photoPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      : <span style={{ fontFamily: "var(--font-round)", fontSize: "0.68rem", color: "rgba(255,255,255,0.22)", fontWeight: 600 }}>A pic that makes her smile 🌟</span>}
                  </div>
                </Field>

                {error && <div style={{ color: "#FF6B6B", fontFamily: "var(--font-round)", fontSize: "0.8rem", textAlign: "center", fontWeight: 700 }}>{error}</div>}

                <div style={{ display: "flex", gap: 10, justifyContent: "center", paddingTop: 4 }}>
                  <button className="sqbtn sqbtn-ghost" onClick={() => setMode("pick")}>← Back</button>
                  <motion.button className="sqbtn sqbtn-rose" onClick={submitLove}
                    disabled={!love.to || !love.from || !love.message}
                    whileHover={love.to && love.from && love.message ? { scale: 1.05, y: -3 } : {}}
                    whileTap={love.to && love.from && love.message ? { scale: 0.93 } : {}}
                    style={{ opacity: love.to && love.from && love.message ? 1 : 0.35, cursor: love.to && love.from && love.message ? "pointer" : "not-allowed" }}>
                    ✦ Generate Her Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ SORRY FORM ══ */}
          {mode === "sorry-form" && (
            <motion.div key="sorry-form" {...pageEnter} style={{ width: "100%", maxWidth: 520 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <img src={BRAND_IMG.sorry} alt="" style={{ width: "min(80px,22vw)", height: "auto", margin: "0 auto 12px", display: "block", filter: "drop-shadow(0 6px 20px rgba(255,77,126,0.45))", animation: "float-bob 3.5s ease-in-out infinite" }} />
                <h2 style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1.5rem,5vw,2rem)", color: "#FF6FA3", marginBottom: 6, textShadow: "0 4px 20px rgba(255,77,126,0.4)" }}>The Apology Page 💋</h2>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "rgba(255,220,235,0.4)", fontStyle: "italic" }}>She can't stay mad. The "No" button won't let her.</p>
              </div>

              <div className="jelly-card" style={{ padding: "28px 22px", display: "flex", flexDirection: "column", gap: 18, borderColor: "rgba(255,77,126,0.18)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Her Name 💗" color="rose">
                    <input className="jelly-input" placeholder="e.g. Priya" value={sorry.to} onChange={e => setS("to", e.target.value)} />
                  </Field>
                  <Field label="Your Name 💗" color="rose">
                    <input className="jelly-input" placeholder="e.g. Arjun" value={sorry.from} onChange={e => setS("from", e.target.value)} />
                  </Field>
                </div>

                <Field label="Your Apology Message 💋" color="rose">
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", color: "rgba(255,200,220,0.25)", fontStyle: "italic", marginBottom: 8 }}>This types out slowly while she reads it. Make it hit 😢</p>
                  <textarea className="jelly-input" placeholder="I know I messed up. I keep replaying it and I hate that I hurt you…" value={sorry.apology} onChange={e => setS("apology", e.target.value)} rows={4} style={{ resize: "vertical" }} />
                </Field>

                <Field label="Why I'm Sorry (up to 3) 🌸" color="rose">
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", color: "rgba(255,200,220,0.25)", fontStyle: "italic", marginBottom: 8 }}>These appear one by one as falling cards ✨</p>
                  {[0, 1, 2].map(i => (
                    <input key={i} className="jelly-input" style={{ marginBottom: i < 2 ? 10 : 0 }}
                      placeholder={["I should have listened instead of reacting", "I take you for granted sometimes and that's not okay", "You deserved better from me in that moment"][i]}
                      value={sorry.reasons[i]}
                      onChange={e => { const r = [...sorry.reasons]; r[i] = e.target.value; setS("reasons", r); }} />
                  ))}
                </Field>

                <Field label="After She Forgives You… 💕" color="rose">
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", color: "rgba(255,200,220,0.25)", fontStyle: "italic", marginBottom: 8 }}>Shown on the celebration screen. Make it tender 🥺</p>
                  <textarea className="jelly-input" placeholder="I promise to be better. You are my favourite person in this world…" value={sorry.extra} onChange={e => setS("extra", e.target.value)} rows={3} style={{ resize: "vertical" }} />
                </Field>

                {error && <div style={{ color: "#FF6B6B", fontFamily: "var(--font-round)", fontSize: "0.8rem", textAlign: "center", fontWeight: 700 }}>{error}</div>}

                <div style={{ display: "flex", gap: 10, justifyContent: "center", paddingTop: 4 }}>
                  <button className="sqbtn sqbtn-ghost" onClick={() => setMode("pick")}>← Back</button>
                  <motion.button className="sqbtn sqbtn-rose" onClick={submitSorry}
                    disabled={!sorry.to || !sorry.from || !sorry.apology}
                    whileHover={sorry.to && sorry.from && sorry.apology ? { scale: 1.05, y: -3 } : {}}
                    whileTap={sorry.to && sorry.from && sorry.apology ? { scale: 0.93 } : {}}
                    style={{ opacity: sorry.to && sorry.from && sorry.apology ? 1 : 0.35, cursor: sorry.to && sorry.from && sorry.apology ? "pointer" : "not-allowed" }}>
                    💋 Generate Apology Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ SUBMITTING ══ */}
          {mode === "submitting" && (
            <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: "2.8rem", display: "block", marginBottom: 20 }}>💫</motion.div>
              <p style={{ fontFamily: "var(--font-fun)", fontSize: "1.1rem", color: "rgba(255,133,162,0.7)" }}>Sprinkling magic…</p>
            </motion.div>
          )}

          {/* ══ DONE SCREENS ══ */}
          {(mode === "love-done" || mode === "sorry-done") && (() => {
            const isLove = mode === "love-done";
            const link = isLove ? loveLink : sorryLink;
            return (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: "center", maxWidth: 520, width: "100%" }}>

                {/* Big emoji */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: [0, 1.3, 0.95, 1.05, 1], rotate: [0, 8, -4, 2, 0] }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ fontSize: "4.5rem", marginBottom: 20, display: "block", filter: `drop-shadow(0 8px 24px rgba(255,77,126,0.5))` }}>
                  {isLove ? "💌" : "💋"}
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ fontFamily: "var(--font-fun)", fontSize: "clamp(1.5rem,5vw,2.2rem)", color: isLove ? "#FFB347" : "#FF85A2", marginBottom: 8, textShadow: `0 4px 24px rgba(${isLove ? "255,179,71" : "255,77,126"},0.45)` }}>
                  {isLove ? "Her Universe is Ready ✨" : "Apology Link Ready 💗"}
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginBottom: 28 }}>
                  {isLove ? `Share this with ${love.to} — she'll never forget it.` : `Send to ${sorry.to} — she won't be able to resist 😈`}
                </motion.p>

                {/* Link box */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="jelly-card" style={{ padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, borderColor: isLove ? "rgba(255,179,71,0.22)" : "rgba(255,107,163,0.22)" }}>
                  <div style={{ flex: 1, fontFamily: "var(--font-round)", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left", fontWeight: 700 }}>
                    {link}
                  </div>
                  <motion.button className={`sqbtn ${isLove ? "sqbtn-gold" : "sqbtn-rose"}`}
                    onClick={() => copy(link)}
                    whileTap={{ scale: 0.9 }}
                    style={{ flexShrink: 0, padding: "10px 18px", fontSize: "0.8rem" }}>
                    {copied ? "✦ Copied!" : "Copy"}
                  </motion.button>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className={`sqbtn ${isLove ? "sqbtn-gold" : "sqbtn-rose"}`}
                    onClick={() => window.open(link, "_blank")}>
                    Preview →
                  </button>
                  <button className="sqbtn sqbtn-ghost" onClick={() => setMode("pick")}>
                    Create Another
                  </button>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                  style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: "0.82rem", color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>
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