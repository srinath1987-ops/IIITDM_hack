
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  History, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
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
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    const email = user.email;
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase();
  };

  return (
    <aside className={`fixed md:flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16 overflow-hidden ${isOpen ? 'w-56' : 'w-0'}`}>
      {isOpen && (
        <>
          {/* User profile section */}
          <div className="flex flex-col items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`} alt="User avatar" />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm dark:text-white">{user?.email?.split('@')[0]}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>

          <div className="flex flex-col flex-1 pt-5 overflow-y-auto">
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Main</p>
            </div>
            <nav className="flex flex-col px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.path) 
                      ? "bg-logistics-50 dark:bg-logistics-900/50 text-logistics-700 dark:text-logistics-400" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <span className={cn(
                    "mr-3",
                    isActive(item.path) 
                      ? "text-logistics-700 dark:text-logistics-400" 
                      : "text-gray-500 dark:text-gray-400"
                  )}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
