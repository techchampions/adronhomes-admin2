// components/CommunityChat.tsx
import React, { useState } from "react";

interface CommunityChatProps {
  estateId: string;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ estateId }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: "John Doe",
      text: "Welcome to the community!",
      time: "10:30 AM",
    },
    {
      id: "2",
      user: "Jane Smith",
      text: "Has anyone paid the utility bill yet?",
      time: "10:45 AM",
    },
    {
      id: "3",
      user: "Mike Johnson",
      text: "I just did, it was easy through the app.",
      time: "11:00 AM",
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
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
      <div className="p-4 border-b bg-[#79B833]/5 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800">
          Community Chat - {estateId}
        </h3>
        <p className="text-sm text-gray-500">General community messaging</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] ${msg.user === "You" ? "bg-[#79B833] text-white" : "bg-gray-100"} rounded-lg p-3`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`text-sm font-medium ${msg.user === "You" ? "text-white" : "text-gray-700"}`}
                >
                  {msg.user}
                </span>
                <span
                  className={`text-xs ${msg.user === "You" ? "text-white/70" : "text-gray-500"}`}
                >
                  {msg.time}
                </span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79B833]"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#79B833] text-white rounded-lg hover:bg-[#79B833]/90 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityChat;
