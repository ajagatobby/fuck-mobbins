import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fuck Mobbins",
  description: "Download mobbins screenshots",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fuck Mobbins",
    description: "Download mobbins screenshots",
    images: ["/logo.png"],
    url: "https://fuck-mobbins.vercel.app",
    siteName: "Fuck Mobbins",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuck Mobbins",
    description: "Download mobbins screenshots",
    images: ["/logo.png"],
  },
  metadataBase: new URL("https://fuck-mobbins.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
