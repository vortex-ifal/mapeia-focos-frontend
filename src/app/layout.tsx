import type { Metadata } from "next";
import { Providers } from "@/lib/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapeia Focos",
  description: "Aplicação Mapeia Focos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
