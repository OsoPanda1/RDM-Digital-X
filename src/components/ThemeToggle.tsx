import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";

const OPTIONS: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Tema claro · niebla de mediodía", Icon: Sun },
  { mode: "dark", label: "Tema oscuro · socavón nocturno", Icon: Moon },
  { mode: "system", label: "Seguir preferencia del sistema", Icon: Monitor },
];

/**
 * Selector de tema en tres estados. Compacto para la barra de navegación,
 * expandido (con etiquetas) para páginas de ajustes y la guía de estilo.
 */
export default function ThemeToggle({ expanded = false }: { expanded?: boolean }) {
  const { mode, setMode } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Selector de tema visual"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 p-1 backdrop-blur-xl"
    >
      {OPTIONS.map(({ mode: value, label, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setMode(value)}
            className={`flex min-h-9 items-center gap-2 rounded-full px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${
              active
                ? "bg-[hsl(var(--gold)/0.16)] text-[hsl(var(--gold))]"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {expanded && <span className="font-body">{value === "system" ? "Sistema" : value === "light" ? "Claro" : "Oscuro"}</span>}
          </button>
        );
      })}
    </div>
  );
}
