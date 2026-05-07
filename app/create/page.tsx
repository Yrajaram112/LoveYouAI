"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function StarField() {
  const [stars, setStars] = useState<any[]>([]);
  const [shooters, setShooters] = useState<any[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: 160 }, (_, i) => ({ id: i, x: Math.random()*100, y: Math.random()*100, size: Math.random()*2.2+0.4, dur: Math.random()*4+2, delay: Math.random()*6 })));
    setShooters(Array.from({ length: 5 }, (_, i) => ({ id: i, x: Math.random()*70, y: Math.random()*40, delay: i*4+Math.random()*3, dur: 1+Math.random()*0.8 })));
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {stars.map(s => <div key={s.id} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:"50%", background: s.size>1.8?"#f5c842":"white", animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />)}
      {shooters.map(s => <div key={s.id} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:2, height:80, background:"linear-gradient(to bottom,transparent,#f5c842,white)", transformOrigin:"top center", transform:"rotate(-43deg)", animation:`shoot ${s.dur}s ease-in ${s.delay}s infinite`, opacity:0 }} />)}
      <div style={{ position:"absolute", top:"-15%", left:"-15%", width:"65vw", height:"65vw", borderRadius:"50%", background:"radial-gradient(circle,#12124e,transparent 70%)", filter:"blur(70px)", animation:"nebula-drift 12s ease-in-out infinite alternate", opacity:0.18 }} />
      <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:"60vw", height:"60vw", borderRadius:"50%", background:"radial-gradient(circle,#3a0e48,transparent 70%)", filter:"blur(70px)", animation:"nebula-drift 10s ease-in-out infinite alternate-reverse", opacity:0.14 }} />
    </div>
  );
}

type Mode = "pick" | "love-form" | "sorry-form" | "submitting" | "love-done" | "sorry-done";

