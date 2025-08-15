// src/general/TableCard.tsx (or wherever your TableCard is located)
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
};

const DEFAULT_COLUMN_WIDTH = 180;
// const IMAGE_COLUMN_WIDTH = 250; // Not used in the provided snippet

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

  return (
    <div className={`bg-white p-6 rounded-[30px] ${className}`}>
      {(title || viewAllText) && (
        <div className="w-full flex justify-between items-center mb-6">
          {title && <h2 className="text-xl font-[350] text-dark">{title}</h2>}
          {viewAllText && (
            <button
              className="text-sm font-bold text-dark hover:text-blue-600 transition-colors"
              onClick={onViewAllClick}
            >
              {viewAllText}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
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
                // onClick={() =>
                //   navigate(`/customers/payment/${row.user_id}/${row.plan_id}`)
                // }
                  onClick={() => {
  const basePath = location.pathname.startsWith("/payments/customers")
    ? "/payments/customers/payment"
    : "/customers/payment";
  navigate(`${basePath}/${row.user_id}/${row.plan_id}`);
}}
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

      {/* Optional: Add pagination controls here if you want them within TableCard */}
      {/*
      {pagination && onPageChange && pagination.totalPages > 1 && (
        <div className="w-full mt-4 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default TableCard;
