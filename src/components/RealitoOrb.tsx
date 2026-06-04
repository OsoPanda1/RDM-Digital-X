import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRealitoChat, type SuggestedAction } from "@/hooks/useRealitoChat";
import ReactMarkdown from "react-markdown";
import rdmBadge from "@/assets/rdm-logo-badge.png";

const orbVariants = {
  idle: {
    scale: [1, 1.08, 1],
    transition: { repeat: Infinity, duration: 3.5, ease: "easeInOut" as const },
  },
  active: {
    scale: 1.12,
    boxShadow: "0 0 50px rgba(0, 243, 255, 0.5)",
  },
};

const actionToMessage: Record<string, string> = {
  SUGGEST_ROUTE: "Recomiéndame la mejor ruta para hoy",
  FIND_FOOD: "¿Dónde puedo comer pastes tradicionales?",
  TELL_HISTORY: "Cuéntame la historia de las minas",
  FIND_ADVENTURE: "¿Qué actividades de aventura hay?",
  REQUEST_FOOD_ROUTE: "Diseña una ruta gastronómica completa",
  REQUEST_HERITAGE_ROUTE: "Quiero hacer la ruta del patrimonio minero",
  REQUEST_ADVENTURE_ROUTE: "Planea una ruta de aventura por la montaña",
  REQUEST_SHORTER_ROUTE: "Quiero una ruta más corta, de 1 hora máximo",
  REQUEST_EVENT_ROUTE: "¿Qué eventos hay próximamente?",
};

const RealitoOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, send } = useRealitoChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setIsOpen(true);
      const detail = (e as CustomEvent<{ question?: string }>).detail;
      const q = detail?.question?.trim();
      if (q) setInput(q);
    };
    window.addEventListener("rdm:realito-open", onOpen as EventListener);
    return () => window.removeEventListener("rdm:realito-open", onOpen as EventListener);
  }, []);

  const handleSend = async (text?: string) => {
    const payload = text ?? input.trim();
    if (!payload) return;
    setInput("");
    await send(payload);
  };

  const handleAction = (action: SuggestedAction) => {
    // Navigation actions
    if (action.action === "NAVIGATE" && action.payload?.path) {
      navigate(action.payload.path as string);
      return;
    }
    if (action.action === "OPEN_CATALOG") {
      navigate("/catalogo");
      return;
    }

    // Translate action to message for Realito
    const msg = actionToMessage[action.action];
    if (msg) {
      void handleSend(msg);
      return;
    }

    // Default: send the label as message
    void handleSend(action.label.replace(/^[^\s]+\s/, ""));
  };

  const lastMessage = messages[messages.length - 1];
  const showSuggestedActions = lastMessage?.role === "assistant" && lastMessage.suggestedActions?.length;

  return (
    <>
      {/* Orb button */}
      <motion.button
        variants={orbVariants}
        animate={isOpen ? "active" : "idle"}
        onClick={() => setIsOpen(!isOpen)}
        className="group fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent cursor-pointer"
        style={{
          boxShadow: "0 0 40px hsla(var(--primary) / 0.5), inset 0 1px 1px hsla(var(--foreground) / 0.25)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Abrir Realito AI — guía territorial"
      >
        {/* Animated halo rings */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border border-primary/40"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut" }}
        />
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border border-accent/30"
          animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut", delay: 1.1 }}
        />
        <span className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-white/30 shadow-inner">
          <img src={rdmBadge} alt="Realito AI" className="h-full w-full object-cover" />
        </span>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-background" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[560px] glass-surface-strong flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">R</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Realito AI</h4>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    Gemelo Digital Territorial · v3
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/10 text-foreground p-3 rounded-2xl rounded-br-sm ml-10"
                      : "bg-card/80 text-foreground p-3 rounded-2xl rounded-bl-sm mr-4 border border-border"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>p]:mb-2 [&>ul]:m-0 [&>ul]:mb-2 [&_strong]:text-primary">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono p-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                  Analizando gemelo digital…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Actions */}
            {showSuggestedActions && !isLoading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {lastMessage.suggestedActions!.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleAction(action)}
                    className="text-[10px] px-2.5 py-1.5 rounded-full bg-primary/10 text-foreground border border-border hover:bg-primary/20 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregúntale a Realito..."
                  className="flex-1 bg-muted/50 text-sm px-4 py-2.5 rounded-xl border border-border outline-none text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl disabled:opacity-50 transition-opacity"
                >
                  →
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RealitoOrb;
