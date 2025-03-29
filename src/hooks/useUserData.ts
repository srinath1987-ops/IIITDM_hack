import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUserProfile } from '@/services/supabaseService';

/**
 * Custom hook to combine auth state with user profile data
 */
export const useUserData = () => {
  const { user, session, isLoading: isAuthLoading, signOut } = useAuth();
  
  // Fetch user profile when authenticated
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getCurrentUserProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
  
  // Refetch profile when user changes
  useEffect(() => {
    if (user) {
      refetchProfile();
    }
  }, [user, refetchProfile]);
  
  return {
    user,
    session,
    profile,
    isLoading: isAuthLoading || isProfileLoading,
    isAuthenticated: !!user,
    signOut,
    refetchProfile,
    profileError,
  };
};

export default useUserData; 