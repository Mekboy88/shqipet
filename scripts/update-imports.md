# Import Path Migration

This document tracks the migration from `@/integrations/supabase/client` to `@/lib/database`.

## Completed Files (8/185):
- ✅ src/components/admin/AdminLoginFactory.tsx
- ✅ src/components/admin/AuthHealthMonitor.tsx
- ✅ src/components/admin/BruteForceRateMap.tsx
- ✅ src/components/admin/DeviceFingerprintCheck.tsx
- ✅ src/components/admin/DynamicAdminPortalManager.tsx
- ✅ src/components/admin/LearningAnalyticsPage.tsx
- ✅ src/components/admin/S3FunctionInvoker.tsx
- ✅ src/components/admin/S3FunctionTester.tsx

## Remaining (177 files)

The supabase folder has been renamed to 'cloud' and all imports need to be updated to use `@/lib/database` for consistency.