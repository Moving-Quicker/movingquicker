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
    "desarrollo web México",
    "landing page para negocios",
    "software a medida PyMEs",
    "página web precio México 2026",
    "presencia digital PyMEs",
    "diseño web Mérida Yucatán",
    "agencia desarrollo web México",
    "tienda online México",
    "consultoría digital PyMEs",
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

const WA_FALLBACK = "521XXXXXXXXXX";

function waDigitsForSchema(): string {
  const raw = process.env.NEXT_PUBLIC_WA_NUMBER ?? WA_FALLBACK;
  return raw.replace(/\D/g, "") || WA_FALLBACK.replace(/\D/g, "");
}

function JsonLd() {
  const base = SITE_URL.replace(/\/$/, "");
  const orgId = `${base}/#organization`;
  const websiteId = `${base}/#website`;
  const logoUrl = `${base}/og-image.jpg`;
  const waUrl = `https://wa.me/${waDigitsForSchema()}`;

  const faqs: { question: string; answer: string }[] = [
    {
      question: "¿Cuánto tarda?",
      answer:
        "Depende del proyecto. Una landing page toma de 1 a 2 semanas. Software más complejo de 1 a 3 meses. Te damos fechas claras desde la propuesta.",
    },
    {
      question: "¿Incluye dominio y hosting?",
      answer:
        "El precio del proyecto no incluye dominio ni hosting. Te ayudamos a configurarlos, pero se contratan directo con el proveedor para que tú tengas el control.",
    },
    {
      question: "¿Puedo hacer cambios después?",
      answer:
        "Sí. Todos los proyectos incluyen 30 días de soporte para ajustes después de la entrega. Cambios mayores se cotizan aparte.",
    },
    {
      question: "¿Qué pasa si no me gusta el resultado?",
      answer:
        "Trabajamos con aprobaciones por etapa. Nunca avanzamos sin tu visto bueno. Si algo no te convence, lo ajustamos antes de continuar.",
    },
    {
      question: "¿Facturas?",
      answer: "Sí. Emitimos factura por todos nuestros servicios.",
    },
  ];

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: base,
        name: "Moving Quicker",
        publisher: { "@id": orgId },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://www.google.com/search?q={search_term_string}+site:movingquicker.com",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: "Moving Quicker",
        url: base,
        logo: logoUrl,
        description:
          "Soluciones digitales para PyMEs en México: landing pages, software a medida y consultoría.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mérida",
          addressRegion: "Yucatán",
          addressCountry: "MX",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          availableLanguage: ["es-MX"],
          url: waUrl,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      },
      {
        "@type": "LocalBusiness",
        name: "Moving Quicker",
        url: "https://movingquicker.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mérida",
          addressRegion: "Yucatán",
          addressCountry: "MX",
        },
        priceRange: "$$",
      },
    ],
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
