import { useEffect, useState } from "react";

import { useAppDispatch } from "@/store/store";
import { Navigate, Outlet } from "react-router";

import { useGetCurrentUserQuery } from "@features/auth/services/authApi";
import { initialize } from "@features/auth/slice/authReducer";
import { AiAssistant } from "@features/chat/components/ai-assistant/AIAssistant";

import { SidebarInset, SidebarProvider } from "@shared/components/ui/sidebar";

import Header from "../header/Header";
import AppSidebar from "../sidebar/AppSidebar";

export function AppLayout() {
  const dispatch = useAppDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { data: user, isLoading: isActualLoading, isError } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isActualLoading) return;

    if (isError) {
      setIsLoadingUser(false);
      return;
    }

    if (!user) {
      setIsLoadingUser(false);
      return;
    }

    setIsLoadingUser(false);
    dispatch(initialize(user));
  }, [user, isActualLoading, setIsLoadingUser, isError]);

  console.log(isLoadingUser, "Loading");
  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
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
      <AiAssistant />
    </SidebarProvider>
  );
}
