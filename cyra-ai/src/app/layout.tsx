import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import { Inter, Cairo } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });
const cairo = Cairo({ subsets: ['arabic'] });

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cyra AI - AI-Powered CV Builder</title>
      </head>
      <body className={`${lng === 'ar' ? cairo.className : inter.className} min-h-screen bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
