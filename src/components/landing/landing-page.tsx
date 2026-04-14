"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type ComponentType,
  type FormEvent,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import BoltRounded from "@mui/icons-material/BoltRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import WebRounded from "@mui/icons-material/WebRounded";
import DashboardRounded from "@mui/icons-material/DashboardRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import SecurityRounded from "@mui/icons-material/SecurityRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import CalculateRounded from "@mui/icons-material/CalculateRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import SupportAgentRounded from "@mui/icons-material/SupportAgentRounded";
import DevicesRounded from "@mui/icons-material/DevicesRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import { FadeIn } from "@/components/motion/fade-in";
import { trackEvent, getVisitorId } from "@/lib/tracking";

// ---------- helpers & env ----------

const WA_FALLBACK = "521XXXXXXXXXX";

function getWaNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WA_NUMBER ?? WA_FALLBACK;
  return raw.replace(/\D/g, "") || WA_FALLBACK.replace(/\D/g, "");
}

function waHref(text: string): string {
  return `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(text)}`;
}

function fmtMx(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

type IconComp = ComponentType<SvgIconProps>;

// ---------- DATA ----------

const solutions: {
  icon: IconComp;
  title: string;
  description: string;
  price: string;
  href: string;
  accent: string;
}[] = [
  {
    icon: WebRounded,
    title: "Presencia Digital",
    description:
      "Landing page profesional, SEO local, Google Maps, WhatsApp integrado. Tu negocio visible para clientes reales.",
    price: "Desde $5,000 MXN",
    href: "#cotiza",
    accent: "#0D9488",
  },
  {
    icon: DashboardRounded,
    title: "Software de Gestión",
    description:
      "Automatiza lo que hoy haces en Excel y WhatsApp. Dashboards, cobros automáticos, reportes.",
    price: "Desde $15,000 MXN",
    href: "#cotiza",
    accent: "#6366F1",
  },
  {
    icon: SupportAgentRounded,
    title: "Consultoría Digital",
    description:
      "¿No sabes qué necesitas? Empezamos por ahí. Análisis de negocio, propuesta de solución, roadmap.",
    price: "Sesión gratuita",
    href: "#cotiza",
    accent: "#F59E0B",
  },
];

const cases: {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  color: string;
  url: string;
  soon?: boolean;
}[] = [
  {
    name: "Rentagil",
    tagline: "Gestión de rentas",
    description:
      "Sistema web para arrendadores que necesitaban dejar de cobrar por WhatsApp y controlar todos sus inmuebles desde un solo lugar.",
    features: [
      "Cobros automáticos con recordatorios",
      "Portal de inquilinos con estado de cuenta",
      "Dashboard de ocupación e ingresos",
    ],
    color: "#5C6BC0",
    url: "https://rentagil.com",
    soon: true,
  },
  {
    name: "ICAIMH",
    tagline: "Congreso internacional de IA",
    description:
      "Plataforma para organizar un congreso académico: inscripción en línea, cobro de entradas, gestión del programa y comunicación con asistentes.",
    features: [
      "Inscripción y cobro en línea con confirmación automática",
      "Panel de administración para ponentes, sesiones y boletos",
      "Generación de recibos en PDF y notificaciones por correo",
    ],
    color: "#0F766E",
    url: "https://2026v2.icaimh.org",
  },
  {
    name: "JAICA Journal",
    tagline: "Revista académica",
    description:
      "Portal de la revista científica JAICA que facilita la difusión de investigación en inteligencia artificial con acceso abierto.",
    features: [
      "Exploración de artículos y números publicados",
      "Cumplimiento editorial para indexación internacional",
      "Integración con Open Journal Systems para gestión editorial",
    ],
    color: "#1565C0",
    url: "https://jaica.maikron.org",
  },
  {
    name: "Manglar Coffee",
    tagline: "Cafetería de especialidad",
    description:
      "Café de especialidad en Ciudad del Carmen que necesitaba presencia digital con menú, galería y ubicación para atraer clientes locales.",
    features: [
      "Menú digital con precios y categorías actualizables",
      "Galería visual del espacio y las bebidas",
      "Ubicación con horarios y enlace a redes sociales",
    ],
    color: "#5D4037",
    url: "https://manglarcoffee.netlify.app",
  },
];

const transformations: { before: string; after: string; icon: IconComp; accent: string; bgTint: string }[] = [
  {
    before: "Tu negocio solo existe en Facebook",
    after: "Landing profesional con SEO y Google Maps",
    icon: WebRounded,
    accent: "#0D9488",
    bgTint: "rgba(13,148,136,0.06)",
  },
  {
    before: "Cobras en WhatsApp y pierdes el hilo",
    after: "Sistema automático de cobros y recordatorios",
    icon: DashboardRounded,
    accent: "#6366F1",
    bgTint: "rgba(99,102,241,0.06)",
  },
  {
    before: "No sabes cuántos clientes te llegan",
    after: "Dashboard con métricas de tu negocio",
    icon: TrendingUpRounded,
    accent: "#F59E0B",
    bgTint: "rgba(245,158,11,0.06)",
  },
];

const steps: { num: number; title: string; desc: string; color: string }[] = [
  {
    num: 1,
    title: "Cuéntanos sobre tu negocio",
    desc: "WhatsApp o formulario. Nos compartes qué necesitas y te escuchamos.",
    color: "#0D9488",
  },
  {
    num: 2,
    title: "Recibe una propuesta clara",
    desc: "Alcance, tiempo y precio. Sin letras chiquitas, sin sorpresas.",
    color: "#6366F1",
  },
  {
    num: 3,
    title: "Lo construimos y lo entregamos",
    desc: "Tú apruebas, nosotros implementamos. Incluye 30 días de soporte.",
    color: "#10B981",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "¿Cuánto tarda?",
    a: "Una landing típica: 1–2 semanas. Un sistema custom: 4–8 semanas.",
  },
  {
    q: "¿Incluye dominio y hosting?",
    a: "Sí, te ayudamos a configurar todo. El costo del dominio (~$300 MXN/año) va aparte.",
  },
  {
    q: "¿Puedo hacer cambios después?",
    a: "Incluimos 30 días de ajustes. Después, podemos ofrecerte un plan de mantenimiento.",
  },
  {
    q: "¿Qué pasa si no me gusta el resultado?",
    a: "Trabajamos con aprobaciones por etapa. Nunca llegas al final sin haber visto avances.",
  },
  {
    q: "¿Facturas?",
    a: "Sí, emitimos factura por cada proyecto.",
  },
];

const navSections: { label: string; href: string }[] = [
  { label: "Soluciones", href: "#soluciones" },
  { label: "Trabajos", href: "#trabajos" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
];

const BUSINESS_TYPES = [
  "Restaurante / cafetería",
  "Comercio local",
  "Servicios profesionales",
  "Salud / belleza / fitness",
  "Inmobiliaria / rentas",
  "Otro",
] as const;

type ProjectType = "landing" | "store" | "custom" | "blog";

const PROJECT_BASE: Record<ProjectType, number> = {
  landing: 5000,
  store: 12000,
  custom: 15000,
  blog: 8000,
};

// ---------- SUB-COMPONENTS ----------

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const onDark = !scrolled;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid" : "none",
        borderColor: "divider",
        transition: "background-color 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, sm: 68 } }}>
          <BoltRounded
            sx={{
              mr: 1,
              fontSize: 28,
              color: onDark ? "primary.light" : "primary.main",
            }}
          />
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: "1.15rem",
              letterSpacing: "-0.02em",
              color: onDark ? "common.white" : "text.primary",
            }}
          >
            Moving Quicker
          </Typography>

          {!isMobile && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 4, flex: 1, alignItems: "center" }}>
              {navSections.map((s) =>
                s.href.startsWith("/") ? (
                  <Button
                    key={s.href}
                    component={Link}
                    href={s.href}
                    size="small"
                    sx={{
                      color: onDark ? "rgba(255,255,255,0.85)" : "text.secondary",
                      fontWeight: 500,
                      textTransform: "none",
                    }}
                  >
                    {s.label}
                  </Button>
                ) : (
                  <Button
                    key={s.href}
                    href={s.href}
                    size="small"
                    sx={{
                      color: onDark ? "rgba(255,255,255,0.85)" : "text.secondary",
                      fontWeight: 500,
                      textTransform: "none",
                    }}
                  >
                    {s.label}
                  </Button>
                ),
              )}
            </Stack>
          )}

          <Box sx={{ flex: 1 }} />

          <Button
            href="#cotiza"
            variant="contained"
            size="medium"
            onClick={() => trackEvent("cta_click", { location: "navbar" })}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
              boxShadow: onDark ? "0 8px 24px rgba(13,148,136,0.45)" : undefined,
            }}
          >
            Cotiza gratis
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        role="button"
        tabIndex={0}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, pr: 1 }}>
          {q}
        </Typography>
        <IconButton size="small" aria-expanded={open} aria-label={open ? "Cerrar respuesta" : "Ver respuesta"}>
          <ExpandMoreRounded
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </IconButton>
      </Box>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Box sx={{ px: 3, pb: 2.5, pt: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {a}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

function QuoteEstimator() {
  const [projectType, setProjectType] = useState<ProjectType>("landing");
  const [pages, setPages] = useState(5);
  const [domain, setDomain] = useState(false);
  const [seo, setSeo] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [waIntegration, setWaIntegration] = useState(false);

  const { low, high, maintenanceNote } = useMemo(() => {
    const base = PROJECT_BASE[projectType];
    const pageFactor = 1 + (pages - 1) * 0.06;
    let subtotal = base * pageFactor;
    if (domain) subtotal += 500;
    if (seo) subtotal += 2000;
    if (waIntegration) subtotal += 3000;
    const lowRounded = Math.round(subtotal / 500) * 500;
    const highRounded = Math.round((lowRounded * 1.5) / 500) * 500;
    return {
      low: lowRounded,
      high: highRounded,
      maintenanceNote: maintenance,
    };
  }, [projectType, pages, domain, seo, maintenance, waIntegration]);

  const waMessage =
    `Hola, vengo de Moving Quicker. Quiero cotizar un proyecto:\n` +
    `— Tipo: ${projectType}\n` +
    `— Páginas aprox.: ${pages}\n` +
    `— Extras: ${[
      domain && "Dominio propio",
      seo && "SEO básico",
      maintenance && "Mantenimiento mensual",
      waIntegration && "Integración WhatsApp",
    ]
      .filter(Boolean)
      .join(", ") || "ninguno"}\n` +
    `— Rango estimado en la web: ${fmtMx(low)} – ${fmtMx(high)}`;

  const extraChips: { key: string; label: string; on: boolean; toggle: () => void }[] = [
    { key: "dom", label: "Dominio propio", on: domain, toggle: () => setDomain((v) => !v) },
    { key: "seo", label: "SEO básico", on: seo, toggle: () => setSeo((v) => !v) },
    {
      key: "mnt",
      label: "Mantenimiento mensual",
      on: maintenance,
      toggle: () => setMaintenance((v) => !v),
    },
    {
      key: "wa",
      label: "Integración WhatsApp",
      on: waIntegration,
      toggle: () => setWaIntegration((v) => !v),
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <CalculateRounded color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 800 }}>
              Estimador rápido
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajusta opciones y obtén un rango orientativo en pesos mexicanos.
            </Typography>
          </Box>
        </Stack>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          ¿Qué tipo de proyecto?
        </Typography>
        <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
          <RadioGroup
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as ProjectType)}
            aria-label="Tipo de proyecto"
          >
            <FormControlLabel value="landing" control={<Radio color="primary" />} label="Landing page" />
            <FormControlLabel value="store" control={<Radio color="primary" />} label="Tienda online" />
            <FormControlLabel value="custom" control={<Radio color="primary" />} label="Sistema custom" />
            <FormControlLabel value="blog" control={<Radio color="primary" />} label="Blog/contenido" />
          </RadioGroup>
        </FormControl>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Número de páginas / secciones: {pages}
        </Typography>
        <Slider
          value={pages}
          onChange={(_, v) => setPages(v as number)}
          min={1}
          max={20}
          valueLabelDisplay="auto"
          aria-label="Número de páginas"
          sx={{
            mb: 3,
            color: "primary.main",
            "& .MuiSlider-thumb": { bgcolor: "primary.main" },
            "& .MuiSlider-track": { bgcolor: "primary.main" },
          }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
          Extras (toca para activar)
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          {extraChips.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              onClick={c.toggle}
              color={c.on ? "primary" : "default"}
              variant={c.on ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Stack>

        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 2,
            p: 3,
            mb: 2,
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 1 }}>
            Estimado orientativo
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>
            {fmtMx(low)} – {fmtMx(high)}
          </Typography>
          {maintenanceNote && (
            <Typography variant="body2" sx={{ opacity: 0.95, mb: 1 }}>
              + {fmtMx(1500)} MXN/mes por mantenimiento (no incluido en el rango).
            </Typography>
          )}
          <Typography variant="body2" sx={{ opacity: 0.88, mb: 2 }}>
            El precio final depende de alcance y complejidad. Te lo detallamos en una cotización formal.
          </Typography>
          <Button
            component="a"
            href={waHref(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardRounded />}
            sx={{
              bgcolor: "common.white",
              color: "primary.dark",
              fontWeight: 800,
              textTransform: "none",
              py: 1.25,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            Cotiza el precio exacto
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}


const AUTOPLAY_MS = 4000;

function CasesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const pausedRef = useRef(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const perPage = isMobile ? 1 : 2;
  const pages = Math.ceil(cases.length / perPage);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / cases.length;
    const idx = Math.round(el.scrollLeft / (cardWidth * perPage));
    setActiveIdx(Math.min(idx, pages - 1));
  }, [perPage, pages]);

  const scrollToPage = useCallback(
    (page: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = el.scrollWidth / cases.length;
      el.scrollTo({ left: cardWidth * perPage * page, behavior: "smooth" });
    },
    [perPage],
  );

  const scrollTo = useCallback(
    (dir: "prev" | "next") => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = el.scrollWidth / cases.length;
      const offset = cardWidth * perPage;
      el.scrollBy({ left: dir === "next" ? offset : -offset, behavior: "smooth" });
    },
    [perPage],
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIdx((prev) => {
        const next = prev >= pages - 1 ? 0 : prev + 1;
        scrollToPage(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [pages, scrollToPage]);

  const pause = useCallback(() => { pausedRef.current = true; }, []);
  const resume = useCallback(() => { pausedRef.current = false; }, []);

  return (
    <Container maxWidth="lg" id="trabajos" sx={{ py: { xs: 6, md: 8 }, scrollMarginTop: 80 }}>
      <FadeIn>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
          PROYECTOS EN PRODUCCIÓN
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
          Soluciones reales para problemas reales
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Cada proyecto nació de una necesidad concreta. Así es como trabajamos.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
            <IconButton
              onClick={() => { pause(); scrollTo("prev"); }}
              disabled={activeIdx === 0}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                "&:disabled": { opacity: 0.3 },
              }}
              aria-label="Anterior"
            >
              <ChevronLeftRounded />
            </IconButton>
            <IconButton
              onClick={() => { pause(); scrollTo("next"); }}
              disabled={activeIdx >= pages - 1}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                "&:disabled": { opacity: 0.3 },
              }}
              aria-label="Siguiente"
            >
              <ChevronRightRounded />
            </IconButton>
          </Stack>
        </Stack>
      </FadeIn>

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          pb: 1,
          mx: -1,
          px: 1,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {cases.map((c) => (
          <Card
            key={c.name}
            elevation={0}
            sx={{
              minWidth: { xs: "85%", sm: "calc(50% - 12px)" },
              maxWidth: { xs: "85%", sm: "calc(50% - 12px)" },
              flexShrink: 0,
              scrollSnapAlign: "start",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
              },
            }}
          >
            <Box sx={{ height: 5, bgcolor: c.color }} />
            <CardContent sx={{ p: 3 }}>
              <Chip
                label={c.tagline}
                size="small"
                sx={{ fontWeight: 600, mb: 1.5, bgcolor: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30` }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                {c.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                {c.description}
              </Typography>
              <Stack spacing={1} sx={{ mb: 2.5 }}>
                {c.features.map((f) => (
                  <Stack key={f} direction="row" spacing={1} alignItems="flex-start">
                    <CheckCircleRounded sx={{ fontSize: 16, color: c.color, mt: 0.3, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                      {f}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              {c.soon ? (
                <Chip label="Próximamente" size="small" variant="outlined" sx={{ fontWeight: 600, opacity: 0.7 }} />
              ) : (
                <Button
                  component="a"
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  endIcon={<OpenInNewRounded sx={{ fontSize: 16 }} />}
                  sx={{ textTransform: "none", fontWeight: 700 }}
                  onClick={() => trackEvent("click_project", { project: c.name, url: c.url })}
                >
                  Ver proyecto
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 3 }}>
        {Array.from({ length: pages }).map((_, i) => (
          <Box
            key={i}
            onClick={() => { pause(); scrollToPage(i); }}
            sx={{
              width: activeIdx === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: activeIdx === i ? "primary.main" : "grey.300",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </Stack>

      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          ¿Necesitas algo similar para tu negocio o institución?
        </Typography>
        <Button
          href="#cotiza"
          variant="contained"
          size="large"
          endIcon={<ArrowForwardRounded />}
          sx={{ textTransform: "none", fontWeight: 800, px: 3 }}
        >
          Cotiza tu proyecto
        </Button>
      </Box>
    </Container>
  );
}

function QuoteSection() {
  return (
    <Box id="cotiza" sx={{ py: { xs: 6, md: 8 }, scrollMarginTop: 80 }}>
      <Container maxWidth="md">
        <FadeIn>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
            COTIZA
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
            Estima tu inversión en minutos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Si prefieres hablar directo, el botón de WhatsApp lleva el contexto de tu estimación.
          </Typography>
        </FadeIn>

        <FadeIn>
          <QuoteEstimator />
        </FadeIn>

        <FadeIn delay={0.04}>
          <Box
            component="a"
            href="/cotiza"
            onClick={() => trackEvent("click_chat_quote_link")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mt: 4,
              mb: 2,
              p: 2,
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              textDecoration: "none",
              color: "text.primary",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <SupportAgentRounded color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                ¿Prefieres que te guiemos paso a paso?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Nuestro asistente te arma una cotización en 1 minuto.
              </Typography>
            </Box>
            <ArrowForwardRounded fontSize="small" color="action" />
          </Box>
        </FadeIn>

        <Divider sx={{ my: 6 }} />
        <FadeIn>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <SecurityRounded color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Formulario de contacto
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <DevicesRounded fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              ¿Sin WhatsApp ahora? Déjanos tus datos y te escribimos.
            </Typography>
          </Stack>
        </FadeIn>
        <FadeIn delay={0.06}>
          <ContactForm />
        </FadeIn>
      </Container>
    </Box>
  );
}

function StickyCTAMobile() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isMobile) return null;

  const msg =
    "Hola, vi Moving Quicker y quiero platicar sobre un proyecto digital para mi negocio en México.";

  return (
    <Zoom in={visible}>
      <Fab
        color="success"
        aria-label="Contactar por WhatsApp"
        href={waHref(msg)}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: "fixed",
          right: 16,
          bottom: 24,
          zIndex: (t) => t.zIndex.tooltip + 1,
          bgcolor: "#25D366",
          color: "#fff",
          "&:hover": { bgcolor: "#1ebe57" },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 28 }} />
      </Fab>
    </Zoom>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessType, setBusinessType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          businessType: businessType || undefined,
          message: message.trim(),
          visitorId: getVisitorId(),
          source: "form",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo enviar. Intenta de nuevo.");
        return;
      }
      trackEvent("form_lead_submitted", { businessType: businessType || "unknown" });
      setSuccess(true);
      setName("");
      setWhatsapp("");
      setBusinessType("");
      setMessage("");
    } catch {
      setError("Error de red. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <FadeIn>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "success.light",
            bgcolor: "rgba(16, 185, 129, 0.08)",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
          }}
        >
          <CheckCircleRounded sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            ¡Mensaje enviado!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Te respondemos pronto por WhatsApp o correo.
          </Typography>
          <Button variant="outlined" onClick={() => setSuccess(false)} sx={{ textTransform: "none" }}>
            Enviar otro mensaje
          </Button>
        </Box>
      </FadeIn>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        {error && (
          <Typography variant="body2" color="error" role="alert">
            {error}
          </Typography>
        )}
        <TextField
          required
          label="Nombre"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          autoComplete="name"
        />
        <TextField
          required
          label="WhatsApp"
          name="whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          fullWidth
          placeholder="Ej. 9991234567"
          autoComplete="tel"
        />
        <FormControl fullWidth>
          <InputLabel id="biz-type-label">Tipo de negocio</InputLabel>
          <Select
            labelId="biz-type-label"
            label="Tipo de negocio"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          >
            <MenuItem value="">
              <em>Selecciona (opcional)</em>
            </MenuItem>
            {BUSINESS_TYPES.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          label="Mensaje"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          minRows={4}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 800, py: 1.25, borderRadius: 2 }}
        >
          {loading ? "Enviando…" : "Enviar mensaje"}
        </Button>
      </Stack>
    </Box>
  );
}

export function LandingPage() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname });
  }, []);

  const finalWa =
    "Hola, quiero que mi negocio tenga presencia digital en México. ¿Me pueden ayudar con una propuesta?";

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <NavBar />

      <Box
        component="header"
        sx={{
          pt: { xs: 12, sm: 14 },
          pb: { xs: 8, md: 10 },
          px: 0,
          background:
            "linear-gradient(165deg, #0F172A 0%, #1E293B 42%, #134E4A 88%, #0D9488 120%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage: "radial-gradient(circle at 20% 20%, #5EEAD4 0%, transparent 45%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <FadeIn>
            <Chip
              label="Soluciones digitales para negocios en México"
              sx={{
                mb: 3,
                bgcolor: "rgba(255,255,255,0.12)",
                color: "primary.light",
                border: "1px solid rgba(94,234,212,0.35)",
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                color: "common.white",
                fontWeight: 900,
                fontSize: { xs: "2.25rem", sm: "2.85rem", md: "3.5rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                maxWidth: 900,
              }}
            >
              Tu negocio pierde clientes
            </Typography>
            <Typography
              component="span"
              variant="h1"
              sx={{
                display: "block",
                color: "primary.light",
                fontWeight: 900,
                fontSize: { xs: "2.25rem", sm: "2.85rem", md: "3.5rem" },
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                maxWidth: 900,
                mt: 0.5,
              }}
            >
              por no tener presencia real
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 3, mb: 2 }}>
              <SpeedRounded sx={{ color: "primary.light", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.88)",
                  fontWeight: 500,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  maxWidth: 640,
                  lineHeight: 1.6,
                }}
              >
                Landing pages, software a la medida y consultoría para PyMEs en México.
              </Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Button
                href="#cotiza"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRounded />}
                onClick={() => trackEvent("cta_click", { location: "hero" })}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  boxShadow: "0 12px 32px rgba(13,148,136,0.45)",
                }}
              >
                Cotiza tu proyecto
              </Button>
              <Button
                href="#trabajos"
                variant="outlined"
                size="large"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  color: "common.white",
                  borderColor: "rgba(255,255,255,0.45)",
                  "&:hover": { borderColor: "common.white", bgcolor: "rgba(255,255,255,0.06)" },
                }}
              >
                Ver trabajos
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 4 }}>
              <Rating
                value={5}
                readOnly
                size="small"
                sx={{ color: "warning.light" }}
                emptyIcon={<StarRounded sx={{ opacity: 0.35, color: "grey.600" }} />}
              />
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Proyectos claros, plazos reales, sin relleno
              </Typography>
            </Stack>
          </FadeIn>
        </Container>
      </Box>

      <CasesCarousel />

      <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(180deg, #F0FDFA 0%, #F8FAFC 100%)" }}>
      <Container maxWidth="lg">
        <FadeIn>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
            ANTES → DESPUÉS
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, mt: 1 }}>
            Del caos digital al control
          </Typography>
        </FadeIn>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {transformations.map((t) => {
            const Icon = t.icon;
            return (
              <Card
                key={t.before}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  height: "100%",
                  bgcolor: t.bgTint,
                  borderTop: `3px solid ${t.accent}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Icon sx={{ fontSize: 28, color: t.accent }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: t.accent }}>
                      Transformación
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.disabled", textDecoration: "line-through", mb: 1.5, minHeight: 44 }}
                  >
                    {t.before}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <ArrowForwardRounded sx={{ color: t.accent }} fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: t.accent }}>
                      Ahora
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {t.after}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
      </Box>

      <Box id="soluciones" sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <FadeIn>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
              SOLUCIONES
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
              Lo que construimos para tu negocio
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
              Tres formas de empezar: presencia web, producto digital o una sesión para definir el camino.
            </Typography>
          </FadeIn>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {solutions.map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.title}
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 20px 50px ${s.accent}26`,
                      borderColor: s.accent,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `${s.accent}14`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 30, color: s.accent }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 72 }}>
                      {s.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: s.accent }}>
                      {s.price}
                    </Typography>
                    <Button
                      href={s.href}
                      endIcon={<ArrowForwardRounded />}
                      sx={{ textTransform: "none", fontWeight: 700, color: s.accent }}
                    >
                      Me interesa
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #312E81 100%)",
          color: "common.white",
        }}
      >
        <Container maxWidth="lg">
          <FadeIn>
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, color: "#A5B4FC" }}>
              PROCESO
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 5, mt: 1 }}>
              Cómo trabajamos
            </Typography>
          </FadeIn>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 4, md: 0 },
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: 28,
                left: "20%",
                right: "20%",
                height: 2,
                background: "linear-gradient(90deg, #0D9488, #6366F1, #10B981)",
                opacity: 0.4,
              }}
            />
            {steps.map((st, i) => (
              <Box key={st.num} sx={{ textAlign: "center", position: "relative", px: { xs: 0, md: 3 } }}>
                <Avatar
                  sx={{
                    bgcolor: st.color,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 2.5,
                    border: "3px solid rgba(255,255,255,0.15)",
                    boxShadow: `0 0 24px ${st.color}66`,
                  }}
                >
                  {st.num}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "common.white" }}>
                  {st.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 280, mx: "auto" }}>
                  {st.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <QuoteSection />

      <Box sx={{ bgcolor: "#F8FAFC" }}>
      <Container maxWidth="md" id="faq" sx={{ py: { xs: 6, md: 8 }, scrollMarginTop: 80 }}>
        <FadeIn>
          <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, color: "#F59E0B" }}>
            FAQ
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, mt: 1 }}>
            Preguntas frecuentes
          </Typography>
        </FadeIn>
        <Stack spacing={2}>
          {faqs.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </Stack>
      </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #6366F1 65%, #0D9488 100%)",
          color: "common.white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage: "radial-gradient(circle at 70% 50%, #F59E0B 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="md">
          <FadeIn>
            <Typography variant="h4" sx={{ fontWeight: 900, textAlign: "center", mb: 2 }}>
              ¿Listo para que tu negocio tenga presencia real?
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center", opacity: 0.92, mb: 4 }}>
              Platícanos qué vendes, dónde estás y qué te gustaría lograr en internet.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                component="a"
                href={waHref(finalWa)}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: "#25D366",
                  color: "#fff",
                  px: 3,
                  "&:hover": { bgcolor: "#1ebe57" },
                }}
              >
                WhatsApp
              </Button>
              <Button
                href="#cotiza"
                variant="outlined"
                size="large"
                onClick={() => trackEvent("cta_click", { location: "final_cta" })}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "common.white",
                  px: 3,
                  "&:hover": { borderColor: "common.white", bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                Ir al formulario
              </Button>
            </Stack>
          </FadeIn>
        </Container>
      </Box>

      <Box component="footer" sx={{ bgcolor: "#0F172A", color: "grey.300", pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            justifyContent="space-between"
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "none", md: "block" }, borderColor: "grey.800" }}
              />
            }
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  <BoltRounded sx={{ fontSize: 22 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "common.white" }}>
                  Moving Quicker
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ maxWidth: 320, opacity: 0.85 }}>
                Soluciones digitales para PyMEs en México: landing pages, software y consultoría.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "common.white", fontWeight: 700, mb: 1.5 }}>
                Soluciones
              </Typography>
              <Stack spacing={1}>
                <Button
                  href="#soluciones"
                  color="inherit"
                  sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}
                >
                  Presencia web
                </Button>
                <Button
                  href="#soluciones"
                  color="inherit"
                  sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}
                >
                  Software
                </Button>
                <Button
                  href="#cotiza"
                  color="inherit"
                  sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}
                >
                  Cotizar
                </Button>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "common.white", fontWeight: 700, mb: 1.5 }}>
                Legal y blog
              </Typography>
              <Stack spacing={1}>
                <Button
                  component={Link}
                  href="/blog"
                  color="inherit"
                  sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}
                >
                  Blog
                </Button>
                <Button
                  component={Link}
                  href="/privacidad"
                  color="inherit"
                  sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}
                >
                  Privacidad
                </Button>
                <Button
                  component={Link}
                  href="/terminos"
                  color="inherit"
                  sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}
                >
                  Términos
                </Button>
              </Stack>
            </Box>
          </Stack>
          <Divider sx={{ my: 4, borderColor: "grey.800" }} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Moving Quicker.
            </Typography>
            <IconButton
              onClick={scrollToTop}
              aria-label="Volver arriba"
              sx={{ color: "primary.light", border: "1px solid", borderColor: "grey.700" }}
            >
              <KeyboardArrowUpRounded />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      <StickyCTAMobile />
    </Box>
  );
}
