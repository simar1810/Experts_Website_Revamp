import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ClientNavbar from "../_components/common/client-navbar/ClientNavbar";
import { AppSidebar } from "./_components/app-sidebar";

export const metadata = {
  title: "WellnessZ Experts | Dashboard",
};

export default function ClientDashboardLayout({ children }) {
  return (
    <SidebarProvider
      className="flex h-svh max-h-svh min-h-0 w-full overflow-hidden"
      style={{
        "--sidebar-width": "17.75rem",
        "--sidebar": "#121212",
        "--sidebar-foreground": "#a3a3a3",
        "--sidebar-accent": "rgba(255, 255, 255, 0.06)",
        "--sidebar-accent-foreground": "#fafafa",
        "--sidebar-border": "rgba(255, 255, 255, 0.08)",
        "--sidebar-ring": "#70C136",
      }}
    >
      <AppSidebar />
      <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50">
        <div className="shrink-0">
          <ClientNavbar isDashboard={true} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-zinc-200/80 bg-white/90 px-4 backdrop-blur md:hidden">
            <SidebarTrigger className="text-zinc-700" />
            <span className="text-sm font-bold text-zinc-800">Menu</span>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#fcfde3] p-4 md:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
