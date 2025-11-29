# Security Utilities

This directory contains security-related utilities and helpers for the application.

## Files

### `secureStorage.ts`
Secure client-side storage utilities with validation and encryption support.

**Key Features:**
- Storage key validation and whitelisting
- Expiry time support
- Clear documentation on what should/shouldn't be stored
- Session storage helpers

**Usage:**
```typescript
import { setSecureItem, getSecureItem } from '@/utils/security/secureStorage';

// Store non-sensitive preference
setSecureItem('theme', 'dark', { expiryMinutes: 43200 }); // 30 days

// Retrieve value
const theme = getSecureItem('theme');
```

**⚠️ CRITICAL SECURITY RULES:**

#### NEVER STORE:
- ❌ Authentication tokens (handled by Supabase SDK)
- ❌ Passwords or password hashes
- ❌ Personal Identifiable Information (PII)
- ❌ API keys or secrets
- ❌ Payment information
- ❌ Backend credentials (AWS, Wasabi, etc.)

#### SAFE TO STORE:
- ✅ UI preferences (theme, language)
- ✅ Non-sensitive user settings
- ✅ Recent searches (non-sensitive only)
- ✅ Cache keys (non-sensitive)
- ✅ Form drafts (with user consent)

### `authGuard.ts`
Authentication validation and session management.

**Key Features:**
- Session validation
- User profile verification
- Security logout on validation failure
- Immediate security checks

**Usage:**
```typescript
import { authGuard } from '@/utils/security/authGuard';

// Validate current session
const result = await authGuard.validateSessionImmediately();
if (!result.isValid) {
  // Handle invalid session
  navigate(result.redirectPath);
}
```

## Security Best Practices

### 1. **Always Use Database-Driven Role Checks**
```typescript
// ✅ CORRECT
const { userRole } = useAuth();
const isAdmin = userRole === 'admin';

// ❌ WRONG
const isAdmin = user.email === 'admin@example.com';
```

### 2. **Never Expose Sensitive Data Client-Side**
```typescript
// ✅ CORRECT: Server-side only
// supabase/functions/get-api-key/index.ts
const apiKey = Deno.env.get('API_KEY');

// ❌ WRONG: Client-side exposure
const apiKey = import.meta.env.VITE_API_KEY; // Exposed in bundle!
```

### 3. **Always Validate User Input**
```typescript
import { z } from 'zod';

// ✅ CORRECT
const schema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100)
});

const result = schema.safeParse(userInput);
if (!result.success) {
  return { error: result.error };
}
```

### 4. **Use RLS Policies for Data Access**
```sql
-- ✅ CORRECT: RLS policy
CREATE POLICY "Users see own data"
ON user_data FOR SELECT
USING (auth.uid() = user_id);

-- ❌ WRONG: No RLS
ALTER TABLE user_data DISABLE ROW LEVEL SECURITY;
```

### 5. **Secure Logout Procedures**
```typescript
// ✅ CORRECT: Complete cleanup
import { immediateLogoutService } from '@/utils/auth/immediateLogoutService';
await immediateLogoutService.performImmediateLogout();

// ❌ WRONG: Incomplete cleanup
await supabase.auth.signOut();
// Missing: localStorage cleanup, session cleanup, etc.
```

## Common Security Pitfalls

### ❌ **Hardcoded Credentials**
```typescript
// NEVER DO THIS
if (user.email === 'admin@example.com') {
  grantAdminAccess();
}
```

### ❌ **Client-Side Secret Storage**
```typescript
// NEVER DO THIS
localStorage.setItem('apiKey', 'sk-xxx');
localStorage.setItem('password', userPassword);
```

### ❌ **Bypassing RLS**
```typescript
// NEVER DO THIS (on client)
const supabase = createClient(url, SERVICE_ROLE_KEY);
```

### ❌ **Trusting Client Input**
```typescript
// NEVER DO THIS
const sql = `SELECT * FROM users WHERE id = ${userId}`;
```

### ❌ **Exposing Sensitive Data**
```typescript
// NEVER DO THIS
console.log('User password:', password);
console.log('API Key:', apiKey);
```

## Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** commit it to version control
2. **DO NOT** discuss publicly
3. Document the issue privately
4. Implement fix following best practices
5. Update security documentation
6. Review logs for potential exploitation

## Related Documentation

- `../../SECURITY_IMPLEMENTATION.md` - Comprehensive security guide
- `../../SECURITY_FIXES.md` - Phase 1 security fixes
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/security)

---

**Last Updated:** 2025-10-01  
**Next Review:** 2025-11-01
