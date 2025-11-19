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
    // Always show first 3 and last 3 pages if possible
    // Show current page and its neighbors if not in first/last 3
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show 1, 2, 3
      pages.push(1, 2, 3);

      // If currentPage is in the first 4, just show up to 4, then ...
      if (currentPage <= 4) {
        if (currentPage === 4) pages.push(4);
        pages.push('...');
      } else if (currentPage >= totalPages - 3) {
        // If currentPage is in the last 4, show ... before last 6
        pages.push('...');
      } else {
        // Show ... currentPage-1, currentPage, currentPage+1 ...
        pages.push('...');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('...');
      }

      // Always show last 3 pages
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    // Remove duplicates and handle consecutive ...
    const uniquePages = pages.filter((value, index, self) => {
      if (value === '...' && self[index - 1] === '...') return false;
      if (typeof value === 'number' && self.indexOf(value) !== index)
        return false;
      return true;
    });

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
