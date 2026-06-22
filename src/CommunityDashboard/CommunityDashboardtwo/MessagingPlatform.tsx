// components/MessagingPlatform.tsx
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMoreVertical,
  FiCheck,
  FiUser,
  FiImage,
  FiArrowLeft,
} from "react-icons/fi";

interface MessageThread {
  id: string;
  name: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
  read: boolean;
  type?: "text" | "image";
}

const MessagingPlatform: React.FC = () => {
  const [threads] = useState<MessageThread[]>([
    {
      id: "1",
      name: "John Doe",
      property: "Lekki Phase 1 - Villa 3",
      lastMessage: "When is the next meeting?",
      time: "2h ago",
      unread: 2,
      avatar: "JD",
      online: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      property: "Banana Island - Apartment 5B",
      lastMessage: "I got the payment confirmation",
      time: "5h ago",
      unread: 0,
      avatar: "JS",
      online: false,
    },
    {
      id: "3",
      name: "Mike Johnson",
      property: "Victoria Island - Land Plot 12",
      lastMessage: "The surveyor is coming tomorrow",
      time: "1d ago",
      unread: 1,
      avatar: "MJ",
      online: true,
    },
    {
      id: "4",
      name: "Sarah Williams",
      property: "Lekki Phase 2 - Apartment 7A",
      lastMessage: "Thanks for the update!",
      time: "2d ago",
      unread: 0,
      avatar: "SW",
      online: false,
    },
  ]);

  const [selectedThread, setSelectedThread] = useState<string | null>("1");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "John Doe",
      text: "Hello, I have a question about the property.",
      time: "10:30 AM",
      isOwn: false,
      read: true,
    },
    {
      id: "2",
      sender: "You",
      text: "Sure, what would you like to know?",
      time: "10:32 AM",
      isOwn: true,
      read: true,
    },
    {
      id: "3",
      sender: "John Doe",
      text: "When is the next community meeting?",
      time: "10:35 AM",
      isOwn: false,
      read: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showThreads, setShowThreads] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedThread) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          sender: "You",
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: true,
          read: true,
        },
      ]);
      setNewMessage("");
    }
  };

  const filteredThreads = threads.filter(
    (thread) =>
      thread.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.property.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedThreadData = threads.find((t) => t.id === selectedThread);

  const handleThreadSelect = (threadId: string) => {
    setSelectedThread(threadId);
    if (isMobile) {
      setShowThreads(false);
    }
  };

  const handleBackToThreads = () => {
    setShowThreads(true);
  };

  return (
    <div className="h-[600px] flex bg-white rounded-2xl border border-gray-100 overflow-hidden relative">
      {/* Thread List */}
      <div
        className={`
          flex flex-col border-r border-gray-100 bg-white
          ${
            isMobile
              ? `absolute inset-0 z-20 transition-transform duration-300 ease-in-out ${showThreads ? "translate-x-0" : "-translate-x-full"}`
              : "relative w-80 flex-shrink-0"
          }
        `}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => handleThreadSelect(thread.id)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                selectedThread === thread.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#79B833] to-[#8FD14F] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {thread.avatar}
                  </div>
                  {thread.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {thread.name}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {thread.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {thread.property}
                  </p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {thread.lastMessage}
                  </p>
                </div>
                {thread.unread > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 bg-[#79B833] rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {thread.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center space-x-3 min-w-0">
                {isMobile && (
                  <button
                    onClick={handleBackToThreads}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                  >
                    <FiArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#79B833] to-[#8FD14F] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {selectedThreadData?.avatar}
                  </div>
                  {selectedThreadData?.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {selectedThreadData?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate hidden sm:block">
                    {selectedThreadData?.property}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                <FiMoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] ${msg.isOwn ? "order-2" : "order-1"}`}
                  >
                    <div
                      className={`rounded-2xl p-3 ${
                        msg.isOwn
                          ? "bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                    </div>
                    <div
                      className={`flex items-center mt-1 space-x-1.5 ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <span className="text-xs text-gray-400">{msg.time}</span>
                      {msg.isOwn &&
                        (msg.read ? (
                          <FiCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <FiCheck className="w-3 h-3 text-gray-400" />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-100 bg-white"
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiPaperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:inline-flex"
                  >
                    <FiImage className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:inline-flex"
                  >
                    <FiSmile className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#79B833] transition-all text-sm min-w-0"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white rounded-full hover:shadow-lg hover:shadow-[#79B833]/30 transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newMessage.trim()}
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FiUser className="w-12 h-12 text-gray-300 mb-3" />
            <p className="font-medium text-gray-500">Select a conversation</p>
            <p className="text-sm">Choose a thread to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPlatform;
