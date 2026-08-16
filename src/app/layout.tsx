import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, Inter, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { faqItems } from "@/data/content";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["600"],
  preload: false,
});

const siteUrl = "https://www.nadastudio.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NADA Studio · Sites e automação sob medida | Jundiaí SP",
    template: "%s · NADA Studio",
  },
  description:
    "Criação de sites, automação com n8n e aplicações sob medida pra pequenos negócios e profissionais autônomos. Menos tarefa manual, mais tempo livre.",
  authors: [{ name: "NADA Studio" }],
  creator: "NADA Studio",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "NADA Studio",
    title: "NADA Studio · Do nada nasce tudo",
    description:
      "A gente cria seu site, tira o repetitivo das suas costas e cuida de tudo por você. Você foca no que importa: vender.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NADA Studio · Do nada nasce tudo",
    description:
      "A gente cria seu site, tira o repetitivo das suas costas e cuida de tudo por você. Você foca no que importa: vender.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "NADA Studio",
  description:
    "Criação de sites, automação de atendimento e processos com n8n, e aplicações sob medida para pequenos negócios e profissionais autônomos.",
  url: siteUrl,
  sameAs: ["https://www.instagram.com/nada.studio.br/"],
  telephone: "+5511932159328",
  areaServed: "BR",
  slogan: "Do nada nasce tudo",
  knowsAbout: [
    "criação de sites",
    "automação com n8n",
    "automação de WhatsApp",
    "automação de agendamento",
    "cobrança automática via Pix",
    "desenvolvimento de aplicações sob medida",
    "inteligência artificial aplicada a negócios",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Criação de sites" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Automação de processos e atendimento" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aplicações sob medida" } },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} ${caveat.variable} antialiased`}
    >
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-BGYNR7JBZW"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BGYNR7JBZW');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

