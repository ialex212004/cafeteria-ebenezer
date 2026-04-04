import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import InfoStrip from "./components/InfoStrip";
import Script from "next/script";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cafeteria-ebenezer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Cafetería Ébenezer",
  description: "Café de día, pizza de noche. Granos seleccionados y pizzas artesanales.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Cafetería Ébenezer",
    description: "Café de día, pizza de noche. Granos seleccionados y pizzas artesanales.",
    url: baseUrl,
    images: [
      {
        url: "/file.svg",
        width: 1200,
        height: 630,
        alt: "Cafetería Ébenezer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cafetería Ébenezer",
    description: "Café de día, pizza de noche. Granos seleccionados y pizzas artesanales.",
    images: ["/file.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    'name': 'Cafetería Ébenezer',
    'image': `${baseUrl}/file.svg`,
    'description': 'Café de día, pizza de noche. Granos seleccionados y pizzas artesanales.',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Calle la Paz, 28-A',
      'addressLocality': 'Valdepeñas',
      'addressRegion': 'Ciudad Real',
      'postalCode': '13300',
      'addressCountry': 'ES'
    },
    'telephone': '+34623272728',
    'url': baseUrl,
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'opens': '08:00',
        'closes': '23:00'
      }
    ],
    'servesCuisine': ['Coffee', 'Italian', 'Pizza'],
    'priceRange': '€€'
  };

  return (
    <html lang="es">
      <head>
        <Script
          id="restaurant-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
          strategy="afterInteractive"
        />
      </head>
      <body>
        <InfoStrip />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
