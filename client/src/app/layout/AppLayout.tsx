import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router";

import Header from "../header/Header";
import AppSidebar from "../sidebar/AppSidebar";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className=" w-full flex h-screen overflow-hidden ">
        <AppSidebar />

        <SidebarInset className="   flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className=" p-6 md:p-8 max-w-[1400px] mx-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
