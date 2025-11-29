
import React from 'react';
import { UsersPagination } from '@/components/admin/users/UsersPagination';

interface UsersPaginationSectionProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  setPage: (page: number) => void;
}

export function UsersPaginationSection(props: UsersPaginationSectionProps) {
  return (
    <UsersPagination
      page={props.page}
      totalPages={props.totalPages}
      totalCount={props.totalCount}
      pageSize={props.pageSize}
      setPage={props.setPage}
    />
  );
}
