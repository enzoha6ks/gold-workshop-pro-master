import { Analytics } from "@vercel/analytics/next";
import { Inter } from 'next/font/google';
import './globals.css'; // Make sure this import is here!
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gold Workshop Manager',
  description: 'Professional gold workshop management system',
  icons: {
    icon: '/trans.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="system" storageKey="goldpro-ui-theme">
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}