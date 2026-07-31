import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import VoiceAssistant from "./pages/VoiceAssistant";
import SmartNotes from "./pages/SmartNotes";
import TodoManager from "./pages/TodoManager";
import Reminder from "./pages/Reminder";
import PDFChat from "./pages/PDFChat";
import EmailWriter from "./pages/EmailWriter";
import StudyPlanner from "./pages/StudyPlanner";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Failed to connect backend"));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Nova AI</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/voice" element={<VoiceAssistant />} />
        <Route path="/notes" element={<SmartNotes />} />
        <Route path="/todo" element={<TodoManager />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/pdf" element={<PDFChat />} />
        <Route path="/email" element={<EmailWriter />} />
        <Route path="/study" element={<StudyPlanner />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
