import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { User } from "lucide-react";
import { useNavigate } from "react-router";
const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-primary-foreground  border-b sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-[#767586] hover:bg-[#f2f3f9] hover:text-[#2e3040] md:hidden" />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-bold ml-1">
          <User size={16} onClick={() => navigate("/profile")} />
        </div>
      </div>
    </header>
  );
};

export default Header;
