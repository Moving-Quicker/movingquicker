import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://movingquicker.com";

export const metadata: Metadata = {
  title: {
    absolute: "Moving Quicker — Soluciones digitales para tu negocio",
  },
  description:
    "Presencia digital, software a medida y herramientas que atraen clientes reales a tu negocio en México. Landing pages, software de gestión y consultoría.",
  keywords: [
    "soluciones digitales",
    "landing pages",
    "software a medida",
    "PyMEs México",
    "desarrollo web",
    "Moving Quicker",
  ],
  authors: [{ name: "Moving Quicker" }],
  creator: "Moving Quicker",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Moving Quicker — Soluciones digitales para tu negocio",
    description: "Presencia digital, software a medida y consultoría para PyMEs en México.",
    url: SITE_URL,
    siteName: "Moving Quicker",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moving Quicker — Soluciones digitales para tu negocio",
    description: "Presencia digital y software para PyMEs en México.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Moving Quicker",
    url: SITE_URL,
    description:
      "Soluciones digitales para PyMEs en México: landing pages, software a medida y consultoría.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MX",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function Page() {
  return (
    <>
      <JsonLd />
      <LandingPage />
    </>
  );
}
