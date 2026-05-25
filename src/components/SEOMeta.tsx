import { Helmet } from "react-helmet-async";

interface SEOMetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "business" | "event" | "place";
  jsonLd?: Record<string, unknown>;
  publishedTime?: string;
  author?: string;
}

const DEFAULT_META = {
  title: "RDM Digital Nexus — Real del Monte | Pueblo Mágico",
  description:
    "Plataforma turística inmersiva de Real del Monte, Hidalgo. Gemelo Digital, Realito AI, mapa vivo y catálogo soberano de comercios locales.",
  image: "/og-rdm-nexus.png",
  siteName: "RDM Digital Nexus",
  siteUrl: "https://real-del-monte-ai-nexus.lovable.app",
};

export function SEOMeta({
  title,
  description,
  image,
  url,
  type = "website",
  jsonLd,
  publishedTime,
  author,
}: SEOMetaProps) {
  const fullTitle = title ? `${title} | ${DEFAULT_META.siteName}` : DEFAULT_META.title;
  const metaDescription = description ?? DEFAULT_META.description;
  const metaImage = image ?? DEFAULT_META.image;
  const canonicalUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : DEFAULT_META.siteUrl);

  const defaultJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: DEFAULT_META.siteName,
    description: metaDescription,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: DEFAULT_META.siteName,
      logo: { "@type": "ImageObject", url: metaImage },
    },
  };

  const finalJsonLd = jsonLd ? { ...defaultJsonLd, ...jsonLd } : defaultJsonLd;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={DEFAULT_META.siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && <meta property="article:author" content={author} />}
      <script type="application/ld+json">{JSON.stringify(finalJsonLd)}</script>
    </Helmet>
  );
}

export const PAGE_SEO = {
  home: {
    title: "RDM Digital - Descubre Real del Monte",
    description:
      "Tu guía completa para explorar Real del Monte, Hidalgo. Historia, cultura, ecoturismo, gastronomía, eventos y más.",
  },
  historia: {
    title: "Historia de Real del Monte",
    description:
      "Descubre la rica historia de Real del Monte, desde la época colonial hasta nuestros días.",
  },
  cultura: {
    title: "Cultura y Tradiciones - Real del Monte",
    description: "Explora la cultura y tradiciones del Pueblo Mágico de Real del Monte, Hidalgo.",
  },
  gastronomia: {
    title: "Gastronomía - Sabores de Real del Monte",
    description: "Descubre la gastronomía de Real del Monte: el tradicional paste, carnitas y más.",
  },
  rutas: {
    title: "Rutas Turísticas - Explora Real del Monte",
    description: "Descubre las mejores rutas de senderismo y caminatas en Real del Monte.",
  },
  ecoturismo: {
    title: "Ecoturismo - Naturaleza en Real del Monte",
    description: "Explora la naturaleza de Real del Monte: bosques, miradores y rutas de aventura.",
  },
  eventos: {
    title: "Eventos y Actividades - Real del Monte",
    description: "Consulta los próximos eventos, festivales y actividades en Real del Monte.",
  },
  dichos: {
    title: "Dichos Personificados - Real del Monte",
    description:
      "47 expresiones tradicionales de Real del Monte. Descubre el rico vocabulario minero del Pueblo Mágico.",
  },
  arte: {
    title: "Arte y Artesanías - Real del Monte",
    description: "Descubre el arte local y las artesanías tradicionales de Real del Monte.",
  },
  catalogo: {
    title: "Directorio de Negocios - RDM Digital",
    description: "Encuentra restaurantes, hoteles, tiendas y servicios en Real del Monte.",
  },
  comunidad: {
    title: "Comunidad - Comparte tu Experiencia",
    description: "Comparte tus fotos, historias y experiencias en Real del Monte.",
  },
  relatos: {
    title: "Relatos y Leyendas - Real del Monte",
    description: "Conoce las leyendas y relatos del Pueblo Mágico de Real del Monte.",
  },
  mapa: {
    title: "Mapa Interactivo - Real del Monte",
    description:
      "Explora Real del Monte con nuestro mapa interactivo. Encuentra lugares, negocios y rutas.",
  },
  donar: {
    title: "Apoya RDM Digital",
    description:
      "Apoya el desarrollo de la plataforma turística de Real del Monte con tu donación.",
  },
};

export default SEOMeta;
