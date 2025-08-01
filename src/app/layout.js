import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./component/SessionWrapper";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SRU - Smart Recycling Unit",
  description: "Smart Recycling Unit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpg" type="image/x-icon"/>
      </head>
      <SessionWrapper>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Toaster />
          {children}
        </body>
      </SessionWrapper>
    </html>
  );
}
