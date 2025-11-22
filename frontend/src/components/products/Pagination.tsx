import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex items-center justify-center gap-2 select-none" aria-label="Pagination">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-md border border-neutral-200 bg-white text-neutral-600 disabled:opacity-40 hover:bg-neutral-50 transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    aria-current={p === currentPage ? "page" : undefined}
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${p === currentPage
                        ? "bg-neutral-200 border-neutral-300 text-neutral-900 font-medium" 
                        : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50" 
                        }`}
                >
                    {p}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded-md border border-neutral-200 bg-white text-neutral-600 disabled:opacity-40 hover:bg-neutral-50 transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
};

export default Pagination;