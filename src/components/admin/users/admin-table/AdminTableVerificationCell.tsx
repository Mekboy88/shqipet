
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface AdminTableVerificationCellProps {
  isVerified: boolean | undefined;
}

export function AdminTableVerificationCell({ isVerified }: AdminTableVerificationCellProps) {
  if (isVerified === undefined) return null;
  
  return isVerified ? (
    <span className="flex items-center text-green-600">
      <CheckCircle className="w-4 h-4 mr-1" /> Verified
    </span>
  ) : (
    <span className="flex items-center text-red-600">
      <XCircle className="w-4 h-4 mr-1" /> Unverified
    </span>
  );
}
