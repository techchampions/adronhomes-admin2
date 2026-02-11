// src/general/TableCard.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Tables/Pagination";

// New type for pagination props
export type PaginationProps = {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

type ColumnConfig<T = any> = {
  key: string;
  title: string;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
};
type TableCardProps<T = any> = {
  data: T[];
  columns: ColumnConfig<T>[];
  title?: string;
  viewAllText?: string | null;
  rowKey?: string | ((row: T) => string);
  className?: string;
  onViewAllClick?: () => void;
  pagination?: PaginationProps;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T, event: React.MouseEvent) => void;

  citta?: boolean;
  headerComponent?: React.ReactNode;
};


const DEFAULT_COLUMN_WIDTH = 180;

const TableCard = <T extends Record<string, any>>({
  data,
  columns,
  title = "",
  viewAllText = "View All",
  rowKey = "id",
  className = "",
  onViewAllClick,
  pagination,
  onPageChange,
  onRowClick,

  citta = false,
  headerComponent,
}: TableCardProps<T>) => {

  const getRowKey = (row: T, index: number) => {
    if (typeof rowKey === "function") return rowKey(row);
    return row[rowKey] || index;
  };
  const navigate = useNavigate();
  const location = useLocation();

  const getWidthStyle = (width?: number) => ({
    width: width ? `${width}px` : `${DEFAULT_COLUMN_WIDTH}px`,
    minWidth: width ? `${width}px` : `${DEFAULT_COLUMN_WIDTH}px`,
    maxWidth: width ? `${width}px` : `${DEFAULT_COLUMN_WIDTH}px`,
  });

  const handleRowClick = (row: T, event: React.MouseEvent) => {
    // Check if the click came from a button or interactive element
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a')
    ) {
      return;
    }

    // First call custom row click handler if provided
    if (onRowClick) {
      onRowClick(row, event);
      return;
    }

    // Default navigation logic for property plans
    if (row.user_id && row.plan_id) {
      const path = location.pathname;
      const basePath = path.startsWith("/payments/customers")
        ? "/payments/customers/payment"
        : path.startsWith("/client/customers")
        ? "/client/customers/payment"
        : "/customers/payment";

      navigate(`${basePath}/${row.user_id}/${row.plan_id}`);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-[30px] ${className}`}>
     {/* Header */}
{(title || viewAllText || (citta && headerComponent)) && (
  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    
    {/* Left side: Title + optional component */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {title && (
        <h2 className="text-xl font-[350] text-dark whitespace-nowrap">
          {title}
        </h2>
      )}

   
    </div>

    {/* Right side: View All */}
     <div className="flex items-start gap-4 w-full sm:w-auto justify-start sm:justify-end">
        {citta && headerComponent && (
        <div className="flex ">
          {headerComponent}
        </div>
      )}
    {viewAllText && (
      <button
        className="text-sm font-bold text-dark hover:text-blue-600 transition-colors"
        onClick={onViewAllClick}
      >
        {viewAllText}
      </button>
    )}
     </div>
  </div>
)}



      <div className="overflow-x-auto">
        <table className="w-full overflow-x-auto">
          <thead>
            <tr className="text-left text-[#757575] text-sm">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="pb-3 font-[325] whitespace-nowrap"
                  style={getWidthStyle(column.width)}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className="text-sm text-dark font-[325] cursor-pointer hover:bg-gray-50"
                onClick={(event) => handleRowClick(row, event)}
              >
                {columns.map((column) => {
                  const cellValue = row[column.key];
                  const cellContent = column.render
                    ? column.render(cellValue, row)
                    : cellValue;

                  return (
                    <td
                      key={`${getRowKey(row, index)}-${column.key}`}
                      className="py-4"
                      title={
                        typeof cellContent === "string"
                          ? cellContent
                          : undefined
                      }
                    >
                      <div
                        className="truncate"
                        style={getWidthStyle(column.width)}
                      >
                        {cellContent}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && onPageChange && (
        <Pagination
          className="mt-8 mb-4"
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default TableCard;