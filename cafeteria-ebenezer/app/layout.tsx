import type { Metadata, Viewport } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import InfoStrip from "./components/InfoStrip";
import ThemeProvider from "./components/ThemeProvider";
import { SITE } from "@/lib/config/site";

/* ── Google Fonts via next/font (self-hosted, no layout shift) ── */
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cafeteria-ebenezer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Cafetería Ébenezer · Sabor cubano en Valdepeñas",
    template: "%s · Cafetería Ébenezer",
  },
  description:
    "Cafetería Ébenezer — sabor cubano auténtico en el corazón de Valdepeñas. Café de especialidad, desayunos caseros, pizzas artesanales y un ambiente cálido que te hace sentir en casa.",
  keywords: [
    "Cafetería Ébenezer",
    "Cafetería cubana Valdepeñas",
    "Desayunos Valdepeñas",
    "Pizza Valdepeñas",
    "Café de especialidad Ciudad Real",
    "Comida cubana Valdepeñas",
    "Brunch Valdepeñas",
    "Restaurante cubano Ciudad Real",
  ],
  authors: [{ name: "Cafetería Ébenezer" }],
  creator: "Cafetería Ébenezer",
  icons: {
    icon: "https://res.cloudinary.com/dphq9ymvo/image/upload/v1776171811/favicon_avmzwi.png",
    shortcut: "https://res.cloudinary.com/dphq9ymvo/image/upload/v1776171811/favicon_avmzwi.png",
    apple: "https://res.cloudinary.com/dphq9ymvo/image/upload/v1776171811/favicon_avmzwi.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Cafetería Ébenezer · Sabor cubano en Valdepeñas",
    description:
      "Café de especialidad, desayunos caseros y pizzas artesanales con alma cubana. Ven a Ébenezer — donde cada visita se siente como llegar a casa.",
    url: baseUrl,
    siteName: "Cafetería Ébenezer",
    images: [
      {
        url: "https://res.cloudinary.com/dphq9ymvo/image/upload/v1776171742/WhatsApp_Image_2026-04-03_at_11.33.21_3_vigfru.jpg",
        width: 1200,
        height: 630,
        alt: "Cafetería Ébenezer — Sabor cubano en Valdepeñas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cafetería Ébenezer · Sabor cubano en Valdepeñas",
    description:
      "Café de especialidad y pizzas artesanales con alma cubana en Valdepeñas. Una experiencia única.",
    images: ["https://res.cloudinary.com/dphq9ymvo/image/upload/v1776171742/WhatsApp_Image_2026-04-03_at_11.33.21_3_vigfru.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1008" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Cafetería Ébenezer",
    image: "https://res.cloudinary.com/dphq9ymvo/image/upload/v1776171742/WhatsApp_Image_2026-04-03_at_11.33.21_3_vigfru.jpg",
    description:
      "Cafetería cubana en Valdepeñas. Café de especialidad, desayunos caseros y pizzas artesanales con alma cubana.",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: "ES",
    },
    telephone: SITE.phone.display,
    url: baseUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    servesCuisine: ["Cuban", "Coffee", "Pizza", "Brunch", "Breakfast"],
    priceRange: "€€",
    acceptsReservations: "True",
  };

  return (
    <html lang="es" className={`${lato.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ebenezer-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <InfoStrip />
          {children}
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
