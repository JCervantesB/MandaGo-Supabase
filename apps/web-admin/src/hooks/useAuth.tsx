import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyId: string | null;
  role: 'admin' | 'operator' | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    phone?: string;
  }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    let mounted = true;

    async function loadUser(session: any) {
      if (session?.user) {
        const { data: userData, error: profileError } = await supabase
          .from('internal_users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('Profile query:', userData, profileError);

        if (mounted) {
          setUser(session.user);
          if (userData) {
            setProfile({
              id: userData.id,
              email: userData.email,
              fullName: userData.full_name,
              companyId: userData.company_id,
              role: userData.role,
            });
          } else if (profileError) {
            console.error('Profile error:', profileError);
          }
          setIsLoading(false);
        }
      } else {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      loadUser(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  }

  async function signUp(data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    phone?: string;
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          company_name: data.companyName,
          phone: data.phone,
        },
      },
    });

    if (authError) {
      return { error: new Error(authError.message) };
    }

    if (!authData.user) {
      return { error: new Error('No se pudo crear el usuario') };
    }

    return { error: null };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error: error ? new Error(error.message) : null };
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, supabase, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
