import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

const FontAwesomeLink = dynamic(
  () => import("./FontAwesomeLink"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Property Management System",
  description: "A modern property management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <FontAwesomeLink />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
