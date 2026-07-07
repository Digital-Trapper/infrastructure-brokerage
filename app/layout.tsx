import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gephyra Markets | Secondary Markets for Critical Infrastructure",
  description:
    "Gephyra Markets is an independent UK specialist exploring secondary-market, reuse and remarketing routes for surplus BESS, power and mission-critical infrastructure equipment.",
  openGraph: {
    title: "Gephyra Markets | Secondary Markets for Critical Infrastructure",
    description:
      "Independent secondary-market routes for surplus energy, power and mission-critical infrastructure equipment.",
    type: "website",
    locale: "en_GB",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
