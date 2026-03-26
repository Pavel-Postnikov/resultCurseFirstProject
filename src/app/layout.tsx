import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";

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
      <body>
        <div className={styles.shell}>
          <header className={styles.header}>
            <nav className={styles.nav}>
              <Link href="/">Главная</Link>
              <Link href="/articles">Статьи</Link>
              <Link href="/test">Тест</Link>
              <Link href="/results">Результаты</Link>
            </nav>
          </header>
          <div className={styles.content}>{children}</div>
        </div>
      </body>
    </html>
  );
}
