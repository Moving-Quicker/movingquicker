"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BoltRounded from "@mui/icons-material/BoltRounded";
import { trackEvent, getVariant } from "@/lib/tracking";

function whatsappHref(): string {
  const raw = process.env.NEXT_PUBLIC_WA_NUMBER;
  if (!raw) return "#";
  const digits = raw.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

const variants = {
  control: {
    title: "¿Necesitas una solución para tu negocio?",
    description: "Cuéntanos qué necesitas y te respondemos por WhatsApp con opciones claras para tu presencia digital.",
    buttonText: "Escribir por WhatsApp",
    getHref: whatsappHref,
    target: "_blank" as const,
  },
  form: {
    title: "¿Este artículo resolvió tu duda?",
    description: "Si necesitas algo más específico para tu negocio, déjanos tus datos y te contactamos con una propuesta.",
    buttonText: "Solicitar cotización",
    getHref: () => "/#contacto",
    target: "_self" as const,
  },
};

export function BlogCTA() {
  const variant = getVariant("blog-cta-variant") ?? "control";
  const v = variant === "form" ? variants.form : variants.control;
  const href = v.getHref();

  return (
    <Box
      sx={{
        my: 4,
        p: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #F0FDFA 0%, #ECFDF5 100%)",
        border: "1px solid",
        borderColor: "rgba(13, 148, 136, 0.25)",
        textAlign: "center",
      }}
    >
      <BoltRounded sx={{ fontSize: 32, color: "#0D9488", mb: 1 }} />
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        {v.title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, maxWidth: 480, mx: "auto" }}
      >
        {v.description}
      </Typography>
      <Button
        href={href}
        variant="contained"
        size="large"
        component="a"
        target={v.target}
        rel={v.target === "_blank" ? "noopener noreferrer" : undefined}
        disabled={href === "#"}
        onClick={() => trackEvent("blog_cta_click", { variant, buttonText: v.buttonText })}
        sx={{
          bgcolor: "#0D9488",
          "&:hover": { bgcolor: "#0f766e" },
        }}
      >
        {v.buttonText}
      </Button>
    </Box>
  );
}
