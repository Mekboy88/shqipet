# Profile Data Security Implementation

## ✅ Security Model

This project implements a **defense-in-depth** approach to protect user personal information:

### 1. Row-Level Security (RLS) Policies

**Three-tier access control with PII protection:**

- **Own Profile**: Users have full access to ALL their profile data
- **Platform Owners**: Can view all profiles (for admin purposes)  
- **Other Users**: **CANNOT** directly query the profiles table for sensitive data
  - Direct SELECT queries are blocked by RLS policies
  - Must use secure functions (`get_safe_profile`, `get_public_profiles`) or views (`public_profiles`)
  - These secure methods only expose non-sensitive fields (username, bio, avatar, etc.)
  - Sensitive fields (email, phone, names, DOB) are completely hidden

### 2. Secure Data Access Methods

**For viewing other users' profiles, always use:**

#### Option A: Public Profiles View (Recommended)
```typescript
// Only exposes: username, bio, avatar_url, cover_url, gender
const { data } = await supabase
  .from('public_profiles')
  .select('*')
  .eq('id', userId);
```

#### Option B: Safe Profile Function
```typescript
// Returns only non-sensitive fields
const { data } = await supabase
  .rpc('get_safe_profile', { profile_id: userId });
```

#### Option C: Full Profile Function (for admins)
```typescript
// Returns all fields, but nulls out sensitive data for non-owners
const { data } = await supabase
  .rpc('get_full_profile', { profile_id: userId });
```

### 3. Protected Columns

**These fields are ONLY visible to:**
- Profile owner
- Platform owners/super admins

**Protected columns:**
- `email`
- `phone_number`
- `first_name`
- `last_name`  
- `date_of_birth`

## 🚨 Important: Application Code Requirements

### ❌ NEVER Do This (BLOCKED by RLS):
```typescript
// BAD - Will fail due to RLS policies preventing direct access
const { data } = await supabase
  .from('profiles')
  .select('email, phone_number, first_name, last_name')
  .neq('id', currentUserId);
// ❌ This query will return empty or error - RLS blocks it
```

### ✅ ALWAYS Do This Instead:
```typescript
// GOOD - Uses public_profiles view (rate-limited)
const { data } = await supabase
  .rpc('get_public_profiles', { limit_count: 20, offset_count: 0 });

// GOOD - Gets single safe profile
const { data } = await supabase
  .rpc('get_safe_profile', { profile_id: userId });

// GOOD - For own profile only
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', currentUserId)
  .single();
```

## 🔐 Security Functions Reference

### `get_full_profile(profile_id uuid)`
Returns complete profile with sensitive fields conditionally exposed:
- **For profile owner**: All fields visible
- **For platform owner**: All fields visible
- **For others**: Sensitive fields return NULL

### `get_safe_profile(profile_id uuid)`
Returns only public, non-sensitive profile information:
- Safe to use for displaying any user's profile
- No PII exposure risk

### `public_profiles` VIEW
Materialized-like view exposing only:
- `id`, `username`, `bio`, `avatar_url`, `cover_url`
- `gender`, `created_at`, `updated_at`, `is_hidden`

Automatically filters out hidden profiles.

## 📋 Migration Checklist

When modifying profile queries in application code:

- [ ] Identify if query is for current user's own data
- [ ] Use `profiles` table ONLY for own profile
- [ ] Use `public_profiles` view for displaying other users
- [ ] Use `get_full_profile()` for admin interfaces
- [ ] Never SELECT sensitive columns when viewing other users
- [ ] Test with multiple user accounts to verify privacy

## 🛡️ Additional Security Measures

1. **Password Breach Protection**: Enabled to prevent compromised passwords
2. **Auth Guard Active**: Routes protected, no bypass enabled
3. **Role Visibility**: Users can only see their own roles
4. **Admin Access Logging**: All admin actions are logged in `admin_actions` table
5. **Rate Limiting**: Public profile functions limited to 50 records per call
6. **Audit Trail**: Profile access logged in `profile_access_logs` table
7. **Direct Query Prevention**: RLS policies block direct SELECT of other users' sensitive data

## 📊 Compliance Notes

This implementation helps ensure compliance with:
- **GDPR**: Personal data minimization, purpose limitation
- **CCPA**: Privacy by design, data access controls
- **SOC 2**: Logical access controls, audit logging

## 🔄 Future Enhancements

Consider implementing:
- Column-level encryption for extra-sensitive data
- Audit logging for profile data access
- Rate limiting on profile queries
- Data retention policies
