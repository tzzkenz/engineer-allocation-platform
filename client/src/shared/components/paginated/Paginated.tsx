"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@shared/components/ui/pagination";

type PaginatedProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
export function Paginated({ page, totalPages, onPageChange }: PaginatedProps) {
  if (totalPages <= 1) return null;

  const renderPages = () => {
    const pages = [];
    const delta = 1; // how many pages to show around current

    for (let i = 1; i <= totalPages; i++) {
      // always show first, last, current and neighbors
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === page - (delta + 1) || i === page + (delta + 1)) {
        // show ellipsis around skipped ranges
        pages.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  return (
    <Pagination className=" justify-normal  mt-4">
      <PaginationContent className=" w-full justify-between">
        <div>
          Showing page {page} of {totalPages}
        </div>
        <div className=" flex items-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              text=""
            />
          </PaginationItem>

          {renderPages()}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
              text=""
            />
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  );
}
