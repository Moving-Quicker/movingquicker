import type { Metadata } from "next";
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/blog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayRounded";
import TimerIcon from "@mui/icons-material/TimerRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    absolute: "Blog — Moving Quicker | Guías de presencia digital para PyMEs",
  },
  description:
    "Artículos sobre presencia digital, precios de desarrollo web, SEO local y herramientas para PyMEs en México. Consejos prácticos de Moving Quicker.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Moving Quicker",
    description: "Guías prácticas de presencia digital, SEO y desarrollo web para negocios en México.",
    type: "website",
    locale: "es_MX",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = tag ? getPostsByTag(tag) : getAllPosts();
  const allTags = getAllTags();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Button
          href="/"
          startIcon={<HomeRoundedIcon />}
          size="small"
          sx={{ mb: 2 }}
          component="a"
        >
          Volver al inicio
        </Button>

        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Blog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Ideas y guías para mejorar la presencia digital de tu negocio en México
        </Typography>

        {allTags.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
            <Chip
              label="Todos"
              href="/blog"
              component="a"
              clickable
              color={!tag ? "primary" : "default"}
              variant={!tag ? "filled" : "outlined"}
              size="small"
            />
            {allTags.map((t) => (
              <Chip
                key={t}
                label={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                component="a"
                clickable
                color={tag === t ? "primary" : "default"}
                variant={tag === t ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Stack>
        )}

        {posts.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" gutterBottom>
                {tag ? "No hay artículos con esta etiqueta" : "No hay artículos publicados aún"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tag
                  ? "Prueba otra etiqueta o vuelve a ver todos los posts."
                  : "Pronto publicaremos contenido útil para tu negocio."}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {posts.map((post) => (
              <Card key={post.slug} sx={{ overflow: "hidden" }}>
                <CardActionArea href={`/blog/${post.slug}`}>
                  {post.image && (
                    <Box sx={{ position: "relative", aspectRatio: "16/7", bgcolor: "grey.100" }}>
                      <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 768px" />
                    </Box>
                  )}
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }}>
                      {post.tags.map((t) => (
                        <Chip key={t} label={t} size="small" variant="outlined" />
                      ))}
                    </Stack>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.7 }}
                    >
                      {post.description}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Intl.DateTimeFormat("es-MX", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).format(new Date(post.date))}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <TimerIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.readingTime}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
