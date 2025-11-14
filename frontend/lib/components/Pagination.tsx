import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const pageRange = 1; // Number of pages to show immediately before and after currentPage
    const pagesToShow = 2 * pageRange + 1; // 3 pages in the middle (e.g., [4, 5, 6])

    // Total pages must exceed this to switch to dynamic view
    const switchThreshold = 5 + pagesToShow;

    if (totalPages <= switchThreshold) {
      // If total pages are small, just show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // --- Dynamic Logic for large totalPages ---

      // 1. Start Block: Always include the first page
      pages.push(1);

      // Calculate the start and end of the middle block
      let start = Math.max(2, currentPage - pageRange);
      let end = Math.min(totalPages - 1, currentPage + pageRange);

      // Adjust start/end near the boundaries
      if (currentPage <= pageRange + 1) {
        // If near the start (e.g., page 1 or 2), show more pages after
        end = 1 + pagesToShow;
      } else if (currentPage >= totalPages - pageRange) {
        // If near the end (e.g., page 9 or 10), show more pages before
        start = totalPages - pagesToShow;
      }

      // 2. First Ellipsis: If the middle block doesn't start right after page 1
      if (start > 2) {
        pages.push('...');
      }

      // 3. Middle Block: Add the range of pages
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // 4. Second Ellipsis: If the middle block doesn't end right before the last page
      if (end < totalPages - 1) {
        // Ensure we don't push '...' if the last added page is only one away from totalPages
        if (
          pages[pages.length - 1] !== '...' &&
          (pages[pages.length - 1] as number) < totalPages - 1
        ) {
          pages.push('...');
        }
      }

      // 5. End Block: Always include the last page
      if (pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages);
      }
    }

    // Clean up duplicate pages or ellipses
    const uniquePages = pages.filter(
      (value, index, self) =>
        (value !== '...' || self[index - 1] !== '...') &&
        value !== self[index - 1]
    );

    return uniquePages.map((page, index) => {
      if (page === '...') {
        return (
          <span
            key={`el-${index}`}
            className="text-sm font-medium text-foreground px-1"
          >
            ...
          </span>
        );
      }

      const isCurrent = page === currentPage;

      return (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={`
            w-10 h-10 text-sm font-medium transition-colors duration-150
            ${
              isCurrent
                ? 'bg-white text-black border border-gray-300 shadow-sm rounded-lg ring-2 ring-blue-500/10' // Current page style
                : 'text-foreground bg-white hover:bg-gray-50'
            }
          `}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex justify-end mt-6">
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center p-2 text-sm font-medium text-foreground bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center p-2 text-sm font-medium text-foreground bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
