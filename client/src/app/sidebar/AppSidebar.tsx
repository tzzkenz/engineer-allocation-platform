import { useAppSelector } from "@/store/store";
import { ChevronRight, Zap } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import { Avatar, AvatarFallback } from "@shared/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@shared/components/ui/sidebar";
import { cn } from "@shared/lib/utils";

import { getAllowedConfigs, navConfig } from "./navConfig";

const AppSidebar = () => {
  const { pathname } = useLocation();

  const { user: authUser } = useAppSelector((state) => state.auth);

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0 shadow-[4px_0_24px_rgba(0,0,0,0.04)]">
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <SidebarHeader className="px-5 py-4 border-b ">
        <NavLink to="/projects" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shadow-sm shrink-0">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className=" text-base font-bold tracking-tight">AllocAI</span>
            <span className=" text-xs font-semibold tracking-tight uppercase">Platform</span>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-xs font-extrabold tracking-tight uppercase px-3 h-auto py-2">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className=" gap-0.5">
              {getAllowedConfigs(authUser!.system_role_name).map((item) => {
                const isActive = item.end ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      data-active={isActive}
                      isActive={isActive}
                      className={cn(
                        "h-auto rounded-sm px-3 py-2.5 text-sm font-medium gap-3 transition-all duration-150",
                        isActive
                          ? [
                              "bg-primary text-secondary",
                              "hover:bg-primary hover:text-secondary",
                              "data-[active=true]:bg-primary data-[active=true]:text-secondary",
                              "shadow-[0_4px_12px_rgba(70,72,212,0.25)]",
                            ]
                          : ["bg-none ", "hover:bg-secondary hover:text-secondary-foreground"]
                      )}
                    >
                      <NavLink to={item.href} end={item.end ?? false}>
                        <item.icon
                          className={cn(
                            " w-4 h-4 shrink-0",
                            isActive ? "text-white" : "text-[#767586]"
                          )}
                        />
                        <span>{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70 shrink-0" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-primary text-white text-sm font-bold">AM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold  truncate">Alex Manager</p>
            <p className="text-xs opacity-80 truncate">admin@helix.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
