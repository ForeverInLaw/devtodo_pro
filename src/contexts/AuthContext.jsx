import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processSession = async (session) => {
      setLoading(true);
      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const { error } = await supabase.rpc('accept_all_pending_invitations', {
            u_id: currentUser.id,
            u_email: currentUser.email,
          });
          if (error) {
            console.error('Error accepting invitations:', error);
          }
        }
      } catch (error) {
        console.error("Error processing session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Process the session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      processSession(session);
    });

    // Listen for subsequent auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      processSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};