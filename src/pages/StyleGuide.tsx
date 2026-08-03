import MainLayout from "@/components/layout/MainLayout";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import { SEOMeta } from "@/components/SEOMeta";
import { useTheme } from "@/hooks/useTheme";
import heroImage from "@/assets/imported/hero-real-del-monte.webp";
import minaImage from "@/assets/imported/mina-acosta.webp";

const COLOR_TOKENS = [
  { name: "--background", desc: "Lienzo base" },
  { name: "--foreground", desc: "Tinta principal" },
  { name: "--card", desc: "Superficie elevada" },
  { name: "--muted", desc: "Fondo secundario" },
  { name: "--border", desc: "Filete estructural" },
  { name: "--gold", desc: "Acento patrimonial" },
  { name: "--electric", desc: "Acento tecnológico" },
  { name: "--platinum", desc: "Texto de apoyo" },
];

const SPACE_TOKENS = ["--space-2", "--space-4", "--space-6", "--space-8", "--space-12", "--space-16", "--space-24"];

const TYPE_SCALE = [
  { token: "--text-6xl", label: "Display cinemático", cls: "font-display text-[3.4rem] md:text-[5.5rem] leading-[1.02]" },
  { token: "--text-4xl", label: "Título de sección", cls: "font-display text-[2.4rem] md:text-[3rem] leading-[1.08]" },
  { token: "--text-2xl", label: "Subtítulo editorial", cls: "font-display italic text-[1.75rem]" },
  { token: "--text-base", label: "Cuerpo de lectura", cls: "font-body text-base leading-[1.7]" },
  { token: "--text-2xs", label: "Kicker · versal", cls: "font-body text-[0.6875rem] tracking-[0.3em] uppercase" },
];

const Swatch = ({ name, desc }: { name: string; desc: string }) => (
  <div className="rounded-xl border border-border bg-card/60 p-3">
    <div
      className="h-14 w-full rounded-lg border border-border"
      style={{ background: `hsl(var(${name}))` }}
      aria-hidden="true"
    />
    <p className="mt-3 font-mono text-[11px] text-foreground">{name}</p>
    <p className="font-body text-[11px] text-muted-foreground">{desc}</p>
  </div>
);

