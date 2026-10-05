import type { Metadata } from "next";
import Script from "next/script";
import { ViewTransition } from "react";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import MotionRoot from "@/components/MotionRoot";
import { faqItems } from "@/data/content";

// Reserva de fonte própria (@font-face "Archivo Reserva" e "Inter Reserva" em
// globals.css) no lugar da automática do next/font: aquela é uma só, medida no
// peso regular, e os títulos em 700/900 mudavam de quebra quando a fonte
// chegava (CLS de 0,15 na página de IA no 4G lento). A reserva tem um ajuste
// por peso, medido nos textos do site.
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  adjustFontFallback: false,
  fallback: ["Archivo Reserva"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  adjustFontFallback: false,
  fallback: ["Inter Reserva"],
});

// Roda antes da primeira pintura:
// - intro: só na primeira vez que a pessoa entra no site, e só se essa
//   entrada for pela home (entrou por outra página, já conta como visto).
//   Fica marcado no navegador (localStorage), não por aba. ?intro força.
//   Sem o atributo "tocar", a tela preta nem chega a aparecer. Se o JS não
//   começar a intro em 4 s (rede muito lenta, script bloqueado), a página
//   abre sem ela: a tela preta não prende ninguém esperando;
// - movimento liberado: classe `motion` (estados iniciais das animações).
//   Se o JS não montar em 4 s, a classe sai e tudo aparece parado.
const SCRIPT_INICIAL = `(function(){var d=document.documentElement;try{var f=/[?&]intro\\b/.test(location.search),v=localStorage.getItem("nada-intro")||sessionStorage.getItem("nada-intro");if(f||(!v&&location.pathname==="/"))d.setAttribute("data-intro","tocar");if(!v)localStorage.setItem("nada-intro","1")}catch(e){}setTimeout(function(){if(d.getAttribute("data-intro")==="tocar"&&!document.querySelector(".intro[data-viva]"))d.setAttribute("data-intro","vista")},4000);if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion");setTimeout(function(){if(!window.__nadaMotion)d.classList.remove("motion")},4000)}})()`;

const siteUrl = "https://www.nadastudio.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NADA Studio · Sites e automação sob medida | Jundiaí SP",
    template: "%s · NADA Studio",
  },
  description:
    "Criação de sites, automação de atendimento e aplicações sob medida pra pequenos negócios e profissionais autônomos. Menos tarefa manual, mais tempo livre.",
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
      className={`${archivo.variable} ${inter.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_INICIAL }} />
        {/* Analytics depois do load: com afterInteractive o Next punha um
            preload de 174 KB no <head>, disputando banda com fontes e CSS no
            4G. A fila do dataLayer (abaixo) começa cedo; nada se perde. */}
        <Script
          strategy="lazyOnload"
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
        <MotionRoot />
        {/* Troca de página: conteúdo sai em 150 ms e entra em 250 ms. */}
        <ViewTransition update="pagina" default="none">
          {children}
        </ViewTransition>
      </body>
    </html>
  );
}

