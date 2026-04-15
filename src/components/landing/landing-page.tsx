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
import { SiteHeader } from "@/components/layout/site-header";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
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
import StorefrontRounded from "@mui/icons-material/StorefrontRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import ArticleRounded from "@mui/icons-material/ArticleRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import RocketLaunchRounded from "@mui/icons-material/RocketLaunchRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import SupportAgentRounded from "@mui/icons-material/SupportAgentRounded";
import DevicesRounded from "@mui/icons-material/DevicesRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import HandshakeRounded from "@mui/icons-material/HandshakeRounded";
import WorkspacePremiumRounded from "@mui/icons-material/WorkspacePremiumRounded";
import FormatQuoteRounded from "@mui/icons-material/FormatQuoteRounded";
import EmailRounded from "@mui/icons-material/EmailRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import { FadeIn } from "@/components/motion/fade-in";
import { ChatQuote } from "@/components/landing/chat-quote";
import { trackEvent, getVariant } from "@/lib/tracking";

// ---------- helpers & env ----------

const WA_FALLBACK = "521XXXXXXXXXX";

function getWaNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WA_NUMBER ?? WA_FALLBACK;
  return raw.replace(/\D/g, "") || WA_FALLBACK.replace(/\D/g, "");
}

function waHref(text: string): string {
  return `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(text)}`;
}

type IconComp = ComponentType<SvgIconProps>;

// ---------- DATA ----------

