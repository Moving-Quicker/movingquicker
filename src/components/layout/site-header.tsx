"use client";

import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import BoltRounded from "@mui/icons-material/BoltRounded";
import Link from "next/link";

const navLinks: { label: string; href: string }[] = [
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Paquetes", href: "/#paquetes" },
  { label: "Trabajos", href: "/#trabajos" },
  { label: "Blog", href: "/blog" },
];

interface SiteHeaderProps {
  transparent?: boolean;
}

export function SiteHeader({ transparent = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(!transparent);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    if (!transparent) {
      setScrolled(true);
      return;
    }
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [transparent]);

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
          <Box
            component={Link}
            href="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
          >
            <BoltRounded
              sx={{
                mr: 1,
                fontSize: 28,
                color: !scrolled ? "primary.light" : "primary.main",
              }}
            />
            <Typography
              variant="body1"
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: "1.15rem",
                letterSpacing: "-0.02em",
                color: !scrolled ? "common.white" : "text.primary",
              }}
            >
              Moving Quicker
            </Typography>
          </Box>

          {!isMobile && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 4, flex: 1, alignItems: "center" }}>
              {navLinks.map((s) => (
                <Button
                  key={s.href}
                  component={Link}
                  href={s.href}
                  size="small"
                  sx={{
                    color: !scrolled ? "rgba(255,255,255,0.85)" : "text.secondary",
                    fontWeight: 500,
                    textTransform: "none",
                  }}
                >
                  {s.label}
                </Button>
              ))}
            </Stack>
          )}

          <Box sx={{ flex: 1 }} />

          <Button
            component={Link}
            href="/#cotiza"
            variant="contained"
            size="medium"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
              boxShadow: !scrolled ? "0 8px 24px rgba(13,148,136,0.45)" : undefined,
            }}
          >
            Cotiza gratis
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
