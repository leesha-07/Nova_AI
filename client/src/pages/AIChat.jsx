import "../styles/AIChat.css";

export default function AIChat() {
  return (
    <div className="chat">
      <div className="Header">
        <h1>Nova AI</h1>
        <h3>Ai Chat title</h3>
        <button> + New Chat</button>
      </div>
      <div className="chatContainer">
        <div className="sidebar">
          <h2>Recent Chats</h2>
          <p className="chat-item active-chat">💬 Image generate</p>
          <p className="chat-item">💬 Code Correction</p>
          <p className="chat-item">💬 Aadhar update</p>
        </div>
        <div className="chatsection">
          <div className="messages">
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

          <div className="inputWrapper">
            <input
              type="text"
              className="input"
              placeholder="Ask Anything ..."
            ></input>
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
