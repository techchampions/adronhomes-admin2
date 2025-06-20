import React from 'react';
import { useNavigate } from 'react-router-dom';

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
};

const DEFAULT_COLUMN_WIDTH = 180;
const IMAGE_COLUMN_WIDTH = 250;

const TableCard = <T extends Record<string, any>>({
  data,
  columns,
  title = 'Table',
  viewAllText = 'View All',
  rowKey = 'id',
  className = '',
}: TableCardProps<T>) => {
  const getRowKey = (row: T, index: number) => {
    if (typeof rowKey === 'function') return rowKey(row);
    return row[rowKey] || index;
  };
const navigate=useNavigate()
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
            <button className="text-sm font-bold text-dark">
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
                className="text-sm text-dark font-[325] cursor-pointer"
          onClick={() => navigate(`/customers/payment/${row.plan_id}/${row.user_id}`)}
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
                    title={typeof cellContent === 'string' ? cellContent : undefined}
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
    </div>
  );
};

export default TableCard;