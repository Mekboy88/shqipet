
import React from 'react';
import { BulkActionsToolbar } from '@/components/admin/users/BulkActionsToolbar';

interface UsersBulkActionsSectionProps {
  selectedCount: number;
  onActivateUsers: (reason: string) => void;
  onSuspendUsers: (reason: string) => void;
  onDeactivateUsers: (reason: string) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onClearSelection: () => void;
}

export function UsersBulkActionsSection(props: UsersBulkActionsSectionProps) {
  return (
    <BulkActionsToolbar
      selectedCount={props.selectedCount}
      onActivateUsers={props.onActivateUsers}
      onSuspendUsers={props.onSuspendUsers}
      onDeactivateUsers={props.onDeactivateUsers}
      onExportCSV={props.onExportCSV}
      onExportJSON={props.onExportJSON}
      onClearSelection={props.onClearSelection}
    />
  );
}
