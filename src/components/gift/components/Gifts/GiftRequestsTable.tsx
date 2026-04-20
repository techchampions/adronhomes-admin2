// src/components/Gifts/GiftRequestsTable.tsx
import React from 'react';
import { GiftRequest } from '../../../Redux/gift/gift_thunk';
// import ReusableTable from '../../../Tables/ReusableTable';
import LoadingAnimations from '../../../LoadingAnimations';
import NotFound from '../../../NotFound';
import { ReusableTable } from '../../../Tables/Table_one';

interface GiftRequestsTableProps {
  requests: GiftRequest[];
  actionLoading: number | null;
  onAction: (request: GiftRequest, type: 'approve' | 'reject') => void;
  loading?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSearch?: (searchTerm: string) => void;
  onSortChange?: (sortOption: any) => void;
}

const GiftRequestsTableContent: React.FC<{
  requests: GiftRequest[];
  actionLoading: number | null;
  onAction: (request: GiftRequest, type: 'approve' | 'reject') => void;
}> = ({ requests, actionLoading, onAction }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'granted':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Granted</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="max-h-screen">
        <p className="text-center font-normal text-[#767676]">
          No data found
        </p>
        <NotFound />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-w-[800px] md:min-w-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                Property
              </th>
              <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                User Note
              </th>
              <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                Status
              </th>
              <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                Requested At
              </th>
              <th className="pb-6 font-[325] text-[#757575] text-sm whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="py-4 text-dark text-sm whitespace-nowrap pr-8">
                  {request.property?.name || `Property ID: ${request.property_id}`}
                </td>
                <td className="py-4 font-[325] text-dark text-sm whitespace-nowrap pr-8">
                  {request.user_note || '-'}
                </td>
                <td className="py-4 font-[350] text-dark text-sm whitespace-nowrap pr-8">
                  {getStatusBadge(request.status)}
                </td>
                <td className="py-4 font-[325] text-dark text-sm whitespace-nowrap pr-8">
                  {new Date(request.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 font-[325] text-dark text-sm whitespace-nowrap">
                  {request.status === 'pending' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => onAction(request, 'approve')}
                        disabled={actionLoading === request.id}
                        className="px-3 py-1.5 bg-[#79B833] text-white text-xs rounded-full hover:bg-[#6aa02e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === request.id ? 'Processing...' : 'Grant'}
                      </button>
                      <button
                        onClick={() => onAction(request, 'reject')}
                        disabled={actionLoading === request.id}
                        className="px-3 py-1.5 text-red-500 border border-red-500 text-xs rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === request.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GiftRequestsTable: React.FC<GiftRequestsTableProps> = ({
  requests,
  actionLoading,
  onAction,
  loading = false,
  activeTab = 'pending',
  onTabChange,
  onSearch,
  onSortChange,
}) => {
  const tabs = ["pending", "granted", "rejected"];

  return (
    <div className="w-full overflow-x-auto">
      <ReusableTable
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange || (() => {})}
        searchPlaceholder="Search for gift requests"
        onSearch={onSearch || (() => {})}
        // sortOptions={[
        //   { value: 'newest', name: 'Newest First' },
        //   { value: 'oldest', name: 'Oldest First' },
        //   { value: 'property', name: 'Property Name' }
        // ]}
        defaultSort={0}
        // sort={true}
        showTabs={true}
        showSearchandSort={true}
        onSortChange={onSortChange || (() => {})}
      >
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <LoadingAnimations loading={loading} />
          </div>
        ) : (
          <GiftRequestsTableContent 
            requests={requests}
            actionLoading={actionLoading}
            onAction={onAction}
          />
        )}
      </ReusableTable>
    </div>
  );
};

export default GiftRequestsTable;