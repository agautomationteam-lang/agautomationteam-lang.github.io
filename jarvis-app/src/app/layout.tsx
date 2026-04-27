import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JARVIS — Live Agent Command Center",
  description: "Real-time AI agent dashboard with live API connections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
