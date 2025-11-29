
import { useState } from 'react';
import type { UserFilters, SimpleUserProfile } from '../types/impersonation-types';

export const useImpersonationState = () => {
  const [users, setUsers] = useState<SimpleUserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [filters, setFilters] = useState<UserFilters>({});
  
  // Impersonation state
  const [selectedUser, setSelectedUser] = useState<SimpleUserProfile | null>(null);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState<boolean>(false);
  const [impersonationReason, setImpersonationReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [requireTwoFactor, setRequireTwoFactor] = useState<boolean>(true);
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [confirmationChecked, setConfirmationChecked] = useState<boolean>(false);
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);
  const [currentImpersonatedUser, setCurrentImpersonatedUser] = useState<SimpleUserProfile | null>(null);

  return {
    // User list state
    users,
    setUsers,
    loading,
    setLoading,
    totalCount,
    setTotalCount,
    page,
    setPage,
    pageSize,
    filters,
    setFilters,
    
    // Impersonation state
    selectedUser,
    setSelectedUser,
    isImpersonateModalOpen,
    setIsImpersonateModalOpen,
    impersonationReason,
    setImpersonationReason,
    customReason,
    setCustomReason,
    requireTwoFactor,
    setRequireTwoFactor,
    twoFactorCode,
    setTwoFactorCode,
    confirmationChecked,
    setConfirmationChecked,
    isImpersonating,
    setIsImpersonating,
    currentImpersonatedUser,
    setCurrentImpersonatedUser,
  };
};

export type { SimpleUserProfile };
