// Stub file - backend removed
const mockResponse = { data: [], error: null };
const mockResponseSingle = { data: null, error: null };

const createMockFrom = () => ({
  select: (...args: any[]) => createMockFrom(),
  insert: (...args: any[]) => createMockFrom(),
  update: (...args: any[]) => createMockFrom(),
  delete: (...args: any[]) => createMockFrom(),
  eq: (...args: any[]) => createMockFrom(),
  neq: (...args: any[]) => createMockFrom(),
  gt: (...args: any[]) => createMockFrom(),
  gte: (...args: any[]) => createMockFrom(),
  lt: (...args: any[]) => createMockFrom(),
  lte: (...args: any[]) => createMockFrom(),
  like: (...args: any[]) => createMockFrom(),
  ilike: (...args: any[]) => createMockFrom(),
  is: (...args: any[]) => createMockFrom(),
  in: (...args: any[]) => createMockFrom(),
  contains: (...args: any[]) => createMockFrom(),
  order: (...args: any[]) => createMockFrom(),
  limit: (...args: any[]) => createMockFrom(),
  range: (...args: any[]) => createMockFrom(),
  single: () => Promise.resolve(mockResponseSingle),
  maybeSingle: () => Promise.resolve(mockResponseSingle),
  then: (resolve: any) => Promise.resolve(mockResponse).then(resolve),
  catch: (reject: any) => Promise.resolve(mockResponse).catch(reject),
});

export const supabase: any = {
  from: (table: string) => createMockFrom(),
  auth: {
    signUp: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    refreshSession: (refreshToken?: any) => Promise.resolve({ data: { session: null, user: null }, error: null }),
    updateUser: (attributes: any) => Promise.resolve({ data: { user: null }, error: null }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve(mockResponseSingle),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      download: () => Promise.resolve(mockResponseSingle),
      list: () => Promise.resolve(mockResponse),
      remove: () => Promise.resolve(mockResponse),
    }),
  },
  functions: {
    invoke: (fn: string, options?: any) => Promise.resolve(mockResponseSingle),
  },
  rpc: (fn: string, params?: any) => Promise.resolve(mockResponseSingle),
  channel: (name: string) => ({
    on: (...args: any[]) => ({
      on: (...args: any[]) => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
    subscribe: () => ({}),
  }),
  removeChannel: (channel: any) => {},
};
