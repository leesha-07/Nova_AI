import "../styles/VoiceAssistant.css";
export default function VoiceAssistant() {
  return (
    <div className="voiceassistant">
      <div className="Header">
        <h1>Nova AI</h1>
        <h2>Voice Assistant</h2>
        <button>+ New Conversation</button>
      </div>
      <div className="mainContainer">
        <div className="Microphonesection">
          <button>🎤</button>
          <p>Listening Status</p>
          <p>Click the microphone to start talking</p>
          <div className="statusCircle"></div>
        </div>
        <div className="Transcriptsection">
          <p>Transcript</p>
          <textarea rows={8} placeholder="Your Thought...."></textarea>
        </div>
        <div className="aiResponse">
          <p>Nova Ai response</p>
          <p>Nova AI response will appear here...</p>
        </div>
        <div className="bottombuttons">
          <button>Start listening</button>
          <button>Stop listening</button>
          <button>clear</button>
        </div>
      </div>
    </div>
  );
}
