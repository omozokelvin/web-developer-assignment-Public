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
    const pageRange = 1;
    const pagesToShow = 2 * pageRange + 1;

    const switchThreshold = 5 + pagesToShow;

    if (totalPages <= switchThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - pageRange);
      let end = Math.min(totalPages - 1, currentPage + pageRange);

      if (currentPage <= pageRange + 1) {
        end = 1 + pagesToShow;
      } else if (currentPage >= totalPages - pageRange) {
        start = totalPages - pagesToShow;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (end < totalPages - 1) {
        if (
          pages[pages.length - 1] !== '...' &&
          (pages[pages.length - 1] as number) < totalPages - 1
        ) {
          pages.push('...');
        }
      }

      if (pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages);
      }
    }

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
                ? 'bg-white text-black border border-gray-300 shadow-sm rounded-lg ring-2 ring-blue-500/10'
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
    <div className="flex justify-center md:justify-end mt-6">
      <div className="flex items-center space-x-1 md:space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-2 py-1 text-sm font-medium text-foreground bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4 mr-1 md:mr-0" />
          <span className="hidden md:block">Previous</span>
        </button>

        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center px-2 py-1 text-sm font-medium text-foreground bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <span className="hidden md:block">Next</span>
          <ChevronRight className="w-4 h-4 ml-1 md:ml-0" />
        </button>
      </div>
    </div>
  );
}
