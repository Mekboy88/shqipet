
// Simplified and explicit type definitions to prevent deep instantiation
export interface SimpleUserProfile {
  id: string;
  username?: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  account_status?: string | null;
  role?: string | null;
  last_login?: string | null;
  created_at?: string | null;
}

export interface ImpersonateReasons {
  'technical-issue': string;
  'bug-verification': string;
  'account-support': string;
  'compliance-check': string;
  'other': string;
}

export interface UserFilters {
  search?: string;
  accountStatus?: string;
  role?: string;
}

export interface ImpersonationData {
  user: SimpleUserProfile;
  startTime: string;
  reason: string;
  adminId: string;
}
