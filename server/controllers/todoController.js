const Todo = require("../models/Todo.js");

const createTodo = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { title, content, priority, dueDate } = req.body;

    const todo = await Todo.create({
      userId,
      title,
      content,
      priority,
      dueDate,
    });

    res.status(201).json({
      message: "Todos created successfully",
      todo,
    });
  } catch (error) {
    console.error("Create todo error:", error);

    res.status(500).json({
      message: "Failed to create todo",
    });
  }
};

const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;

    const todos = await Todo.find({ userId });

    res.status(200).json({
      message: "Found todos",
      todos,
    });
  } catch (error) {
    console.error("Get todos error:", error);

    res.status(500).json({
      message: "Failed to get todos",
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user.userId;

    const { title, content, priority, dueDate, completed } = req.body;

    const todo = await Todo.findOne({
      _id: todoId,
      userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo was not found",
      });
    }

    if (title !== undefined) {
      todo.title = title;
    }

    if (content !== undefined) {
      todo.content = content;
    }

    if (priority !== undefined) {
      todo.priority = priority;
    }

    if (dueDate !== undefined) {
      todo.dueDate = dueDate;
    }

    if (completed !== undefined) {
      todo.completed = completed;
    }

    await todo.save();

    res.status(200).json({
      message: "Todo was updated successfully",
      todo,
    });
  } catch (error) {
    console.error("Update todo error:", error);

    res.status(500).json({
      message: "Failed to update todo",
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findOne({
      _id: todoId,
      userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo was not found",
      });
    }

    await todo.deleteOne();

    res.status(200).json({
      message: "Todo was deleted successfully",
    });
  } catch (error) {
    console.error("Delete todo error:", error);

    res.status(500).json({
      message: "Failed to delete todo",
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};
