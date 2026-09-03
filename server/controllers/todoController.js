const Todo = require("../models/Todo.js");

const createTodo = async (req, res) => {
  const { userId, title, content, priority, dueDate } = req.body;
  const todo = await Todo.create({
    userId,
    title,
    content,
    priority,
    dueDate,
  });
  res.status(201).json({ message: "Todos created successfully", todo });
};

const getTodos = async (req, res) => {
  const { userId } = req.params;
  const todos = await Todo.find({ userId });
  res.status(200).json({ message: "Found todos", todos });
};

const updateTodo = async (req, res) => {
  const { todoId } = req.params;
  const { title, content, priority, dueDate, completed } = req.body;
  const todo = await Todo.findById(todoId);
  if (!todo) {
    return res.status(404).json({ message: "Todo was not found" });
  }
  todo.title = title;
  todo.content = content;
  todo.priority = priority;
  todo.dueDate = dueDate;
  todo.completed = completed;
  await todo.save();
  res.status(200).json({ message: "Todo was updated successfully", todo });
};

const deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  const todo = await Todo.findById(todoId);
  if (!todo) {
    return res.status(404).json({ message: "Todo was not found" });
  }
  await todo.deleteOne();
  res.status(200).json({ message: "Todo was deleted successfully" });
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};
