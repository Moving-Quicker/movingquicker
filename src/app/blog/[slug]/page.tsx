import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { extractFaqs, getAllPosts, getPostBySlug } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx/mdx-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Image from "next/image";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayRounded";
import TimerIcon from "@mui/icons-material/TimerRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import { BlogTracker } from "@/components/blog/blog-tracker";

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
    keywords: post.keywords,
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

  const faqs = extractFaqs(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        image: post.image ? `${SITE_URL}${post.image}` : undefined,
        datePublished: post.date,
        author: { "@type": "Organization", name: post.author, url: SITE_URL },
        publisher: { "@type": "Organization", name: "Moving Quicker", url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
        ],
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: { xs: 6, md: 8 } }}>
      <BlogTracker slug={slug} title={post.title} tags={post.tags} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {post.image && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: { xs: "16/9", md: "21/9" },
            mb: { xs: -4, md: -6 },
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
            priority
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
            }}
          />
        </Box>
      )}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 3, sm: 4 },
            ...(post.image ? { mt: { xs: 0, md: 0 } } : { mt: { xs: 4, md: 6 } }),
            boxShadow: post.image ? "0 -20px 40px rgba(0,0,0,0.08)" : "none",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Button href="/blog" size="small" component="a" sx={{ minWidth: "auto", px: 1, color: "text.secondary" }}>
              Blog
            </Button>
            <Typography variant="body2" color="text.disabled">/</Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: { xs: 200, sm: "none" } }}>
              {post.title}
            </Typography>
          </Stack>

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

          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
            {post.title}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            alignItems="center"
            sx={{ mb: 3 }}
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

          <MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </Box>
      </Container>
    </Box>
  );
}
