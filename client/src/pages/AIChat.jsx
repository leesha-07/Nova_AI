import "../styles/AIChat.css";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingChatId, setLoadingChatId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getChats() {
      try {
        const userId = localStorage.getItem("userId");

        const response = await fetch(
          `http://localhost:5000/api/chat-history/${userId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();

        console.log("CHAT HISTORY:", data);

        setChats(data.chats);
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    }

    getChats();
  }, []);

  async function handleSend() {
    if (!message.trim()) return;

    const userId = localStorage.getItem("userId");

    setMessage("");

    const sendingChatId = currentChatId;

    setError("");
    setLoading(true);
    setLoadingChatId(currentChatId);

    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "user",
          text: message,
        },
      ]);

      let interactionID;

      const currentChat = chats.find((chat) => chat._id === sendingChatId);

      if (currentChat) {
        interactionID = currentChat.interactionID;
      } else {
        interactionID = null;
      }

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          message: message,
          interactionID: interactionID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();

      const newMessage = [
        {
          sender: "user",
          text: message,
        },
        {
          sender: "ai",
          text: data.message,
        },
      ];

      if (sendingChatId === null) {
        const chatHistoryResponse = await fetch(
          "http://localhost:5000/api/chat-history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              title: message,
              messages: newMessage,
              interactionID: data.interactionID,
            }),
          },
        );

        if (!chatHistoryResponse.ok) {
          console.log("Failed to save chat history");
        } else {
          const chatData = await chatHistoryResponse.json();

          setCurrentChatId(chatData.newChat._id);

          setChats((previousChats) => [...previousChats, chatData.newChat]);
        }
      } else {
        const updateResponse = await fetch(
          "http://localhost:5000/api/chat-history/" + sendingChatId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: newMessage,
              interactionID: data.interactionID,
            }),
          },
        );

        if (!updateResponse.ok) {
          console.log("Failed to update chat");
        } else {
          setChats((previousChats) =>
            previousChats.map((chat) => {
              if (chat._id === currentChatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, ...newMessage],
                  interactionID: data.interactionID,
                };
              }

              return chat;
            }),
          );
        }
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          text: data.message,
        },
      ]);
    } catch (error) {
      console.log("Chat error:", error);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
      setLoadingChatId(null);
    }
  }

  function handleNewChat() {
    setMessage("");
    setMessages([]);
    setCurrentChatId(null);
    setError("");
  }

  function handleChatId(id) {
    const selectedChat = chats.find((chat) => chat._id === id);

    if (!selectedChat) return;

    setMessages(selectedChat.messages);
    setCurrentChatId(selectedChat._id);
    setError("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat">
      {/* HEADER */}
      <div className="chatHeader">
        <div className="chatLogo">
          <span>✨</span>
          Nova AI
        </div>

        <h2>AI Assistant</h2>

        <button className="chatNewButton" onClick={handleNewChat}>
          + New Chat
        </button>
      </div>

      {/* MAIN */}
      <div className="chatContainer">
        {/* RECENT CHATS */}
        <div className="chatsidebar">
          <h2>Recent Chats</h2>

          {chats.length === 0 ? (
            <p className="noChats">No conversations yet</p>
          ) : (
            chats.map((chat) => (
              <p
                key={chat._id}
                className={currentChatId === chat._id ? "activeChat" : ""}
                onClick={() => handleChatId(chat._id)}
              >
                {chat.title}
              </p>
            ))
          )}
        </div>

        {/* CHAT */}
        <div className="chatsection">
          <div className="chatmessages">
            {messages.length === 0 && (
              <div className="chatWelcome">
                <div className="chatWelcomeIcon">✨</div>

                <h3>Welcome to Nova AI</h3>

                <p>Ask me anything or tell me what you need help with.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={message.sender === "user" ? "userclass" : "aiclass"}
              >
                {message.sender === "ai" ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  message.text
                )}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="chatinputWrapper">
            <input
              type="text"
              className="chatinput"
              placeholder="Ask Nova AI anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={handleSend}
              disabled={loading && loadingChatId === currentChatId}
            >
              {loading && loadingChatId === currentChatId
                ? "Sending..."
                : "Send"}
            </button>

            {error && <span className="chatError">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
