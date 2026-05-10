import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from "./ClientLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});



export const metadata = {
  title: "Computing Students Society | University of Peshawar",
  description: "Official website of Computing Students Society, Department of Computer Science. Empowering students through technology, workshops, and innovation.",
  metadataBase: new URL('https://cssuop.org'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Computing Students Society",
    description: "Workshops, hackathons, and a student-first tech community.",
    url: 'https://cssuop.org',
    siteName: 'CSS UOP',
    images: [
      {
        url: '/images/og/home.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${inter.variable} antialiased`}
      >
        <ClientLayout>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
}
