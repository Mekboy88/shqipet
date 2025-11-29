// DO NOT EDIT — Retryable import system for chunk load errors.
// Removing this re-introduces full-screen refresh prompts.

import React from 'react';

/**
 * Retry wrapper for dynamic imports to handle chunk load errors
 * without forcing a full page refresh
 */
export async function retryImport<T>(
  factory: () => Promise<T>,
  attempts: number = 3,
  delayMs: number = 1200
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await factory();
    } catch (error: any) {
      lastError = error;
      
      const isChunkError = 
        error?.name === 'ChunkLoadError' ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('ChunkLoadError') ||
        error?.message?.includes('Failed to fetch dynamically imported module');

      if (isChunkError && attempt < attempts) {
        console.warn(`[RetryImport] Chunk load failed (attempt ${attempt}/${attempts}), retrying in ${delayMs}ms:`, error.message);
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        continue;
      }

      // If it's not a chunk error or we've exhausted attempts, throw
      if (!isChunkError || attempt === attempts) {
        console.error(`[RetryImport] Import failed after ${attempts} attempts:`, error);
        throw error;
      }
    }
  }

  throw lastError!;
}

/**
 * Wrapper for React.lazy that includes retry logic
 */
export function retryableLazy<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  attempts: number = 3,
  delayMs: number = 1200
): React.LazyExoticComponent<T> {
  return React.lazy(() => retryImport(factory, attempts, delayMs));
}

/**
 * Global chunk error handler setup
 */
export function setupChunkErrorRecovery() {
  // Listen for global chunk errors
  window.addEventListener('error', (event) => {
    const isChunkError = 
      event.message?.includes('Loading chunk') ||
      event.message?.includes('ChunkLoadError') ||
      event.filename?.includes('chunk');

    if (isChunkError) {
      console.warn('[ChunkRecovery] Global chunk load error detected:', event.message);
      
      // Notify global recovery system
      window.dispatchEvent(new CustomEvent('chunk-load-error', {
        detail: { 
          message: event.message,
          filename: event.filename,
          timestamp: Date.now()
        }
      }));
      
      // Prevent default error handling
      event.preventDefault();
    }
  });

  // Listen for unhandled promise rejections (often chunk errors in async contexts)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const isChunkError = 
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('ChunkLoadError');

    if (isChunkError) {
      console.warn('[ChunkRecovery] Unhandled chunk load rejection:', error);
      
      // Notify global recovery system
      window.dispatchEvent(new CustomEvent('chunk-load-error', {
        detail: { 
          error: error.message,
          timestamp: Date.now()
        }
      }));
      
      // Prevent default unhandled rejection handling
      event.preventDefault();
    }
  });

  console.log('[ChunkRecovery] Chunk error recovery handlers installed');
}

/**
 * Utility to manually trigger chunk recovery
 */
export function triggerChunkRecovery() {
  console.log('[ChunkRecovery] Manual chunk recovery triggered');
  window.dispatchEvent(new CustomEvent('manual-chunk-recovery'));
}

/**
 * Clear module cache for failed chunks (development only)
 */
export function clearChunkCache() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.warn('[ChunkRecovery] Clearing chunk cache (development only)');
    // In development, we can clear module cache
    if ('webpackChunkName' in window) {
      // Clear webpack cache if available
      try {
        delete (window as any).__webpack_require__.cache;
      } catch (e) {
        console.warn('[ChunkRecovery] Could not clear webpack cache:', e);
      }
    }
  }
}