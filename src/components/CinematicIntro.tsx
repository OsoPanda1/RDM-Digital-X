import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import rdmBadge from "@/assets/rdm-logo-badge.png";

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 3200),
      setTimeout(() => setPhase(3), 5500),
      setTimeout(() => onComplete(), 6800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(220, 35%, 4%), hsl(220, 40%, 3%))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsla(43,80%,55%,0.05)] to-transparent animate-fog-drift" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[hsla(210,100%,55%,0.03)] to-transparent animate-fog-drift-reverse" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsla(43,80%,55%,0.06),transparent_60%)]" />

          <div className="relative z-10 text-center px-8">
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div key="p0" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                  className="font-body text-[10px] tracking-[0.5em] uppercase text-[hsl(var(--platinum))]/50">
                  RDM Digital presenta
                </motion.div>
              )}
              {phase === 1 && (
                <motion.div key="p1" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1 }}
                    className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden pulse-gold ring-2 ring-[hsl(var(--gold))]/40"
                    style={{ filter: "drop-shadow(0 0 50px hsla(43, 80%, 55%, 0.45))" }}
                  >
                    <img src={rdmBadge} alt="Insignia oficial RDM Digital · Real del Monte" className="w-full h-full object-cover" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight"
                  >
                    <span className="text-gradient-gold">Real del Monte</span>
                  </motion.h1>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 0.5 }} className="w-20 h-px mx-auto bg-gradient-gold" />
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="font-display text-lg md:text-xl text-[hsl(var(--platinum))]/50 italic">
                    Innovación Turística Inteligente
                  </motion.p>
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div key="p2" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                  className="font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--gold))]/40">
                  Donde la niebla revela lo extraordinario
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 6.5, ease: "linear" }}
            style={{ transformOrigin: "left" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
