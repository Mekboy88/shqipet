/**
 * Universal User Hook - 100% Consistent User Data
 * Use this hook for ALL user data needs across the application
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { universalUserService, UniversalUserData } from '@/services/universalUserService';
import { useGlobalAvatar } from '@/hooks/useGlobalAvatar';

export const useUniversalUser = (userId?: string) => {
  const { user } = useAuth();
  const resolvedUserId = userId || user?.id || null;
  const { avatarUrl: globalAvatarUrl } = useGlobalAvatar(resolvedUserId || undefined);

  // Get cached user data immediately to prevent loading states
  const cachedData = resolvedUserId ? universalUserService.getCachedUser(resolvedUserId) : null;
  
  const [userData, setUserData] = useState<UniversalUserData>(cachedData || {
    id: '',
    auth_user_id: '',
    email: '',
    first_name: '',
    last_name: '',
    display_name: '',
    initials: '',
    avatar_url: null,
    username: null,
    verified: false,
    role: 'user',
    account_status: 'active',
    loading: false, // NEVER show loading - always show immediately
    error: null
  });

useEffect(() => {
  if (!resolvedUserId) {
    setUserData(prev => ({
      ...prev,
      loading: false,
      error: null // No error - just no user
    }));
    return;
  }

  // NO TIMEOUT - immediate loading
  const unsubscribe = universalUserService.subscribe(resolvedUserId, (newUserData) => {
    // NEVER show loading state - always show data immediately
    setUserData({ ...newUserData, loading: false });
  });

  return () => {
    unsubscribe();
  };
}, [resolvedUserId]);

const refreshUser = async () => {
  if (resolvedUserId) {
    await universalUserService.refreshUser(resolvedUserId);
  }
};

  return {
    // Core data
    userData,
    loading: false, // NEVER LOADING - always show immediately
    error: userData.error,
    
    // User info
    displayName: userData.display_name,
    firstName: userData.first_name,
    lastName: userData.last_name,
    initials: userData.initials,
    avatarUrl: globalAvatarUrl ?? userData.avatar_url,
    email: userData.email,
    username: userData.username,
    verified: userData.verified,
    role: userData.role,
    accountStatus: userData.account_status,
    
    // Actions
    refreshUser
  };
};

// Hook for multiple users
export const useUniversalUsers = (userIds: string[]) => {
  const [usersData, setUsersData] = useState<Map<string, UniversalUserData>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userIds || userIds.length === 0) {
      setUsersData(new Map());
      setLoading(false);
      return;
    }

    const loadUsers = async () => {
      setLoading(true);
      try {
        const users = await universalUserService.getUsers(userIds);
        setUsersData(users);
      } catch (error) {
        console.error('Error loading multiple users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userIds.join(',')]);

  return {
    usersData,
    loading,
    getUser: (userId: string) => usersData.get(userId) || null
  };
};