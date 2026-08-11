import type { Metadata } from "next";
import { Archivo, Inter, Caveat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

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
  // Só 600: todo uso do font-hand herda peso 400/500, então o 700 baixava sem
  // nunca ser escolhido.
  weight: ["600"],
});

const siteUrl = "https://nada-studio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NADA Studio · Do nada nasce tudo",
    template: "%s · NADA Studio",
  },
  description:
    "Criação de sites, automação com n8n e aplicações sob medida pra pequenos negócios e profissionais autônomos. Menos tarefa manual, mais tempo pro que importa.",
  keywords: [
    "criação de site",
    "criação de sites para pequenos negócios",
    "automação de whatsapp",
    "automação com n8n",
    "agência de automação",
    "desenvolvimento de aplicativo sob medida",
    "automação de atendimento",
    "automação de agendamento",
    "site para autônomo",
    "site para profissional liberal",
    "inteligência artificial para negócios",
    "cobrança automática pix",
    "NADA Studio",
  ],
  authors: [{ name: "NADA Studio" }],
  creator: "NADA Studio",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "NADA Studio",
    title: "NADA Studio · Do nada nasce tudo",
    description:
      "A gente cria seu site, automatiza o repetitivo e cuida de tudo por você. Você foca no que importa: vender.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NADA Studio · Do nada nasce tudo",
    description:
      "A gente cria seu site, automatiza o repetitivo e cuida de tudo por você. Você foca no que importa: vender.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${inter.variable} ${caveat.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