const Block = ({
  id,
  index,
  label,
  title,
  subtitle,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section id={id} aria-labelledby={`${id}-title`} className="container mx-auto px-6 py-16 md:py-24">
    <div id={`${id}-title`}>
      <SectionHeader index={index} label={label} title={title} subtitle={subtitle} align="left" />
    </div>
    {children}
  </section>
);

const StyleGuide = () => {
  const { mode, resolved } = useTheme();

  return (
    <MainLayout>
      <SEOMeta
        title="Guía de estilo · RDM Digital Nexus"
        description="Sistema de diseño de RDM Digital: tokens de color, espaciado y tipografía, componentes editoriales (Reveal, SectionHeader, PageHero) y controles de accesibilidad."
      />

      <PageHero
        image={heroImage}
        tag="Plano III · Documentación"
        title="Guía de"
        highlight="estilo"
        description="El vocabulario visual de Real del Monte: tokens, ritmo tipográfico y componentes editoriales con sus variantes, estados y reglas de accesibilidad."
      />

      {/* Tema */}
      <Block
        id="tema"
        index="01"
        label="Tema"
        title="Claro, oscuro y sistema"
        subtitle="La niebla cambia con la hora; la interfaz también."
      >
        <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card/60 p-6">
          <ThemeToggle expanded />
          <div className="font-body text-sm text-muted-foreground">
            Preferencia: <span className="text-foreground">{mode}</span> · Tema aplicado:{" "}
            <span className="text-[hsl(var(--gold))]">{resolved}</span>
          </div>
        </div>
      </Block>

      {/* Color */}
      <Block id="color" index="02" label="Tokens" title="Color" subtitle="Plata, tinta y oro: nada se escribe a mano.">
        <Reveal variant="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLOR_TOKENS.map((token) => (
            <Swatch key={token.name} {...token} />
          ))}
        </Reveal>
      </Block>

      {/* Espaciado */}
      <Block id="espaciado" index="03" label="Tokens" title="Espaciado" subtitle="Ritmo de 4px, respiración territorial.">
        <div className="space-y-3">
          {SPACE_TOKENS.map((token) => (
            <div key={token} className="flex items-center gap-4">
              <span className="w-32 font-mono text-[11px] text-muted-foreground">{token}</span>
              <span
                className="h-3 rounded-full bg-[hsl(var(--gold)/0.55)]"
                style={{ width: `var(${token})` }}
                aria-hidden="true"
              />
            </div>
          ))}
          <p className="pt-4 font-body text-sm text-muted-foreground">
            Secciones: <code className="font-mono text-foreground">--section-y</code> ·{" "}
            <code className="font-mono text-foreground">--gutter-x</code> (fluidos con <code className="font-mono">clamp()</code>).
          </p>
        </div>
      </Block>

      {/* Tipografía */}
      <Block id="tipografia" index="04" label="Tokens" title="Tipografía" subtitle="Cormorant Garamond narra; Montserrat informa.">
        <div className="space-y-8">
          {TYPE_SCALE.map((item) => (
            <div key={item.token} className="border-b border-border pb-6">
              <span className="token-chip mb-3">{item.token}</span>
              <p className={item.cls}>{item.label} · Real del Monte</p>
            </div>
          ))}
        </div>
      </Block>

      {/* SectionHeader */}
      <Block id="section-header" index="05" label="Componentes" title="SectionHeader" subtitle="Tres acentos, dos alineaciones, numeral opcional.">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-2xl border border-border p-6">
            <SectionHeader index="01" label="accent = gold" title="Oro laminado" subtitle="Variante por defecto." align="left" />
          </div>
          <div className="rounded-2xl border border-border p-6">
            <SectionHeader label="accent = electric" title="Cian territorial" subtitle="Para datos y telemetría." align="left" accent="electric" />
          </div>
          <div className="rounded-2xl border border-border p-6">
            <SectionHeader label="accent = copper" title="Plata mineral" align="left" accent="copper" />
          </div>
          <div className="rounded-2xl border border-border p-6">
            <SectionHeader label="align = center" title="Centrado" subtitle="Para aperturas de capítulo." accent="gold" />
          </div>
        </div>
      </Block>

      {/* Reveal */}
      <Block id="reveal" index="06" label="Componentes" title="Reveal" subtitle="Cinco variantes de entrada; ninguna es obligatoria.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["up", "left", "right", "scale"] as const).map((variant, i) => (
            <Reveal
              key={variant}
              variant={variant}
              delay={i * 90}
              className="rounded-2xl border border-border bg-card/60 p-6"
            >
              <span className="token-chip mb-3">variant = {variant}</span>
              <p className="font-body text-sm text-muted-foreground">
                Entra al cruzar el 12% del viewport, una sola vez.
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal variant="stagger" className="mt-8 grid gap-4 sm:grid-cols-3">
          {["stagger · 1", "stagger · 2", "stagger · 3"].map((label) => (
            <div key={label} className="rounded-2xl border border-border bg-card/60 p-6 font-body text-sm">
              {label}
            </div>
          ))}
        </Reveal>

        <p className="mt-6 font-body text-sm text-muted-foreground">
          Con <code className="font-mono text-foreground">prefers-reduced-motion: reduce</code> todos los reveals, glows y
          Ken Burns quedan estáticos: el contenido aparece completo, sin desplazamiento ni desenfoque.
        </p>
      </Block>

      {/* PageHero */}
      <Block id="page-hero" index="07" label="Componentes" title="PageHero" subtitle="Portada de capítulo con velo en tres tiempos.">
        <div className="overflow-hidden rounded-3xl border border-border">
          <PageHero
            image={minaImage}
            tag="Ejemplo · Plano I"
            title="Mina"
            highlight="Acosta"
            description="El hero acepta imagen, kicker, título en dos tonos, filete y descripción; el resaltado se controla con highlightClass."
            highlightClass="text-gradient-gold"
          />
        </div>
        <p className="mt-6 font-body text-sm text-muted-foreground">
          Props: <code className="font-mono text-foreground">image</code>, <code className="font-mono text-foreground">tag</code>,{" "}
          <code className="font-mono text-foreground">title</code>, <code className="font-mono text-foreground">highlight</code>,{" "}
          <code className="font-mono text-foreground">description</code>,{" "}
          <code className="font-mono text-foreground">highlightClass</code>.
        </p>
      </Block>

      {/* Estados y accesibilidad */}
      <Block id="accesibilidad" index="08" label="Accesibilidad" title="Estados y foco" subtitle="Todo lo interactivo se ve, se tabula y se entiende.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button type="button" className="btn-premium min-h-11">Primario</button>
          <button type="button" className="btn-glass min-h-11">Secundario</button>
          <button type="button" className="btn-glass min-h-11 opacity-50" disabled>
            Deshabilitado
          </button>
          <a
            href="#tema"
            className="flex min-h-11 items-center justify-center rounded-full border border-border font-body text-sm text-foreground"
          >
            Enlace
          </a>
        </div>
        <ul className="mt-8 space-y-2 font-body text-sm text-muted-foreground">
          <li>· Anillo de foco de 2px con separación del fondo (<code className="font-mono">--focus-ring</code>) en cualquier elemento tabulable.</li>
          <li>· Objetivos táctiles mínimos de 44×44 px en controles primarios.</li>
          <li>· Contraste AA garantizado por tokens: nunca colores literales en componentes.</li>
          <li>· El movimiento respeta <code className="font-mono">prefers-reduced-motion</code> a nivel global.</li>
        </ul>
      </Block>
    </MainLayout>
  );
};

export default StyleGuide;
