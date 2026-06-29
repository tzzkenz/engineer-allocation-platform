import { Button } from "@/shared/components/ui/button";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-primary-foreground  border-b sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-[#767586] hover:bg-[#f2f3f9] hover:text-[#2e3040] md:hidden" />
      </div>

      <div className="flex items-center gap-2">
        <Button className="relative p-2 rounded-full  transition-colors">
          <Bell />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-600" />
        </Button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-bold ml-1">
          AM
        </div>
      </div>
    </header>
  );
};

export default Header;
