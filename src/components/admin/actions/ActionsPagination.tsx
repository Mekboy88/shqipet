
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ActionsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
}

export function ActionsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  setCurrentPage
}: ActionsPaginationProps) {
  // Generate an array of pagination numbers to display
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    items.push(1);
    
    // Calculate range of pages to show around current page
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 2);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 2) {
      startPage = Math.max(2, endPage - maxPagesToShow + 2);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push('ellipsis-start');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push('ellipsis-end');
    }
    
    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };

  // Handle previous page click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500">
        Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={handlePreviousPage}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {getPaginationItems().map((page, i) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <PaginationItem key={`ellipsis-${i}`}>
                  <span className="px-4 py-2">...</span>
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink 
                  onClick={() => setCurrentPage(Number(page))}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={handleNextPage}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
