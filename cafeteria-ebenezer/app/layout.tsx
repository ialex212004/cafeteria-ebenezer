import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cafeteria Ebenezer",
  description: "Cafe de dia, pizza de noche en Cafeteria Ebenezer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
