import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Галерея Шмуклер",
  description: "Галерея современного искусства в Москве. Живопись, графика, скульптура. Покупка картин напрямую от художников.",
  metadataBase: new URL("https://shmuklergallery.com"),
  openGraph: {
    title: "Галерея Шмуклер",
    description: "Галерея современного искусства в Москве. Живопись, графика, скульптура. Покупка картин напрямую от художников.",
    url: "https://shmuklergallery.com",
    siteName: "Галерея Шмуклер",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Галерея Шмуклер",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Галерея Шмуклер",
    description: "Галерея современного искусства в Москве.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
