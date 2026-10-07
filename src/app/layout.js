import { Kalam, Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from "./ClientLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap',
  weight: ["400", "500", "600", "700"],
});

const kalamDisplay = Kalam({
  variable: "--font-display",
  subsets: ["latin"],
  display: 'swap',
  weight: "700",
});

const kalamAccent = Kalam({
  variable: "--font-accent",
  subsets: ["latin"],
  display: 'swap',
  weight: "700",
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
  verification: {
    google: "ldZlwQNWsZI7VkfH99Nu_NyMiB3TSuf_vD3JJ_u2Pco",
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
        className={`${poppins.variable} ${kalamDisplay.variable} ${kalamAccent.variable} antialiased`}
      >
        <ClientLayout>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
}
