import "../styles/VoiceAssistant.css";
import { useState, useEffect, useRef } from "react";

export default function VoiceAssistant() {
  const userId = localStorage.getItem("userId");

  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState([]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    async function getVoiceHistory() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/voice/user/${userId}`,
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setVoiceHistory(data.voice);
      } catch (error) {
        console.error("Failed to get voice history:", error);
      }
    }

    if (userId) {
      getVoiceHistory();
    }
  }, [userId]);

  async function saveVoiceConversation(command, aiResponse) {
    if (!userId || !command || !aiResponse) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          command: command,
          response: aiResponse,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setVoiceHistory((previous) => [data.voice, ...previous]);
    } catch (error) {
      console.error("Failed to save voice conversation:", error);
    }
  }

  async function deleteVoiceConversation(voiceId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/voice/${voiceId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setVoiceHistory((previous) =>
        previous.filter((voice) => voice._id !== voiceId),
      );
    } catch (error) {
      console.error("Failed to delete voice conversation:", error);
    }
  }

  function startListening() {
    if (listening || thinking || speaking) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setTranscript(text);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Could not start speech recognition:", error);

      setListening(false);
      recognitionRef.current = null;
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setListening(false);
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  async function askVoiceAI() {
    if (!transcript.trim()) {
      return;
    }

    if (thinking || listening) {
      return;
    }

    stopSpeaking();

    const currentTranscript = transcript;

    try {
      setThinking(true);
      setResponse("");

      const response = await fetch("http://localhost:5000/api/voice/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          message: currentTranscript,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        setResponse(data.message || "Something went wrong.");
        return;
      }

      setResponse(data.message);

      await saveVoiceConversation(currentTranscript, data.message);

      const speech = new SpeechSynthesisUtterance(data.message);

      speech.lang = "en-US";

      speech.onstart = () => {
        setSpeaking(true);
      };

      speech.onend = () => {
        setSpeaking(false);
      };

      speech.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setSpeaking(false);
      };

      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error("Voice AI request failed:", error);

      setResponse("Something went wrong. Try again.");
    } finally {
      setThinking(false);
    }
  }

  function clearConversation() {
    stopListening();
    stopSpeaking();

    setTranscript("");
    setResponse("");
    setThinking(false);
  }

  const statusText = listening
    ? "Listening..."
    : thinking
      ? "Thinking..."
      : speaking
        ? "Speaking..."
        : "Idle";

  const statusClass = listening
    ? "listening"
    : thinking
      ? "thinking"
      : speaking
        ? "speaking"
        : "idle";

  return (
    <div className="voiceassistant">
      {/* HEADER */}
      <div className="voiceHeader">
        <h1>✨ Nova AI</h1>

        <h2>Voice Assistant</h2>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="voicemainContainer">
        {/* MICROPHONE */}
        <div className="Microphonesection">
          <button
            className={`microphoneButton ${listening ? "active" : ""}`}
            onClick={startListening}
            disabled={listening || thinking || speaking}
          >
            🎤
          </button>

          <h3>Status</h3>

          <div className="voiceStatus">
            <span className={`statusDot ${statusClass}`}></span>

            <span>{statusText}</span>
          </div>

          <p className="statusDescription">
            {listening
              ? "Nova is listening to you."
              : thinking
                ? "Nova is processing your request."
                : speaking
                  ? "Nova is speaking."
                  : "Ready for your next command."}
          </p>
        </div>

        {/* TRANSCRIPT */}
        <div className="Transcriptsection">
          <div className="sectionTitle">
            <h2>Transcript</h2>

            {transcript && (
              <span className="characterCount">
                {transcript.length} characters
              </span>
            )}
          </div>

          <textarea
            placeholder="Speak or type your command here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* AI RESPONSE */}
      <div className="aiResponse">
        <div className="responseHeader">
          <h2>Nova AI Response</h2>

          {thinking && <span className="responseStatus">⏳ Processing</span>}

          {speaking && <span className="responseStatus">🔊 Speaking</span>}
        </div>

        <div className="responseContent">
          <div className="novaIcon">🤖</div>

          <div className="responseText">
            {thinking ? (
              <p className="thinkingText">Nova is thinking...</p>
            ) : (
              <p>
                {response || "Hello! I'm ready whenever you start speaking."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <div className="voiceHistory">
        <div className="historyHeader">
          <div>
            <h2>Voice History</h2>

            <p>Your previous conversations with Nova</p>
          </div>

          <span className="historyCount">
            {voiceHistory.length} conversations
          </span>
        </div>

        <div className="historyList">
          {voiceHistory.length === 0 ? (
            <div className="emptyHistory">
              <span>🎙️</span>

              <p>No voice conversations yet.</p>
            </div>
          ) : (
            voiceHistory.map((voice) => (
              <div className="voiceHistoryItem" key={voice._id}>
                <div className="historyConversation">
                  <div className="userMessage">
                    <span className="messageLabel">You</span>

                    <p>{voice.command}</p>
                  </div>

                  <div className="novaMessage">
                    <span className="messageLabel">Nova AI</span>

                    <p>{voice.response}</p>
                  </div>
                </div>

                <button
                  className="deleteHistoryButton"
                  onClick={() => deleteVoiceConversation(voice._id)}
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="voicebottombuttons">
        <button
          className="startButton"
          onClick={startListening}
          disabled={listening || thinking || speaking}
        >
          🎤 Start
        </button>

        <button
          className="askButton"
          onClick={askVoiceAI}
          disabled={!transcript.trim() || listening || thinking}
        >
          {thinking ? "⏳ Thinking..." : "🤖 Ask Nova"}
        </button>

        <button
          className="stopButton"
          onClick={() => {
            stopListening();
            stopSpeaking();
          }}
          disabled={!listening && !speaking}
        >
          ⏹ Stop
        </button>

        <button className="clearButton" onClick={clearConversation}>
          🗑 Clear
        </button>
      </div>
    </div>
  );
}
