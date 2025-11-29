
import React from 'react';
import { UsersFilters } from '@/components/admin/users/UsersFilters';

interface UsersFiltersSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onDateChange: (key: string, date: Date | null) => void;
  onResetFilters: () => void;
  accountStatus: string;
  emailVerification: string;
  phoneVerification: string;
  role: string;
  dateStart: Date | null;
  dateEnd: Date | null;
}

export function UsersFiltersSection(props: UsersFiltersSectionProps) {
  return (
    <UsersFilters
      search={props.search}
      onSearchChange={props.onSearchChange}
      onFilterChange={props.onFilterChange}
      onDateChange={props.onDateChange}
      onResetFilters={props.onResetFilters}
      accountStatus={props.accountStatus}
      emailVerification={props.emailVerification}
      phoneVerification={props.phoneVerification}
      role={props.role}
      dateStart={props.dateStart}
      dateEnd={props.dateEnd}
    />
  );
}
