import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <div className="bg-accent">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    </>
  );
}
