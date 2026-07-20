import { FormEvent, UIEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import Pagination from "../../components/Tables/Pagination";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { AppDispatch } from "../../components/Redux/store";
import {
  clearChatReply,
  selectChatReplyError,
  selectChatReplyLoading,
  selectSingleUserInfo,
  selectSingleUserInfoError,
  selectSingleUserInfoLoading,
} from "../../components/Redux/estate/estateSlice";
import {
  fetchSingleUserEstateInfo,
  markEstateChatAsRead,
  Payment,
  sendChatReply,
  ChatMessage,
} from "../../components/Redux/estate/estateThunk";
import { formatDate } from "../../utils/formatdate";
import EstateDetailModal, { EstateDetailItem } from "./EstateDetailModal";

const paymentStatus = (status: number) => {
  if (status === 1) return "Approved";
  if (status === 2) return "Rejected";
  return "Pending";
};

const getMaintenanceStatusStyle = (status?: string) => {
  const normalizedStatus = String(status || "").toLowerCase();

  if (normalizedStatus === "pending") {
    return "bg-[#FFF4E8] text-[#FF9131]";
  }

  if (normalizedStatus === "resolved" || normalizedStatus === "completed") {
    return "bg-[#EAF7EA] text-[#2E9B2E]";
  }

  if (normalizedStatus === "rejected" || normalizedStatus === "cancelled") {
    return "bg-[#FDECEC] text-[#D70E0E]";
  }

  return "bg-[#F1F1F1] text-[#767676]";
};

const getPriorityStyle = (priority?: string) => {
  const normalizedPriority = String(priority || "").toLowerCase();

  if (normalizedPriority === "high") {
    return "bg-[#FDECEC] text-[#D70E0E]";
  }

  if (normalizedPriority === "medium") {
    return "bg-[#FFF4E8] text-[#FF9131]";
  }

  if (normalizedPriority === "low") {
    return "bg-[#EAF7EA] text-[#2E9B2E]";
  }

  return "bg-[#F1F1F1] text-[#767676]";
};

export default function SingleUserEstate() {
  const dispatch = useDispatch<AppDispatch>();
  const { estateId, userId } = useParams();
  const numericEstateId = Number(estateId);
  const numericUserId = Number(userId);
  const userInfo = useSelector(selectSingleUserInfo);
  const loading = useSelector(selectSingleUserInfoLoading);
  const error = useSelector(selectSingleUserInfoError);
  const chatLoading = useSelector(selectChatReplyLoading);
  const chatError = useSelector(selectChatReplyError);
  const [activeTab, setActiveTab] = useState("Payments");
  const [message, setMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any | null>(
    null,
  );
  const [openedUnreadCount, setOpenedUnreadCount] = useState(0);
  const [markedReadChannels, setMarkedReadChannels] = useState<string[]>([]);
  const [privateChatMessages, setPrivateChatMessages] = useState<ChatMessage[]>(
    [],
  );
  const [loadingOlderPrivateChats, setLoadingOlderPrivateChats] =
    useState(false);
  const privateChatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Number.isFinite(numericEstateId) && Number.isFinite(numericUserId)) {
      dispatch(
        fetchSingleUserEstateInfo({
          estateId: numericEstateId,
          userId: numericUserId,
        }),
      );
    }
  }, [dispatch, numericEstateId, numericUserId]);

  useEffect(() => {
    if (chatError) {
      toast.error(chatError);
    }
  }, [chatError]);

  useEffect(() => {
    const chats = userInfo?.chats;
    if (!chats) return;

    setPrivateChatMessages((currentMessages) => {
      const mergedMessages =
        chats.current_page === 1
          ? chats.data
          : [...chats.data, ...currentMessages];
      const uniqueMessages = Array.from(
        new Map(mergedMessages.map((chat) => [chat.id, chat])).values(),
      );

      return uniqueMessages.sort(
        (firstChat, secondChat) =>
          new Date(firstChat.created_at).getTime() -
          new Date(secondChat.created_at).getTime(),
      );
    });

    if (chats.current_page === 1) {
      requestAnimationFrame(() => {
        const container = privateChatContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  }, [userInfo?.chats]);

  useEffect(() => {
    if (activeTab !== "Chats" || !userInfo) return;

    const channel = userInfo.chats.data.find((chat) => chat.channel)?.channel;
    const unreadCount = userInfo.estate.unread_count || 0;

    if (unreadCount > 0) {
      setOpenedUnreadCount(unreadCount);
    }

    if (channel && unreadCount > 0 && !markedReadChannels.includes(channel)) {
      dispatch(markEstateChatAsRead({ channel }));
      setMarkedReadChannels((currentChannels) => [...currentChannels, channel]);
    }
  }, [activeTab, dispatch, markedReadChannels, userInfo]);

  const clientName = useMemo(() => {
    if (!userInfo?.client) return "Estate Client";
    return `${userInfo.client.first_name || ""} ${
      userInfo.client.last_name || ""
    }`.trim();
  }, [userInfo]);

  const handleSendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() || !userInfo?.client) return;

    const result = await dispatch(
      sendChatReply({
        estate_id: numericEstateId,
        receiver_id: userInfo.client.id,
        message: message.trim(),
      }),
    );

    if (sendChatReply.fulfilled.match(result)) {
      setMessage("");
      dispatch(clearChatReply());
      toast.success("Reply sent successfully");
    }
  };

  const getPaymentStatusColor = (status: number) => {
    if (status === 1) return "#2E9B2E";
    if (status === 2) return "#D70E0E";
    return "#FF9131";
  };

  const paymentDetailItems = (payment: Payment): EstateDetailItem[] => [
    { label: "Payment ID", value: `#${payment.id}` },
    { label: "Description", value: payment.description || "N/A" },
    { label: "Payment Method", value: payment.payment_method || "N/A" },
    { label: "Payment Type", value: payment.payment_type || "N/A" },
    { label: "Purpose", value: payment.purpose || "N/A" },
    { label: "Reference", value: payment.reference || "N/A" },
    {
      label: "Status",
      value: paymentStatus(payment.status),
      statusColor: getPaymentStatusColor(payment.status),
    },
    { label: "Chargeable ID", value: payment.chargeable_id || "N/A" },
    {
      label: "Client",
      value:
        `${payment.user_first_name || ""} ${payment.user_last_name || ""}`.trim() ||
        clientName,
    },
    { label: "Created Date", value: formatDate(payment.created_at) },
    { label: "Updated Date", value: formatDate(payment.updated_at) },
  ];

  const maintenanceDetailItems = (item: any): EstateDetailItem[] => [
    { label: "Request ID", value: item.id || "N/A" },
    {
      label: "Title",
      value: item.title || "N/A",
    },
    {
      label: "Content",
      value: item.content || "N/A",
    },
    { label: "Priority", value: item.priority || "N/A" },
    {
      label: "Status",
      value: item.status || "N/A",
      statusColor:
        String(item.status || "").toLowerCase() === "pending"
          ? "#FF9131"
          : "#2E9B2E",
    },
    {
      label: "Client",
      value:
        `${item.user_first_name || ""} ${item.user_last_name || ""}`.trim() ||
        clientName,
    },
    { label: "Attachment", value: item.attached || "No attachment" },
    { label: "Created Date", value: formatDate(item.created_at) },
    { label: "Updated Date", value: formatDate(item.updated_at) },
  ];

  const handleSingleRecordPageChange = async (page: number) => {
    if (!Number.isFinite(numericEstateId) || !Number.isFinite(numericUserId)) {
      return;
    }

    await dispatch(
      fetchSingleUserEstateInfo({
        estateId: numericEstateId,
        userId: numericUserId,
        page,
      }),
    );
  };

  const handlePrivateChatScroll = async (event: UIEvent<HTMLDivElement>) => {
    const chatPagination = userInfo?.chats;
    if (
      !chatPagination ||
      activeTab !== "Chats" ||
      loadingOlderPrivateChats ||
      loading ||
      chatPagination.current_page >= chatPagination.last_page ||
      event.currentTarget.scrollTop > 24
    ) {
      return;
    }

    setLoadingOlderPrivateChats(true);
    const previousScrollHeight = event.currentTarget.scrollHeight;

    await handleSingleRecordPageChange(chatPagination.current_page + 1);

    requestAnimationFrame(() => {
      const container = privateChatContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight - previousScrollHeight;
      }
      setLoadingOlderPrivateChats(false);
    });
  };

  const activePagination = useMemo(() => {
    if (!userInfo) return null;

    if (activeTab === "Payments") return userInfo.payments;
    if (activeTab === "Maintenance") return userInfo.maintenance;
    return userInfo.chats;
  }, [activeTab, userInfo]);

  const renderActivePagination = () => {
    if (!activePagination || activePagination.total <= activePagination.per_page) {
      return null;
    }

    return (
      <Pagination
        pagination={{
          currentPage: activePagination.current_page,
          totalPages: activePagination.last_page,
          totalItems: activePagination.total,
          perPage: activePagination.per_page,
        }}
        onPageChange={handleSingleRecordPageChange}
        className="mt-8 mb-4"
      />
    );
  };

  const renderPayments = () => {
    const payments = userInfo?.payments.data || [];

    if (payments.length === 0) {
      return (
        <div className="max-h-screen">
          <p className="text-center font-normal text-[#767676]">
            No payment found
          </p>
          <NotFound />
        </div>
      );
    }

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px] md:min-w-0">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Payment ID
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Description
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Method
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Type
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Status
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    #{payment.id}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[240px]">
                    <div className="truncate">{payment.description || "N/A"}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {payment.payment_method || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {payment.payment_type || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-sm">
                    <span
                      className={
                        payment.status === 1
                          ? "text-[#2E9B2E]"
                          : payment.status === 2
                          ? "text-[#D70E0E]"
                          : "text-[#FF9131]"
                      }
                    >
                      {paymentStatus(payment.status)}
                    </span>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {formatDate(payment.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMaintenance = () => {
    const maintenance = userInfo?.maintenance.data || [];

    if (maintenance.length === 0) {
      return (
        <div className="max-h-screen">
          <p className="text-center font-normal text-[#767676]">
            No maintenance request found
          </p>
          <NotFound />
        </div>
      );
    }

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[760px] md:min-w-0">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Request
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Content
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Priority
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Status
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {maintenance.map((item, index) => (
                <tr
                  key={item.id || index}
                  onClick={() => setSelectedMaintenance(item)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[220px]">
                    <div className="truncate">
                      {item.title || "N/A"}
                    </div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[280px]">
                    <div className="truncate">{item.content || "N/A"}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-[350] ${getPriorityStyle(
                        item.priority,
                      )}`}
                    >
                      {item.priority || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-[350] ${getMaintenanceStatusStyle(
                        item.status,
                      )}`}
                    >
                      {item.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {formatDate(item.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderChats = () => {
    const chats = privateChatMessages;
    const sortedChats = privateChatMessages;
    const visibleUnreadCount = Math.min(openedUnreadCount, sortedChats.length);
    const unreadDividerIndex =
      visibleUnreadCount > 0 ? sortedChats.length - visibleUnreadCount : -1;
    const visibleReadCount = Math.max(sortedChats.length - visibleUnreadCount, 0);

    return (
      <div className="space-y-5">
        {chats.length === 0 ? (
          <div className="max-h-screen">
            <p className="text-center font-normal text-[#767676]">
              No chat found
            </p>
            <NotFound />
          </div>
        ) : (
          <div
            ref={privateChatContainerRef}
            onScroll={handlePrivateChatScroll}
            className="bg-[#F6F6F8] rounded-[24px] p-4 sm:p-5 h-[520px] overflow-y-auto custom-scrollbar"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-[350] text-[#57713A] border border-[#DDEBD0]">
                Read {visibleReadCount.toLocaleString()}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-[350] ${
                  visibleUnreadCount > 0
                    ? "bg-[#D70E0E] text-white"
                    : "bg-white text-[#767676] border border-[#E8E8E8]"
                }`}
              >
                Unread {visibleUnreadCount.toLocaleString()}
              </span>
            </div>
            {userInfo?.chats &&
              userInfo.chats.current_page < userInfo.chats.last_page && (
                <div className="flex justify-center pb-4">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-[350] text-[#767676] border border-[#E8E8E8]">
                    {loadingOlderPrivateChats
                      ? "Loading older messages..."
                      : "Scroll up for older messages"}
                  </span>
                </div>
              )}
            <div className="space-y-4">
              {sortedChats.map((chat, index) => {
                const isUserSender = chat.sender === numericUserId;
                const senderName =
                  `${chat.sender_first_name || ""} ${
                    chat.sender_last_name || ""
                  }`.trim() || (isUserSender ? clientName : "Admin");
                const initials = senderName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div key={chat.id}>
                    {index === unreadDividerIndex && (
                      <div className="flex items-center gap-3 py-2">
                        <div className="h-px flex-1 bg-[#D9D9D9]" />
                        <span className="rounded-full bg-[#D70E0E] px-3 py-1 text-[10px] font-[350] text-white">
                          New unread messages ({visibleUnreadCount})
                        </span>
                        <div className="h-px flex-1 bg-[#D9D9D9]" />
                      </div>
                    )}
                    <div
                      className={`flex gap-3 ${
                        isUserSender ? "justify-start" : "justify-end"
                      }`}
                    >
                      {isUserSender && (
                        <div className="w-8 h-8 rounded-full bg-white text-[#57713A] border border-[#DDEBD0] flex items-center justify-center text-xs font-[350] flex-shrink-0">
                          {initials || "U"}
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] sm:max-w-[68%] ${
                          isUserSender ? "items-start" : "items-end"
                        } flex flex-col`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`font-[350] text-xs ${
                              isUserSender ? "text-[#57713A]" : "text-[#767676]"
                            }`}
                          >
                            {isUserSender ? senderName : "Admin"}
                          </p>
                          <p className="font-[325] text-[10px] text-[#9A9A9A]">
                            {formatDate(chat.created_at)}
                          </p>
                        </div>

                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isUserSender
                              ? "bg-white text-[#272727] rounded-tl-sm border border-[#E8E8E8]"
                              : "bg-[#57713A] text-white rounded-tr-sm"
                          }`}
                        >
                          <p className="font-[325] text-sm leading-6 whitespace-pre-wrap break-words">
                            {chat.message || "N/A"}
                          </p>
                        </div>

                        <p
                          className={`mt-1 text-[10px] font-[325] ${
                            isUserSender ? "text-[#767676]" : "text-[#57713A]"
                          }`}
                        >
                          {isUserSender ? "User" : "Admin reply"}
                        </p>
                      </div>

                      {!isUserSender && (
                        <div className="w-8 h-8 rounded-full bg-[#57713A] text-white flex items-center justify-center text-xs font-[350] flex-shrink-0">
                          A
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSendReply}
          className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
        >
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a reply"
            className="w-full min-h-[82px] rounded-[20px] bg-[#F6F6F8] p-4 text-sm text-dark outline-none resize-none"
          />
          <button
            type="submit"
            disabled={chatLoading || !message.trim()}
            className="bg-[#79B833] hover:bg-[#6aa22c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-full h-[42px] px-6 w-full sm:w-fit flex-shrink-0"
          >
            {chatLoading ? "Sending..." : "Send Reply"}
          </button>
        </form>
      </div>
    );
  };

  if (!Number.isFinite(numericEstateId) || !Number.isFinite(numericUserId)) {
    return (
      <div className="pb-[52px] relative">
        <Header
          title="Estate Client"
          subtitle="Invalid estate client selected"
          history={true}
          showSearchAndButton={false}
        />
      </div>
    );
  }

  const chatTabUnread =
    activeTab === "Chats"
      ? openedUnreadCount
      : userInfo?.estate.unread_count || 0;
  const chatTabLabel =
    chatTabUnread > 0 ? `Chats (${chatTabUnread.toLocaleString()})` : "Chats";
  const activeTableTab = activeTab === "Chats" ? chatTabLabel : activeTab;

  return (
    <div className="pb-[52px] relative">
      <Header
        title={clientName}
        subtitle={userInfo?.estate?.estate_name || "Estate client information"}
        history={true}
        showSearchAndButton={false}
      />

      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Payments"
          value={userInfo?.payments.total || 0}
          change="Client estate payments"
        />
        <MatrixCard
          title="Maintenance"
          value={userInfo?.maintenance.total || 0}
          change="Client maintenance requests"
        />
        <MatrixCard
          title="Chats"
          value={userInfo?.chats.total || 0}
          change="Client estate messages"
        />
        <MatrixCard
          title="Estate Status"
          value={userInfo?.estate.is_operating === 1 ? "Operating" : "Inactive"}
          change="Current estate operation status"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          tabs={["Payments", "Maintenance", chatTabLabel]}
          activeTab={activeTableTab}
          onTabChange={(tab) => setActiveTab(tab.startsWith("Chats") ? "Chats" : tab)}
          showSearchandSort={false}
        >
          {loading ? (
            <LoadingAnimations loading={loading} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : activeTab === "Payments" ? (
            <>
              {renderPayments()}
              {renderActivePagination()}
            </>
          ) : activeTab === "Maintenance" ? (
            <>
              {renderMaintenance()}
              {renderActivePagination()}
            </>
          ) : (
            <>
              {renderChats()}
            </>
          )}
        </ReusableTable>
      </div>

      {selectedPayment && (
        <EstateDetailModal
          isOpen={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
          title="Payment Details"
          subtitle={selectedPayment.description || "Estate payment record"}
          items={paymentDetailItems(selectedPayment)}
        />
      )}

      {selectedMaintenance && (
        <EstateDetailModal
          isOpen={Boolean(selectedMaintenance)}
          onClose={() => setSelectedMaintenance(null)}
          title="Maintenance Details"
          subtitle={
            selectedMaintenance.title ||
            selectedMaintenance.subject ||
            "Estate maintenance request"
          }
          items={maintenanceDetailItems(selectedMaintenance)}
        />
      )}
    </div>
  );
}
