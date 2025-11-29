
import React from 'react';
import { UsersExportButtons } from '@/components/admin/users/UsersExportButtons';

interface UsersHeaderProps {
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function UsersHeader({ onExportCSV, onExportJSON }: UsersHeaderProps) {
  return (
    <UsersExportButtons onExportCSV={onExportCSV} onExportJSON={onExportJSON} />
  );
}
