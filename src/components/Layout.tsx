import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Dashboard',
  showSidebar = true 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { sidebarColor } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100`}>
      <div className="flex min-h-screen">
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            color={sidebarColor} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}

        <div className={`flex-1 transition-all duration-300 ${showSidebar && isSidebarOpen ? "md:ml-[240px]" : showSidebar ? "md:ml-[70px]" : ""}`}>
          <Header 
            onMenuClick={showSidebar ? toggleSidebar : undefined}
            title={title}
          />
          
          <main className="p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