export default function CreatePage() {
  const [mode, setMode] = useState<Mode>("pick");
  const [loveLink, setLoveLink] = useState("");
  const [sorryLink, setSorryLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [love, setLove] = useState({ to:"", from:"", message:"", memory:"", date:"", song:"", photo:"" });
  const setL = (k:string, v:string) => setLove(f=>({...f,[k]:v}));

  const [sorry, setSorry] = useState({ to:"", from:"", apology:"", reasons:["","",""], extra:"" });
  const setS = (k:string, v:string|string[]) => setSorry(f=>({...f,[k]:v}));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 600;
      const ratio = Math.min(MAX/img.width, MAX/img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width*ratio);
      canvas.height = Math.round(img.height*ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      setPhotoPreview(dataUrl);
      setL("photo", dataUrl);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const submitLove = async () => {
    setError("");
    setSubmitting(true);
    setMode("submitting");
    try {
      const res = await fetch("/api/love", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ to:love.to, from:love.from, message:love.message, memory:love.memory, date:love.date, song:love.song, photoBase64: love.photo||null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Failed");
      // Wait 2 seconds for Sanity CDN to sync before showing the link
      await new Promise(r => setTimeout(r, 2000));
      setLoveLink(`${window.location.origin}/open/${data.id}`);
      setMode("love-done");
    } catch(e:any) {
      setError(e.message);
      setMode("love-form");
    }
    setSubmitting(false);
  };

  const submitSorry = async () => {
    setError("");
    setSubmitting(true);
    setMode("submitting");
    try {
      const res = await fetch("/api/sorry", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ to:sorry.to, from:sorry.from, apology:sorry.apology, reasons:sorry.reasons.filter(Boolean), extra:sorry.extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Failed");
      // Wait 2 seconds for Sanity CDN to sync before showing the link
      await new Promise(r => setTimeout(r, 2000));
      setSorryLink(`${window.location.origin}/sorry/${data.id}`);
      setMode("sorry-done");
    } catch(e:any) {
      setError(e.message);
      setMode("sorry-form");
    }
    setSubmitting(false);
  };

  const copy = (link:string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2500);
  };

  const Label = ({c, children}:{c?:string,children:React.ReactNode}) => (
    <label style={{ fontFamily:"'Cinzel',serif", fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase", color: c||"#f5c842", marginBottom:6, display:"block" }}>{children}</label>
  );

  const inputStyle = (pink=false):React.CSSProperties => ({
    background:"rgba(255,255,255,0.04)", border:`1px solid rgba(${pink?"255,110,180":"245,200,66"},0.22)`,
    borderRadius:12, color:"#f0f0ff", fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem",
    padding:"13px 17px", width:"100%", outline:"none", transition:"all 0.3s",
  });

  return (
    <div style={{ minHeight:"100vh", position:"relative" }}>
      <StarField />
      <div style={{ position:"relative", zIndex:2, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 20px" }}>

        <AnimatePresence mode="wait">

          {/* ── MODE PICKER ── */}
          {mode==="pick" && (
            <motion.div key="pick" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.7}} style={{textAlign:"center",maxWidth:640,width:"100%"}}>
              <motion.div animate={{scale:[1,1.08,1]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}} style={{fontSize:"3rem",marginBottom:16}}>✦</motion.div>
              <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(2rem,6vw,3.8rem)", fontWeight:700, letterSpacing:"0.08em", color:"#f5c842", textShadow:"0 0 40px rgba(245,200,66,0.5)", marginBottom:8 }}>ForYouOnly</h1>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1rem,2.5vw,1.25rem)", color:"rgba(240,240,255,0.6)", fontStyle:"italic", marginBottom:12 }}>A love letter, built into a link.</p>
              <div style={{ width:80, height:1, background:"linear-gradient(to right,transparent,#f5c842,transparent)", margin:"0 auto 40px" }} />

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20, maxWidth:560, margin:"0 auto 32px" }}>
                {/* Love Letter */}
                <motion.button whileHover={{scale:1.03,y:-4}} whileTap={{scale:0.97}} onClick={()=>setMode("love-form")}
                  style={{ background:"rgba(245,200,66,0.05)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:24, padding:"36px 24px", cursor:"pointer", textAlign:"center", color:"inherit", transition:"all 0.3s" }}>
                  <div style={{fontSize:"2.8rem",marginBottom:14}}>💌</div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.78rem", letterSpacing:"0.18em", color:"#f5c842", textTransform:"uppercase", marginBottom:10 }}>Love Letter</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem", color:"rgba(255,255,255,0.4)", fontStyle:"italic", lineHeight:1.7 }}>Make her feel like the whole universe rearranged itself for her</div>
                </motion.button>
                {/* She's Mad */}
                <motion.button whileHover={{scale:1.03,y:-4}} whileTap={{scale:0.97}} onClick={()=>setMode("sorry-form")}
                  style={{ background:"rgba(255,110,180,0.05)", border:"1px solid rgba(255,110,180,0.2)", borderRadius:24, padding:"36px 24px", cursor:"pointer", textAlign:"center", color:"inherit", transition:"all 0.3s" }}>
                  <div style={{fontSize:"2.8rem",marginBottom:14}}>🥺</div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.78rem", letterSpacing:"0.18em", color:"#ff6eb4", textTransform:"uppercase", marginBottom:10 }}>She's Mad at Me</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem", color:"rgba(255,255,255,0.4)", fontStyle:"italic", lineHeight:1.7 }}>Playful apology page — the "No" button literally runs away 😈</div>
                </motion.button>
              </div>
              <p style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.15)", letterSpacing:"0.08em" }}>powered by sanity · zero bs · pure love</p>
            </motion.div>
          )}

          {/* ── LOVE FORM ── */}
          {mode==="love-form" && (
            <motion.div key="love-form" initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.7}} style={{width:"100%",maxWidth:580}}>
              <div style={{textAlign:"center",marginBottom:36}}>
                <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.4rem,4vw,2rem)", color:"#f5c842", letterSpacing:"0.1em", marginBottom:8 }}>✦ Build Her Universe</h2>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"rgba(255,255,255,0.35)", fontStyle:"italic" }}>Every field becomes a constellation in her sky</p>
              </div>
              <div className="glass-card" style={{padding:"36px 30px",display:"flex",flexDirection:"column",gap:22}}>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div><Label>Her Name ✦</Label><input style={inputStyle()} className="cosmic-input" placeholder="e.g. Priya" value={love.to} onChange={e=>setL("to",e.target.value)}/></div>
                  <div><Label>Your Name ✦</Label><input style={inputStyle()} className="cosmic-input" placeholder="e.g. Arjun" value={love.from} onChange={e=>setL("from",e.target.value)}/></div>
                </div>

                <div>
                  <Label>Your Love Message ✦</Label>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.25)",fontStyle:"italic",marginBottom:8}}>This appears letter by letter — like a love letter hand-delivered from the stars</p>
                  <textarea className="cosmic-input" placeholder="Tell her how the stars rearranged themselves the day you met her…" value={love.message} onChange={e=>setL("message",e.target.value)} rows={4} style={{...inputStyle(),resize:"vertical"}} />
                </div>

                <div>
                  <Label>A Memory Only You Two Share ✦</Label>
                  <textarea className="cosmic-input" placeholder="That rainy evening when… / The first time you laughed at my terrible joke…" value={love.memory} onChange={e=>setL("memory",e.target.value)} rows={3} style={{...inputStyle(),resize:"vertical"}} />
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div><Label>Together Since ✦</Label><input type="date" className="cosmic-input" style={{...inputStyle(),colorScheme:"dark"}} value={love.date} onChange={e=>setL("date",e.target.value)}/></div>
                  <div><Label>Your Song ✦</Label><input className="cosmic-input" style={inputStyle()} placeholder="e.g. Perfect – Ed Sheeran" value={love.song} onChange={e=>setL("song",e.target.value)}/></div>
                </div>

                <div>
                  <Label>A Photo of You Two ✦</Label>
                  <div style={{display:"flex",alignItems:"center",gap:14,marginTop:2}}>
                    <button onClick={()=>fileRef.current?.click()} style={{ padding:"11px 20px", border:"1px dashed rgba(245,200,66,0.35)", borderRadius:10, background:"rgba(245,200,66,0.04)", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem" }}>📷 Choose Photo</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
                    {photoPreview && <div style={{width:52,height:52,borderRadius:8,overflow:"hidden",border:"2px solid rgba(245,200,66,0.4)"}}><img src={photoPreview} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
                    {!photoPreview && <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.62rem",color:"rgba(255,255,255,0.18)"}}>Uploaded to Sanity CDN — crisp on any device 🌟</span>}
                  </div>
                </div>

                {error && <div style={{color:"#ff6b6b",fontFamily:"'Space Mono',monospace",fontSize:"0.72rem",textAlign:"center"}}>{error}</div>}

                <div style={{display:"flex",gap:12,justifyContent:"center",paddingTop:8}}>
                  <button onClick={()=>setMode("pick")} style={{padding:"12px 24px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:50,background:"transparent",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.72rem",letterSpacing:"0.1em"}}>← Back</button>
                  <button className="cosmic-btn" onClick={submitLove} disabled={!love.to||!love.from||!love.message} style={{opacity:love.to&&love.from&&love.message?1:0.4,cursor:love.to&&love.from&&love.message?"pointer":"not-allowed"}}>✦ Generate Her Link</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SORRY FORM ── */}
          {mode==="sorry-form" && (
            <motion.div key="sorry-form" initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.7}} style={{width:"100%",maxWidth:580}}>
              <div style={{textAlign:"center",marginBottom:36}}>
                <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.4rem,4vw,2rem)", color:"#ff6eb4", letterSpacing:"0.1em", marginBottom:8 }}>💋 The Apology Page</h2>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"rgba(255,200,220,0.4)", fontStyle:"italic" }}>She can't stay mad. The "No" button won't let her.</p>
              </div>
              <div className="glass-card" style={{padding:"36px 30px",display:"flex",flexDirection:"column",gap:22,borderColor:"rgba(255,110,180,0.15)"}}>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div><Label c="#ff6eb4">Her Name 💗</Label><input className="cosmic-input" style={inputStyle(true)} placeholder="e.g. Priya" value={sorry.to} onChange={e=>setS("to",e.target.value)}/></div>
                  <div><Label c="#ff6eb4">Your Name 💗</Label><input className="cosmic-input" style={inputStyle(true)} placeholder="e.g. Arjun" value={sorry.from} onChange={e=>setS("from",e.target.value)}/></div>
                </div>

                <div>
                  <Label c="#ff6eb4">Your Apology Message 💋</Label>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.78rem",color:"rgba(255,200,220,0.25)",fontStyle:"italic",marginBottom:8}}>This types out slowly while she reads it. Make it hit.</p>
                  <textarea className="cosmic-input" style={{...inputStyle(true),resize:"vertical"}} placeholder="I know I messed up. I keep replaying it and I hate that I hurt you. You mean everything to me and I will do better…" value={sorry.apology} onChange={e=>setS("apology",e.target.value)} rows={4}/>
                </div>

                <div>
                  <Label c="#ff6eb4">Reasons I'm Sorry (up to 3) 🌸</Label>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.78rem",color:"rgba(255,200,220,0.25)",fontStyle:"italic",marginBottom:8}}>These flip in like falling dominoes, one by one</p>
                  {[0,1,2].map(i=>(
                    <input key={i} className="cosmic-input" style={{...inputStyle(true),marginBottom:i<2?10:0}} placeholder={["I should have listened instead of reacting","I take you for granted sometimes and that's not okay","You deserved better from me in that moment"][i]} value={sorry.reasons[i]} onChange={e=>{const r=[...sorry.reasons];r[i]=e.target.value;setS("reasons",r);}}/>
                  ))}
                </div>

                <div>
                  <Label c="#ff6eb4">After She Forgives You… 💕</Label>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.78rem",color:"rgba(255,200,220,0.25)",fontStyle:"italic",marginBottom:8}}>Shown on the celebration screen. Make it tender.</p>
                  <textarea className="cosmic-input" style={{...inputStyle(true),resize:"vertical"}} placeholder="I promise to be better. You are my favourite person in this world and I never want to lose you. I love you more than words…" value={sorry.extra} onChange={e=>setS("extra",e.target.value)} rows={3}/>
                </div>

                {error && <div style={{color:"#ff6b6b",fontFamily:"'Space Mono',monospace",fontSize:"0.72rem",textAlign:"center"}}>{error}</div>}

                <div style={{display:"flex",gap:12,justifyContent:"center",paddingTop:8}}>
                  <button onClick={()=>setMode("pick")} style={{padding:"12px 24px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:50,background:"transparent",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.72rem",letterSpacing:"0.1em"}}>← Back</button>
                  <button onClick={submitSorry} disabled={!sorry.to||!sorry.from||!sorry.apology}
                    style={{padding:"15px 36px",borderRadius:50,border:"none",background:sorry.to&&sorry.from&&sorry.apology?"linear-gradient(135deg,#ff6eb4,#ff3d9a)":"rgba(255,110,180,0.2)",color:"white",fontFamily:"'Cinzel',serif",fontSize:"0.82rem",letterSpacing:"0.15em",cursor:sorry.to&&sorry.from&&sorry.apology?"pointer":"not-allowed",fontWeight:700,boxShadow:sorry.to&&sorry.from&&sorry.apology?"0 0 24px rgba(255,110,180,0.35)":"none"}}>
                    💋 Generate Her Apology Link
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SUBMITTING ── */}
          {mode==="submitting" && (
            <motion.div key="submitting" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:"center"}}>
              <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:"linear"}} style={{fontSize:"2.5rem",display:"block",marginBottom:20}}>✦</motion.div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"rgba(255,255,255,0.5)",fontStyle:"italic"}}>Saving to the stars…</p>
            </motion.div>
          )}

          {/* ── LOVE DONE ── */}
          {(mode==="love-done"||mode==="sorry-done") && (
            <motion.div key="done" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}} style={{textAlign:"center",maxWidth:580,width:"100%"}}>
              <motion.div initial={{scale:0}} animate={{scale:[0,1.3,1]}} transition={{duration:0.6,ease:"backOut"}} style={{marginBottom:24,fontSize:"4rem"}}>
                {mode==="love-done"?"💌":"💋"}
              </motion.div>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.4rem,4vw,2rem)", color: mode==="love-done"?"#f5c842":"#ff6eb4", letterSpacing:"0.08em", marginBottom:8 }}>
                {mode==="love-done"?"Her Universe is Ready ✦":"Apology Link Ready 💗"}
              </h2>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"rgba(255,255,255,0.45)", fontStyle:"italic", marginBottom:32 }}>
                {mode==="love-done"
                  ? `Share this with ${love.to}. She'll never forget it.`
                  : `Send this to ${sorry.to}. She won't be able to resist. 😈`}
              </p>

              <div className="glass-card" style={{padding:"18px 22px",marginBottom:18,display:"flex",alignItems:"center",gap:12,borderColor: mode==="love-done"?"rgba(245,200,66,0.2)":"rgba(255,110,180,0.2)"}}>
                <div style={{flex:1,fontFamily:"'Space Mono',monospace",fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>
                  {mode==="love-done"?loveLink:sorryLink}
                </div>
                <button onClick={()=>copy(mode==="love-done"?loveLink:sorryLink)}
                  style={{flexShrink:0,padding:"10px 18px",borderRadius:30,border:`1px solid rgba(${mode==="love-done"?"245,200,66":"255,110,180"},0.4)`,background:copied?`rgba(${mode==="love-done"?"245,200,66":"255,110,180"},0.18)`:`rgba(${mode==="love-done"?"245,200,66":"255,110,180"},0.06)`,color:copied?(mode==="love-done"?"#f5c842":"#ff6eb4"):"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.7rem",letterSpacing:"0.1em",transition:"all 0.3s"}}>
                  {copied?"✦ Copied!":"Copy"}
                </button>
              </div>

              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={()=>window.open(mode==="love-done"?loveLink:sorryLink,"_blank")}
                  style={{padding:"14px 36px",borderRadius:50,border:"none",background: mode==="love-done"?"linear-gradient(135deg,#f5c842,#c9a227)":"linear-gradient(135deg,#ff6eb4,#ff3d9a)",color: mode==="love-done"?"#02020a":"white",fontFamily:"'Cinzel',serif",fontSize:"0.82rem",letterSpacing:"0.15em",cursor:"pointer",fontWeight:700}}>
                  Preview →
                </button>
                <button onClick={()=>setMode("pick")}
                  style={{padding:"12px 24px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:50,background:"transparent",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.72rem",letterSpacing:"0.1em"}}>
                  Create Another
                </button>
              </div>

              <p style={{marginTop:28,fontFamily:"'Cormorant Garamond',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.2)",fontStyle:"italic"}}>
                Stored in Sanity — link works on any device, forever 🌌
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
