import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserData {
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle profile creation after successful signup or social login
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();
          
          // If no profile exists, create it
          if (!existingProfile) {
            const metadata = session.user.user_metadata;
            const email = session.user.email || '';
            
            // For social logins, extract name from metadata
            let firstName = metadata?.firstName || metadata?.first_name || metadata?.given_name || '';
            let lastName = metadata?.lastName || metadata?.last_name || metadata?.family_name || '';
            let companyName = metadata?.companyName || '';
            let phone = metadata?.phone || metadata?.phone_number || '';
            
            // If no name from social login, use email prefix
            if (!firstName && !lastName) {
              firstName = email.split('@')[0];
              lastName = '';
            }
            
            try {
              const { error: profileError } = await supabase
                .from('users')
                .insert({
                  id: session.user.id,
                  email: email,
                  first_name: firstName,
                  last_name: lastName,
                  company_name: companyName || 'Mi Empresa',
                  phone: phone,
                });
              
              if (profileError) {
                console.error('Error creating user profile:', profileError);
              }
            } catch (error) {
              console.error('Error creating user profile:', error);
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: UserData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          companyName: userData.companyName,
          phone: userData.phone,
        }
      }
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    // Store remember preference
    if (rememberMe) {
      localStorage.setItem('rememberUser', email);
    } else {
      localStorage.removeItem('rememberUser');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { data, error };
  };

  const signInWithTwitter = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    // Clear remember preference on logout
    localStorage.removeItem('rememberUser');
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const getRememberedUser = () => {
    return localStorage.getItem('rememberUser') || '';
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    return { data, error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithTwitter,
    signOut,
    resetPassword,
    getRememberedUser,
  };
};
