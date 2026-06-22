// components/MessagingPlatform.tsx
import React, { useState } from "react";

interface MessageThread {
  id: string;
  name: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
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
    },
    {
      id: "2",
      name: "Jane Smith",
      property: "Banana Island - Apartment 5B",
      lastMessage: "I got the payment confirmation",
      time: "5h ago",
      unread: 0,
    },
    {
      id: "3",
      name: "Mike Johnson",
      property: "Victoria Island - Land Plot 12",
      lastMessage: "The surveyor is coming tomorrow",
      time: "1d ago",
      unread: 1,
    },
  ]);

  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "John Doe",
      text: "Hello, I have a question about the property.",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      text: "Sure, what would you like to know?",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: "3",
      sender: "John Doe",
      text: "When is the next community meeting?",
      time: "10:35 AM",
      isOwn: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

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
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] flex">
      {/* Thread List */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Messages</h3>
          <p className="text-sm text-gray-500">
            Direct property communications
          </p>
        </div>
        <div className="divide-y">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                selectedThread === thread.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{thread.name}</p>
                  <p className="text-sm text-gray-500">{thread.property}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {thread.lastMessage}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{thread.time}</p>
                  {thread.unread > 0 && (
                    <span className="inline-block mt-1 px-2 py-1 bg-[#79B833] text-white text-xs rounded-full">
                      {thread.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <div className="p-4 border-b bg-gray-50">
              <p className="font-semibold text-gray-800">
                {threads.find((t) => t.id === selectedThread)?.name}
              </p>
              <p className="text-sm text-gray-500">
                {threads.find((t) => t.id === selectedThread)?.property}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] ${msg.isOwn ? "bg-[#79B833] text-white" : "bg-gray-100"} rounded-lg p-3`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${msg.isOwn ? "text-white/70" : "text-gray-500"}`}
                    >
                      {msg.time}
                    </p>
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPlatform;
