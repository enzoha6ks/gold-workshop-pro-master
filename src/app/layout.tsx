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
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <div className="min-h-screen bg-gray-50">
//           <div className="flex h-screen">
//             {/* Sidebar - Hidden on mobile, shown on desktop */}
//             <div className="hidden md:block w-64 flex-shrink-0">
//               <Sidebar />
//             </div>
            
//             {/* Main content */}
//             <div className="flex-1 flex flex-col overflow-hidden">
//               <Header />
//               <main className="flex-1 overflow-auto">
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

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gold Workshop Manager',
  description: 'Professional gold workshop management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen bg-gray-50">
          <div className="flex h-screen">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <Sidebar />
            </div>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}