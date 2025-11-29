/**
 * Backend disabled: SupabaseAuthFixer no-op
 * All RPC and auth-dependent operations are short-circuited.
 */
export class SupabaseAuthFixer {
  private static instance: SupabaseAuthFixer;

  public static getInstance(): SupabaseAuthFixer {
    if (!SupabaseAuthFixer.instance) {
      SupabaseAuthFixer.instance = new SupabaseAuthFixer();
    }
    return SupabaseAuthFixer.instance;
  }

  /**
   * Execute RPC call with guaranteed auth context (disabled)
   */
  async executeRPCWithAuth<T = any>(
    functionName: string,
    params: Record<string, any> = {}
  ): Promise<{ data: T | null; error: any }> {
    console.warn('[SupabaseAuthFixer] Backend disabled, RPC skipped', { functionName, params });
    return { data: null, error: { message: 'Backend disabled' } };
  }

  /**
   * Test authentication context in database (disabled)
   */
  async testAuthContext(): Promise<{
    isAuthenticated: boolean;
    authUserId: string | null;
    profileExists: boolean;
    error?: string;
  }> {
    return {
      isAuthenticated: false,
      authUserId: null,
      profileExists: false,
      error: 'Backend disabled'
    };
  }
}

export const supabaseAuthFixer = SupabaseAuthFixer.getInstance();