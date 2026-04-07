import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment/moment";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate, setChats } = useAppContext();
  const [search, setSearch] = useState("");

  const styles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }

    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #555;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #999;
    }

    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .sidebar-animate {
      animation: slideInLeft 0.3s ease-in-out;
    }

    .chat-item-hover:hover {
      box-shadow: 0 4px 12px rgba(164, 86, 247, 0.1);
    }

    .btn-gradient:hover {
      box-shadow: 0 8px 24px rgba(164, 86, 247, 0.3);
      transform: translateY(-2px);
    }

    .btn-gradient:active {
      transform: scale(0.98);
    }

    /* Light mode specific */
    .sidebar-light {
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      border-color: #e5e7eb;
    }

    /* Dark mode specific */
    .sidebar-dark {
      background: linear-gradient(135deg, #1a1625 0%, #0f0a15 100%);
      border-color: #80609f33;
    }

    /* Smooth transition for theme change */
    .sidebar-wrapper {
      transition: background 0.3s ease, border-color 0.3s ease;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div
        className={`flex flex-col h-screen min-w-72 p-6 sidebar-wrapper backdrop-blur-xl transition-all duration-500 max-md:absolute left-0 z-50 border-r ${
          theme === "dark" ? "sidebar-dark" : "sidebar-light"
        } ${!isMenuOpen && "max-md:-translate-x-full"} ${
          isMenuOpen && "max-md:sidebar-animate"
        }`}
      >
        {/* Logo Section */}
        <div className="mb-8">
          <img
            src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
            alt="Logo"
            className="w-full max-w-44 object-contain transition-all duration-300"
          />
        </div>

        {/* New Chat Button */}
       <button
  onClick={() => {
    const newChat = {
      _id: Date.now(),
      messages: [],
      updatedAt: new Date()
    };

    setChats((prev) => [newChat, ...prev]);
    setSelectedChat(newChat);
  }}
  className="flex justify-center items-center w-full py-3 px-4 mb-6 text-white text-sm font-semibold bg-gradient-to-r from-[#A456F7] via-[#8B5CF6] to-[#3D81F6] rounded-lg cursor-pointer transition-all duration-300 btn-gradient"
>
  <span className="mr-2 text-lg">+</span>
  New Chat
</button>

        {/* Search Box */}
        <div
          className={`flex items-center gap-3 px-4 py-3 mb-6 border rounded-lg backdrop-blur-sm transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/5 border-white/10 hover:border-purple-500/40"
              : "bg-white border-gray-300 hover:border-purple-400"
          }`}
        >
          <img
            src={assets.search_icon}
            className={`w-4 h-4 opacity-60 ${theme === "dark" ? "invert" : ""}`}
            alt="Search"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className={`flex-1 bg-transparent text-sm placeholder:text-gray-400 outline-none transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        {/* Recent Chats Section */}
        {chats.length > 0 && (
          <p
            className={`text-xs font-semibold uppercase tracking-wide mb-3 px-2 transition-colors duration-300 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Recent Chats
          </p>
        )}

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-2 pr-2 custom-scrollbar">
          {chats
           .filter((chat) => {
  const firstMessage = chat.messages?.[0]?.content || "";
  const chatName = chat.name || "";

  return (
    firstMessage.toLowerCase().includes(search.toLowerCase()) ||
    chatName.toLowerCase().includes(search.toLowerCase())
  );
})
            .map((chat) => (
              <div
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                key={chat._id}
                className={`p-3 px-4 border rounded-lg cursor-pointer transition-all duration-300 group chat-item-hover ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate transition-colors duration-300 ${
                        theme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {chat.messages.length > 0
                        ? chat.messages[0].content.slice(0, 32)
                        : chat.name}
                    </p>
                    <p
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {moment(chat.updatedAt).fromNow()}
                    </p>
                  </div>
                  <img
                    src={assets.bin_icon}
                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-2 cursor-pointer hover:scale-110 ${
                      theme === "dark" ? "invert" : ""
                    }`}
                    alt="Delete"
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Community Images */}
        <div
          onClick={() => {
            navigate("/community");
            setIsMenuOpen(false);
          }}
          className={`flex items-center gap-3 p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-300 group ${
            theme === "dark"
              ? "border-white/10 hover:bg-white/5"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          <img
            src={assets.gallery_icon}
            className={`w-5 h-5 group-hover:scale-110 transition-transform ${
              theme === "dark" ? "invert" : ""
            }`}
            alt="Gallery"
          />
          <div className="flex flex-col flex-1">
            <p
              className={`text-sm font-medium transition-colors duration-300 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Community Images
            </p>
            <p
              className={`text-xs transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Explore community
            </p>
          </div>
        </div>

        {/* Credits */}
        <div
          onClick={() => {
            navigate("/credits");
            setIsMenuOpen(false);
          }}
          className={`flex items-center gap-3 p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-300 group ${
            theme === "dark"
              ? "border-white/10 hover:bg-white/5"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          <img
            src={assets.diamond_icon}
            className={`w-5 h-5 group-hover:scale-110 transition-transform ${
              theme === "dark" ? "invert" : ""
            }`}
            alt="Credits"
          />
          <div className="flex flex-col flex-1">
            <p
              className={`text-sm font-semibold transition-colors duration-300 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Credits: {user?.credits || 0}
            </p>
            <p
              className={`text-xs transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Purchase to continue
            </p>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div
          className={`flex items-center justify-between p-4 mb-3 border rounded-lg transition-all duration-300 ${
            theme === "dark"
              ? "border-white/10"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={assets.theme_icon}
              className={`w-5 h-5 ${theme === "dark" ? "invert" : ""}`}
              alt="Theme"
            />
            <p
              className={`text-sm font-medium transition-colors duration-300 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Dark Mode
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer">
            <input
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
            />
            <div
              className={`w-10 h-6 rounded-full transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-purple-600"
                  : "bg-gray-300"
              }`}
            ></div>
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                theme === "dark" ? "translate-x-4" : ""
              }`}
            ></span>
          </label>
        </div>

        {/* User Account */}
        <div
          className={`flex items-center gap-3 p-4 border rounded-lg group cursor-pointer transition-all duration-300 ${
            theme === "dark"
              ? "border-white/10 hover:bg-white/5"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          <img
            src={assets.user_icon}
            className="w-8 h-8 rounded-full object-cover"
            alt="User"
          />
          <p
            className={`flex-1 text-sm font-medium truncate transition-colors duration-300 ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {user ? user.name : "Login to account"}
          </p>
          {user && (
            <img
              src={assets.logout_icon}
              className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:scale-110 ${
                theme === "dark" ? "invert" : ""
              }`}
              alt="Logout"
            />
          )}
        </div>

        {/* Close Button Mobile */}
        <img
          onClick={() => setIsMenuOpen(false)}
          src={assets.close_icon}
          className={`absolute top-5 right-5 w-5 h-5 cursor-pointer md:hidden ${
            theme === "dark" ? "invert" : ""
          }`}
          alt="Close"
        />
      </div>
    </>
  );
};

export default Sidebar;
