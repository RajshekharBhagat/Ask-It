import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
const roboto = Roboto({ subsets: ["latin"], weight: '400' });
import './globals.css';


export const metadata: Metadata = {
  title: "Ask-It",
  description: "Start your anonymous journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={roboto.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
