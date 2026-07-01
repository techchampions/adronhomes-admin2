import { FormEvent, UIEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import Pagination from "../../components/Tables/Pagination";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { AppDispatch } from "../../components/Redux/store";
import {
  selectCommunityMessageSendError,
  selectCommunityMessageSendLoading,
  selectCommunityMessages,
  selectCommunityMessagesError,
  selectCommunityMessagesLoading,
  selectEstateGroupConversation,
  selectEstateUsersData,
  selectEstateUsersError,
  selectEstateUsersInfo,
  selectEstateUsersLoading,
  selectEstateUsersMetrics,
  selectEstateUsersPagination,
} from "../../components/Redux/estate/estateSlice";
import {
  fetchCommunityMessages,
  fetchEstateUsers,
  markCommunityMessagesAsRead,
  sendCommunityMessage,
  CommunityMessage,
} from "../../components/Redux/estate/estateThunk";
import EstateUsersTable from "./EstateUsersTable";
import { formatDate } from "../../utils/formatdate";
import AddEstateClientsModal from "./AddEstateClientsModal";

export default function EstateUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const { estateId } = useParams();
  const numericEstateId = Number(estateId);
  const users = useSelector(selectEstateUsersData);
  const estateInfo = useSelector(selectEstateUsersInfo);
  const groupConversation = useSelector(selectEstateGroupConversation);
  const metrics = useSelector(selectEstateUsersMetrics);
  const loading = useSelector(selectEstateUsersLoading);
  const error = useSelector(selectEstateUsersError);
  const pagination = useSelector(selectEstateUsersPagination);
  const communityMessages = useSelector(selectCommunityMessages);
  const communityLoading = useSelector(selectCommunityMessagesLoading);
  const communityError = useSelector(selectCommunityMessagesError);
  const communitySendLoading = useSelector(selectCommunityMessageSendLoading);
  const communitySendError = useSelector(selectCommunityMessageSendError);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Residents");
  const [communityMessage, setCommunityMessage] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [openedGroupUnreadCount, setOpenedGroupUnreadCount] = useState(0);
  const [markedCommunityChannels, setMarkedCommunityChannels] = useState<
    string[]
  >([]);
  const [communityChatMessages, setCommunityChatMessages] = useState<
    CommunityMessage[]
  >([]);
  const [loadingOlderCommunityMessages, setLoadingOlderCommunityMessages] =
    useState(false);
  const communityChatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Number.isFinite(numericEstateId)) {
      dispatch(
        fetchEstateUsers({
          estateId: numericEstateId,
          page: pagination.currentPage,
        }),
      );
    }
  }, [dispatch, numericEstateId, pagination.currentPage]);

  useEffect(() => {
    if (activeTab !== "Community Chat" || !groupConversation?.channel) return;

    dispatch(fetchCommunityMessages({ channel: groupConversation.channel }));
  }, [activeTab, dispatch, groupConversation?.channel]);

  useEffect(() => {
    const messages = communityMessages.messages;
    if (!messages) return;

    setCommunityChatMessages((currentMessages) => {
      const mergedMessages =
        messages.current_page === 1
          ? messages.data
          : [...messages.data, ...currentMessages];
      const uniqueMessages = Array.from(
        new Map(mergedMessages.map((message) => [message.id, message])).values(),
      );

      return uniqueMessages.sort(
        (firstMessage, secondMessage) =>
          new Date(firstMessage.created_at).getTime() -
          new Date(secondMessage.created_at).getTime(),
      );
    });

    if (messages.current_page === 1) {
      requestAnimationFrame(() => {
        const container = communityChatContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  }, [communityMessages.messages]);

  useEffect(() => {
    if (activeTab !== "Community Chat" || !groupConversation?.channel) return;

    const unreadCount =
      communityMessages.conversation?.unread_count ??
      metrics?.admin_group_unread ??
      0;

    if (unreadCount > 0) {
      setOpenedGroupUnreadCount(unreadCount);
    }

    if (
      unreadCount > 0 &&
      !markedCommunityChannels.includes(groupConversation.channel)
    ) {
      dispatch(
        markCommunityMessagesAsRead({ channel: groupConversation.channel }),
      );
      setMarkedCommunityChannels((channels) => [
        ...channels,
        groupConversation.channel,
      ]);
    }
  }, [
    activeTab,
    communityMessages.conversation?.unread_count,
    dispatch,
    groupConversation?.channel,
    markedCommunityChannels,
    metrics?.admin_group_unread,
  ]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return users;

    return users.filter((user) =>
      [
        user.first_name,
        user.last_name,
        user.email,
        user.phone_number,
        `${user.first_name || ""} ${user.last_name || ""}`,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [users, search]);

  const handleCommunityPageChange = async (page: number) => {
    if (!groupConversation?.channel) return;
    await dispatch(
      fetchCommunityMessages({ channel: groupConversation.channel, page }),
    );
  };

  const handleCommunityChatScroll = async (event: UIEvent<HTMLDivElement>) => {
    const messagePagination = communityMessages.messages;

    if (
      !messagePagination ||
      activeTab !== "Community Chat" ||
      loadingOlderCommunityMessages ||
      communityLoading ||
      messagePagination.current_page >= messagePagination.last_page ||
      event.currentTarget.scrollTop > 24
    ) {
      return;
    }

    setLoadingOlderCommunityMessages(true);
    const previousScrollHeight = event.currentTarget.scrollHeight;

    await handleCommunityPageChange(messagePagination.current_page + 1);

    requestAnimationFrame(() => {
      const container = communityChatContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight - previousScrollHeight;
      }
      setLoadingOlderCommunityMessages(false);
    });
  };

  const handleSendCommunityMessage = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!communityMessage.trim() || !Number.isFinite(numericEstateId)) return;

    const result = await dispatch(
      sendCommunityMessage({
        estateId: numericEstateId,
        message: communityMessage.trim(),
      }),
    );

    if (sendCommunityMessage.fulfilled.match(result)) {
      setCommunityMessage("");
    }
  };

  const renderCommunityChat = () => {
    const sortedMessages = communityChatMessages;
    const visibleUnreadCount = Math.min(
      openedGroupUnreadCount,
      sortedMessages.length,
    );
    const visibleReadCount = Math.max(
      sortedMessages.length - visibleUnreadCount,
      0,
    );
    const unreadDividerIndex =
      visibleUnreadCount > 0 ? sortedMessages.length - visibleUnreadCount : -1;

    if (!groupConversation?.channel) {
      return (
        <div className="max-h-screen">
          <p className="text-center font-normal text-[#767676]">
            No community conversation found
          </p>
          <NotFound />
        </div>
      );
    }

    if (communityLoading) {
      return <LoadingAnimations loading={communityLoading} />;
    }

    if (communityError || communitySendError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">
            {communityError || communitySendError}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div
          ref={communityChatContainerRef}
          onScroll={handleCommunityChatScroll}
          className="bg-[#F6F6F8] rounded-[24px] p-4 sm:p-5 h-[560px] overflow-y-auto custom-scrollbar"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="font-[350] text-sm text-dark">
                {communityMessages.conversation?.estate_name ||
                  estateInfo?.estate_name ||
                  "Community Chat"}
              </p>
              <p className="font-[325] text-xs text-[#767676]">
                {communityMessages.conversation?.member_count || users.length}{" "}
                members
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
          </div>
          {communityMessages.messages &&
            communityMessages.messages.current_page <
              communityMessages.messages.last_page && (
              <div className="flex justify-center pb-4">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-[350] text-[#767676] border border-[#E8E8E8]">
                  {loadingOlderCommunityMessages
                    ? "Loading older messages..."
                    : "Scroll up for older messages"}
                </span>
              </div>
            )}

          {sortedMessages.length === 0 ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">
                No community messages found
              </p>
              <NotFound />
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMessages.map((message, index) => {
                const isAdmin = message.user_id === 1;
                const senderName =
                  `${message.first_name || ""} ${message.last_name || ""}`.trim() ||
                  (isAdmin ? "Admin" : "Customer");
                const initials = senderName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div key={message.id}>
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
                        isAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isAdmin && (
                        <div className="w-8 h-8 rounded-full bg-white text-[#57713A] border border-[#DDEBD0] flex items-center justify-center text-xs font-[350] flex-shrink-0">
                          {initials || "C"}
                        </div>
                      )}

                      <div
                        className={`max-w-[78%] sm:max-w-[68%] ${
                          isAdmin ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`font-[350] text-xs ${
                              isAdmin ? "text-[#767676]" : "text-[#57713A]"
                            }`}
                          >
                            {isAdmin ? "ADMIN" : "CUSTOMER"} · {senderName}
                          </p>
                          <p className="font-[325] text-[10px] text-[#9A9A9A]">
                            {formatDate(message.created_at)}
                          </p>
                        </div>

                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isAdmin
                              ? "bg-[#57713A] text-white rounded-tr-sm"
                              : "bg-white text-[#272727] rounded-tl-sm border border-[#E8E8E8]"
                          }`}
                        >
                          <p className="font-[325] text-sm leading-6 whitespace-pre-wrap break-words">
                            {message.message || "N/A"}
                          </p>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="w-8 h-8 rounded-full bg-[#57713A] text-white flex items-center justify-center text-xs font-[350] flex-shrink-0">
                          A
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendCommunityMessage}
          className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
        >
          <textarea
            value={communityMessage}
            onChange={(event) => setCommunityMessage(event.target.value)}
            placeholder="Write a community message"
            className="w-full min-h-[82px] rounded-[20px] bg-[#F6F6F8] p-4 text-sm text-dark outline-none resize-none"
          />
          <button
            type="submit"
            disabled={communitySendLoading || !communityMessage.trim()}
            className="bg-[#79B833] hover:bg-[#6aa22c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-full h-[42px] px-6 w-full sm:w-fit flex-shrink-0"
          >
            {communitySendLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    );
  };

  if (!Number.isFinite(numericEstateId)) {
    return (
      <div className="pb-[52px] relative">
        <Header
          title="Estate Users"
          subtitle="Invalid estate selected"
          history={true}
          showSearchAndButton={false}
        />
      </div>
    );
  }

  return (
    <div className="pb-[52px] relative">
      <Header
        title={estateInfo?.estate_name || "Estate Users"}
        subtitle="View clients attached to this estate"
        history={true}
        buttonText="Add Client to Estate"
        onButtonClick={() => setShowAddClientModal(true)}
      />

      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total Users"
          value={metrics?.total_users || 0}
          change="Clients in this estate"
        />
        <MatrixCard
          title="Private Unread"
          value={metrics?.admin_total_unread || 0}
          change="Private client messages"
        />
        <MatrixCard
          title="Group Unread"
          value={metrics?.admin_group_unread || 0}
          change="Community messages for admin"
        />
        <MatrixCard
          title="Total Unread"
          value={metrics?.total_unread_messages || 0}
          change="All unread estate messages"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          tabs={[
            "Residents",
            metrics?.admin_group_unread
              ? `Community Chat (${metrics.admin_group_unread})`
              : "Community Chat",
          ]}
          activeTab={
            activeTab === "Community Chat" && metrics?.admin_group_unread
              ? `Community Chat (${metrics.admin_group_unread})`
              : activeTab
          }
          onTabChange={(tab) =>
            setActiveTab(tab.startsWith("Community Chat") ? "Community Chat" : tab)
          }
          searchPlaceholder="Search Users"
          onSearch={setSearch}
          showSearchandSort={activeTab === "Residents"}
        >
          {activeTab === "Community Chat" ? (
            renderCommunityChat()
          ) : loading ? (
            <LoadingAnimations loading={loading} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">
                No user found
              </p>
              <NotFound />
            </div>
          ) : (
            <EstateUsersTable data={filteredUsers} estateId={numericEstateId} />
          )}
        </ReusableTable>
      </div>

      <AddEstateClientsModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        estateId={numericEstateId}
        propertySlug={estateInfo?.property_slug}
        estateName={estateInfo?.estate_name}
        onAssigned={() =>
          dispatch(
            fetchEstateUsers({
              estateId: numericEstateId,
              page: pagination.currentPage,
            }),
          )
        }
      />
    </div>
  );
}
