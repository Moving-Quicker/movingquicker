"use client";

import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import BoltRounded from "@mui/icons-material/BoltRounded";
import PeopleRounded from "@mui/icons-material/PeopleRounded";
import LeaderboardRounded from "@mui/icons-material/LeaderboardRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import TouchAppRounded from "@mui/icons-material/TouchAppRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";

interface Stats {
  overview: {
    totalVisitors: number;
    visitorsA: number;
    visitorsB: number;
    totalLeads: number;
    leadsA: number;
    leadsB: number;
    totalEvents: number;
    conversionA: number;
    conversionB: number;
  };
  recentLeads: {
    id: string;
    name: string;
    whatsapp: string;
    businessType: string | null;
    message: string;
    source: string;
    variant: string;
    createdAt: string;
  }[];
  dailyVisitors: { date: string; variant: string; count: number }[];
  dailyLeads: { date: string; variant: string; count: number }[];
  eventsByType: { type: string; count: number }[];
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        flex: 1,
        minWidth: 200,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: `${color}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

function MiniBar({ data, label }: { data: { date: string; variant: string; count: number }[]; label: string }) {
  const grouped = new Map<string, { A: number; B: number }>();
  for (const d of data) {
    const entry = grouped.get(d.date) ?? { A: 0, B: 0 };
    entry[d.variant as "A" | "B"] = d.count;
    grouped.set(d.date, entry);
  }

  const entries = [...grouped.entries()].slice(-14);
  const maxVal = Math.max(1, ...entries.flatMap(([, v]) => [v.A, v.B]));

  if (entries.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">No hay datos aún</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{label}</Typography>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: "#0D9488" }} />
            <Typography variant="caption">Variante A</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: "#6366F1" }} />
            <Typography variant="caption">Variante B</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.5, height: 120 }}>
        {entries.map(([date, v]) => (
          <Box key={date} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
            <Stack direction="row" spacing={0.25} sx={{ height: 100, alignItems: "flex-end" }}>
              <Box
                sx={{
                  width: 8,
                  height: `${(v.A / maxVal) * 100}%`,
                  minHeight: v.A > 0 ? 4 : 0,
                  bgcolor: "#0D9488",
                  borderRadius: "2px 2px 0 0",
                }}
              />
              <Box
                sx={{
                  width: 8,
                  height: `${(v.B / maxVal) * 100}%`,
                  minHeight: v.B > 0 ? 4 : 0,
                  bgcolor: "#6366F1",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            </Stack>
            <Typography variant="caption" sx={{ fontSize: "0.55rem", color: "text.secondary", transform: "rotate(-45deg)", whiteSpace: "nowrap" }}>
              {date.slice(5)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [fetching, setFetching] = useState(false);

  const fetchStats = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setStats(data);
      setAuthed(true);
    } catch {
      // ignore
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogin = async () => {
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setLoginError(data.error ?? "Credenciales inválidas");
        return;
      }
      setAuthed(true);
      setPassword("");
      await fetchStats();
    } catch {
      setLoginError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setStats(null);
    setUser("");
    setPassword("");
  };

  if (!authed) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F8FAFC",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: 380,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <BoltRounded sx={{ color: "#0D9488" }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              MQ Admin
            </Typography>
          </Stack>
          <TextField
            fullWidth
            label="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            size="small"
            autoComplete="username"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            error={!!loginError}
            helperText={loginError}
            size="small"
            autoComplete="current-password"
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading || !user || !password}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!stats || fetching) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F8FAFC",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const { overview, recentLeads, dailyVisitors, dailyLeads, eventsByType } = stats;
  const winner = overview.conversionA > overview.conversionB ? "A" : overview.conversionB > overview.conversionA ? "B" : "TIE";

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BoltRounded sx={{ color: "#0D9488", fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              MQ Analytics
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={fetchStats}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Actualizar
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<LogoutRounded sx={{ fontSize: 16 }} />}
              onClick={handleLogout}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Salir
            </Button>
          </Stack>
        </Stack>

        {/* A/B Overview */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }}>
          <StatCard
            label="Total visitantes"
            value={overview.totalVisitors}
            sub={`A: ${overview.visitorsA} · B: ${overview.visitorsB}`}
            icon={<PeopleRounded sx={{ color: "#0D9488" }} />}
            color="#0D9488"
          />
          <StatCard
            label="Total leads"
            value={overview.totalLeads}
            sub={`A: ${overview.leadsA} · B: ${overview.leadsB}`}
            icon={<LeaderboardRounded sx={{ color: "#6366F1" }} />}
            color="#6366F1"
          />
          <StatCard
            label="Total eventos"
            value={overview.totalEvents}
            icon={<TouchAppRounded sx={{ color: "#F59E0B" }} />}
            color="#F59E0B"
          />
        </Stack>

        {/* Conversion comparison */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Tasa de conversión (Visitantes → Leads)
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#0D9488" }}>
                  {overview.conversionA}%
                </Typography>
                <Chip
                  label="Variante A"
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: "#0D948814", color: "#0D9488" }}
                />
                {winner === "A" && (
                  <Chip label="GANADOR" size="small" sx={{ fontWeight: 800, bgcolor: "#0D9488", color: "#fff" }} />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Estimador + Formulario clásico
              </Typography>
              <Box sx={{ mt: 1, height: 8, bgcolor: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.min(overview.conversionA, 100)}%`,
                    bgcolor: "#0D9488",
                    borderRadius: 4,
                    transition: "width 0.5s ease",
                  }}
                />
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#6366F1" }}>
                  {overview.conversionB}%
                </Typography>
                <Chip
                  label="Variante B"
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: "#6366F114", color: "#6366F1" }}
                />
                {winner === "B" && (
                  <Chip label="GANADOR" size="small" sx={{ fontWeight: 800, bgcolor: "#6366F1", color: "#fff" }} />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Chat interactivo (bot)
              </Typography>
              <Box sx={{ mt: 1, height: 8, bgcolor: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.min(overview.conversionB, 100)}%`,
                    bgcolor: "#6366F1",
                    borderRadius: 4,
                    transition: "width 0.5s ease",
                  }}
                />
              </Box>
            </Box>
          </Stack>
          {winner === "TIE" && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Ambas variantes tienen la misma tasa de conversión (o aún no hay datos suficientes).
            </Typography>
          )}
        </Paper>

        {/* Charts */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <MiniBar data={dailyVisitors} label="Visitantes diarios (últimos 14 días)" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <MiniBar data={dailyLeads} label="Leads diarios (últimos 14 días)" />
          </Box>
        </Stack>

        {/* Events breakdown */}
        <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Eventos (últimos 7 días)
          </Typography>
          {eventsByType.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No hay eventos aún</Typography>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {eventsByType.map((e) => (
                <Chip
                  key={e.type}
                  label={`${e.type}: ${e.count}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                />
              ))}
            </Stack>
          )}
        </Paper>

        {/* Recent Leads */}
        <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Últimos leads ({recentLeads.length})
            </Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>WhatsApp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fuente</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Variante</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                        No hay leads aún
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{lead.whatsapp}</TableCell>
                      <TableCell>{lead.businessType ?? "—"}</TableCell>
                      <TableCell>
                        <Chip
                          label={lead.source}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            bgcolor: lead.source === "chat" ? "#6366F114" : "#0D948814",
                            color: lead.source === "chat" ? "#6366F1" : "#0D9488",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.variant}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            bgcolor: lead.variant === "A" ? "#0D948814" : "#6366F114",
                            color: lead.variant === "A" ? "#0D9488" : "#6366F1",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {new Date(lead.createdAt).toLocaleString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 4, textAlign: "center" }}>
          Moving Quicker Admin · Datos en tiempo real desde Neon PostgreSQL
        </Typography>
      </Container>
    </Box>
  );
}
