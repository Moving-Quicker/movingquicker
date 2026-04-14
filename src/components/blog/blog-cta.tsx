"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BoltRounded from "@mui/icons-material/BoltRounded";

interface BlogCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

function whatsappHref(): string {
  const raw = process.env.NEXT_PUBLIC_WA_NUMBER;
  if (!raw) return "#";
  const digits = raw.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export function BlogCTA({
  title = "¿Necesitas una solución para tu negocio?",
  description = "Cuéntanos qué necesitas y te respondemos por WhatsApp con opciones claras para tu presencia digital.",
  buttonText = "Escribir por WhatsApp",
}: BlogCTAProps) {
  const href = whatsappHref();

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
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, maxWidth: 480, mx: "auto" }}
      >
        {description}
      </Typography>
      <Button
        href={href}
        variant="contained"
        size="large"
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        disabled={href === "#"}
        sx={{
          bgcolor: "#0D9488",
          "&:hover": { bgcolor: "#0f766e" },
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
}
