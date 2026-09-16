const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");
const app = express();
const notesRoutes = require("./routes/notesRoutes");
app.use("/uploads", express.static("uploads"));
const pushRoutes = require("./routes/pushRoutes");
const todoRoutes = require("./routes/todoRoutes");
const pdfChatRoutes = require("./routes/pdfChatRoutes");
const emailRoutes = require("./routes/emailRoutes");
const profileRoutes = require("./routes/profileRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const studyRoutes = require("./routes/studyRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const searchRoutes = require("./routes/searchRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { startReminderScheduler } = require("./services/reminderScheduler");
console.log("MONGO_URI starts with:", process.env.MONGO_URI?.slice(0, 20));
console.log("MONGO_URI raw length:", process.env.MONGO_URI?.length);
connectDB();
startReminderScheduler();
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat-history", chatHistoryRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/pdf", pdfChatRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reminder", reminderRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Nova AI backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
