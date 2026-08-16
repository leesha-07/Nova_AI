const Chat = require("../models/Chat.js");
const createChat = async (req, res) => {
  const { userId, title, messages, interactionID } = req.body;
  const newChat = await Chat.create({
    userId,
    title,
    messages,
    interactionID,
  });
  res.status(201).json({ message: "Chat created successfully", newChat });
};
const getChats = async (req, res) => {
  const userId = req.params.userId;
  const chats = await Chat.find({ userId });
  res.status(200).json({ message: "The chats found", chats });
};
const updateChat = async (req, res) => {
  const chatId = req.params.chatId;
  const { messages, interactionID } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  chat.messages = [...chat.messages, ...messages];
  chat.interactionID = interactionID;
  await chat.save();
  res.status(200).json({
    message: "Chat updated successfully",
    chat,
  });
};
module.exports = { createChat, getChats, updateChat };
