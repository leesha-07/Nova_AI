import "../styles/AIChat.css";
import { useState } from "react";
export default function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState[""];
  function handleSend() {
    console.log(message);
  }
  return (
    <div className="chat">
      <div className="chatHeader">
        <h1>Nova AI</h1>
        <h2>AI Assistant</h2>
        <button> + New Chat</button>
      </div>
      <div className="chatContainer">
        <div className="chatsidebar">
          <h2>Recent Chats</h2>
          <p className="chat-item chatactive-chat">💬 Image generate</p>
          <p className="chat-item">💬 Code Correction</p>
          <p className="chat-item">💬 Aadhar update</p>
        </div>
        <div className="chatsection">
          <div className="chatmessages">
            <p>🤖 Hello! How can I help you today?</p>
            <p>👤 Explain React Components.</p>
            <p>🤖 React Components are reusable UI pieces...</p>
            <p>🤖 Hello! How can I help you today?</p>
            <p>👤 Explain React Components.</p>
            <p>🤖 React Components are reusable UI pieces...</p>
            <p>🤖 Hello! How can I help you today?</p>
            <p>👤 Explain React Components.</p>
            <p>🤖 React Components are reusable UI pieces...</p>
            <p>🤖 Hello! How can I help you today?</p>
            <p>👤 Explain React Components.</p>
            <p>🤖 React Components are reusable UI pieces...</p>
          </div>

          <div className="chatinputWrapper">
            <input
              type="text"
              className="chatinput"
              placeholder="Ask Anything ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></input>
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
