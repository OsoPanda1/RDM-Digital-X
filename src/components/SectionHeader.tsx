import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  accent?: "gold" | "electric" | "copper";
  align?: "center" | "left";
  /** Numeral editorial opcional: "01", "02"… */
  index?: string;
}

const SectionHeader = ({
  label,
  title,
  subtitle,
  accent = "gold",
  align = "center",
  index,
}: SectionHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const titleClass =
    accent === "electric"
      ? "text-gradient-cyan"
      : accent === "copper"
        ? "text-gradient-silver"
        : "text-foil-gold text-foil-gold--live";

  const centered = align === "center";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 ${centered ? "text-center" : "text-left"}`}
    >
      <div className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}>
        {index && <span className="numeral">{index}</span>}
        <span className={`kicker ${centered && !index ? "kicker--center" : ""}`}>{label}</span>
      </div>

      <h2
        className={`font-display font-normal text-[2.6rem] leading-[1.04] md:text-[4.25rem] tracking-[-0.03em] mt-4 ${titleClass}`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`font-display text-lg md:text-xl italic text-[hsl(var(--platinum))]/55 mt-5 max-w-xl leading-relaxed ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}

      <div className={`hairline mt-8 ${centered ? "mx-auto w-40" : "w-28"}`} />
    </motion.div>
  );
};

export default SectionHeader;
