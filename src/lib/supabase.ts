import { createClient } from '@supabase/supabase-js';

// Create a mock Supabase client for development
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null }),
        range: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        count: (countOption: string) => ({ count: 0, error: null }),
      }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  };
};

// We're using SQLite now, so we'll just use the mock client
export const supabase = createMockClient() as any;
