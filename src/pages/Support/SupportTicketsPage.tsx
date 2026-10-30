import { useEffect, useState } from "react";
import Header from "../../general/Header";
import {
  fetchSupportTicket,
  fetchSupportTickets,
  replyToSupportTicket,
  setSupportTicketStatus,
  SupportTicket,
  TicketMessage,
  TicketStatus,
} from "./supportTicketsApi";

function when(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function personName(user?: { first_name?: string; last_name?: string; email?: string } | null) {
  const name = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
  return name || user?.email || "Customer";
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadList = async () => {
    const rows = await fetchSupportTickets();
    setTickets(rows);
    return rows;
  };

  useEffect(() => {
    let active = true;
    loadList()
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load tickets");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setTicket(null);
      return;
    }
    let active = true;
    setTicket(null);
    setThreadLoading(true);
    fetchSupportTicket(selectedId)
      .then((row) => {
        if (active) setTicket(row);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load this ticket");
      })
      .finally(() => {
        if (active) setThreadLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  const send = async () => {
    if (!ticket || !message.trim()) return;
    setSending(true);
    setError("");
    try {
      const updated = await replyToSupportTicket(ticket.id, message.trim());
      setTicket(updated);
      setMessage("");
      await loadList();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Could not send the reply");
    } finally {
      setSending(false);
    }
  };

  const toggleStatus = async () => {
    if (!ticket) return;
    setSending(true);
    setError("");
    try {
      const next = ticket.status === "open" ? "closed" : "open";
      const updated = await setSupportTicketStatus(ticket.id, next);
      setTicket(updated);
      await loadList();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Could not update the ticket");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pb-14">
      <Header
        title="Support tickets"
        subtitle="Reply to customers and close tickets when the issue is resolved."
        showSearchAndButton={false}
      />

      <div className="px-4 lg:pl-[38px] lg:pr-[68px]">
        {error && (
          <div className="mb-4 rounded-[24px] bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
        )}
        {loading ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
            Loading tickets
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
            No support tickets yet.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
            <div className="space-y-2">
              {tickets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-[24px] border bg-white p-4 text-left ${
                    selectedId === item.id ? "border-[#79B833]" : "border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-[#032147]">{item.subject}</p>
                    <Status status={item.status} />
                  </div>
                  <p className="mt-1 text-sm text-[#767676]">{personName(item.user)}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#888888]">
                    {item.latest_message?.body || "No messages yet"}
                  </p>
                </button>
              ))}
            </div>

            {!ticket && !threadLoading && (
              <div className="flex min-h-80 items-center justify-center rounded-[28px] bg-white text-sm text-[#767676]">
                Select a ticket to reply.
              </div>
            )}
            {threadLoading && (
              <div className="flex min-h-80 items-center justify-center rounded-[28px] bg-white text-sm text-[#767676]">
                Loading ticket
              </div>
            )}
            {ticket && !threadLoading && (
              <div className="flex min-h-80 flex-col rounded-[28px] bg-white">
                <div className="flex items-start justify-between gap-3 border-b border-[#F0F0F0] px-5 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#032147]">{ticket.subject}</h2>
                    <p className="mt-1 text-sm text-[#767676]">
                      {personName(ticket.user)}
                      {ticket.user?.email ? ` · ${ticket.user.email}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={sending}
                    onClick={toggleStatus}
                    className="h-10 shrink-0 rounded-full border border-[#79B833] px-4 text-sm font-semibold text-[#79B833]"
                  >
                    {ticket.status === "open" ? "Close ticket" : "Reopen ticket"}
                  </button>
                </div>
                <div className="flex-1 space-y-3 px-5 py-4">
                  {(ticket.messages || []).map((item) => (
                    <Bubble key={item.id} message={item} />
                  ))}
                </div>
                {ticket.status === "open" && (
                  <form
                    className="border-t border-[#F0F0F0] p-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      send();
                    }}
                  >
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={3}
                      placeholder="Reply as support"
                      className="w-full rounded-2xl border border-[#E6E6E6] px-4 py-3 text-sm outline-none focus:border-[#79B833]"
                    />
                    <button
                      type="submit"
                      disabled={sending || !message.trim()}
                      className="mt-3 h-11 rounded-full bg-[#032147] px-5 text-sm font-semibold text-white disabled:bg-gray-200"
                    >
                      {sending ? "Sending..." : "Send reply"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Bubble({ message }: { message: TicketMessage }) {
  const fromSupport = message.author_role === "support";
  return (
    <div className={`flex ${fromSupport ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          fromSupport ? "bg-[#032147] text-white" : "bg-[#79B833]/10 text-[#032147]"
        }`}
      >
        <p className={`text-xs font-semibold ${fromSupport ? "text-white/70" : "text-[#5d8f24]"}`}>
          {fromSupport ? "Support" : personName(message.author)}
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.body}</p>
        <p className={`mt-2 text-xs ${fromSupport ? "text-white/60" : "text-[#888888]"}`}>
          {when(message.created_at)}
        </p>
      </div>
    </div>
  );
}

function Status({ status }: { status: TicketStatus }) {
  const open = status === "open";
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
        open ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {open ? "Open" : "Closed"}
    </span>
  );
}
