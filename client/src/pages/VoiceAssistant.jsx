import "../styles/VoiceAssistant.css";
export default function VoiceAssistant() {
  return (
    <div className="voiceassistant">
      <div className="voiceHeader">
        <h1>Nova AI</h1>
        <h2>Voice Assistant</h2>
        <button>+ New Conversation</button>
      </div>
      <div className="voicemainContainer">
        <div className="Microphonesection">
          <button>🎤</button>
          <h3>Status</h3>

          <p>● Idle 🟢 Listening 🔴 Microphone Off</p>
          <div className="statusCircle"></div>
        </div>
        <div className="Transcriptsection">
          <h2>Transcript</h2>
          <textarea rows={8} placeholder="Your Thought...."></textarea>
        </div>
      </div>
      <div className="aiResponse">
        <h2>Nova Ai response</h2>
        <p>🤖 Nova AI </p>
        <p>--------------------------------</p>
        <p> Hello Leesha! I'm ready whenever you start speaking.</p>
        <p>--------------------------------</p>
      </div>
      <div className="voicebottombuttons">
        <button>🎤 Start</button>
        <button>⏹ Stop </button>
        <button> 🗑 Clear</button>
      </div>
    </div>
  );
}
