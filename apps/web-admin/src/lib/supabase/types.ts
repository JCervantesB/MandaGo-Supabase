export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          trade_name: string | null;
          tax_id: string | null;
          email: string | null;
          phone: string | null;
          logo_url: string | null;
          address: string | null;
          lat: number | null;
          lng: number | null;
          settings: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          trade_name?: string | null;
          tax_id?: string | null;
          email?: string | null;
          phone?: string | null;
          logo_url?: string | null;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          settings?: Record<string, unknown>;
          is_active?: boolean;
        };
        Update: Partial<{
          name: string;
          trade_name: string | null;
          tax_id: string | null;
          email: string | null;
          phone: string | null;
          logo_url: string | null;
          address: string | null;
          lat: number | null;
          lng: number | null;
          settings: Record<string, unknown>;
          is_active: boolean;
        }>;
      };
      internal_users: {
        Row: {
          id: string;
          company_id: string | null;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'admin' | 'operator';
          is_active: boolean;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id?: string | null;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'operator';
          is_active?: boolean;
          last_seen_at?: string | null;
        };
        Update: Partial<{
          company_id: string | null;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'admin' | 'operator';
          is_active: boolean;
          last_seen_at: string | null;
        }>;
      };
    };
  };
};
