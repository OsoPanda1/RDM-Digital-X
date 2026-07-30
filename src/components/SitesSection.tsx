import { Reveal } from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import pasteImg from "@/assets/imported/paste.webp";
import museoImg from "@/assets/imported/mina-acosta.webp";
import callesImg from "@/assets/imported/calles-colonial.webp";

/**
 * Tres piezas emblemáticas presentadas como fichas editoriales:
 * numeral, filete, categoría en versalitas y fotografía con velo.
 */
const sites = [
  {
    index: "I",
    title: "Museo de Mina La Acosta",
    category: "Museo · Histórico",
    description:
      "Desciende 400 metros bajo tierra en una de las minas más emblemáticas del siglo XIX, con guías que trabajaron el socavón.",
    image: museoImg,
    accent: "glow-gold",
  },
  {
    index: "II",
    title: "Pastes del Portal",
    category: "Gastronomía · Herencia Cornish",
    description:
      "La receta original traída por mineros ingleses en 1824, horneada con fuego de leña y repulgue hecho a mano.",
    image: pasteImg,
    accent: "glow-cyan",
  },
  {
    index: "III",
    title: "Centro Histórico",
    category: "Arquitectura · Colonial",
    description:
      "Calles empedradas con fachadas del siglo XVIII y techos de lámina roja: cada esquina sostiene una historia distinta.",
    image: callesImg,
    accent: "glow-silver",
  },
];

const SitesSection = () => (
  <section id="explorar" className="relative py-28 overflow-hidden">
    <div className="container mx-auto px-6">
      <SectionHeader
        index="01"
        label="Descubrimiento"
        title="Sitios emblemáticos"
        subtitle="Tres anclas del pueblo: la mina, la mesa y la piedra."
        align="left"
      />

      <Reveal variant="stagger" className="grid md:grid-cols-3 gap-6">
        {sites.map((site) => (
          <article
            key={site.title}
            className={`glass-surface grain overflow-hidden card-lift ${site.accent} group`}
          >
            <div className="img-frame relative h-56">
              <img
                src={site.image}
                alt={site.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-4 left-5 z-10 numeral text-[2.25rem] leading-none">
                {site.index}
              </span>
            </div>

            <div className="p-7">
              <span className="font-body text-[10px] uppercase tracking-[0.32em] text-[hsl(var(--gold))]/70">
                {site.category}
              </span>
              <h3 className="font-display text-2xl md:text-[1.75rem] tracking-[-0.02em] mt-3 mb-3 text-foreground">
                {site.title}
              </h3>
              <div className="hairline w-12 mb-4 group-hover:w-24 transition-all duration-700" />
              <p className="font-body text-sm text-[hsl(var(--platinum))]/60 leading-relaxed">
                {site.description}
              </p>
            </div>
          </article>
        ))}
      </Reveal>
    </div>
  </section>
);

export default SitesSection;
