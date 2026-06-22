// components/CommunityChat.tsx
import React, { useState } from "react";
import {
  FiSend,
  FiImage,
  FiSmile,
  FiMoreVertical,
} from "react-icons/fi";

interface CommunityChatProps {
  estateId: string;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ estateId }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: "John Doe",
      text: "Welcome to the community.",
      time: "10:30 AM",
      isOnline: true,
    },
    {
      id: "2",
      user: "Jane Smith",
      text: "Has anyone paid the utility bill yet?",
      time: "10:45 AM",
      isOnline: false,
    },
    {
      id: "3",
      user: "Mike Johnson",
      text: "I just did, it was easy through the app.",
      time: "11:00 AM",
      isOnline: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          user: "You",
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOnline: true,
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="h-[600px] flex flex-col bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#79B833] to-[#8FD14F] rounded-full flex items-center justify-center text-white font-bold">
              C
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{estateId}</h3>
              <p className="text-xs text-green-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                247 members online
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiMoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] ${msg.user === "You" ? "order-2" : "order-1"}`}
            >
              <div
                className={`rounded-2xl p-3 ${
                  msg.user === "You"
                    ? "bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <div
                className={`flex items-center mt-1 space-x-2 ${msg.user === "You" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`text-xs ${msg.user === "You" ? "text-gray-400" : "text-gray-400"}`}
                >
                  {msg.time}
                </span>
                {msg.user !== "You" && (
                  <div className="flex items-center space-x-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${msg.isOnline ? "bg-green-500" : "bg-gray-300"}`}
                    ></span>
                    <span className="text-xs text-gray-400">{msg.user}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t bg-white/80 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiImage className="w-5 h-5 text-gray-400" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiSmile className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#79B833] transition-all"
          />
          <button
            type="submit"
            className="p-2.5 bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white rounded-full hover:shadow-lg hover:shadow-[#79B833]/30 transition-all duration-200"
            disabled={!newMessage.trim()}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityChat;
