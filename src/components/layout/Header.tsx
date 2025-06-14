
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      <h1 className={`${isMobile ? 'text-sm' : 'text-xl'} font-semibold text-gray-800 truncate`}>
        {title}
      </h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center gap-1 md:gap-2">
            <FileDown size={isMobile ? 14 : 16} />
            <span className="hidden sm:inline">Ekspor</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Ekspor PDF</DropdownMenuItem>
          <DropdownMenuItem>Ekspor Excel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
