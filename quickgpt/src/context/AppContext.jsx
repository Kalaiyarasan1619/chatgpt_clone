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

 const fetchUsersChats = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/chat/history");
    const data = await res.json();

    const initialChat = {
      _id: 1,
      messages: data.flatMap(chat => [
        { role: "user", content: chat.message },
        { role: "assistant", content: chat.response }
      ]),
      updatedAt: new Date()
    };

    setChats([initialChat]);
    setSelectedChat(initialChat);

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
  if (user && chats.length === 0) {
    fetchUsersChats();
  }
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
    theme,
    setTheme,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
