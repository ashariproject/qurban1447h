
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

type Role = "admin" | "shohibul" | "animal" | "packaging" | "distribution";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
      <Sidebar 
        activeRole={activeRole} 
        onRoleChange={setActiveRole}
        currentUserRole={currentUserRole}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <Button 
            onClick={handleBackToMain}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Kembali ke Menu Utama
          </Button>
          
          <Header title="DASHBOARD QURBAN AS SAKINAH PANTAI MENTARI" />
        </div>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
