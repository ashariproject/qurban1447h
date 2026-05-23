import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth, Role } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUserRole = (user?.role || 'admin') as Role;
  const [activeRole, setActiveRole] = useState<Role>(currentUserRole);

  const handleBackToMain = () => {
    const rolePath = currentUserRole === 'admin' ? '/admin' : `/${currentUserRole}`;
    navigate(rolePath);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed' : 'relative'} ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 z-50`}>
        <Sidebar 
          activeRole={activeRole} 
          onRoleChange={setActiveRole}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-2 md:px-4 md:py-2 border-b bg-white shadow-sm">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                variant="ghost" 
                size="sm"
                className="p-1 h-8 w-8"
              >
                <Menu size={18} />
              </Button>
            )}
            <Button 
              onClick={handleBackToMain}
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8"
            >
              <ArrowLeft size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Beranda</span>
            </Button>
          </div>
          
          <Header title={isMobile ? "QURBANKU" : "QURBANKU - DASHBOARD PETUGAS"} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-2 md:p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
