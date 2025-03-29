
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Don't show sidebar on auth page
  const isAuthPage = location.pathname === '/auth';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        {!isAuthPage && (
          <>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'w-56' : 'w-0'
              } relative`}
            >
              <Sidebar isOpen={sidebarOpen} />
              <Button 
                variant="outline" 
                size="icon" 
                className={`absolute top-24 -right-4 h-8 w-8 rounded-full border shadow-md z-50 bg-white dark:bg-gray-800`}
                onClick={toggleSidebar}
              >
                {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </>
        )}
        <main className={`flex-1 p-4 md:p-6 pt-20 transition-all duration-300 ${isAuthPage ? 'w-full' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
