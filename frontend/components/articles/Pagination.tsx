"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 pt-6">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 rounded-xl border border-[rgba(197,160,89,0.22)] bg-white px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#6B5E51] transition-all duration-300 hover:border-[#C5A059] hover:text-[#C5A059] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft size={15} />
        Previous
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-11 w-11 rounded-xl border text-sm font-black transition-all duration-300 ${
              isActive
                ? "border-[#C5A059] bg-[#C5A059] text-white shadow-[0_12px_30px_rgba(197,160,89,0.22)]"
                : "border-[rgba(197,160,89,0.22)] bg-white text-[#6B5E51] hover:border-[#C5A059] hover:text-[#C5A059]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 rounded-xl border border-[rgba(197,160,89,0.22)] bg-white px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#6B5E51] transition-all duration-300 hover:border-[#C5A059] hover:text-[#C5A059] disabled:pointer-events-none disabled:opacity-40"
      >
        Next
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
