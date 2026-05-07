"use client";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { readClient, LOVE_QUERY } from "@/lib/sanity";

interface LoveData {
  _id: string; to: string; from: string; message: string;
  memory: string; date: string; song: string; createdAt: string;
  photo?: { asset?: { url: string } };
}

function CosmicBg() {
  const [stars,setStars]=useState<any[]>([]);
  const [shooters,setShooters]=useState<any[]>([]);
  useEffect(()=>{
    setStars(Array.from({length:200},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*2.6+0.4,dur:Math.random()*5+2,delay:Math.random()*6,gold:Math.random()>0.85})));
    setShooters(Array.from({length:9},(_,i)=>({id:i,x:Math.random()*80,y:Math.random()*40,delay:i*3.8+Math.random()*2.5,dur:1+Math.random()*0.7})));
  },[]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      {stars.map(s=><div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:s.gold?"#f5c842":"white",opacity:s.gold?0.7:1,animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`}}/>)}
      {shooters.map(s=><div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:2,height:90,opacity:0,background:"linear-gradient(to bottom,transparent,#f5c842,white)",transformOrigin:"top center",transform:"rotate(-43deg)",animation:`shoot ${s.dur}s ease-in ${s.delay}s infinite`}}/>)}
      <div style={{position:"absolute",top:"-15%",left:"-15%",width:"70vw",height:"70vw",borderRadius:"50%",background:"radial-gradient(circle,#0e0e4e,transparent 70%)",filter:"blur(70px)",animation:"nebula-drift 12s ease-in-out infinite alternate",opacity:0.2}}/>
      <div style={{position:"absolute",bottom:"-20%",right:"-15%",width:"65vw",height:"65vw",borderRadius:"50%",background:"radial-gradient(circle,#3a0e2e,transparent 70%)",filter:"blur(70px)",animation:"nebula-drift 9s ease-in-out infinite alternate-reverse",opacity:0.16}}/>
      <div style={{position:"absolute",top:"35%",left:"25%",width:"45vw",height:"45vw",borderRadius:"50%",background:"radial-gradient(circle,#1a1248,transparent 70%)",filter:"blur(55px)",animation:"nebula-drift 8s ease-in-out 2s infinite alternate",opacity:0.13}}/>
    </div>
  );
}

function FloatingHearts() {
  const [hearts,setHearts]=useState<any[]>([]);
  useEffect(()=>{
    setHearts(Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,dur:7+Math.random()*9,delay:Math.random()*12,size:12+Math.random()*22,op:0.06+Math.random()*0.13})));
  },[]);
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,overflow:"hidden"}}>
      {hearts.map(h=><div key={h.id} style={{position:"absolute",left:`${h.x}%`,bottom:"-60px",fontSize:h.size,opacity:h.op,color:"#f5c842",animation:`float-up ${h.dur}s ease-in ${h.delay}s infinite`}}>♥</div>)}
    </div>
  );
}

function Fireworks() {
  const [particles,setParticles]=useState<any[]>([]);
  useEffect(()=>{
    const colors = ["#f5c842","#ff6b9d","#c4b5fd","#60a5fa","#ff9999","white"];
    setParticles(Array.from({length:55},(_,i)=>({id:i,angle:(i/55)*360,dist:90+Math.random()*130,color:colors[Math.floor(Math.random()*colors.length)],size:4+Math.random()*5,dur:0.8+Math.random()*0.6})));
  },[]);
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:10,overflow:"hidden"}}>
      {[...Array(5)].map((_,b)=>(
        <div key={b} style={{position:"absolute",left:`${15+b*15}%`,top:`${15+(b%3)*22}%`}}>
          {particles.map(p=>(
            <motion.div key={p.id} initial={{x:0,y:0,scale:1,opacity:1}}
              animate={{x:Math.cos(p.angle*Math.PI/180)*p.dist,y:Math.sin(p.angle*Math.PI/180)*p.dist,scale:0,opacity:0}}
              transition={{duration:p.dur,delay:b*0.28,ease:"easeOut"}}
              style={{position:"absolute",width:p.size,height:p.size,borderRadius:"50%",background:p.color,boxShadow:`0 0 6px ${p.color}`}}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function MusicNotes() {
  const [notes,setNotes]=useState<any[]>([]);
  useEffect(()=>{
    setNotes(Array.from({length:10},(_,i)=>({id:i,note:["♪","♫","♩","♬","𝄞"][i%5],x:10+Math.random()*80,dur:3+Math.random()*3,delay:Math.random()*4,size:16+Math.random()*16})));
  },[]);
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {notes.map(n=><div key={n.id} style={{position:"absolute",left:`${n.x}%`,bottom:0,fontSize:n.size,color:"#f5c842",opacity:0,animation:`music-float ${n.dur}s ease-out ${n.delay}s infinite`}}>{n.note}</div>)}
    </div>
  );
}

function Typewriter({text,speed=38,onDone}:{text:string;speed?:number;onDone?:()=>void}) {
  const [shown,setShown]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    setShown("");setDone(false);
    let i=0;
    const iv=setInterval(()=>{i++;setShown(text.slice(0,i));if(i>=text.length){clearInterval(iv);setDone(true);onDone?.();}},speed);
    return ()=>clearInterval(iv);
  },[text]);
  return <span>{shown}{!done&&<span style={{animation:"blink 0.8s step-end infinite",color:"#f5c842"}}>|</span>}</span>;
}

function DaysCounter({dateStr}:{dateStr:string}) {
  const [count,setCount]=useState(0);
  const target=Math.max(0,Math.floor((Date.now()-new Date(dateStr).getTime())/(1000*60*60*24)));
  useEffect(()=>{
    let c=0;const step=Math.max(1,Math.ceil(target/80));
    const iv=setInterval(()=>{c=Math.min(c+step,target);setCount(c);if(c>=target)clearInterval(iv);},16);
    return ()=>clearInterval(iv);
  },[target]);
  const y=Math.floor(target/365),m=Math.floor((target%365)/30),d=target%30;
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(4rem,12vw,8rem)",fontWeight:700,color:"#f5c842",lineHeight:1,textShadow:"0 0 40px rgba(245,200,66,0.6),0 0 80px rgba(245,200,66,0.3)",animation:count<target?"counter-flash 0.25s ease-in-out infinite":"none"}}>{count.toLocaleString()}</div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"rgba(255,255,255,0.45)",marginTop:10}}>days of loving you</div>
      {y>0&&<div style={{marginTop:20,display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap"}}>
        {[{v:y,l:"years"},{v:m,l:"months"},{v:d,l:"days"}].map(x=>(
          <div key={x.l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.8rem",color:"#f5c842"}}>{x.v}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.3)",letterSpacing:"0.12em"}}>{x.l}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}

function Section({children,delay=0}:{children:React.ReactNode;delay?:number}) {
  return (
    <motion.div initial={{opacity:0,y:60,filter:"blur(8px)"}} whileInView={{opacity:1,y:0,filter:"blur(0px)"}}
      viewport={{once:true,margin:"-80px"}} transition={{duration:1.3,delay,ease:[0.16,1,0.3,1]}}>
      {children}
    </motion.div>
  );
}

function PetalBurst({show}:{show:boolean}) {
  const [petals,setPetals]=useState<any[]>([]);
  useEffect(()=>{
    setPetals(Array.from({length:28},(_,i)=>({id:i,emoji:["🌸","🌹","✨","💫","⭐","🌺","💕"][i%7],tx:(Math.random()-0.5)*320,ty:-(80+Math.random()*220),rot:Math.random()*720-360,size:14+Math.random()*22,dur:0.7+Math.random()*0.9})));
  },[]);
  if(!show) return null;
  return (
    <div style={{position:"absolute",top:"50%",left:"50%",pointerEvents:"none",zIndex:20}}>
      {petals.map(p=><motion.div key={p.id} initial={{x:0,y:0,scale:0,rotate:0,opacity:1}} animate={{x:p.tx,y:p.ty,scale:1,rotate:p.rot,opacity:0}} transition={{duration:p.dur,ease:"easeOut"}} style={{position:"absolute",fontSize:p.size,transform:"translate(-50%,-50%)"}}>{p.emoji}</motion.div>)}
    </div>
  );
}

export default function OpenStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<LoveData|null>(null);
  const [error, setError] = useState(false);
  const [scene, setScene] = useState<"loading"|"greeting"|"envelope"|"letter"|"journey">("loading");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [petals, setPetals] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [letterDone, setLetterDone] = useState(false);

  useEffect(()=>{
    console.log("[open/[id]] Fetching with ID:", id);
    readClient.fetch(LOVE_QUERY,{id}).then(d=>{
      console.log("[open/[id]] Query result:", d);
      if(!d){console.error("[open/[id]] Document not found");setError(true);return;}
      setData(d);
      setTimeout(()=>setScene("greeting"),800);
    }).catch(err=>{console.error("[open/[id]] Fetch error:", err);setError(true);});
  },[id]);

  const openEnvelope=()=>{
    setEnvelopeOpen(true);setPetals(true);
    setTimeout(()=>{setPetals(false);setScene("letter");},1300);
  };

  useEffect(()=>{
    if(letterDone){
      setTimeout(()=>setScene("journey"),900);
      setTimeout(()=>setFireworks(true),1100);
      setTimeout(()=>setFireworks(false),4200);
    }
  },[letterDone]);

  if(error) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:40,background:"#02020a"}}>
      <CosmicBg/>
      <div style={{position:"relative",zIndex:2}}>
        <div style={{fontSize:"3rem",marginBottom:20}}>💔</div>
        <h2 style={{fontFamily:"'Cinzel',serif",fontSize:"1.4rem",color:"#f5c842",marginBottom:12}}>This link seems lost in space</h2>
        <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(255,255,255,0.35)",fontStyle:"italic"}}>Ask him to send you a new one.</p>
      </div>
    </div>
  );

  if(!data||scene==="loading") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#02020a"}}>
      <CosmicBg/>
      <motion.div style={{position:"relative",zIndex:2,textAlign:"center"}}>
        <motion.div animate={{rotate:360}} transition={{duration:2.5,repeat:Infinity,ease:"linear"}} style={{fontSize:"2.2rem",display:"block",marginBottom:18}}>✦</motion.div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(255,255,255,0.35)",fontStyle:"italic"}}>Opening your universe…</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",position:"relative",overflowX:"hidden",background:"#02020a"}}>
      <CosmicBg/>
      {scene==="journey"&&<FloatingHearts/>}
      {fireworks&&<Fireworks/>}

      <AnimatePresence mode="wait">

        {/* GREETING */}
        {scene==="greeting"&&(
          <motion.div key="greeting" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:1.04}} transition={{duration:1}}
            style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",position:"relative",zIndex:2}}>
            <div style={{position:"relative",marginBottom:36}}>
              {[...Array(3)].map((_,i)=>(
                <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:180,height:180,borderRadius:"50%",border:`1px solid rgba(245,200,66,${0.25-i*0.07})`,animation:`ring-pulse 2.5s ease-out ${i*0.55}s infinite`}}/>
              ))}
              <motion.div initial={{scale:0,rotate:-15}} animate={{scale:1,rotate:0}} transition={{delay:0.3,duration:1.3,ease:[0.16,1,0.3,1]}}>
                <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"clamp(3rem,12vw,6rem)",color:"#f5c842",position:"relative",zIndex:1,textShadow:"0 0 40px rgba(245,200,66,0.5),0 0 80px rgba(245,200,66,0.2)",lineHeight:1.1}}>{data.to}</div>
              </motion.div>
            </div>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:0.9}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.05rem,2.8vw,1.4rem)",color:"rgba(255,255,255,0.55)",fontStyle:"italic",marginBottom:12}}>Someone rearranged the stars for you tonight.</p>
              <p style={{fontFamily:"'Cinzel',serif",fontSize:"0.78rem",color:"rgba(245,200,66,0.65)",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:52}}>— from {data.from}, with all his heart —</p>
            </motion.div>
            <motion.button initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.9,duration:0.7}} className="cosmic-btn" onClick={()=>setScene("envelope")} whileHover={{scale:1.06}} whileTap={{scale:0.96}}>
              Open Your Letter ✦
            </motion.button>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.8}} style={{position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:"rgba(255,255,255,0.18)",letterSpacing:"0.15em"}}>SCROLL DOWN</div>
              <motion.div animate={{y:[0,8,0]}} transition={{duration:1.5,repeat:Infinity}}><div style={{color:"rgba(245,200,66,0.4)",fontSize:"1.1rem"}}>↓</div></motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ENVELOPE */}
        {scene==="envelope"&&(
          <motion.div key="envelope" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.9}}
            style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",position:"relative",zIndex:2}}>
            <motion.p initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.9}} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"rgba(255,255,255,0.45)",fontStyle:"italic",marginBottom:64}}>He wrote you something…</motion.p>
            <div style={{position:"relative",cursor:"pointer"}} onClick={openEnvelope}>
              <PetalBurst show={petals}/>
              <motion.div initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.5,duration:1.1,ease:[0.16,1,0.3,1]}} whileHover={{scale:1.05,rotate:1}}>
                <div style={{width:290,height:195,position:"relative"}}>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#1a1a3e,#2d0e3a)",border:"1px solid rgba(245,200,66,0.4)",borderRadius:8,boxShadow:"0 20px 60px rgba(0,0,0,0.5),0 0 40px rgba(245,200,66,0.1)"}}/>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:"55%",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:"200%",background:"linear-gradient(160deg,#12123a,#3a0e48)",border:"1px solid rgba(245,200,66,0.3)",clipPath:"polygon(0 0,100% 0,50% 100%)",transformOrigin:"top center",transition:"transform 0.9s ease",transform:envelopeOpen?"rotateX(-180deg)":"rotateX(0deg)"}}/>
                  </div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:"55%",overflow:"hidden"}}>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"200%",background:"linear-gradient(to bottom,#2d1b60,#1a1a40)",clipPath:"polygon(0 100%,100% 100%,50% 0)"}}/>
                  </div>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:46,height:46,borderRadius:"50%",background:"radial-gradient(circle,#f5c842,#c9a227)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",boxShadow:"0 0 20px rgba(245,200,66,0.5)",zIndex:2}}>♥</div>
                </div>
              </motion.div>
            </div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3}} style={{marginTop:44,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <motion.p animate={{opacity:[0.4,1,0.4]}} transition={{duration:2,repeat:Infinity}} style={{fontFamily:"'Cinzel',serif",fontSize:"0.73rem",letterSpacing:"0.22em",color:"rgba(245,200,66,0.65)"}}>TAP THE ENVELOPE</motion.p>
              <motion.div animate={{y:[0,7,0]}} transition={{duration:1.5,repeat:Infinity}}><span style={{color:"rgba(245,200,66,0.45)",fontSize:"1.2rem"}}>↓</span></motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* LETTER */}
        {scene==="letter"&&(
          <motion.div key="letter" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.9}}
            style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 24px",position:"relative",zIndex:2}}>
            <div style={{maxWidth:600,width:"100%"}}>
              <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:1.1}}>
                <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(245,200,66,0.18)",borderRadius:20,padding:"52px 44px",backdropFilter:"blur(20px)",boxShadow:"0 30px 80px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.04)"}}>
                  <div style={{textAlign:"center",marginBottom:40}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.28em",color:"rgba(245,200,66,0.45)",textTransform:"uppercase",marginBottom:14}}>A Letter From the Stars</div>
                    <div style={{width:64,height:1,background:"linear-gradient(to right,transparent,#f5c842,transparent)",margin:"0 auto"}}/>
                  </div>
                  <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"1.1rem",color:"rgba(245,200,66,0.85)",marginBottom:22}}>My dearest {data.to},</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1rem,2.4vw,1.22rem)",lineHeight:1.95,color:"rgba(240,240,255,0.86)",letterSpacing:"0.015em"}}>
                    <Typewriter text={data.message} speed={32} onDone={()=>setTimeout(()=>setLetterDone(true),900)}/>
                  </div>
                  {letterDone&&(
                    <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.9}} style={{marginTop:36,paddingTop:26,borderTop:"1px solid rgba(245,200,66,0.1)",textAlign:"right"}}>
                      <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"1.1rem",color:"rgba(245,200,66,0.75)"}}>Forever yours,</div>
                      <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"1.7rem",color:"#f5c842",textShadow:"0 0 20px rgba(245,200,66,0.4)"}}>{data.from} ♥</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* JOURNEY */}
        {scene==="journey"&&(
          <motion.div key="journey" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.2}} style={{position:"relative",zIndex:2}}>

            {/* Days Counter */}
            {data.date&&(
              <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center"}}>
                <Section>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.32em",color:"rgba(245,200,66,0.45)",textTransform:"uppercase",marginBottom:36}}>✦ Our Journey ✦</div>
                  <DaysCounter dateStr={data.date}/>
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.8}} style={{marginTop:36,fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>and counting, forever</motion.div>
                  <div style={{marginTop:28}}>{[...Array(5)].map((_,i)=><motion.span key={i} animate={{scale:[1,1.3,1]}} transition={{duration:1.5,delay:i*0.2,repeat:Infinity}} style={{display:"inline-block",margin:"0 5px",fontSize:"1.3rem",color:i===2?"#f5c842":"rgba(245,200,66,0.35)"}}>♥</motion.span>)}</div>
                </Section>
              </div>
            )}

            {/* Memory */}
            {data.memory&&(
              <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px"}}>
                <Section delay={0.2}>
                  <div style={{maxWidth:580,textAlign:"center"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.32em",color:"rgba(245,200,66,0.45)",textTransform:"uppercase",marginBottom:36}}>✦ Our Memory ✦</div>
                    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(245,200,66,0.13)",borderRadius:22,padding:"52px 44px",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:18,left:22,fontFamily:"'Cinzel',serif",fontSize:"5rem",color:"rgba(245,200,66,0.07)",lineHeight:1,userSelect:"none"}}>"</div>
                      <div style={{position:"absolute",bottom:8,right:22,fontFamily:"'Cinzel',serif",fontSize:"5rem",color:"rgba(245,200,66,0.07)",lineHeight:1,userSelect:"none",transform:"rotate(180deg)"}}>"</div>
                      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.05rem,2.8vw,1.35rem)",lineHeight:1.9,color:"rgba(240,240,255,0.82)",fontStyle:"italic",position:"relative",zIndex:1}}>{data.memory}</p>
                      <div style={{marginTop:24,display:"flex",justifyContent:"center",gap:10}}>{"🌸 ✨ 🌸".split(" ").map((e,i)=><span key={i} style={{fontSize:"1rem"}}>{e}</span>)}</div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* Photo */}
            {data.photo?.asset?.url&&(
              <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px"}}>
                <Section delay={0.1}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.32em",color:"rgba(245,200,66,0.45)",textTransform:"uppercase",marginBottom:52}}>✦ Us ✦</div>
                    <motion.div whileHover={{rotate:0,scale:1.05}} transition={{duration:0.4}} style={{display:"inline-block",background:"white",padding:"14px 14px 52px",boxShadow:"0 30px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.1)",transform:"rotate(-3deg)"}}>
                      <img src={data.photo.asset.url} alt="Us" style={{display:"block",width:"min(280px,70vw)",height:"min(280px,70vw)",objectFit:"cover"}}/>
                      <div style={{textAlign:"center",marginTop:14,fontFamily:"'Dancing Script',cursive",fontSize:"1.1rem",color:"#333"}}>{data.from} ♥ {data.to}</div>
                    </motion.div>
                  </div>
                </Section>
              </div>
            )}

            {/* Song */}
            {data.song&&(
              <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px"}}>
                <Section>
                  <div style={{textAlign:"center",position:"relative"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.32em",color:"rgba(245,200,66,0.45)",textTransform:"uppercase",marginBottom:36}}>✦ Our Song ✦</div>
                    <div style={{position:"relative",display:"inline-block"}}>
                      <MusicNotes/>
                      <motion.div animate={{scale:[1,1.03,1]}} transition={{duration:3,repeat:Infinity}} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(245,200,66,0.18)",borderRadius:22,padding:"44px 64px",position:"relative",zIndex:1}}>
                        <div style={{fontSize:"3rem",marginBottom:18}}>🎵</div>
                        <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"clamp(1.4rem,4vw,2rem)",color:"#f5c842",textShadow:"0 0 20px rgba(245,200,66,0.4)",marginBottom:10}}>{data.song}</div>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.9rem",color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>every note reminds me of you</div>
                      </motion.div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* Grand Finale */}
            <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center"}}>
              <Section>
                <div style={{maxWidth:560}}>
                  <motion.div animate={{scale:[1,1.18,1]}} transition={{duration:1.5,repeat:Infinity,ease:"easeInOut"}} style={{fontSize:"4rem",marginBottom:36,display:"block"}}>♥</motion.div>
                  <h2 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(1.6rem,5vw,3rem)",color:"#f5c842",letterSpacing:"0.08em",marginBottom:26,textShadow:"0 0 40px rgba(245,200,66,0.4)"}}>You Are My Universe</h2>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1rem,2.5vw,1.25rem)",color:"rgba(255,255,255,0.55)",fontStyle:"italic",lineHeight:1.95,marginBottom:52}}>In a cosmos of a billion stars,<br/>every single one of them points to you.</p>
                  <div style={{display:"flex",justifyContent:"center",gap:18,marginBottom:60,flexWrap:"wrap"}}>
                    {["🌌","💫","♥","💫","🌌"].map((e,i)=><motion.span key={i} animate={{y:[0,-10,0]}} transition={{duration:2,delay:i*0.3,repeat:Infinity}} style={{fontSize:"1.9rem"}}>{e}</motion.span>)}
                  </div>
                  <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"clamp(1.2rem,3vw,1.5rem)",color:"rgba(245,200,66,0.65)",marginBottom:8}}>Made just for you,</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(1rem,2.8vw,1.25rem)",color:"rgba(255,255,255,0.45)",letterSpacing:"0.18em"}}>— {data.from} —</div>
                  <div style={{marginTop:64,paddingTop:40,borderTop:"1px solid rgba(245,200,66,0.08)"}}>
                    <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:"rgba(255,255,255,0.12)",letterSpacing:"0.1em"}}>LOVEYOUAI · built with love · no distance too far</p>
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
