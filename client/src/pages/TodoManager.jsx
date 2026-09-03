import "../styles/TodoManager.css";
import { useState, useEffect } from "react";
export default function TodoManager() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState("all");
  useEffect(() => {
    async function getTodos() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User Id not found");
      }
      const response = await fetch(`http://localhost:5000/api/todo/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data.todos);
      if (data.todos.length > 0) {
        setSelectedTodo(data.todos[0]);
      }
    }
    getTodos();
  }, []);

  async function saveTodo() {
    if (selectedTodo === null) {
      throw new Error("The Todo is empty");
    } else {
      const response = await fetch(
        `http://localhost:5000/api/todo/${selectedTodo._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: selectedTodo.title,
            content: selectedTodo.content,
            priority: selectedTodo.priority,
            dueDate: selectedTodo.dueDate,
            completed: selectedTodo.completed,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update todo");
      } else {
        setTodos((currentTodos) =>
          currentTodos.map((todo) =>
            todo._id === selectedTodo._id ? selectedTodo : todo,
          ),
        );
      }
    }
  }

  async function createNewTodo() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User Id not found");
    }
    const newTodo = {
      userId,
      title: "Untitled Todo",
      content: "Start writing...",
    };
    const response = await fetch("http://localhost:5000/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    const data = await response.json();
    setTodos((currentTodos) => [...currentTodos, data.todo]);
    setSelectedTodo(data.todo);
  }

  const filteredTodos = todos.filter((todo) => {
    if (!todo.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (filters === "all") {
      return true;
    }

    if (filters === "completed") {
      return todo.completed;
    }

    if (filters === "highpriority") {
      return todo.priority === "High";
    }

    if (filters === "today") {
      if (!todo.dueDate) {
        return false;
      }

      const today = new Date().toISOString().split("T")[0];
      const todoDate = new Date(todo.dueDate).toISOString().split("T")[0];

      return todoDate === today;
    }
    return true;
  });
  async function deleteTodo() {
    if (selectedTodo === null) {
      return;
    }
    const response = await fetch(
      `http://localhost:5000/api/todo/${selectedTodo._id}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      throw new Error("Todo not found");
    }

    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo._id !== selectedTodo._id),
    );
    setSelectedTodo(null);
  }
  const today = new Date().toISOString().split("T")[0];

  const aiSuggestions = todos
    .filter((todo) => !todo.completed)
    .map((todo) => {
      const todoDate = todo.dueDate
        ? new Date(todo.dueDate).toISOString().split("T")[0]
        : null;

      if (todo.priority === "High" && todoDate === today) {
        return {
          id: todo._id,
          title: todo.title,
          emoji: "🔥",
          message:
            "is high priority and due today. Consider completing it first.",
        };
      }

      if (todoDate && todoDate < today) {
        return {
          id: todo._id,
          title: todo.title,
          emoji: "⚠️",
          message: "is overdue. Consider completing it as soon as possible.",
        };
      }

      if (todo.priority === "High") {
        return {
          id: todo._id,
          title: todo.title,
          emoji: "🔴",
          message: "is a high priority task. Consider completing it first.",
        };
      }

      if (todoDate === today) {
        return {
          id: todo._id,
          title: todo.title,
          emoji: "📅",
          message: "is due today. Consider completing it today.",
        };
      }

      return null;
    })
    .filter((suggestion) => suggestion !== null);
  return (
    <div className="todoPage">
      <div className="todoheader">
        <h1>Nova AI</h1>
        <h2>To-Do Manager</h2>

        <button onClick={createNewTodo}>+ Add Task</button>
      </div>

      <div className="todoDetails">
        <h2>Task Details</h2>

        <input
          className="todoTitleInput"
          type="string"
          value={selectedTodo ? selectedTodo.title : ""}
          onChange={(event) => {
            setSelectedTodo({
              ...selectedTodo,
              title: event.target.value,
            });
          }}
        />

        <textarea
          className="todoContentInput"
          value={selectedTodo ? selectedTodo.content : ""}
          onChange={(event) => {
            setSelectedTodo({
              ...selectedTodo,
              content: event.target.value,
            });
          }}
        />

        <div className="todoOptions">
          <select
            value={selectedTodo ? selectedTodo.priority : ""}
            onChange={(event) => {
              setSelectedTodo({
                ...selectedTodo,
                priority: event.target.value,
              });
            }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            type="date"
            value={
              selectedTodo && selectedTodo.dueDate
                ? new Date(selectedTodo.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(event) => {
              setSelectedTodo({
                ...selectedTodo,
                dueDate: event.target.value,
              });
            }}
          />

          <select
            value={selectedTodo ? selectedTodo.completed : ""}
            onChange={(event) => {
              setSelectedTodo({
                ...selectedTodo,
                completed: event.target.value === "true",
              });
            }}
          >
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <div className="todoActions">
          <button onClick={saveTodo}>Save</button>
          <button onClick={deleteTodo}>Delete</button>
        </div>
      </div>

      <div className="todoMain">
        <div className="todofilters">
          <button className="todoactive" onClick={() => setFilters("all")}>
            All
          </button>

          <button onClick={() => setFilters("today")}>Today</button>

          <button onClick={() => setFilters("highpriority")}>
            High Priority
          </button>
        </div>

        <div className="todotaskContainer">
          <div className="todopendingTasks">
            <h2>Pending Tasks</h2>

            {filteredTodos
              .filter((todo) => !todo.completed)
              .map((todo) => (
                <div
                  className="todotaskCard"
                  key={todo._id}
                  onClick={() => setSelectedTodo(todo)}
                >
                  <h3>{todo.title}</h3>
                </div>
              ))}
          </div>

          <div className="todocompletedTasks">
            <h2>Completed Tasks</h2>

            {filteredTodos
              .filter((todo) => todo.completed)
              .map((todo) => (
                <div
                  className="todotaskCard"
                  key={todo._id}
                  onClick={() => setSelectedTodo(todo)}
                >
                  <h3>{todo.title}</h3>
                </div>
              ))}
          </div>
        </div>

        <div className="todoaiSuggestion">
          <h2>🤖 AI Suggestions</h2>

          <ul>
            {aiSuggestions.map((suggestion) => (
              <li key={suggestion.id}>
                {suggestion.emoji} <strong>{suggestion.title}</strong>{" "}
                {suggestion.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
