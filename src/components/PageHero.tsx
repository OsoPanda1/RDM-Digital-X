import { motion } from "framer-motion";

interface PageHeroProps {
  image: string;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  highlightClass?: string;
}

const PageHero = ({
  image,
  tag,
  title,
  highlight,
  description,
  highlightClass = "text-gradient-cyan",
}: PageHeroProps) => (
  <section className="relative min-h-[68vh] flex items-end overflow-hidden grain">
    <div className="absolute inset-0">
      <img
        src={image}
        alt={`${title} ${highlight} · Real del Monte`}
        className="w-full h-full object-cover ken-burns"
      />
      {/* Velo en tres tiempos: contraste sin apagar la fotografía. */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/72 to-background/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_90%,hsla(43,80%,55%,0.10),transparent_58%)]" />
    </div>

    <div className="relative z-10 container mx-auto px-6 pb-20 pt-36">
      <motion.div
        initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="kicker">{tag}</span>

        <h1 className="font-display font-normal text-[2.9rem] md:text-7xl lg:text-[5.5rem] tracking-[-0.035em] leading-[0.94] mt-5 mb-6">
          <span className="text-foreground">{title}</span>{" "}
          <span className={highlightClass}>{highlight}</span>
        </h1>

        <div className="hairline w-32 mb-6" />

        <p className="max-w-xl text-[hsl(var(--platinum))]/65 text-base md:text-lg leading-relaxed">
          {description}
        </p>
      </motion.div>
    </div>
  </section>
);

export default PageHero;
