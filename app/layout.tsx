import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Cafeteria Ebenezer',
  description: 'Sitio web de Cafeteria Ebenezer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
