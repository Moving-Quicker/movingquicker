import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx/mdx-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayRounded";
import TimerIcon from "@mui/icons-material/TimerRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import { TrackPageview } from "@/components/track-pageview";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://movingquicker.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogImages = post.image
    ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
    : undefined;

  return {
    title: {
      absolute: `${post.title} — Blog Moving Quicker`,
    },
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "Moving Quicker",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      locale: "es_MX",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ogImages?.map((i) => i.url),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image ? `${SITE_URL}${post.image}` : undefined,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author, url: SITE_URL },
    publisher: { "@type": "Organization", name: "Moving Quicker", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackPageview metadata={{ type: "blog", slug }} />
      <Container maxWidth="md">
        <Button href="/blog" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }} size="small" component="a">
          Volver al blog
        </Button>

        {post.image && (
          <Box sx={{ borderRadius: 3, overflow: "hidden", mb: 3, position: "relative", aspectRatio: "16/9" }}>
            <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 768px" priority />
          </Box>
        )}

        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
          {post.tags.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              variant="outlined"
              href={`/blog?tag=${encodeURIComponent(t)}`}
              component="a"
              clickable
            />
          ))}
        </Stack>

        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
          {post.title}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PersonIcon sx={{ fontSize: 16, color: "text.disabled" }} />
            <Typography variant="body2" color="text.secondary">
              {post.author}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <CalendarTodayIcon sx={{ fontSize: 14, color: "text.disabled" }} />
            <Typography variant="body2" color="text.secondary">
              {new Intl.DateTimeFormat("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(post.date))}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <TimerIcon sx={{ fontSize: 14, color: "text.disabled" }} />
            <Typography variant="body2" color="text.secondary">
              {post.readingTime}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        <MDXRemote source={post.content} components={mdxComponents} />
      </Container>
    </Box>
  );
}
