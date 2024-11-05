import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceMono = localFont({
  src: "./fonts/SpaceMono-Regular.ttf",
  variable: "--font-space-mono",
  weight: "4700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frontend Mentor - Tip calculator app",
  description: "Tip calculator app challenge solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${spaceMono.variable} antialiased min-h-dvh flex flex-col items-center`}
      >
        {children}
      </body>
    </html>
  );
}