const solutions: {
  icon: IconComp;
  title: string;
  description: string;
  tag: string;
  href: string;
  accent: string;
}[] = [
  {
    icon: WebRounded,
    title: "Presencia Digital",
    description:
      "Landing page profesional, SEO local, Google Maps, WhatsApp integrado. Tu negocio visible para clientes reales.",
    tag: "Entrega en 1–2 semanas",
    href: "#cotiza",
    accent: "#0D9488",
  },
  {
    icon: DashboardRounded,
    title: "Software de Gestión",
    description:
      "Automatiza lo que hoy haces en Excel y WhatsApp. Dashboards, cobros automáticos, reportes.",
    tag: "A la medida de tu negocio",
    href: "#cotiza",
    accent: "#6366F1",
  },
  {
    icon: SupportAgentRounded,
    title: "Consultoría Digital",
    description:
      "¿No sabes qué necesitas? Empezamos por ahí. Análisis de negocio, propuesta de solución, roadmap.",
    tag: "Primera sesión sin costo",
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
    desc: "Alcance, tiempos y todo lo que incluye. Sin letras chiquitas, sin sorpresas.",
    color: "#6366F1",
  },
  {
    num: 3,
    title: "Te mostramos un demo gratis",
    desc: "Armamos un prototipo rápido para que veas la idea aterrizada antes de decidir. Sin costo, sin compromiso.",
    color: "#F59E0B",
  },
  {
    num: 4,
    title: "Lo construimos y lo entregamos",
    desc: "Si te convence el demo, lo pulimos e implementamos. Incluye 30 días de soporte.",
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
    a: "Sí, te ayudamos a configurar todo. El dominio va aparte y te indicamos las opciones en tu propuesta.",
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


const BUSINESS_TYPES = [
  "Restaurante / cafetería",
  "Comercio local",
  "Servicios profesionales",
  "Salud / belleza / fitness",
  "Inmobiliaria / rentas",
  "Otro",
] as const;

type ProjectType = "landing" | "store" | "custom" | "blog";

const PROJECT_OPTIONS: {
  value: ProjectType;
  label: string;
  icon: IconComp;
  desc: string;
}[] = [
  { value: "landing", label: "Landing page", icon: WebRounded, desc: "Presencia web profesional" },
  { value: "store", label: "Tienda online", icon: StorefrontRounded, desc: "Vende tus productos en línea" },
  { value: "custom", label: "Sistema custom", icon: CodeRounded, desc: "Software a la medida" },
  { value: "blog", label: "Blog / contenido", icon: ArticleRounded, desc: "Publica y posiciona tu marca" },
];

type FeatureOption = { key: string; label: string; desc: string };

const FEATURES_BY_TYPE: Record<ProjectType, FeatureOption[]> = {
  landing: [
    { key: "seo", label: "SEO y posicionamiento", desc: "Aparece en Google" },
    { key: "wa", label: "Integración WhatsApp", desc: "Chat directo con clientes" },
    { key: "domain", label: "Dominio propio", desc: "tunegocio.com" },
    { key: "analytics", label: "Métricas y reportes", desc: "Mide tus resultados" },
    { key: "mnt", label: "Mantenimiento mensual", desc: "Actualizaciones y soporte" },
    { key: "gmb", label: "Google Business Profile", desc: "Aparece en Google Maps" },
  ],
  store: [
    { key: "payments", label: "Cobros en línea", desc: "Stripe / MercadoPago" },
    { key: "catalog", label: "Catálogo de productos", desc: "Con fotos y precios" },
    { key: "orders", label: "Gestión de pedidos", desc: "Notificaciones automáticas" },
    { key: "seo", label: "SEO y posicionamiento", desc: "Aparece en Google" },
    { key: "wa", label: "Integración WhatsApp", desc: "Chat directo con clientes" },
    { key: "analytics", label: "Métricas de ventas", desc: "Mide tu negocio" },
    { key: "domain", label: "Dominio propio", desc: "tunegocio.com" },
    { key: "mnt", label: "Mantenimiento mensual", desc: "Actualizaciones y soporte" },
  ],
  custom: [
    { key: "admin", label: "Panel de administración", desc: "Gestiona todo desde un dashboard" },
    { key: "integrations", label: "Integraciones", desc: "Pagos, correo, WhatsApp, APIs" },
    { key: "automation", label: "Automatizaciones", desc: "Cobros, recordatorios, reportes" },
    { key: "roles", label: "Roles y permisos", desc: "Accesos por usuario" },
    { key: "db", label: "Base de datos dedicada", desc: "Almacena todo tu negocio" },
    { key: "analytics", label: "Reportes y métricas", desc: "Decisiones con datos" },
    { key: "mnt", label: "Soporte y mantenimiento", desc: "Actualizaciones continuas" },
  ],
  blog: [
    { key: "seo", label: "SEO y posicionamiento", desc: "Aparece en Google" },
    { key: "cms", label: "Panel de contenido", desc: "Publica sin programar" },
    { key: "newsletter", label: "Newsletter", desc: "Captura suscriptores" },
    { key: "domain", label: "Dominio propio", desc: "tunegocio.com" },
    { key: "analytics", label: "Métricas de lectura", desc: "Qué contenido funciona" },
    { key: "mnt", label: "Mantenimiento mensual", desc: "Actualizaciones y soporte" },
  ],
};

const ALL_FEATURES: FeatureOption[] = Object.values(FEATURES_BY_TYPE).flat().filter(
  (f, i, arr) => arr.findIndex((x) => x.key === f.key) === i,
);

// ---------- PRICING DATA ----------

const pricingPackages: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  delivery: string;
  accent: string;
  icon: IconComp;
  blogSlug: string;
  popular?: boolean;
}[] = [
  {
    title: "Landing Page",
    price: "$8,000",
    period: "MXN pago único",
    description: "Presencia web profesional que convierte visitantes en clientes.",
    features: [
      "Diseño responsive a medida",
      "SEO local + Google Business",
      "Botón WhatsApp integrado",
      "Formulario de contacto",
      "Certificado SSL + hosting",
      "Dominio propio (.com.mx)",
    ],
    delivery: "1–2 semanas",
    accent: "#0D9488",
    icon: WebRounded,
    blogSlug: "cuanto-cuesta-pagina-web-mexico",
  },
  {
    title: "Tienda Online",
    price: "$18,000",
    period: "MXN pago único",
    description: "Vende en línea con cobros, catálogo y gestión de pedidos.",
    features: [
      "Todo lo de Landing Page",
      "Catálogo de productos",
      "Cobros en línea (Stripe / MercadoPago)",
      "Panel de administración",
      "Notificaciones de pedidos",
      "Métricas de ventas",
    ],
    delivery: "2–4 semanas",
    accent: "#6366F1",
    icon: StorefrontRounded,
    blogSlug: "cuanto-cuesta-tienda-online-mexico",
    popular: true,
  },
  {
    title: "Software a Medida",
    price: "$35,000",
    period: "MXN desde",
    description: "Sistema diseñado para tu operación: dashboards, automatización, portales.",
    features: [
      "Análisis de requerimientos",
      "Diseño UX/UI personalizado",
      "Base de datos dedicada",
      "Integraciones (pagos, correo, WhatsApp)",
      "Panel de administración",
      "Documentación y capacitación",
    ],
    delivery: "4–8 semanas",
    accent: "#F59E0B",
    icon: CodeRounded,
    blogSlug: "software-medida-vs-saas",
  },
];

// ---------- TRUST STATS ----------

const trustStats: { label: string; value: string; icon: IconComp }[] = [
  { label: "Proyectos entregados", value: "10+", icon: WorkspacePremiumRounded },
  { label: "Tiempo de respuesta", value: "<24h", icon: AccessTimeRounded },
  { label: "Soporte incluido", value: "30 días", icon: HandshakeRounded },
  { label: "Diseño y código", value: "100% a medida", icon: DevicesRounded },
];

// ---------- TESTIMONIALS ----------

const testimonials: {
  quote: string;
  name: string;
  role: string;
  company: string;
}[] = [
  {
    quote: "Nos entregaron el sistema de inscripciones en tiempo récord. El congreso se gestionó sin problemas gracias a la plataforma.",
    name: "Comité Organizador",
    role: "Congreso Internacional",
    company: "ICAIMH",
  },
  {
    quote: "Profesionales y rápidos. La revista quedó lista para indexación internacional con todas las especificaciones que pedimos.",
    name: "Equipo Editorial",
    role: "Revista Académica",
    company: "JAICA Journal",
  },
  {
    quote: "Nuestra presencia digital pasó de cero a tener menú, galería y ubicación. Los clientes nos encuentran mucho más fácil.",
    name: "Yussef Andueza",
    role: "Cafetería de Especialidad",
    company: "Manglar Coffee",
  },
];

// ---------- TECH STACK ----------

const techStack: { name: string; color: string }[] = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#000000" },
  { name: "Node.js", color: "#339933" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Prisma", color: "#2D3748" },
  { name: "Vercel", color: "#000000" },
  { name: "Stripe", color: "#635BFF" },
  { name: "Figma", color: "#F24E1E" },
  { name: "PostHog", color: "#F9BD2B" },
];

// ---------- SUB-COMPONENTS ----------

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
  const TOTAL_STEPS = 3;
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [features, setFeatures] = useState<Set<string>>(new Set());
  const [desc, setDesc] = useState("");

  const toggleFeature = useCallback((key: string) => {
    setFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const selectedLabel =
    PROJECT_OPTIONS.find((o) => o.value === projectType)?.label ?? "";

  const currentFeatures = projectType ? FEATURES_BY_TYPE[projectType] : [];

  const waMessage = useMemo(() => {
    const featureLabels = ALL_FEATURES.filter((f) => features.has(f.key)).map((f) => f.label);
    return (
      `Hola, vengo de Moving Quicker. Quiero cotizar un proyecto:\n` +
      `— Tipo: ${selectedLabel || "No seleccionado"}\n` +
      `— Funcionalidades: ${featureLabels.join(", ") || "ninguna seleccionada"}\n` +
      (desc ? `— Descripción: ${desc}\n` : "") +
      `\n¿Me pueden enviar una propuesta personalizada?`
    );
  }, [selectedLabel, features, desc]);

  const canAdvance = step === 1 ? !!projectType : true;
  const progress = (step / TOTAL_STEPS) * 100;

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
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <AutoAwesomeRounded color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 800 }}>
              Configura tu proyecto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              3 pasos rápidos y te enviamos una propuesta personalizada.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Paso {step} de {TOTAL_STEPS}
            </Typography>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
              {Math.round(progress)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": { borderRadius: 3 },
            }}
          />
        </Box>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                ¿Qué tipo de proyecto necesitas?
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.5,
                  mb: 3,
                }}
              >
                {PROJECT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = projectType === opt.value;
                  return (
                    <Box
                      key={opt.value}
                      onClick={() => {
                        setProjectType(opt.value);
                        setFeatures(new Set());
                        trackEvent("configurator_step", { step: 2, projectType: opt.value });
                        setTimeout(() => setStep(2), 250);
                      }}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor: selected ? "primary.main" : "divider",
                        bgcolor: selected ? "rgba(13,148,136,0.08)" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        position: "relative",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: selected ? "rgba(13,148,136,0.08)" : "action.hover",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Icon sx={{ fontSize: 28, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                            {opt.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {opt.desc}
                          </Typography>
                        </Box>
                      </Stack>
                      {selected && (
                        <CheckCircleRounded
                          color="primary"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            fontSize: 20,
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  ¿Qué funcionalidades te interesan?
                </Typography>
                <Chip label={selectedLabel} size="small" color="primary" variant="outlined" />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                Selecciona todas las que apliquen — puedes cambiar después.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                {currentFeatures.map((f) => {
                  const on = features.has(f.key);
                  return (
                    <Chip
                      key={f.key}
                      label={`${f.label} — ${f.desc}`}
                      onClick={() => toggleFeature(f.key)}
                      color={on ? "primary" : "default"}
                      variant={on ? "filled" : "outlined"}
                      sx={{ fontWeight: 600, py: 2.5 }}
                    />
                  );
                })}
              </Stack>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(13,148,136,0.06)",
                  border: "1px solid",
                  borderColor: "primary.light",
                  borderRadius: 2,
                  p: 2.5,
                  mb: 3,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Resumen de tu proyecto
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleRounded color="primary" sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      <strong>Tipo:</strong> {selectedLabel}
                    </Typography>
                  </Stack>
                  {features.size > 0 && (
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <CheckCircleRounded color="primary" sx={{ fontSize: 18, mt: 0.25 }} />
                      <Typography variant="body2">
                        <strong>Incluye:</strong>{" "}
                        {ALL_FEATURES.filter((f) => features.has(f.key))
                          .map((f) => f.label)
                          .join(", ")}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                Cuéntanos un poco más (opcional)
              </Typography>
              <TextField
                multiline
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="¿A qué se dedica tu negocio? ¿Qué problema quieres resolver?"
                fullWidth
                sx={{ mb: 3 }}
              />

              <Button
                component="a"
                href={waHref(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                fullWidth
                size="large"
                startIcon={<WhatsAppIcon />}
                endIcon={<RocketLaunchRounded />}
                onClick={() => {
                  trackEvent("wa_click", { location: "configurator", projectType: projectType ?? "none" });
                  trackEvent("conversion", { type: "whatsapp", location: "configurator", projectType: projectType ?? "none" });
                  trackEvent("configurator_submit", {
                    projectType: projectType ?? "none",
                    features: Array.from(features).join(","),
                  });
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  py: 1.5,
                  bgcolor: "#25D366",
                  color: "#fff",
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#1ebe57" },
                }}
              >
                Recibir propuesta personalizada
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mt: 1.5 }}
              >
                Sin compromiso — Te respondemos en menos de 24 horas.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        {step < TOTAL_STEPS && (
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              disabled={!canAdvance}
              onClick={() => {
                trackEvent("configurator_step", { step: step + 1, projectType: projectType ?? "none" });
                setStep((s) => s + 1);
              }}
              endIcon={<ArrowForwardRounded />}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Siguiente
            </Button>
          </Stack>
        )}
        {step === TOTAL_STEPS && (
          <Stack direction="row" justifyContent="flex-start" sx={{ mt: 1 }}>
            <Button
              onClick={() => setStep((s) => s - 1)}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Atrás
            </Button>
          </Stack>
        )}
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
        <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
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
              <Typography variant="h6" component="h3" sx={{ fontWeight: 800, mb: 1 }}>
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
  const variant = getVariant("quote-section") ?? "control";

  useEffect(() => {
    trackEvent("quote_section_view", { variant });
  }, [variant]);

  return (
    <Box id="cotiza" sx={{ py: { xs: 6, md: 8 }, scrollMarginTop: 80 }}>
      <Container maxWidth="md">
        <FadeIn>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
            COTIZA SIN COMPROMISO
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
            {variant === "control" ? "Arma tu proyecto en 1 minuto" : "Cotiza tu proyecto en 1 minuto"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {variant === "control"
              ? "Configura lo que necesitas y te enviamos una propuesta personalizada."
              : "Nuestro asistente te guía paso a paso. Sin compromiso."}
          </Typography>
        </FadeIn>

        <FadeIn>
          {variant === "control" ? <QuoteEstimator /> : <ChatQuote />}
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
              Déjanos tus datos y te escribimos. Sin compromiso.
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
        onClick={() => {
          trackEvent("wa_click", { location: "fab" });
          trackEvent("conversion", { type: "whatsapp", location: "fab" });
        }}
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
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessType, setBusinessType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const mountedAt = useRef(Date.now());

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
          email: email.trim(),
          whatsapp: whatsapp.trim() || undefined,
          businessType: businessType || undefined,
          message: message.trim(),
          source: "form",
          _hp: hp,
          _t: mountedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        trackEvent("form_submit_error", { error: data.error ?? "unknown", status: res.status });
        setError(data.error ?? "No se pudo enviar. Intenta de nuevo.");
        return;
      }
      trackEvent("form_lead_submitted", { businessType: businessType || "unknown" });
      trackEvent("conversion", { type: "form", location: "contact_form" });
      setSuccess(true);
      setName("");
      setEmail("");
      setWhatsapp("");
      setBusinessType("");
      setMessage("");
    } catch {
      trackEvent("form_submit_error", { error: "network", status: 0 });
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
          label="Correo electrónico"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          placeholder="tu@correo.com"
          autoComplete="email"
        />
        <TextField
          label="WhatsApp (opcional)"
          name="whatsapp"
          value={whatsapp}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
            const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean);
            setWhatsapp(parts.join(" "));
          }}
          fullWidth
          placeholder="999 123 4567"
          autoComplete="tel"
          inputProps={{ maxLength: 12, inputMode: "numeric" }}
        />
        <Box
          sx={{ position: "absolute", left: -9999, opacity: 0, height: 0, overflow: "hidden" }}
          aria-hidden="true"
        >
          <TextField
            label="No llenar"
            name="website"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </Box>
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


  const finalWa =
    "Hola, quiero que mi negocio tenga presencia digital en México. ¿Me pueden ayudar con una propuesta?";

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <SiteHeader transparent />

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

      {/* Trust Stats Bar */}
      <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: { xs: 2, md: 4 },
            }}
          >
            {trustStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Stack key={stat.label} direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                  <Icon sx={{ fontSize: 28, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Box>
        </Container>
      </Box>

      <CasesCarousel />

      {/* Testimonials */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="lg">
          <FadeIn>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
              TESTIMONIOS
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 4, mt: 1 }}>
              Lo que dicen nuestros clientes
            </Typography>
          </FadeIn>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {testimonials.map((t) => (
              <Card
                key={t.company}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1 }}>
                  <FormatQuoteRounded sx={{ fontSize: 32, color: "primary.main", opacity: 0.5, mb: 1 }} />
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontStyle: "italic", color: "text.secondary", flex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {t.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t.role} — {t.company}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(180deg, #F0FDFA 0%, #F8FAFC 100%)" }}>
      <Container maxWidth="lg">
        <FadeIn>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
            ANTES → DESPUÉS
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 4, mt: 1 }}>
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
            <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
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
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 72 }}>
                      {s.description}
                    </Typography>
                    <Chip
                      label={s.tag}
                      size="small"
                      sx={{
                        mb: 2,
                        bgcolor: `${s.accent}14`,
                        color: s.accent,
                        fontWeight: 700,
                        border: `1px solid ${s.accent}30`,
                      }}
                    />
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

      {/* Pricing Packages */}
      <Box id="paquetes" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#F8FAFC", scrollMarginTop: 80 }}>
        <Container maxWidth="lg">
          <FadeIn>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
              PAQUETES
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
              Inversión clara desde el inicio
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
              Precios transparentes, sin costos ocultos. Cada paquete incluye diseño, desarrollo y puesta en producción.
            </Typography>
          </FadeIn>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            {pricingPackages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <Card
                  key={pkg.title}
                  elevation={0}
                  sx={{
                    border: pkg.popular ? "2px solid" : "1px solid",
                    borderColor: pkg.popular ? pkg.accent : "divider",
                    borderRadius: 3,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 16px 40px ${pkg.accent}20`,
                    },
                  }}
                >
                  {pkg.popular && (
                    <Chip
                      label="Más popular"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: pkg.accent,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1.5,
                          bgcolor: `${pkg.accent}14`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon sx={{ fontSize: 24, color: pkg.accent }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {pkg.title}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 0.5 }}>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: pkg.accent }}>
                        {pkg.price}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                      {pkg.period} · Entrega: {pkg.delivery}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      {pkg.description}
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 3, flex: 1 }}>
                      {pkg.features.map((f) => (
                        <Stack key={f} direction="row" spacing={1} alignItems="flex-start">
                          <CheckCircleRounded sx={{ fontSize: 18, color: pkg.accent, mt: 0.2 }} />
                          <Typography variant="body2">{f}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
                      50% al inicio, 50% al entregar · Facturamos
                    </Typography>
                    <Button
                      href="#cotiza"
                      variant={pkg.popular ? "contained" : "outlined"}
                      fullWidth
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        py: 1.2,
                        ...(pkg.popular
                          ? { bgcolor: pkg.accent, "&:hover": { bgcolor: pkg.accent, filter: "brightness(0.9)" } }
                          : { borderColor: pkg.accent, color: pkg.accent }),
                      }}
                      onClick={() => trackEvent("cta_click", { location: "pricing", package: pkg.title })}
                    >
                      Cotizar {pkg.title.toLowerCase()}
                    </Button>
                    <Button
                      component={Link}
                      href={`/blog/${pkg.blogSlug}`}
                      size="small"
                      sx={{ textTransform: "none", mt: 1, color: "text.secondary", fontSize: "0.75rem" }}
                    >
                      Ver desglose completo en el blog
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
            <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 5, mt: 1 }}>
              Cómo trabajamos
            </Typography>
          </FadeIn>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 4, md: 0 },
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: 28,
                left: "14%",
                right: "14%",
                height: 2,
                background: "linear-gradient(90deg, #0D9488, #6366F1, #F59E0B, #10B981)",
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

      {/* Tech Stack */}
      <Box sx={{ py: { xs: 4, md: 5 }, bgcolor: "background.paper", borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: "text.disabled", display: "block", textAlign: "center", mb: 3 }}>
            TECNOLOGÍAS QUE USAMOS
          </Typography>
          <Stack
            direction="row"
            spacing={{ xs: 2, md: 4 }}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ rowGap: 2 }}
          >
            {techStack.map((tech) => (
              <Chip
                key={tech.name}
                label={tech.name}
                variant="outlined"
                size="medium"
                sx={{
                  fontWeight: 600,
                  borderColor: "divider",
                  bgcolor: "background.default",
                  "&:hover": { borderColor: "primary.main" },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#F8FAFC" }}>
      <Container maxWidth="md" id="faq" sx={{ py: { xs: 6, md: 8 }, scrollMarginTop: 80 }}>
        <FadeIn>
          <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, color: "#F59E0B" }}>
            FAQ
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 3, mt: 1 }}>
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
            <Typography variant="h4" component="h2" sx={{ fontWeight: 900, textAlign: "center", mb: 2 }}>
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
                onClick={() => {
                  trackEvent("wa_click", { location: "final_cta" });
                  trackEvent("conversion", { type: "whatsapp", location: "final_cta" });
                }}
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
          >
            <Box sx={{ maxWidth: 340 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  <BoltRounded sx={{ fontSize: 22 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "common.white" }}>
                  Moving Quicker
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                Soluciones digitales para PyMEs en México: landing pages, software y consultoría.
              </Typography>
              <Stack spacing={1}>
                <Box component="a" href="mailto:contacto@movingquicker.com" sx={{ display: "flex", alignItems: "center", gap: 1, color: "grey.300", textDecoration: "none", "&:hover": { color: "primary.light" } }}>
                  <EmailRounded sx={{ fontSize: 16, opacity: 0.7 }} />
                  <Typography variant="body2">contacto@movingquicker.com</Typography>
                </Box>
                <Box component="a" href={waHref("Hola, vi su sitio y quiero más información.")} target="_blank" rel="noopener noreferrer" sx={{ display: "flex", alignItems: "center", gap: 1, color: "grey.300", textDecoration: "none", "&:hover": { color: "primary.light" } }}>
                  <WhatsAppIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                  <Typography variant="body2">938 109 5593</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlaceRounded sx={{ fontSize: 16, opacity: 0.7 }} />
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    Mérida, Yucatán, México
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "common.white", fontWeight: 700, mb: 1.5 }}>
                Soluciones
              </Typography>
              <Stack spacing={1}>
                <Button href="#soluciones" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}>
                  Presencia web
                </Button>
                <Button href="#soluciones" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}>
                  Software
                </Button>
                <Button href="#paquetes" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}>
                  Paquetes
                </Button>
                <Button href="#cotiza" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}>
                  Cotizar
                </Button>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "common.white", fontWeight: 700, mb: 1.5 }}>
                Recursos
              </Typography>
              <Stack spacing={1}>
                <Button component={Link} href="/blog" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}>
                  Blog
                </Button>
                <Button component={Link} href="/privacidad" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}>
                  Privacidad
                </Button>
                <Button component={Link} href="/terminos" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: 0.9 }}>
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
              © {new Date().getFullYear()} Moving Quicker. Mérida, Yucatán.
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
