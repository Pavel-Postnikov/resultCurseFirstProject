import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Frontend Interview Portal",
    template: "%s | Frontend Interview Portal",
  },
  description: "Портал подготовки к frontend-собеседованию: теория плюс интерактивная практика.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
