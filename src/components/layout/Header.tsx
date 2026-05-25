
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleGoPublic = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center space-x-2 md:space-x-3">
      <h1 className={`${isMobile ? 'text-sm' : 'text-xl'} font-semibold text-gray-800 truncate`}>
        {title}
      </h1>

      {/* Tombol Kembali ke Website Publik */}
      <Button
        onClick={handleGoPublic}
        variant="outline"
        size={isMobile ? "sm" : "default"}
        className="flex items-center gap-1 md:gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
      >
        <Globe size={isMobile ? 13 : 15} />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">Website</span>
      </Button>

      {/* Tombol Logout */}
      <Button
        onClick={handleLogout}
        variant="outline"
        size={isMobile ? "sm" : "default"}
        className="flex items-center gap-1 md:gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={isMobile ? 13 : 15} />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">Logout</span>
      </Button>
    </div>
  );
};

export default Header;
