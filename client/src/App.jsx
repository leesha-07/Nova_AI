import { useEffect, useState } from "react";

function App() {
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

export default App;
