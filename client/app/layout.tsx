'use client'
import { Josefin_Sans, Poppins } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./Providers"; // This should wrap your Redux context
import { ThemeProvider } from "./utils/theme-provider";

const poppins = Poppins({
  variable: "--font-Poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const josefin = Josefin_Sans({
  variable: "--font-Josefin",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${josefin.variable}`}>
      <body className="!bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <Toaster position='top-center' reverseOrder={false} />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
