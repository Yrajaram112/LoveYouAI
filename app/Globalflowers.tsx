"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FLOWERS = ["🌸", "🌹", "🌺", "🌼", "💐", "🪷", "🌷", "🌻", "🌷", "🌸"];

interface Flower {
  id: number;
  emoji: string;
  x: number;       // vw %
  size: number;
  dur: number;
  rot: number;
}

export default function GlobalFlowers() {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    let counter = 0;

    const spawn = () => {
      const f: Flower = {
        id: counter++,
        emoji: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
        x: Math.random() * 92 + 2,      // 2vw – 94vw so never off edge
        size: 16 + Math.random() * 26,   // 16px – 42px
        dur: 5 + Math.random() * 5,      // 5s – 10s rise time
        rot: Math.random() * 60 - 30,    // ±30°
      };
      setFlowers(prev => [...prev.slice(-40), f]); // keep max 40 alive
    };

    // Seed 18 flowers immediately at staggered start times
    for (let i = 0; i < 18; i++) {
      setTimeout(spawn, i * 300);
    }

    // Then spawn one every ~1.1s forever
    const iv = setInterval(spawn, 1100);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      pointerEvents: "none", zIndex: 1,
      overflow: "hidden",
    }}>
      {flowers.map(f => (
        <motion.div
          key={f.id}
          initial={{ y: "105vh", x: `${f.x}vw`, rotate: f.rot, opacity: 0, scale: 0.3 }}
          animate={{
            y: "-12vh",
            rotate: f.rot + 50,
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.3, 1, 1, 0.5],
          }}
          transition={{ duration: f.dur, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: 0,
            fontSize: f.size,
            filter: "drop-shadow(0 2px 6px rgba(255,77,126,0.25))",
            willChange: "transform, opacity",
          }}
        >
          {f.emoji}
        </motion.div>
      ))}
    </div>
  );
}