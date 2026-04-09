import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]); 
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const fetchUser = async () => {
    setUser(dummyUserData);
  };

  const normalizePageId = (v) => {
    const n =
      typeof v === "number" && Number.isFinite(v)
        ? Math.trunc(v)
        : parseInt(String(v ?? ""), 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  };

  const mapApiChatRowToClient = (chat) => {
    const id = chat?.id ?? chat?.chat_id;
    const pageRaw = chat?.pageId ?? chat?.page_id;
    return {
      _id: id != null ? Number(id) : Date.now(),
      pageId: normalizePageId(pageRaw),
      messages: [
        { role: "user", content: String(chat?.message ?? "") },
        { role: "assistant", content: String(chat?.response ?? "") },
      ],
      updatedAt: new Date(),
    };
  };

  const mergeApiRowsToThread = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const sorted = [...rows].sort((a, b) => Number(a.id) - Number(b.id));
    const messages = sorted.flatMap((r) => [
      { role: "user", content: r.message ?? "" },
      { role: "assistant", content: r.response ?? "" },
    ]);
    const last = sorted[sorted.length - 1];
    return {
      _id: last.id,
      pageId: normalizePageId(last.pageId),
      messages,
      updatedAt: new Date(),
    };
  };

  /** Loads full DB thread for a page_id (all turns). */
  const loadThreadByPageId = async (pageId) => {
    const pid = normalizePageId(pageId);
    try {
      const res = await fetch(`http://localhost:8080/api/chat/page/${pid}`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data) || data.length === 0) return null;
      return mergeApiRowsToThread(data);
    } catch {
      return null;
    }
  };

  const fetchUsersChats = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/chat/recent");
      const data = await res.json();
      if (!res.ok) {
        console.error("Error loading recent chats:", data);
        return;
      }
      if (!Array.isArray(data)) {
        console.error("Recent chats is not an array:", data);
        return;
      }

      const mappedChats = data.map(mapApiChatRowToClient);

      setChats(mappedChats);
      setSelectedChat(mappedChats[0] || null);
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };

  useEffect(() => {
    if(theme === 'dark'){
        document.documentElement.classList.add('dark');
    }else{
        document.documentElement.classList.remove('dark');
    }
  },[theme])

  useEffect(() => {
    if (!user) return;
    fetchUsersChats();
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    loadThreadByPageId,
    theme,
    setTheme,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
