
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface UsersPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  setPage: (page: number) => void;
}

export function UsersPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  setPage,
}: UsersPaginationProps) {
  const renderPagination = () => {
    const pageNumbers: number[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Current page neighborhood
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(page + 1, totalPages - 1);
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(-2); // -2 represents second ellipsis
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return (
      <PaginationContent>
        <PaginationItem>
          <Button 
            variant="ghost" 
            className="gap-1 pl-2.5" 
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
          >
            <PaginationPrevious />
            Previous
          </Button>
        </PaginationItem>
        
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber < 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={pageNumber}>
              <Button 
                variant="ghost"
                className="gap-1 px-4"
                onClick={() => setPage(pageNumber)}
                disabled={page === pageNumber}
              >
                <PaginationLink isActive={page === pageNumber}>
                  {pageNumber}
                </PaginationLink>
              </Button>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <Button 
            variant="ghost" 
            className="gap-1 pr-2.5" 
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    );
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {Math.min(totalCount, (page - 1) * pageSize + 1)} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
      </div>
      <Pagination>
        {renderPagination()}
      </Pagination>
    </div>
  );
}
