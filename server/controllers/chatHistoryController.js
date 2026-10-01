const Chat = require("../models/Chat.js");

const createChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { title, messages, interactionID } = req.body;

    const newChat = await Chat.create({
      userId,
      title,
      messages,
      interactionID,
    });

    res.status(201).json({
      message: "Chat created successfully",
      newChat,
    });
  } catch (error) {
    console.error("Create chat error:", error);

    res.status(500).json({
      message: "Failed to create chat",
    });
  }
};

const getChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await Chat.find({ userId });

    res.status(200).json({
      message: "The chats found",
      chats,
    });
  } catch (error) {
    console.error("Get chats error:", error);

    res.status(500).json({
      message: "Failed to get chats",
    });
  }
};

const updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const { messages, interactionID } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    if (Array.isArray(messages)) {
      chat.messages = [...chat.messages, ...messages];
    }

    if (interactionID !== undefined) {
      chat.interactionID = interactionID;
    }

    await chat.save();

    res.status(200).json({
      message: "Chat updated successfully",
      chat,
    });
  } catch (error) {
    console.error("Update chat error:", error);

    res.status(500).json({
      message: "Failed to update chat",
    });
  }
};

module.exports = {
  createChat,
  getChats,
  updateChat,
};
