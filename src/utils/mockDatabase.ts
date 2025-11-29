// Mock database client - placeholder for future Cloud integration
export const mockSupabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Database not connected') }),
    getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Database not connected') }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: () => Promise.resolve({ error: new Error('Database not connected') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
    signInWithOtp: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
    resetPasswordForEmail: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
        maybeSingle: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
      }),
      in: () => Promise.resolve({ data: [], error: new Error('Database not connected') }),
      order: () => Promise.resolve({ data: [], error: new Error('Database not connected') }),
      range: () => Promise.resolve({ data: [], error: new Error('Database not connected'), count: 0 }),
      filter: () => Promise.resolve({ data: [], error: new Error('Database not connected') }),
      or: () => Promise.resolve({ data: [], error: new Error('Database not connected') }),
      ilike: () => Promise.resolve({ data: [], error: new Error('Database not connected') }),
    }),
    insert: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
    update: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
    upsert: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
  }),
  rpc: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
  schema: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
          maybeSingle: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
        }),
        in: () => Promise.resolve({ data: [], error: new Error('Database not connected') }),
      }),
    }),
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => {},
    }),
  }),
  removeChannel: () => {},
  functions: {
    invoke: () => Promise.resolve({ data: null, error: new Error('Database not connected') }),
  },
};

// Re-export as supabase for compatibility
export { mockSupabase as supabase };