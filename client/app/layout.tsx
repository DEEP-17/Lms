'use client'
import { Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/theme-provider";
import {Toaster} from "react-hot-toast"
import {Providers} from "./Providers"
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Toaster position='top-center' reverseOrder={false}/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}