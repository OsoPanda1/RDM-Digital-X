import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import historiaImg from "@/assets/historia-hero.jpg";
import gastronomiaImg from "@/assets/gastronomia-hero.jpg";
import rutasImg from "@/assets/hero-rdm.jpg";
import eventosImg from "@/assets/eventos-hero.jpg";
import ecoturismoImg from "@/assets/ecoturismo-hero.jpg";
import mitosImg from "@/assets/relatos-hero.jpg";
import arteImg from "@/assets/arte-hero.jpg";
import comunidadImg from "@/assets/cultura-hero.jpg";

/**
 * Mosaico editorial de acceso a los capítulos del territorio.
 * Dos piezas dominantes (Historia y Gastronomía) sostienen la retícula;
 * el resto respira alrededor. La jerarquía se lee antes que el texto.
 */
const chapters = [
  {
    label: "Historia",
    path: "/historia",
    desc: "Cinco siglos de herencia minera cornish",
    image: historiaImg,
    span: "mosaic-wide mosaic-tall",
    feature: true,
  },
  {
    label: "Gastronomía",
    path: "/gastronomia",
    desc: "Del paste original al mole hidalguense",
    image: gastronomiaImg,
    span: "mosaic-wide",
    feature: true,
  },
  { label: "Rutas", path: "/rutas", desc: "9 recorridos temáticos", image: rutasImg, span: "" },
  { label: "Eventos", path: "/eventos", desc: "Fiestas y festivales vivos", image: eventosImg, span: "" },
  { label: "Ecoturismo", path: "/ecoturismo", desc: "Bosque, cascadas y niebla", image: ecoturismoImg, span: "" },
  { label: "Mitos", path: "/relatos", desc: "Leyendas de socavón", image: mitosImg, span: "" },
  { label: "Arte", path: "/arte", desc: "Platería y oficio local", image: arteImg, span: "mosaic-wide" },
  { label: "Comunidad", path: "/comunidad", desc: "Muro global de viajeros", image: comunidadImg, span: "mosaic-wide" },
];

const QuickLinksSection = () => (
  <section className="relative py-28">
    <div className="container mx-auto px-6">
      <SectionHeader
        index="02"
        label="Navega el Pueblo Mágico"
        title="Los capítulos del territorio"
        subtitle="Ocho entradas al mismo lugar. Cada una abre una forma distinta de recorrer Real del Monte."
        align="left"
      />

      <Reveal variant="stagger" className="mosaic">
        {chapters.map((chapter) => (
          <Link
            key={chapter.path}
            to={chapter.path}
            aria-label={`${chapter.label}: ${chapter.desc}`}
            className={`group relative overflow-hidden rounded-2xl card-lift border border-[hsl(var(--gold))]/15 ${chapter.span}`}
          >
            <div className="img-frame absolute inset-0">
              <img
                src={chapter.image}
                alt={`${chapter.label} en Real del Monte`}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                loading="lazy"
              />
            </div>

            <div className="relative z-20 h-full flex flex-col justify-end p-5 md:p-6 isolate bg-gradient-to-t from-background/85 via-background/25 to-transparent">
              <div className="hairline w-10 mb-3 opacity-0 group-hover:opacity-100 group-hover:w-20 transition-all duration-700" />
              <h3
                className={`font-display tracking-[-0.02em] text-foreground ${
                  chapter.feature ? "text-3xl md:text-4xl" : "text-2xl"
                }`}
              >
                {chapter.label}
              </h3>
              <p className="font-body text-[11px] md:text-xs text-[hsl(var(--platinum))]/60 mt-1 leading-relaxed max-w-[26ch]">
                {chapter.desc}
              </p>
            </div>

            <ArrowUpRight
              className="absolute top-5 right-5 z-10 h-4 w-4 text-[hsl(var(--gold))]/0 group-hover:text-[hsl(var(--gold))]/85 -translate-y-1 group-hover:translate-y-0 transition-all duration-500"
              aria-hidden="true"
            />
          </Link>
        ))}
      </Reveal>
    </div>
  </section>
);

export default QuickLinksSection;
