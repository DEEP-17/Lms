'use client'

import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { SessionProvider } from "next-auth/react";
import { Josefin_Sans, Poppins } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import "./globals.css";
import { Providers } from "./Providers";
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
    <html
      lang="en"
      suppressHydrationWarning={true}
    >
      <body className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark bg-gradient-to-b dark:from-gray-900 dark:to:black duration-300`}>
        <SessionProvider>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Toaster position="top-center" reverseOrder={false} />
              <Custom>{children}</Custom>
            </ThemeProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery(undefined);
  return (
    isLoading ? <Loader /> : <>{children}</>
  )
};