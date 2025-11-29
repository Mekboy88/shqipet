# Authentication Protection Documentation

## ⚠️ CRITICAL: Account vs Post Anonymous State

### Account Level (NEVER Anonymous)
- **User accounts NEVER become anonymous automatically**
- Account authentication is managed by Supabase Auth
- Platform owners, admins, and all users maintain their authenticated state
- Only EXPLICIT logout actions clear authentication

### Post Level (Optional Anonymous)
- **Posts can be created as anonymous** (user choice)
- This is a POST visibility setting, NOT an account state
- Located in CreatePostDesktop component as UI preference
- When posting anonymously:
  - Post appears without author name
  - Account remains fully authenticated
  - User can still see own posts
  - Next post defaults back to non-anonymous

## Session Protection Features

### 1. Automatic Session Monitoring
```typescript
sessionProtection.startProtection()
```
- Monitors session health every 60 seconds
- Auto-refreshes tokens before expiration (5 min threshold)
- Prevents unexpected session invalidation

### 2. Explicit Logout Only
```typescript
// Only THIS triggers actual logout
await signOut()
```
- User must explicitly request logout
- Session won't clear on navigation
- Token refresh failures are handled gracefully
- No automatic logouts on errors

### 3. Session Activity Tracking
Database table: `session_activity`
- Logs all session events (login, logout, refresh)
- Tracks event source (explicit vs automatic)
- Helps debug unexpected logouts
- Platform owners can view all activity

## Key Protection Mechanisms

### AuthContext Changes
- Only responds to explicit `SIGNED_OUT` events
- Ignores token refresh failures that don't require logout
- Maintains session through navigation and page reloads
- Fetches user data on token refresh

### Session Protection Service
Location: `src/utils/auth/sessionProtection.ts`

Features:
- `startProtection()` - Start monitoring
- `stopProtection()` - Stop on logout
- `forceRefresh()` - Manual token refresh
- `getSessionStatus()` - Check session health

### Database Functions
```sql
-- Log session activity
SELECT public.log_session_activity('login', 'explicit_user_action');

-- Check active session
SELECT public.has_active_session(user_id);
```

## How to Verify Protection

### Check Session Status
```typescript
const status = await sessionProtection.getSessionStatus();
console.log(status);
// {
//   hasSession: true,
//   expiresIn: 3600, // seconds
//   isHealthy: true
// }
```

### View Session Activity
Query the database:
```sql
SELECT * FROM public.session_activity 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 20;
```

## Common Issues & Solutions

### Issue: User got logged out unexpectedly
**Check:**
1. View session_activity table for logout event
2. Check event_source (should be 'explicit_user_action')
3. Look for error patterns before logout

**Solution:**
- Session protection now prevents this
- Auto-refresh keeps tokens alive
- Only explicit logout() clears session

### Issue: Post shows as "Anonymous"
**Clarification:**
- This is POST visibility, not account state
- Check `isAnonymous` state in CreatePostDesktop
- User account is still fully authenticated
- Next post will default to non-anonymous

### Issue: Session expired after navigation
**Solution:**
- Session protection monitors continuously
- Tokens refresh automatically before expiration
- Navigation doesn't clear auth state

## Security Guarantees

✅ **Platform owners NEVER lose authentication automatically**  
✅ **Admin accounts protected from auto-logout**  
✅ **Regular users stay authenticated between sessions**  
✅ **Token refresh happens seamlessly**  
✅ **Anonymous posts don't affect account state**  
✅ **All logouts are logged and traceable**  

## Console Debugging

Enable session monitoring in console:
```javascript
// Check protection status
console.log('Session Protection Active:', sessionProtection);

// Force refresh
await sessionProtection.forceRefresh();

// Check status
const status = await sessionProtection.getSessionStatus();
console.log('Session Status:', status);
```

## Migration Applied

Database migration includes:
- ✅ Session activity tracking table
- ✅ RLS policies for privacy
- ✅ Functions for logging and checking sessions
- ✅ Indexes for performance
- ✅ Admin access to all session logs

---

**Last Updated:** 2025-11-08  
**Protection Level:** Maximum - All accounts protected from automatic logout
