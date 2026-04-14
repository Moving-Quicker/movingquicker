import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import { ChatQuote } from "@/components/landing/chat-quote";
import { TrackPageview } from "@/components/track-pageview";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://movingquicker.com";

export const metadata: Metadata = {
  title: "Cotiza tu proyecto en 1 minuto — Moving Quicker",
  description:
    "Nuestro asistente te guía paso a paso para estimar tu proyecto digital. Landing pages, tiendas online, software a medida y más.",
  alternates: { canonical: "/cotiza" },
  openGraph: {
    title: "Cotiza tu proyecto en 1 minuto",
    description:
      "Nuestro asistente te guía paso a paso para estimar tu proyecto digital.",
    url: `${SITE_URL}/cotiza`,
    siteName: "Moving Quicker",
    type: "website",
    locale: "es_MX",
  },
};

export default function CotizaPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: { xs: 2, md: 4 },
        pb: { xs: 6, md: 10 },
      }}
    >
      <TrackPageview metadata={{ type: "cotiza" }} />

      <Container maxWidth="sm">
        <Button
          href="/"
          component="a"
          startIcon={<ArrowBackRounded />}
          size="small"
          sx={{ mb: 3, textTransform: "none" }}
        >
          Volver al inicio
        </Button>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <BoltRounded color="primary" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
            Cotiza tu proyecto
          </Typography>
        </Stack>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 420 }}
        >
          Responde unas preguntas rápidas y te damos un estimado al instante.
          Sin compromiso.
        </Typography>

        <ChatQuote />
      </Container>
    </Box>
  );
}
