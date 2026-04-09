// ERPContractTransactionsTable.tsx (fixed version)
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import TableCard, { PaginationProps } from "../../general/TableCard";
import { formatAsNaira } from "../../utils/formatcurrency";
import { formatDate } from "../../utils/formatdate";
import LoadingAnimations from "../../components/LoadingAnimations";
import ERPTransactionModal, { ERPTransaction } from "./ERPTransactionModal";
import {
  selectERPTransactions,
  selectERPTransactionsLoading,
  selectERPTransactionsError,
  selectERPTransactionsPagination,
  clearTransactions,
  setPage,
  resetERPContractTransactionsState,
} from "../../components/Redux/Contract/erpContractTransactions/erpContractTransactionsSlice";
import { fetchERPContractTransactions } from "../../components/Redux/Contract/erpContractTransactions/erpContractTransactionsThunk";
import { AppDispatch } from "../../components/Redux/store";

interface ERPContractTransactionsTableProps {
  contractId: string;
  customerName?: string;
  className?: string;
  onViewTransaction?: (transaction: ERPTransaction) => void;
}

const ERPContractTransactionsTable: React.FC<
  ERPContractTransactionsTableProps
> = ({ contractId, customerName, className, onViewTransaction }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<ERPTransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const transactions = useSelector(selectERPTransactions);
  const loading = useSelector(selectERPTransactionsLoading);
  const error = useSelector(selectERPTransactionsError);
  const pagination = useSelector(selectERPTransactionsPagination);

  // Fetch transactions when contractId or page changes
  const fetchTransactions = useCallback(() => {
    if (contractId) {
      dispatch(
        fetchERPContractTransactions({
          contractId,
          page: pagination.currentPage,
        }),
      );
    }
  }, [dispatch, contractId, pagination.currentPage]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset page when contractId changes
  useEffect(() => {
    // Reset to page 1 when contract changes
    if (contractId) {
      dispatch(setPage(1));
      dispatch(clearTransactions());
    }
    
    // Cleanup when component unmounts or contractId changes
    return () => {
      dispatch(resetERPContractTransactionsState());
    };
  }, [dispatch, contractId]);

  const handlePageChange = (page: number) => {
    if (page !== pagination.currentPage) {
      dispatch(setPage(page));
      // The useEffect will trigger fetchTransactions with the new page
    }
  };

  const openTransactionModal = (transaction: ERPTransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
    if (onViewTransaction) {
      onViewTransaction(transaction);
    }
  };

  const closeTransactionModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Transform transactions for table display
  const tableData = transactions.map((transaction) => ({
    id: transaction.id,
    transactionRef: transaction.TransactionReference,
    date: formatDate(transaction.TransactionDate),
    description: transaction.TransactionDescription,
    type: transaction.TransactionDRCR,
    typeDisplay: transaction.TransactionDRCR === "C" ? "CREDIT" : "DEBIT",
    amount: formatAsNaira(Math.abs(transaction.TransactionAmount)),
    amountRaw: transaction.TransactionAmount,
    amountClass:
      transaction.TransactionDRCR === "C" ? "text-green-600" : "text-red-600",
    amountPrefix: transaction.TransactionDRCR === "C" ? "+" : "-",
    originalTransaction: transaction,
  }));

  // Table columns configuration (using compactColumns by default)
  const compactColumns = [
    {
      key: "transactionRef",
      title: "Reference",
      width: 130,
      render: (_: any, row: any) => {
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          openTransactionModal(row.originalTransaction);
        };

        return (
          <div
            className="cursor-pointer hover:text-blue-600 hover:underline font-medium"
            onClick={handleClick}
          >
            {row.transactionRef}
          </div>
        );
      },
    },
    {
      key: "date",
      title: "Date",
      width: 100,
      render: (value: string, row: any) => {
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          openTransactionModal(row.originalTransaction);
        };

        return (
          <div
            className="cursor-pointer hover:text-blue-600"
            onClick={handleClick}
          >
            {value}
          </div>
        );
      },
    },
    {
      key: "description",
      title: "Description",
      width: 200,
      render: (value: string, row: any) => {
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          openTransactionModal(row.originalTransaction);
        };

        return (
          <div
            className="cursor-pointer truncate hover:text-blue-600"
            onClick={handleClick}
            title={value}
          >
            {value}
          </div>
        );
      },
    },
    {
      key: "typeDisplay",
      title: "Type",
      width: 80,
      render: (value: string, row: any) => {
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          openTransactionModal(row.originalTransaction);
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
              row.type === "C"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            onClick={handleClick}
          >
            {row.type === "C" ? "CREDIT" : "DEBIT"}
          </span>
        );
      },
    },
    {
      key: "amount",
      title: "Amount",
      width: 120,
      render: (value: string, row: any) => {
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          openTransactionModal(row.originalTransaction);
        };

        return (
          <div
            className={`font-medium cursor-pointer ${row.amountClass}`}
            onClick={handleClick}
          >
            {row.amountPrefix}
            {value}
          </div>
        );
      },
    },
  ];

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        Error loading transactions: {error}
      </div>
    );
  }

  // Only show "View All" if there are more than the current page size
  const showViewAll = pagination.total > pagination.perPage;

  return (
    <div className={className}>
      <TableCard
        title={`ERP Transactions - Contract ${contractId}`}
        data={tableData}
        columns={compactColumns}
        viewAllText={showViewAll ? "View All" : null}
        rowKey="id"
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
          totalItems: pagination.total,
          totalPages: pagination.lastPage,
        }}
        onPageChange={handlePageChange}
        onRowClick={(row) => openTransactionModal(row.originalTransaction)}
      />

      <ERPTransactionModal
        isOpen={isModalOpen}
        onClose={closeTransactionModal}
        transactionData={selectedTransaction!}
        contractId={contractId}
        customerName={customerName}
      />
    </div>
  );
};

export default ERPContractTransactionsTable;