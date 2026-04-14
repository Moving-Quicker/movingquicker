"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import BoltRounded from "@mui/icons-material/BoltRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import SendRounded from "@mui/icons-material/SendRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { trackEvent, getVisitorId } from "@/lib/tracking";

// ── Types ──

interface Msg {
  id: string;
  role: "bot" | "user";
  content: string;
  special?: "result";
}

let _seq = 0;
const mkMsg = (role: "bot" | "user", content: string, special?: "result"): Msg => ({
  id: `${Date.now()}-${++_seq}`,
  role,
  content,
  special,
});

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Phase =
  | "IDLE"
  | "ASK_PROJECT"
  | "ASK_PAGES"
  | "ASK_EXTRAS"
  | "ASK_NAME"
  | "ASK_WHATSAPP"
  | "ASK_MESSAGE"
  | "SENDING"
  | "DONE";

const PROJECT_OPTIONS = [
  { key: "landing", label: "Landing page" },
  { key: "store", label: "Tienda online" },
  { key: "custom", label: "Sistema a la medida" },
  { key: "blog", label: "Blog / contenido" },
  { key: "unsure", label: "No estoy seguro" },
];

const EXTRAS = [
  { key: "domain", label: "Dominio propio" },
  { key: "seo", label: "SEO básico" },
  { key: "maintenance", label: "Mantenimiento mensual" },
  { key: "whatsapp", label: "Integración WhatsApp" },
];

const BASE_PRICES: Record<string, number> = {
  landing: 5000,
  store: 12000,
  custom: 15000,
  blog: 8000,
  unsure: 8000,
};

function fmtMx(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

// ── Sub-components ──

function BotAvatar() {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(13,148,136,0.12)",
        flexShrink: 0,
        mt: 0.3,
      }}
    >
      <BoltRounded sx={{ fontSize: 15, color: "#0D9488" }} />
    </Box>
  );
}

function UserAvatar() {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(99,102,241,0.15)",
        flexShrink: 0,
        mt: 0.3,
      }}
    >
      <PersonRounded sx={{ fontSize: 15, color: "#6366F1" }} />
    </Box>
  );
}

