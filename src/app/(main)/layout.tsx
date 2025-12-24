import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {DataProvider} from "@/components/layout/data-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
    </DataProvider>
  );
}