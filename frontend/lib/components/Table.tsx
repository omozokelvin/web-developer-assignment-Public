import { Frown } from 'lucide-react';
import { ExtendedColumnDef } from '@/lib/types';
import Pagination from '@/lib/components/Pagination';
import Loading from '@/lib/components/Loading/Loading';

interface TableProps<TData> {
  title?: string;
  noRecordMessage?: string;
  data: TData[];
  columns: ExtendedColumnDef<TData>[];
  isLoading: boolean;
  onRowClick?: (row: TData) => void;
  totalPages: number;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  isError: boolean;
  error: Error | null;
}

export default function Table<TData>({
  title = '',
  noRecordMessage = 'No records found',
  data,
  columns,
  isLoading,
  onRowClick,
  totalPages,
  pageNumber,
  setPageNumber,
  isError,
  error,
}: TableProps<TData>) {
  return (
    <div className="max-w-4xl mx-auto md:p-6 p-2 bg-white rounded-xl font-inter">
      {!!title && (
        <h1 className="font-medium text-6xl tracking-normal text-foreground mb-8">
          {title}
        </h1>
      )}

      {/* Table Structure */}
      <div className="overflow-x-auto relative border border-input rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead>
            <tr className="text-left text-sm font-medium text-mutedForeground tracking-wider border-b border-input">
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`py-4 pl-4 pr-3 last:pr-4 first:pl-4 font-normal ${
                    column.headerClassName || ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 justify-center">
                  <div className="flex justify-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 && !isError ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-500"
                >
                  {noRecordMessage}
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <div className="text-center p-12 text-red-600 bg-red-50 rounded-xl shadow-inner max-w-4xl mx-auto">
                    <Frown className="w-8 h-8 mx-auto mb-3" />
                    <h2 className="text-xl font-semibold">
                      Error Loading Users
                    </h2>
                    <p className="text-sm">
                      {error instanceof Error
                        ? error.message
                        : 'An unknown error occurred.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    transition-colors duration-150
                    ${onRowClick ? 'cursor-pointer hover:bg-indigo-50' : ''}
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`
                        py-4 pl-4 pr-3 first:pl-4 last:pr-4 text-sm text-foreground truncate max-w-xs overflow-ellipsis whitespace-nowrap
                        ${column.className || ''}
                      `}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={pageNumber}
          onPageChange={setPageNumber}
        />
      )}
    </div>
  );
}
