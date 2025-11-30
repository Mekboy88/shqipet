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
  containedBy: (...args: any[]) => createMockFrom(),
  rangeGt: (...args: any[]) => createMockFrom(),
  rangeGte: (...args: any[]) => createMockFrom(),
  rangeLt: (...args: any[]) => createMockFrom(),
  rangeLte: (...args: any[]) => createMockFrom(),
  rangeAdjacent: (...args: any[]) => createMockFrom(),
  overlaps: (...args: any[]) => createMockFrom(),
  textSearch: (...args: any[]) => createMockFrom(),
  match: (...args: any[]) => createMockFrom(),
  not: (...args: any[]) => createMockFrom(),
  or: (...args: any[]) => createMockFrom(),
  filter: (...args: any[]) => createMockFrom(),
  order: (...args: any[]) => createMockFrom(),
  limit: (...args: any[]) => createMockFrom(),
  range: (...args: any[]) => createMockFrom(),
  abortSignal: (...args: any[]) => createMockFrom(),
  single: () => Promise.resolve(mockResponseSingle),
  maybeSingle: () => Promise.resolve(mockResponseSingle),
  then: (resolve: any) => Promise.resolve(mockResponse).then(resolve),
  catch: (reject: any) => Promise.resolve(mockResponse).catch(reject),
});

const supabase: any = {
  from: (table: string) => createMockFrom(),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  rpc: (fn: string, params?: any) => Promise.resolve(mockResponseSingle),
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
  channel: (name: string) => ({
    on: (...args: any[]) => ({ subscribe: () => ({}) }),
    subscribe: () => ({}),
  }),
  removeChannel: (channel: any) => {},
};

export default supabase;
