// BULLETPROOF AUTH WALL - DISABLED TO PREVENT FLASH
// Auth is now handled properly by CentralizedAuthGuard in ViewSwitcher
// This file is kept for reference but no longer executes

/*
const publicRoutes = ['/auth/login', '/auth/register', '/register', '/auth/verification', '/auth/callback', '/terms-of-use', '/privacy-policy'];
const currentPath = window.location.pathname;

console.log('🛡️ AUTH WALL ACTIVATED - Current path:', currentPath);

// ALWAYS redirect to login for root path or any protected route
if (currentPath === '/' || !publicRoutes.includes(currentPath)) {
  console.log('🚫 UNAUTHORIZED ACCESS DETECTED - REDIRECTING TO LOGIN');
  window.location.href = '/auth/login';
  // Stop all execution
  throw new Error('UNAUTHORIZED_ACCESS_PREVENTED');
}

console.log('✅ PUBLIC ROUTE ALLOWED - Continuing...');
*/

console.log('🛡️ AUTH WALL DISABLED - Using CentralizedAuthGuard instead');