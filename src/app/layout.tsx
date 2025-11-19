// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { Toaster } from "@/components/ui/sonner";
// import { Sidebar } from "@/components/layout/sidebar";
// import { Header } from "@/components/layout/header";

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Gold Workshop Manager',
//   description: 'Professional gold workshop management system',
//   icons: {
//     icon: '/trans.png',
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning className="h-full">
//       <body className={`${inter.className} h-full`} suppressHydrationWarning>
//         <div className="min-h-full bg-slate-50 flex flex-col">
//           <div className="flex flex-1 overflow-hidden">
//             {/* Sidebar - Hidden on mobile, shown on desktop */}
//             <div className="hidden md:block w-64 flex-shrink-0">
//               <Sidebar />
//             </div>
            
//             {/* Main content */}
//             <div className="flex-1 flex flex-col min-w-0">
//               <Header />
//               <main className="flex-1 overflow-auto bg-slate-50">
//                 {children}
//               </main>
//             </div>
//           </div>
//           <Toaster />
//         </div>
//       </body>
//     </html>
//   );
// }



import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/contexts/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gold Workshop Manager',
  description: 'Professional gold workshop management system',
  icons: {
    icon: '/trans.png',
  },
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
          <div className="min-h-full bg-slate-50 dark:bg-slate-900 flex flex-col">
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar - Hidden on mobile, shown on desktop */}
              <div className="hidden md:block w-64 flex-shrink-0">
                <Sidebar />
              </div>
              
              {/* Main content */}
              <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}