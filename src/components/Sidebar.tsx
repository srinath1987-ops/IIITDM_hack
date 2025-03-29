
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LineChart, 
  MapPin, 
  History, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  if (isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <LineChart className="h-5 w-5" /> 
    },
    { 
      name: 'Plan Route', 
      path: '/ride', 
      icon: <MapPin className="h-5 w-5" /> 
    },
    { 
      name: 'Travel History', 
      path: '/history', 
      icon: <History className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 pt-16">
      <div className="flex flex-col flex-1 pt-5">
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-gray-500 uppercase">Main</p>
        </div>
        <nav className="flex flex-col px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(item.path) 
                  ? "bg-logistics-50 text-logistics-700" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <span className={cn(
                "mr-3",
                isActive(item.path) ? "text-logistics-700" : "text-gray-500"
              )}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-3 mt-auto border-t border-gray-200">
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
