// CustomersTableComponent.tsx

import React from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../components/Redux/store";
import Pagination from "../../components/Tables/Pagination";
import {
  selectCustomersPagination,
  setCustomersPage,
} from "../../components/Redux/customers/customers_slice";
import {
  customer,
  Marketer,
} from "../../components/Redux/customers/customers_thunk"; // Import Marketer interface
import { formatDate } from "../../utils/formatdate";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";

interface CustomersTable {
  id: any;
  first_name: any;
  last_name: any;
  marketer: Marketer; // Change 'any' to 'Marketer'
  created_at: any;
  property_plan_total: any;
  saved_property_total: any;
  phone_number: any;
}

interface CustomersTableprop {
  data: CustomersTable[];
}

export default function CustomersTableComponent({ data }: CustomersTableprop) {
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectCustomersPagination);
  const location = useLocation();

  const handlePageChange = async (page: any) => {
    await dispatch(setCustomersPage(page));
    // await dispatch(customer(page));
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Customer's Name
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Marketer in Charge
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Date Joined
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Property Plans
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Saved Properties
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] whitespace-nowrap">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => {
                    let basePath = "/customers"; // default fallback

                    if (location.pathname.startsWith("/payments/customers")) {
                      basePath = "/payments/customers";
                    } else if (
                      location.pathname.startsWith("/client/customers")
                    ) {
                      basePath = "/client/customers";
                    }

                    navigate(`${basePath}/${row.id}`);
                  }}
                >
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[72px] truncate whitespace-nowrap pr-4"
                    title={
                      typeof `${row.first_name || ""} ${
                        row.last_name || ""
                      }` === "string"
                        ? `${row.first_name || ""} ${
                            row.last_name || ""
                          }`.trim()
                        : undefined
                    }
                  >
                    {row.first_name || row.last_name
                      ? `${row.first_name || ""} ${row.last_name || ""}`.trim()
                      : "N/A"}
                  </td>

                  <td
                    className="pb-[31px] font-gotham font-[350] text-dark text-sm max-w-[85px] truncate whitespace-nowrap pr-4"
                    title={
                      row.marketer
                        ? `${row.marketer.first_name || ""} ${
                            row.marketer.last_name || ""
                          }`.trim()
                        : undefined
                    }
                  >
                    {/* Access marketer's first_name and last_name */}
                    {row.marketer
                      ? `${row.marketer.first_name || ""} ${
                          row.marketer.last_name || ""
                        }`.trim()
                      : "N/A"}
                  </td>
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[73px] truncate whitespace-nowrap pr-4"
                    title={
                      typeof formatDate(row.created_at) === "string"
                        ? formatDate(row.created_at)
                        : undefined
                    }
                  >
                    {row.created_at ? formatDate(row.created_at) : "N/A"}
                  </td>
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowra pr-4"
                    title={
                      typeof row.property_plan_total === "string"
                        ? row.property_plan_total
                        : undefined
                    }
                  >
                    {row.property_plan_total ?? "N/A"}
                  </td>
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap pr-4"
                    title={
                      typeof row.saved_property_total === "string"
                        ? row.saved_property_total
                        : undefined
                    }
                  >
                    {row.saved_property_total ?? "N/A"}
                  </td>
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[100px] truncate whitespace-nowrap"
                    title={
                      typeof row.phone_number === "string"
                        ? row.phone_number
                        : undefined
                    }
                  >
                    {row.phone_number ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full">
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4"
        />
      </div>
    </>
  );
}
