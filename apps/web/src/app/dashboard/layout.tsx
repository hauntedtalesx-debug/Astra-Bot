import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-[#070B19] text-white selection:bg-purple-500/30">
      
      {/* Global Sidebar */}
      <DashboardSidebar user={session?.user || null} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="relative z-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
