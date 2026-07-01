import { useEffect } from "react";

import { useAppDispatch } from "@/store/store";
import { Outlet } from "react-router";

import { useGetCurrentUserQuery } from "@features/auth/services/authApi";
import { initialize } from "@features/auth/slice/authReducer";

import { SidebarInset, SidebarProvider } from "@shared/components/ui/sidebar";

import Header from "../header/Header";
import AppSidebar from "../sidebar/AppSidebar";

export function AppLayout() {
  const dispatch = useAppDispatch();
  const { data: user, isLoading: isLoadingUser, isError } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isLoadingUser || isError) return;

    if (!user) return;

    dispatch(initialize(user));
  }, [user, isLoadingUser, isError]);

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

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
