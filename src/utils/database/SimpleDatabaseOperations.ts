/**
 * Simple Database Operations
 * Bulletproof database operations with automatic error handling
 */

import { supabase } from '@/integrations/supabase/client';
import { errorRecoveryService } from '@/utils/errorBoundary/ErrorRecoveryService';

interface SafeOperationResult<T = any> {
  data: T | null;
  error: any;
  success: boolean;
}

class SimpleDatabaseOperations {
  private maxRetries = 3;
  private retryDelay = 1000;

  // Safe database operation with retry logic
  async executeWithRetry<T>(
    operation: () => Promise<{ data: T | null; error: any }>,
    context = 'database operation'
  ): Promise<SafeOperationResult<T>> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 ${context} attempt ${attempt}/${this.maxRetries}`);
        
        const result = await operation();

        if (result.error) {
          lastError = result.error;
          
          // Handle specific error types
          if (result.error.code === '23503') {
            console.warn('🔧 Foreign key constraint violation detected');
            await this.handleForeignKeyError(result.error);
            continue; // Retry after handling constraint
          }
          
          if (result.error.code === '42501') {
            console.error('🔐 Permission denied - stopping retry');
            break; // Don't retry permission errors
          }
          
          // Network or temporary errors - retry
          if (this.isRetryableError(result.error)) {
            console.log(`⏳ Retryable error, waiting ${this.retryDelay * attempt}ms...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            continue;
          }
          
          // Non-retryable error
          break;
        }

        // Success
        console.log(`✅ ${context} successful`);
        return {
          data: result.data,
          error: null,
          success: true
        };

      } catch (error) {
        lastError = error;
        console.warn(`❌ ${context} failed (attempt ${attempt}):`, error);
        
        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }

    // All retries failed
    console.error(`❌ All ${context} attempts failed:`, lastError);
    errorRecoveryService.handleError(lastError);

    return {
      data: null,
      error: lastError,
      success: false
    };
  }

  // Check if error is retryable
  private isRetryableError(error: any): boolean {
    const retryableCodes = ['PGRST301', 'PGRST001', '08006', '08001'];
    const retryableMessages = ['network', 'timeout', 'connection', 'unavailable'];

    return (
      retryableCodes.includes(error.code) ||
      retryableMessages.some(msg => 
        error.message?.toLowerCase().includes(msg)
      )
    );
  }

  // Handle foreign key constraint errors
  private async handleForeignKeyError(error: any): Promise<void> {
    console.log('🔧 Handling foreign key constraint error...');
    
    if (error.message?.includes('admin_actions') && error.message?.includes('profiles')) {
      await this.ensureUserProfile();
    }
  }

  // Ensure user profile exists
  private async ensureUserProfile(): Promise<void> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('No authenticated user');
      }

      const userId = session.session.user.id;
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', userId)
        .single();

      if (!existingProfile) {
        console.log('🔄 Creating missing user profile...');
        
        const user = session.session.user;
        
        await supabase.from('profiles').insert({
          auth_user_id: userId,
          user_id: userId,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          username: user.user_metadata?.username || `user_${userId.slice(0, 8)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        console.log('✅ User profile created successfully');
      }
    } catch (error) {
      console.warn('⚠️ Could not ensure user profile:', error);
      // Don't throw - let the original operation proceed
    }
  }

  // Safe profile update with automatic profile creation
  async safeProfileUpdate(userId: string, updateData: any): Promise<SafeOperationResult> {
    return this.executeWithRetry(async () => {
      // Ensure profile exists first
      await this.ensureUserProfile();
      
      // Perform update
      return await supabase
        .from('profiles')
        .update(updateData)
        .eq('auth_user_id', userId);
    }, 'profile update');
  }

  // Safe admin action with automatic profile creation
  async safeAdminAction(actionData: any): Promise<SafeOperationResult> {
    return this.executeWithRetry(async () => {
      // Ensure profile exists first
      await this.ensureUserProfile();
      
      // Perform admin action
      return await supabase
        .from('admin_actions')
        .insert(actionData);
    }, 'admin action');
  }
}

export const simpleDatabaseOperations = new SimpleDatabaseOperations();