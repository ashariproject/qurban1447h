
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

type Role = "admin" | "shohibul" | "animal" | "packaging" | "distribution";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine user role based on current path
  const getUserRoleFromPath = (): Role => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/shohibul')) return 'shohibul';
    if (path.startsWith('/animal')) return 'animal';
    if (path.startsWith('/packaging')) return 'packaging';
    if (path.startsWith('/distribution')) return 'distribution';
    return 'admin'; // default
  };

  const [activeRole, setActiveRole] = useState<Role>(getUserRoleFromPath());
  const currentUserRole = getUserRoleFromPath();

  const handleBackToMain = () => {
    navigate('/');
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
          currentUserRole={currentUserRole}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-3 md:p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                variant="ghost" 
                size="sm"
                className="p-2"
              >
                <Menu size={20} />
              </Button>
            )}
            <Button 
              onClick={handleBackToMain}
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Kembali ke Menu Utama</span>
              <span className="sm:hidden">Menu</span>
            </Button>
          </div>
          
          <Header title={isMobile ? "DASHBOARD QURBAN" : "DASHBOARD QURBAN AS SAKINAH PANTAI MENTARI"} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
