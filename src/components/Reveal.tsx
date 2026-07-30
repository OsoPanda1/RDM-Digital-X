import { useEffect, useRef, useState } from "react";

type RevealVariant = "up" | "left" | "right" | "scale" | "stagger";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
  stagger: "stagger",
};

interface UseRevealOptions {
  /** Se dispara una sola vez por defecto: la entrada es un gesto, no un bucle. */
  once?: boolean;
  /** Margen de anticipación respecto al viewport. */
  rootMargin?: string;
  threshold?: number;
}

/**
 * Observador de entrada en viewport. Devuelve la ref del nodo y si ya se reveló.
 * Se apoya en clases CSS (`reveal`, `stagger`, `is-revealed`) para que la
 * animación viva en la capa de estilo y no en JavaScript.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  once = true,
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.12,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, revealed };
}

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: RevealVariant;
  once?: boolean;
  /** Retardo en ms antes de que el elemento entre. */
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header";
}

/**
 * Envoltorio declarativo del revelado en scroll.
 * Uso: <Reveal variant="stagger"> … </Reveal>
 */
export const Reveal = ({
  variant = "up",
  once = true,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  children,
  ...rest
}: RevealProps) => {
  const { ref, revealed } = useReveal<HTMLDivElement>({ once });

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${VARIANT_CLASS[variant]} ${revealed ? "is-revealed" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
