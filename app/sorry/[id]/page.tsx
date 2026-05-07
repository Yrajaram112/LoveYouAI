"use client";
import { use, useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { readClient, SORRY_QUERY } from "@/lib/sanity";

interface SorryData {
  _id: string; to: string; from: string; apology: string;
  reasons: string[]; extra: string; forgiven: boolean;
}

// ── Pink Cosmic Background ──────────────────────────────────────────────────
function PinkCosmos() {
  const [kisses,setKisses]=useState<any[]>([]);
  const [stars,setStars]=useState<any[]>([]);
  useEffect(()=>{
    setKisses(Array.from({length:24},(_,i)=>({id:i,x:Math.random()*100,dur:6+Math.random()*9,delay:Math.random()*12,size:13+Math.random()*22,op:0.05+Math.random()*0.1,emoji:["💋","💗","🌸","💕","✨","💖","🩷","😘"][Math.floor(Math.random()*8)]})));
    setStars(Array.from({length:110},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,w:Math.random()*2.2+0.4,h:Math.random()*2.2+0.4,h1:315+Math.random()*50,h2:75+Math.random()*25,dur:2+Math.random()*4,delay:Math.random()*5})));
  },[]);
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-20%",left:"-10%",width:"70vw",height:"70vw",borderRadius:"50%",background:"radial-gradient(circle,#c2185b,transparent 70%)",filter:"blur(80px)",opacity:0.1,animation:"nebula-drift 11s ease-in-out infinite alternate"}}/>
      <div style={{position:"absolute",bottom:"-15%",right:"-10%",width:"65vw",height:"65vw",borderRadius:"50%",background:"radial-gradient(circle,#880e4f,transparent 70%)",filter:"blur(80px)",opacity:0.1,animation:"nebula-drift 9s ease-in-out infinite alternate-reverse"}}/>
      <div style={{position:"absolute",top:"35%",right:"15%",width:"45vw",height:"45vw",borderRadius:"50%",background:"radial-gradient(circle,#ad1457,transparent 70%)",filter:"blur(65px)",opacity:0.08,animation:"nebula-drift 7s ease-in-out 1s infinite alternate"}}/>
      {stars.map(s=><div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.w,height:s.h,borderRadius:"50%",background:`hsl(${s.h1},90%,${s.h2}%)`,animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`}}/>)}
      {kisses.map(k=><div key={k.id} style={{position:"absolute",left:`${k.x}%`,bottom:"-60px",fontSize:k.size,opacity:k.op,animation:`float-up ${k.dur}s ease-in ${k.delay}s infinite`}}>{k.emoji}</div>)}
    </div>
  );
}

// ── Kiss confetti ───────────────────────────────────────────────────────────
function KissBurst() {
  const [particles,setParticles]=useState<any[]>([]);
  useEffect(()=>{
    const emojis=["💋","💗","💖","🌸","✨","🩷","💕","😘","🎀","💝"];
    setParticles(Array.from({length:90},(_,i)=>({id:i,emoji:emojis[i%emojis.length],angle:(i/90)*360,dist:100+Math.random()*200,size:16+Math.random()*26,dur:0.7+Math.random()*0.9,delay:Math.random()*0.5})));
  },[]);
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
      {[...Array(7)].map((_,b)=>(
        <div key={b} style={{position:"absolute",left:`${10+b*13}%`,top:`${10+(b%3)*28}%`}}>
          {particles.map(p=>(
            <motion.div key={p.id} initial={{x:0,y:0,scale:0,opacity:1}}
              animate={{x:Math.cos(p.angle*Math.PI/180)*p.dist,y:Math.sin(p.angle*Math.PI/180)*p.dist,scale:1,opacity:0}}
              transition={{duration:p.dur,delay:b*0.2+p.delay,ease:"easeOut"}}
              style={{position:"absolute",fontSize:p.size}}>{p.emoji}</motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Sad bouncing mascot ─────────────────────────────────────────────────────
function Mascot({mood}:{mood:"devastated"|"hopeful"|"ecstatic"}) {
  const faces={devastated:"🥺",hopeful:"😢",ecstatic:"😍"};
  const colors={devastated:"drop-shadow(0 0 18px rgba(255,110,180,0.3))",hopeful:"drop-shadow(0 0 22px rgba(255,110,180,0.45))",ecstatic:"drop-shadow(0 0 30px rgba(255,110,180,0.7))"};
  return (
    <motion.div
      animate={{
        y: mood==="ecstatic"?[0,-30,0]:[0,-14,0],
        rotate: mood==="ecstatic"?[0,-12,12,-8,8,0]:[0,-3,3,0],
        scale: mood==="ecstatic"?[1,1.1,1]:1,
      }}
      transition={{duration:mood==="ecstatic"?0.5:2,repeat:Infinity,ease:"easeInOut"}}
      style={{fontSize:"clamp(4.5rem,15vw,7.5rem)",display:"block",filter:colors[mood]}}>
      {faces[mood]}
    </motion.div>
  );
}

// ── Typewriter ──────────────────────────────────────────────────────────────
function Typewriter({text,speed=35,onDone}:{text:string;speed?:number;onDone?:()=>void}) {
  const [shown,setShown]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    setShown("");setDone(false);
    let i=0;
    const iv=setInterval(()=>{i++;setShown(text.slice(0,i));if(i>=text.length){clearInterval(iv);setDone(true);onDone?.();}},speed);
    return ()=>clearInterval(iv);
  },[text]);
  return <span>{shown}{!done&&<span style={{animation:"blink 0.8s step-end infinite",color:"#ff6eb4"}}>|</span>}</span>;
}

// ── Reason cards (flip in like dominoes) ───────────────────────────────────
function ReasonCards({reasons}:{reasons:string[]}) {
  const [shown,setShown]=useState(0);
  useEffect(()=>{
    if(shown>=reasons.filter(Boolean).length) return;
    const t=setTimeout(()=>setShown(s=>s+1),700);
    return ()=>clearTimeout(t);
  },[shown,reasons]);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:500}}>
      {reasons.filter(Boolean).map((r,i)=>(
        <AnimatePresence key={i}>
          {i<shown&&(
            <motion.div initial={{opacity:0,x:-40,rotateY:-25}} animate={{opacity:1,x:0,rotateY:0}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}}
              style={{display:"flex",alignItems:"flex-start",gap:14,background:"rgba(255,110,180,0.06)",border:"1px solid rgba(255,110,180,0.18)",borderRadius:14,padding:"14px 18px",textAlign:"left"}}>
              <span style={{fontSize:"1.1rem",flexShrink:0}}>💗</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",color:"rgba(255,220,235,0.82)",lineHeight:1.65}}>{r}</span>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

// ── The Evil "No" Button ────────────────────────────────────────────────────
function EvilNo({attempts,onAttempt}:{attempts:number;onAttempt:()=>void}) {
  const [pos,setPos]=useState({x:0,y:0});
  const [flash,setFlash]=useState("");
  const msgs=["Nope 😜","Too slow! 💨","Nice try 😇","The audacity 💅","Not today! 🏃","lol bye 😂","Still no 🙈","Hehe 👻","U thought 💀","I'm literally running 🌸"];
  const gone=attempts>=6;

  const flee=useCallback(()=>{
    if(gone) return;
    onAttempt();
    setFlash(msgs[attempts%msgs.length]);
    setTimeout(()=>setFlash(""),1000);
    // pick a random spot — but keep within reasonable bounds
    const newX=(Math.random()-0.5)*300;
    const newY=(Math.random()-0.5)*220;
    setPos({x:newX,y:newY});
  },[attempts,gone,onAttempt]);

  if(gone) return null;

  const scale=Math.max(0.28,1-attempts*0.12);
  const opacity=Math.max(0.18,1-attempts*0.14);

  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <motion.div animate={{x:pos.x,y:pos.y}} transition={{type:"spring",stiffness:420,damping:18}} style={{position:"relative"}}>
        <button
          onMouseEnter={flee}
          onTouchStart={flee}
          onClick={flee}
          style={{
            padding:`${Math.round(10*scale)}px ${Math.round(26*scale)}px`,
            borderRadius:50,border:"1px solid rgba(255,110,180,0.25)",
            background:"rgba(255,110,180,0.07)",
            color:`rgba(255,160,195,${opacity})`,
            cursor:"pointer",fontFamily:"'Cinzel',serif",
            fontSize:`${0.78*scale}rem`,letterSpacing:"0.1em",
            transform:`scale(${scale}) rotate(${attempts*9}deg)`,
            transition:"all 0.3s",userSelect:"none",opacity,
            boxShadow:"none",
          }}>
          No 😤
        </button>
      </motion.div>
      <AnimatePresence>
        {flash&&(
          <motion.div initial={{opacity:0,y:0,scale:0.6}} animate={{opacity:1,y:-44,scale:1}} exit={{opacity:0}} transition={{duration:0.4}}
            style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap",fontFamily:"'Dancing Script',cursive",fontSize:"1rem",color:"#ff6eb4",pointerEvents:"none",zIndex:30}}>
            {flash}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function SorryStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data,setData]=useState<SorryData|null>(null);
  const [error,setError]=useState(false);
  const [scene,setScene]=useState<"loading"|"apology"|"question"|"forgiven">("loading");
  const [apologyDone,setApologyDone]=useState(false);
  const [noAttempts,setNoAttempts]=useState(0);
  const [kissBurst,setKissBurst]=useState(false);

  useEffect(()=>{
    console.log("[sorry/[id]] Fetching with ID:", id);
    readClient.fetch(SORRY_QUERY,{id}).then(d=>{
      console.log("[sorry/[id]] Query result:", d);
      if(!d){console.error("[sorry/[id]] Document not found");setError(true);return;}
      setData(d);
      setTimeout(()=>setScene("apology"),700);
    }).catch(err=>{console.error("[sorry/[id]] Fetch error:", err);setError(true);});
  },[id]);

  const handleForgiven=useCallback(()=>{
    setScene("forgiven");
    setKissBurst(true);
    setTimeout(()=>setKissBurst(false),3800);
    // Notify Sanity
    fetch("/api/forgiven",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}).catch(()=>{});
  },[id]);

  const noGone=noAttempts>=6;
  const yesScale=Math.min(1.6,1+noAttempts*0.1);
  const mood=noAttempts===0?"devastated":noAttempts<3?"hopeful":"ecstatic";

  const forgiveTaunts=[
    "The 'No' button doesn't feel like cooperating today 🙈",
    "Interesting… it keeps running away 🏃‍♂️💨",
    "Maybe the universe is trying to tell you something… ✨",
    "Okay at this point it's obviously a sign 💅",
    "One more try and it might just disappear entirely… 👀",
    "Yeah I'm pretty sure the No button has given up on you 😂",
  ];

  if(error) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",background:"#0d0008",padding:40}}>
      <PinkCosmos/>
      <div style={{position:"relative",zIndex:2}}>
        <div style={{fontSize:"3rem",marginBottom:16}}>💔</div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(255,200,220,0.5)",fontStyle:"italic"}}>This link seems broken — ask him to send a new one.</p>
      </div>
    </div>
  );

  if(!data||scene==="loading") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0d0008"}}>
      <PinkCosmos/>
      <motion.div style={{position:"relative",zIndex:2,textAlign:"center"}}>
        <motion.div animate={{scale:[1,1.25,1]}} transition={{duration:1.1,repeat:Infinity}}>
          <span style={{fontSize:"3rem"}}>💗</span>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0d0008",position:"relative",overflowX:"hidden"}}>
      <PinkCosmos/>
      {kissBurst&&<KissBurst/>}

      <AnimatePresence mode="wait">

        {/* ── APOLOGY SCENE ── */}
        {scene==="apology"&&(
          <motion.div key="apology" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:0.97}} transition={{duration:0.9}}
            style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",position:"relative",zIndex:2}}>

            <Mascot mood="devastated"/>

            <motion.div initial={{opacity:0,y:26}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.9}} style={{marginTop:28,marginBottom:14}}>
              <p style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(0.9rem,3vw,1.1rem)",letterSpacing:"0.22em",color:"rgba(255,182,210,0.5)",textTransform:"uppercase",marginBottom:10}}>a message for</p>
              <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"clamp(2.4rem,9vw,4.5rem)",color:"#ff6eb4",textShadow:"0 0 30px rgba(255,110,180,0.5),0 0 60px rgba(255,110,180,0.2)",lineHeight:1.1}}>{data.to} 💗</div>
            </motion.div>

            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1,duration:0.9}} style={{maxWidth:540,margin:"28px auto 0",width:"100%"}}>
              <div style={{background:"rgba(255,110,180,0.04)",border:"1px solid rgba(255,110,180,0.15)",borderRadius:22,padding:"40px 34px",backdropFilter:"blur(20px)",boxShadow:"0 20px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.03)"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.05rem,2.5vw,1.25rem)",lineHeight:1.95,color:"rgba(255,220,235,0.88)",fontStyle:"italic"}}>
                  <Typewriter text={data.apology} speed={30} onDone={()=>setApologyDone(true)}/>
                </div>
                <div style={{marginTop:26,fontFamily:"'Dancing Script',cursive",fontSize:"1.25rem",color:"rgba(255,110,180,0.7)",textAlign:"right"}}>— {data.from} 💋</div>
              </div>
            </motion.div>

            {/* Reasons flip in */}
            {apologyDone&&data.reasons?.length>0&&(
              <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.8}} style={{marginTop:28,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
                <p style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.22em",color:"rgba(255,150,200,0.45)",textTransform:"uppercase"}}>reasons I'm sorry</p>
                <ReasonCards reasons={data.reasons}/>
              </motion.div>
            )}

            {apologyDone&&(
              <motion.button initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.8}}
                onClick={()=>setScene("question")}
                whileHover={{scale:1.07}} whileTap={{scale:0.95}}
                style={{marginTop:40,padding:"16px 44px",borderRadius:50,border:"none",background:"linear-gradient(135deg,#ff6eb4,#e91e8c)",color:"white",fontFamily:"'Cinzel',serif",fontSize:"0.85rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",boxShadow:"0 0 30px rgba(255,110,180,0.45)",fontWeight:700}}>
                Read My Question 💋
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── QUESTION SCENE ── */}
        {scene==="question"&&(
          <motion.div key="question" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.9}}
            style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",position:"relative",zIndex:2}}>

            <Mascot mood={mood}/>

            <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.9}} style={{marginTop:28,marginBottom:44}}>
              <h2 style={{fontFamily:"'Dancing Script',cursive",fontSize:"clamp(2rem,7vw,3.5rem)",color:"#ff6eb4",textShadow:"0 0 30px rgba(255,110,180,0.5)",lineHeight:1.3,marginBottom:14}}>
                Are you still mad at me? 🥺
              </h2>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(255,200,225,0.4)",fontStyle:"italic"}}>choose wisely… or let fate decide 👀</p>
            </motion.div>

            {/* Taunts */}
            <AnimatePresence>
              {noAttempts>0&&!noGone&&(
                <motion.div key={noAttempts} initial={{opacity:0,scale:0.85,y:10}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,y:-10}}
                  style={{marginBottom:22,fontFamily:"'Dancing Script',cursive",fontSize:"1.05rem",color:"rgba(255,150,200,0.7)",maxWidth:400}}>
                  {forgiveTaunts[Math.min(noAttempts-1,5)]}
                </motion.div>
              )}
              {noGone&&(
                <motion.div initial={{opacity:0,scale:0.6}} animate={{opacity:1,scale:1}} transition={{type:"spring",bounce:0.5}}
                  style={{marginBottom:22,fontFamily:"'Dancing Script',cursive",fontSize:"1.1rem",color:"#ff6eb4"}}>
                  The 'No' button has officially left the chat 😇✨
                </motion.div>
              )}
            </AnimatePresence>

            {/* YES + NO */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:32,flexWrap:"wrap",position:"relative",minHeight:130}}>
              <motion.button
                onClick={handleForgiven}
                animate={{scale:yesScale}}
                whileHover={{scale:yesScale*1.09}}
                whileTap={{scale:yesScale*0.94}}
                style={{
                  padding:"18px 50px",borderRadius:50,border:"none",
                  background:"linear-gradient(135deg,#ff6eb4,#e91e8c)",
                  color:"white",fontFamily:"'Cinzel',serif",
                  fontSize:"1rem",letterSpacing:"0.12em",
                  cursor:"pointer",fontWeight:700,whiteSpace:"nowrap",
                  boxShadow:`0 0 ${24+noAttempts*10}px rgba(255,110,180,${0.45+noAttempts*0.08})`,
                }}>
                Okay fine 😤💕
              </motion.button>

              <EvilNo attempts={noAttempts} onAttempt={()=>setNoAttempts(n=>n+1)}/>
            </div>

            {/* Soft alternatives */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
              style={{marginTop:52,display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
              {["I'm not mad, just disappointed 😞","Fine. But you owe me 💅","Only because you're cute 🥺"].map(label=>(
                <button key={label} onClick={handleForgiven}
                  style={{padding:"10px 20px",borderRadius:50,border:"1px solid rgba(255,110,180,0.22)",background:"rgba(255,110,180,0.05)",color:"rgba(255,200,220,0.6)",cursor:"pointer",fontFamily:"'Cormorant Garamond',serif",fontSize:"0.92rem",fontStyle:"italic",transition:"all 0.3s"}}
                  onMouseEnter={e=>{(e.currentTarget).style.borderColor="rgba(255,110,180,0.5)";(e.currentTarget).style.color="#ff9dc8";}}
                  onMouseLeave={e=>{(e.currentTarget).style.borderColor="rgba(255,110,180,0.22)";(e.currentTarget).style.color="rgba(255,200,220,0.6)";}}>
                  {label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── FORGIVEN SCENE ── */}
        {scene==="forgiven"&&(
          <motion.div key="forgiven" initial={{opacity:0,scale:0.88}} animate={{opacity:1,scale:1}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
            style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",position:"relative",zIndex:2}}>

            <Mascot mood="ecstatic"/>

            <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.9}}>
              <h1 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(1.8rem,6vw,3.8rem)",color:"#ff6eb4",textShadow:"0 0 40px rgba(255,110,180,0.65),0 0 80px rgba(255,110,180,0.3)",letterSpacing:"0.06em",marginTop:24,marginBottom:16}}>
                SHE SAID YES!! 🎉💋
              </h1>
              <p style={{fontFamily:"'Dancing Script',cursive",fontSize:"clamp(1.2rem,4vw,1.9rem)",color:"rgba(255,200,230,0.82)",marginBottom:40}}>
                {data.to} has officially forgiven you ✨
              </p>
            </motion.div>

            {data.extra&&(
              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.8,duration:0.9}} style={{maxWidth:500,marginBottom:40,width:"100%"}}>
                <div style={{background:"rgba(255,110,180,0.05)",border:"1px solid rgba(255,110,180,0.2)",borderRadius:22,padding:"36px 30px",backdropFilter:"blur(20px)"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1rem,2.5vw,1.22rem)",color:"rgba(255,220,235,0.88)",lineHeight:1.9,fontStyle:"italic"}}>{data.extra}</div>
                  <div style={{marginTop:22,fontFamily:"'Dancing Script',cursive",fontSize:"1.25rem",color:"#ff6eb4",textAlign:"right"}}>— {data.from}, forever yours 💋</div>
                </div>
              </motion.div>
            )}

            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}} style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>
              {["💋","💗","😍","🌸","💖","✨","💋"].map((e,i)=>(
                <motion.span key={i} animate={{y:[0,-14,0],scale:[1,1.25,1]}} transition={{duration:1.5,delay:i*0.2,repeat:Infinity}} style={{fontSize:"2.2rem",display:"inline-block"}}>{e}</motion.span>
              ))}
            </motion.div>

            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}} style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:"rgba(255,150,200,0.18)",letterSpacing:"0.1em"}}>
              FORYOUONLY · no more fights · just forever 💋
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
