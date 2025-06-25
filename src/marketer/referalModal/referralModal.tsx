import React, { useEffect, useState } from "react";
import { GoX } from "react-icons/go";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../Table_one";
import PaymentsTableAll from "./PaymentTable";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlyStats } from "../../components/Redux/Marketer/marketers_monthly_thunk";
import { formatAsNaira } from "../../utils/formatcurrency";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";


export default function ReferralModal({ onClose }: { onClose: () => void }) {
  const tabs = ["Referral History"];
  const [activeTab, setActiveTab] = useState("Referral History");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch<AppDispatch>();

  const { error, loading, total_expected, total_paid, monthly_stats } = useSelector(
    (state: RootState) => state.marketerMonthlyStats
  );

  useEffect(() => {
    dispatch(fetchMonthlyStats({ year: selectedYear }));
  }, [dispatch, selectedYear]);

  const statData = () => {
    if (!monthly_stats) return [];
    return monthly_stats.map((item) => ({
      month: item.month,
      totalUsers: item.users,
      totalPayments: item.payment_count,
      totalAmount: item.total_paid,
    }));
  };

  const statsData = statData();
  const isEmpty = statsData.length === 0;

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#F5F5F5] rounded-[20px] max-w-[800px] w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0 flex-shrink-0">
          <div className="flex flex-row justify-between items-start w-full">
            <div>
              <p className="text-2xl font-[350] text-dark">Referral Details</p>
              <h1 className="text-base text-dark font-[325] mt-2 pb-4">
                View the referral amount history
              </h1>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close modal"
            >
              <GoX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <MatrixCardGreen
              title="Total Amount"
              value={formatAsNaira(total_paid)}
              change="All customers on a property plan"
            />
            <MatrixCard
              title="Total Amount for this month"
              value={total_expected.toLocaleString()}
              change="Includes all customers on a property plan"
            />
          </div>

          {/* Table Section */}
          <div className="mt-5">
            <ReusableTable
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              onYearChange={(year) => setSelectedYear(year)}
              tabs={tabs}
            >
              {loading ? (
                <div className="w-full flex items-center justify-center">
                  <LoadingAnimations loading={loading} />
                </div>
              ) : isEmpty ? (
                <div className="w-full text-center py-6">
                  <p className="text-[#767676]">No active plans found</p>
                  <NotFound />
                </div>
              ) : (
                <PaymentsTableAll currentItems={statsData} />
              )}
            </ReusableTable>
          </div>
        </div>
      </div>
    </div>
  );
}
