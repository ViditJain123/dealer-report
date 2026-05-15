/**
 * Supabase database types.
 *
 * Hand-written to match the SQL in `supabase/migrations/`. Keep this file in
 * sync whenever the schema changes. Once the Supabase CLI is linked to
 * the project you may instead regenerate it:
 *
 *   supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 */
export type Database = {
  public: {
    Tables: {
      distributors: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dealers: {
        Row: {
          id: string;
          distributor_id: string;
          dealer_name: string;
          dealer_code: string;
          password_hash: string;
          phone_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          distributor_id: string;
          dealer_name: string;
          dealer_code: string;
          password_hash: string;
          phone_number: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          distributor_id?: string;
          dealer_name?: string;
          dealer_code?: string;
          password_hash?: string;
          phone_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dealers_distributor_id_fkey';
            columns: ['distributor_id'];
            isOneToOne: false;
            referencedRelation: 'distributors';
            referencedColumns: ['id'];
          },
        ];
      };
      sessions: {
        Row: {
          id: string;
          distributor_id: string;
          token_hash: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          distributor_id: string;
          token_hash: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          distributor_id?: string;
          token_hash?: string;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sessions_distributor_id_fkey';
            columns: ['distributor_id'];
            isOneToOne: false;
            referencedRelation: 'distributors';
            referencedColumns: ['id'];
          },
        ];
      };
      dealer_sessions: {
        Row: {
          id: string;
          dealer_id: string;
          token_hash: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          dealer_id: string;
          token_hash: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          dealer_id?: string;
          token_hash?: string;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dealer_sessions_dealer_id_fkey';
            columns: ['dealer_id'];
            isOneToOne: false;
            referencedRelation: 'dealers';
            referencedColumns: ['id'];
          },
        ];
      };
      dealer_devices: {
        Row: {
          id: string;
          dealer_id: string;
          device_id: string;
          device_label: string;
          status: string;
          created_at: string;
          updated_at: string;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          dealer_id: string;
          device_id: string;
          device_label?: string;
          status: string;
          created_at?: string;
          updated_at?: string;
          approved_at?: string | null;
        };
        Update: {
          id?: string;
          dealer_id?: string;
          device_id?: string;
          device_label?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          approved_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dealer_devices_dealer_id_fkey';
            columns: ['dealer_id'];
            isOneToOne: false;
            referencedRelation: 'dealers';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/** Convenience row aliases for application code. */
export type Distributor = Database['public']['Tables']['distributors']['Row'];
export type Dealer = Database['public']['Tables']['dealers']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type DealerSession = Database['public']['Tables']['dealer_sessions']['Row'];
export type DealerDevice = Database['public']['Tables']['dealer_devices']['Row'];
