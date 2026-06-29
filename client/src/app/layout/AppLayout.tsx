import { type ReactNode, useState } from "react";

// import { Sidebar } from "@/widgets/sidebar/Sidebar";
// import { Header } from "@/widgets/header/Header";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Outlet } from "react-router";

interface AppLayoutProps {
  breadcrumb?: ReactNode;
}

export function AppLayout({ breadcrumb }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f8]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col h-full">
        {/* <Sidebar /> */}
        Sidebar
      </aside>

      {/* Mobile sidebar sheet */}
      <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 lg:hidden" />
          <Dialog.Content
            className="fixed left-0 top-0 bottom-0 z-50 w-56 lg:hidden focus:outline-none"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
            {/* <Sidebar onClose={() => setSidebarOpen(false)} /> */}
            <Dialog.Close className="absolute top-4 right-4 p-1 rounded-lg bg-[#f2f3f9] text-[#585a68] hover:bg-[#e6e8ee]">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* <Header
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumb={breadcrumb}
        /> */}

        <div>Header</div>
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1400px] mx-auto">{<Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
