const express = require("express");

const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTodo);

router.get("/:userId", protect, getTodos);

router.put("/:todoId", protect, updateTodo);

router.delete("/:todoId", protect, deleteTodo);

module.exports = router;
