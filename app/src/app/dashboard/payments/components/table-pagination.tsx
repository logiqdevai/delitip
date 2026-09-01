"use client";

import { type FC } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const MAX_VISIBLE_PAGES = 7;

function getVisiblePages(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const withEllipsis: (number | "ellipsis")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) {
      withEllipsis.push("ellipsis");
    }
    withEllipsis.push(p);
  });
  return withEllipsis;
}

export const TablePagination: FC<{
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const goTo = (target: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange(target);
    }
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page - 1)}
          />
        </PaginationItem>
        {getVisiblePages(page, totalPages).map((entry, index) =>
          entry === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink href="#" isActive={entry === page} onClick={goTo(entry)}>
                {entry}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
            onClick={goTo(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
