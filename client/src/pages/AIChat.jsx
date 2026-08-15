import "../styles/AIChat.css";
import { useState } from "react";
export default function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSend() {
    if (!message.trim()) return;
    let activeChatId = currentChatId;
    setError("");
    setLoading(true);
    try {
      console.log(message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
      ]);
      if (currentChatId === null) {
        const chatObjects = {
          id: Date.now(),
          title: message,
          messages: [{ sender: "user", text: message }],
        };
        activeChatId = chatObjects.id;
        setChats((prevChats) => [...prevChats, chatObjects]);
        setCurrentChatId(chatObjects.id);
      } else {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === currentChatId) {
              return {
                ...chat,
                messages: [...chat.messages, { sender: "user", text: message }],
              };
            } else {
              return chat;
            }
          }),
        );
      }
      let interactionID;
      const currentChat = chats.find((chat) => chat.id === currentChatId);
      if (currentChat) {
        interactionID = currentChat.interactionID;
      } else {
        interactionID = null;
      }
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          interactionID: interactionID,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: data.message },
      ]);
      setMessage("");

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id == activeChatId) {
            return {
              ...chat,
              interactionID: data.interactionID,
            };
          } else {
            return chat;
          }
        }),
      );
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id == activeChatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: "ai", text: data.message },
              ],
            };
          } else {
            return chat;
          }
        }),
      );
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat() {
    setMessage("");
    setMessages([]);
    setCurrentChatId(null);
  }
  function handleChatId(id) {
    console.log(id);
    const selectedChat = chats.find((chat) => chat.id === id);
    setMessages(selectedChat.messages);
    setCurrentChatId(selectedChat.id);
  }
  return (
    <div className="chat">
      <div className="chatHeader">
        <h1>Nova AI</h1>
        <h2>AI Assistant</h2>
        <button onClick={handleNewChat}> + New Chat</button>
      </div>
      <div className="chatContainer">
        <div className="chatsidebar">
          <h2>Recent Chats</h2>
          {chats.map((chat) => (
            <p
              onClick={() => {
                handleChatId(chat.id);
              }}
              key={chat.id}
            >
              {chat.title}
            </p>
          ))}
        </div>
        <div className="chatsection">
          <div className="chatmessages">
            {messages.map((message, index) => (
              <p
                key={index}
                className={message.sender === "user" ? "userclass" : "aiclass"}
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className="chatinputWrapper">
            <input
              type="text"
              className="chatinput"
              placeholder="Ask Anything ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></input>
            {error ? error : ""}
            <button onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
