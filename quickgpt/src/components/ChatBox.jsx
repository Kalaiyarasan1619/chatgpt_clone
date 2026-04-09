import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const TypingDots = () => (
  <div className="flex items-end gap-3 px-2">
    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0 border border-violet-200 dark:border-violet-700">
      <svg
        className="w-4 h-4 text-violet-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
      </svg>
    </div>
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-sm px-5 py-3.5 flex gap-1.5 items-center shadow-sm">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-500 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  </div>
);

const EmptyState = ({ theme }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-5 select-none py-10">
    <div className="relative">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
        <img
          src={assets.logo_full || "/logo.svg"}
          alt="logo"
          className="w-10 h-10 object-contain brightness-0 invert"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <svg
          className="w-10 h-10 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-900 animate-pulse" />
    </div>
    <div className="text-center space-y-2">
      <p className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight">
        Ask me anything
      </p>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs">
        I'm here to help — try typing a question below
      </p>
    </div>
    <div className="flex flex-wrap gap-2 justify-center max-w-sm mt-2">
      {[
        "✨ Explain quantum physics",
        "🎨 Design ideas",
        "💡 Write code for me",
      ].map((s) => (
        <span
          key={s}
          className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
        >
          {s}
        </span>
      ))}
    </div>
  </div>
);

const normalizePageId = (v) => {
  const n =
    typeof v === "number" && Number.isFinite(v)
      ? Math.trunc(v)
      : parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

const ChatBox = () => {
 const { chats, setChats, selectedChat, setSelectedChat, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const [focused, setFocused] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !selectedChat) return;
    setLoading(true); // ✅
    const resolvedPageId = normalizePageId(selectedChat?.pageId);

   const userMessage = { role: "user", content: prompt, timestamp: new Date() };

setMessages((prev) => {
  const updated = [...prev, userMessage];

  const updatedChat = {
    ...selectedChat,
    messages: updated,
    updatedAt: new Date(),
    pageId: resolvedPageId,
  };

  setSelectedChat(updatedChat);

  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat._id === selectedChat._id ? updatedChat : chat
    )
  );

  return updated;
});

   try {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: prompt,
      pageId: resolvedPageId,
    }),
  });

  const data = await res.json(); // ✅ THIS WAS MISSING

  const aiMessage = {
    role: "assistant",
    content: data.reply,
    timestamp: new Date(),
  };

  setMessages((prev) => {
    const updatedMessages = [...prev, aiMessage];

    const updatedChat = {
      ...selectedChat,
      messages: updatedMessages,
      updatedAt: new Date(),
      pageId: resolvedPageId,
    };

    setSelectedChat(updatedChat);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === selectedChat._id ? updatedChat : chat
      )
    );

    return updatedMessages;
  });

} catch (error) {
  console.error("Error:", error);
}
    setPrompt("");   // ✅

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 max-md:mt-14">
      {/* ── TOP HEADER BAR ── */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-200 dark:shadow-violet-900/30">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-white leading-none">
              AI Assistant
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-500 font-medium">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Mode toggle pills */}
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
          {["text", "image"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 capitalize ${
                mode === m
                  ? "bg-white dark:bg-zinc-700 text-violet-600 dark:text-violet-400 shadow-sm"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {m === "text" ? "💬 Text" : "🖼️ Image"}
            </button>
          ))}
        </div>
      </div>

      {/* ── MESSAGES AREA ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 xl:px-24 2xl:px-48 py-6 space-y-5 scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(139,92,246,0.3) transparent",
        }}
      >
        {messages.length === 0 ? (
          <EmptyState theme={theme} />
        ) : (
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        )}

        {loading && <TypingDots />}
      </div>

      {/* ── BOTTOM INPUT SECTION ── */}
      <div className="flex-shrink-0 px-4 sm:px-8 xl:px-24 2xl:px-48 pb-6 pt-3 bg-zinc-50 dark:bg-zinc-950">
        {/* Publish toggle for image mode */}
        {mode === "image" && (
          <div className="flex items-center gap-2 mb-3 px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => setIsPublished((p) => !p)}
                className={`relative w-9 h-5 rounded-full transition-all duration-300 ${
                  isPublished ? "bg-violet-500" : "bg-zinc-300 dark:bg-zinc-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    isPublished ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                Publish to community
              </span>
            </label>
          </div>
        )}

        {/* Input bar */}
        <form onSubmit={onSubmit}>
          <div
            className={`flex items-center gap-3 bg-white dark:bg-zinc-900 border rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
              focused
                ? "border-violet-400 dark:border-violet-600 shadow-violet-100 dark:shadow-violet-900/20 shadow-md"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            {/* Mode chip */}
            <div className="flex-shrink-0">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 rounded-lg px-2 py-1 outline-none cursor-pointer appearance-none"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 flex-shrink-0" />

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              placeholder={
                mode === "image"
                  ? "Describe the image you want..."
                  : "Type your message..."
              }
              className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            {/* Send / Stop button */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                loading
                  ? "bg-red-100 dark:bg-red-900/30 text-red-500 cursor-not-allowed"
                  : prompt.trim()
                    ? "bg-violet-500 hover:bg-violet-600 active:scale-95 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30 cursor-pointer"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Hint text */}
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-2.5">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-700">
              Enter
            </kbd>{" "}
            to send
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