function TypingDots() {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <BotAvatar />
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", pt: 1 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: "text.disabled",
              animation: "mqTyping 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes mqTyping": {
                "0%, 60%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                "30%": { opacity: 1, transform: "scale(1)" },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

// ── Main Component ──

export function ChatQuote() {
  const theme = useTheme();
  const endRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<Phase>("IDLE");

  const [projectType, setProjectType] = useState("");
  const [pages, setPages] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");

  const scroll = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  useEffect(() => {
    scroll();
  }, [messages, typing, phase, scroll]);

  const typeOne = useCallback(
    async (text: string) => {
      setTyping(true);
      scroll();
      await wait(Math.min(500 + text.length * 5, 1600));
      setTyping(false);
      setMessages((p) => [...p, mkMsg("bot", text)]);
    },
    [scroll],
  );

  const typeMany = useCallback(
    async (...texts: string[]) => {
      for (const t of texts) {
        await typeOne(t);
        await wait(150);
      }
    },
    [typeOne],
  );

  const userMsg = useCallback((text: string) => {
    setMessages((p) => [...p, mkMsg("user", text)]);
  }, []);

  // ── Init ──

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    (async () => {
      setMessages([
        mkMsg("bot", "¡Hola! Soy el asistente de Moving Quicker. 👋"),
        mkMsg("bot", "Te ayudo a estimar tu proyecto en menos de 1 minuto."),
      ]);
      await typeOne("¿Qué tipo de proyecto necesitas?");
      setPhase("ASK_PROJECT");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──

  const onProject = async (key: string, label: string) => {
    setProjectType(key);
    userMsg(label);
    trackEvent("chat_project_selected", { projectType: key });
    if (key === "unsure") {
      await typeMany(
        "¡Sin problema! Para eso estamos.",
        "¿Aproximadamente cuántas páginas o secciones imaginas?",
      );
    } else {
      await typeOne("¿Cuántas páginas o secciones necesitas aproximadamente?");
    }
    setPhase("ASK_PAGES");
  };

  const onPages = async () => {
    if (!pages.trim()) return;
    userMsg(`${pages} páginas`);
    await typeOne("¿Necesitas alguno de estos extras? (toca los que quieras y luego 'Continuar')");
    setPhase("ASK_EXTRAS");
  };

  const toggleExtra = (key: string) => {
    setExtras((prev) => (prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]));
  };

  const onExtras = async () => {
    const selected = extras.length > 0 ? extras.map((e) => EXTRAS.find((x) => x.key === e)?.label).join(", ") : "Ninguno";
    userMsg(selected);

    const base = BASE_PRICES[projectType] ?? 8000;
    const pageFactor = 1 + (Math.max(1, parseInt(pages) || 5) - 1) * 0.06;
    let subtotal = base * pageFactor;
    if (extras.includes("domain")) subtotal += 500;
    if (extras.includes("seo")) subtotal += 2000;
    if (extras.includes("whatsapp")) subtotal += 3000;
    const low = Math.round(subtotal / 500) * 500;
    const high = Math.round((low * 1.5) / 500) * 500;

    const hasMaintenance = extras.includes("maintenance");

    await typeMany(
      `Basado en lo que me dices, tu proyecto estaría entre ${fmtMx(low)} y ${fmtMx(high)} MXN.${hasMaintenance ? ` + ${fmtMx(1500)}/mes por mantenimiento.` : ""}`,
      "Este es un estimado orientativo. Para darte un precio exacto necesitamos conocerte un poco más.",
      "¿Cómo te llamas?",
    );
    setPhase("ASK_NAME");
  };

  const onName = async () => {
    if (!name.trim()) return;
    userMsg(name.trim());
    await typeOne(`¡Mucho gusto, ${name.trim()}! ¿Cuál es tu número de WhatsApp?`);
    setPhase("ASK_WHATSAPP");
  };

  const onWhatsapp = async () => {
    if (!whatsapp.trim()) return;
    userMsg(whatsapp.trim());
    await typeOne("Por último, cuéntanos brevemente sobre tu negocio o proyecto. ¿Qué problema quieres resolver?");
    setPhase("ASK_MESSAGE");
  };

  const onMessage = async () => {
    if (!message.trim()) return;
    userMsg(message.trim());
    setPhase("SENDING");

    try {
      trackEvent("chat_lead_submitted", { projectType, pages, extras });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          businessType: PROJECT_OPTIONS.find((p) => p.key === projectType)?.label ?? "",
          message: `[Chat Quote] Tipo: ${projectType}, Páginas: ${pages}, Extras: ${extras.join(",") || "ninguno"}. Mensaje: ${message.trim()}`,
          visitorId: getVisitorId(),
          source: "chat",
        }),
      });

      if (res.ok) {
        await typeMany(
          "¡Listo! Recibimos tu información. ✅",
          "Te contactamos pronto por WhatsApp para afinar los detalles y darte una cotización formal.",
        );
        setPhase("DONE");
      } else {
        await typeOne("Hubo un problema al enviar. ¿Podrías intentarlo por WhatsApp?");
        setPhase("DONE");
      }
    } catch {
      await typeOne("Error de conexión. Intenta por WhatsApp directamente.");
      setPhase("DONE");
    }
  };

  // ── Bubble renderer ──

  const renderBubble = (m: Msg) => {
    const isBot = m.role === "bot";
    return (
      <Fade in timeout={300} key={m.id}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-start",
            justifyContent: isBot ? "flex-start" : "flex-end",
          }}
        >
          {isBot && <BotAvatar />}
          <Box
            sx={{
              maxWidth: "80%",
              px: 2,
              py: 1.25,
              borderRadius: isBot ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
              bgcolor: isBot ? "rgba(15,23,42,0.04)" : "rgba(13,148,136,0.1)",
              border: "1px solid",
              borderColor: isBot ? "divider" : "rgba(13,148,136,0.2)",
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {m.content}
            </Typography>
          </Box>
          {!isBot && <UserAvatar />}
        </Box>
      </Fade>
    );
  };

  // ── Input area ──

  const renderInput = () => {
    if (typing) return null;

    switch (phase) {
      case "ASK_PROJECT":
        return (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {PROJECT_OPTIONS.map((p) => (
              <Chip
                key={p.key}
                label={p.label}
                onClick={() => onProject(p.key, p.label)}
                sx={{
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "primary.main", color: "#fff" },
                }}
              />
            ))}
          </Stack>
        );

      case "ASK_PAGES":
        return (
          <TextField
            value={pages}
            onChange={(e) => setPages(e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 5"
            size="small"
            type="tel"
            fullWidth
            onKeyDown={(e) => e.key === "Enter" && onPages()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onPages} size="small" color="primary">
                      <SendRounded sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        );

      case "ASK_EXTRAS":
        return (
          <Stack spacing={1.5}>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {EXTRAS.map((e) => (
                <Chip
                  key={e.key}
                  label={e.label}
                  onClick={() => toggleExtra(e.key)}
                  color={extras.includes(e.key) ? "primary" : "default"}
                  variant={extras.includes(e.key) ? "filled" : "outlined"}
                  sx={{ fontWeight: 600, cursor: "pointer" }}
                />
              ))}
            </Stack>
            <Button
              variant="contained"
              size="small"
              onClick={onExtras}
              sx={{ textTransform: "none", fontWeight: 700, alignSelf: "flex-start" }}
            >
              Continuar
            </Button>
          </Stack>
        );

      case "ASK_NAME":
        return (
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            size="small"
            fullWidth
            autoComplete="name"
            onKeyDown={(e) => e.key === "Enter" && onName()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onName} size="small" color="primary">
                      <SendRounded sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        );

      case "ASK_WHATSAPP":
        return (
          <TextField
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Ej: 9991234567"
            size="small"
            type="tel"
            fullWidth
            autoComplete="tel"
            onKeyDown={(e) => e.key === "Enter" && onWhatsapp()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onWhatsapp} size="small" color="primary">
                      <SendRounded sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        );

      case "ASK_MESSAGE":
        return (
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Cuéntanos sobre tu negocio..."
            size="small"
            multiline
            maxRows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onMessage();
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onMessage} size="small" color="primary">
                      <SendRounded sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
          />
        );

      case "SENDING":
        return (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            Enviando...
          </Typography>
        );

      case "DONE":
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CheckCircleRounded sx={{ color: "success.main" }} />
            <Typography variant="body2" color="text.secondary">
              ¡Conversación completa!
            </Typography>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        maxWidth: 520,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "rgba(15,23,42,0.02)",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "rgba(13,148,136,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BoltRounded sx={{ fontSize: 20, color: "#0D9488" }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "0.85rem", lineHeight: 1.2 }}>
            Moving Quicker
          </Typography>
          <Typography variant="caption" sx={{ color: typing ? "primary.main" : "text.secondary", fontWeight: typing ? 600 : 400 }}>
            {typing ? "Escribiendo..." : "En línea"}
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          height: 380,
          overflowY: "auto",
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 2 },
        }}
      >
        {messages.map(renderBubble)}
        {typing && <TypingDots />}
        <div ref={endRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(15,23,42,0.02)",
          minHeight: 56,
        }}
      >
        {renderInput()}
      </Box>
    </Paper>
  );
}
