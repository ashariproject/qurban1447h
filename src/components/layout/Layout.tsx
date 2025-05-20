
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

type Role = "admin" | "shohibul" | "animal" | "packaging" | "distribution";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<Role>("admin");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRole={activeRole} onRoleChange={setActiveRole} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard Qurban" />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
