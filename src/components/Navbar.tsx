
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full z-50">
      <div className="flex justify-between items-center mx-auto">
        <Link to="/" className="flex items-center space-x-3">
          <Truck className="h-8 w-8 text-logistics-600" />
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            TN Cargo Navigator
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="link" asChild>
                <Link to="/">Dashboard</Link>
              </Button>
              <Button variant="link" asChild>
                <Link to="/ride">Plan Route</Link>
              </Button>
              <Button variant="link" asChild>
                <Link to="/history">History</Link>
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="link" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full py-2 px-4 pt-2 border-t border-gray-200 animate-fade-in">
          <div className="flex flex-col space-y-2">
            {user ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/ride" onClick={() => setIsMenuOpen(false)}>Plan Route</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/history" onClick={() => setIsMenuOpen(false)}>History</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-red-600" 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
