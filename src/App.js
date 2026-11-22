import { useRef, useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import HistoryPage from "./pages/HistoryPage";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { saveConversation } from "./utils/conversationStorage";

function App() {
  const [chatKey, setChatKey] = useState(0);
  const [resetError, setResetError] = useState("");
  const currentConversationRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("product-ai-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("product-ai-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === "light" ? "dark" : "light"));
  };

  const handleConversationChange = (conversation) => {
    currentConversationRef.current = conversation;
  };

  const handleNewSuggestion = () => {
    const currentConversation = currentConversationRef.current;

    if (currentConversation?.messages?.length > 0) {
      try {
        saveConversation(currentConversation);
      } catch (error) {
        setResetError(
          "Could not save the current conversation. Please try again.",
        );
        return;
      }
    }

    currentConversationRef.current = null;
    setResetError("");
    setChatKey((previous) => previous + 1);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar onNewSuggestion={handleNewSuggestion} />

        <div className="main-content">
          <Header theme={theme} onToggleTheme={toggleTheme} />

          {resetError && (
            <p role="alert" className="save-status">
              {resetError}
            </p>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <ChatPage
                  key={chatKey}
                  onConversationChange={handleConversationChange}
                />
              }
            />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
