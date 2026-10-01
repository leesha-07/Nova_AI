import "../styles/TodoManager.css";
import { useState, useEffect } from "react";

export default function TodoManager() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState("all");

  useEffect(() => {
    async function getTodos() {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          throw new Error("Authentication information not found");
        }

        const response = await fetch(
          `http://localhost:5000/api/todo/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();

        setTodos(data.todos);

        if (data.todos.length > 0) {
          setSelectedTodo(data.todos[0]);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }

    getTodos();
  }, []);

  async function saveTodo() {
    if (selectedTodo === null) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `http://localhost:5000/api/todo/${selectedTodo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      }

      const data = await response.json();

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo._id === selectedTodo._id ? data.todo || selectedTodo : todo,
        ),
      );

      setSelectedTodo(data.todo || selectedTodo);
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  }

  async function createNewTodo() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const newTodo = {
        title: "Untitled Todo",
        content: "Start writing...",
      };

      const response = await fetch("http://localhost:5000/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const data = await response.json();

      setTodos((currentTodos) => [...currentTodos, data.todo]);
      setSelectedTodo(data.todo);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  }

  async function deleteTodo() {
    if (selectedTodo === null) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `http://localhost:5000/api/todo/${selectedTodo._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Todo not found");
      }

      const updatedTodos = todos.filter(
        (todo) => todo._id !== selectedTodo._id,
      );

      setTodos(updatedTodos);

      if (updatedTodos.length > 0) {
        setSelectedTodo(updatedTodos[0]);
      } else {
        setSelectedTodo(null);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const filteredTodos = todos.filter((todo) => {
    const titleMatches = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!titleMatches) {
      return false;
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

      const todoDate = new Date(todo.dueDate).toISOString().split("T")[0];

      return todoDate === today;
    }

    return true;
  });

  const pendingTodos = filteredTodos.filter((todo) => !todo.completed);

  const completedTodos = filteredTodos.filter((todo) => todo.completed);

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
      {/* ================= HEADER ================= */}

      <header className="todoheader">
        <div className="todoLogo">
          <span>✨</span>
          Nova AI
        </div>

        <h2>To-Do Manager</h2>

        <button className="todoNewButton" onClick={createNewTodo}>
          + Add Task
        </button>
      </header>

      {/* ================= MAIN CONTENT ================= */}

      <main className="todoContent">
        {/* ================= TASK LIST SECTION ================= */}

        <section className="todoTaskSection">
          <div className="todoSectionTop">
            <div>
              <h2>My Tasks</h2>
              <p>Manage your pending and completed tasks.</p>
            </div>

            <input
              className="todoSearch"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {/* FILTERS */}

          <div className="todofilters">
            <button
              className={filters === "all" ? "todoactive" : ""}
              onClick={() => setFilters("all")}
            >
              All
            </button>

            <button
              className={filters === "today" ? "todoactive" : ""}
              onClick={() => setFilters("today")}
            >
              Today
            </button>

            <button
              className={filters === "highpriority" ? "todoactive" : ""}
              onClick={() => setFilters("highpriority")}
            >
              High Priority
            </button>

            <button
              className={filters === "completed" ? "todoactive" : ""}
              onClick={() => setFilters("completed")}
            >
              Completed
            </button>
          </div>

          {/* TASK COLUMNS */}

          <div className="todotaskContainer">
            {/* PENDING */}

            <div className="todotaskColumn">
              <div className="todoColumnHeader">
                <h3>Pending Tasks</h3>
                <span>{pendingTodos.length}</span>
              </div>

              <div className="todoTaskList">
                {pendingTodos.length === 0 ? (
                  <p className="todoEmpty">No pending tasks.</p>
                ) : (
                  pendingTodos.map((todo) => (
                    <div
                      className={`todotaskCard ${
                        selectedTodo?._id === todo._id ? "selectedTask" : ""
                      }`}
                      key={todo._id}
                      onClick={() => setSelectedTodo(todo)}
                    >
                      <div className="taskCardTop">
                        <h3>{todo.title}</h3>

                        <span
                          className={`priority ${todo.priority.toLowerCase()}`}
                        >
                          {todo.priority}
                        </span>
                      </div>

                      <p>{todo.content}</p>

                      {todo.dueDate && (
                        <small>
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COMPLETED */}

            <div className="todotaskColumn">
              <div className="todoColumnHeader">
                <h3>Completed Tasks</h3>
                <span>{completedTodos.length}</span>
              </div>

              <div className="todoTaskList">
                {completedTodos.length === 0 ? (
                  <p className="todoEmpty">No completed tasks.</p>
                ) : (
                  completedTodos.map((todo) => (
                    <div
                      className={`todotaskCard completedTask ${
                        selectedTodo?._id === todo._id ? "selectedTask" : ""
                      }`}
                      key={todo._id}
                      onClick={() => setSelectedTodo(todo)}
                    >
                      <div className="taskCardTop">
                        <h3>{todo.title}</h3>

                        <span className="completedBadge">Completed</span>
                      </div>

                      <p>{todo.content}</p>

                      {todo.dueDate && (
                        <small>
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= TASK DETAILS ================= */}

        <aside className="todoDetails">
          <div className="todoDetailsHeader">
            <h2>Task Details</h2>
            <span>{selectedTodo ? "Editing task" : "No task selected"}</span>
          </div>

          {selectedTodo ? (
            <>
              <label>Title</label>

              <input
                className="todoTitleInput"
                type="text"
                value={selectedTodo.title}
                onChange={(event) => {
                  setSelectedTodo({
                    ...selectedTodo,
                    title: event.target.value,
                  });
                }}
              />

              <label>Description</label>

              <textarea
                className="todoContentInput"
                value={selectedTodo.content}
                onChange={(event) => {
                  setSelectedTodo({
                    ...selectedTodo,
                    content: event.target.value,
                  });
                }}
              />

              <div className="todoOptions">
                <div>
                  <label>Priority</label>

                  <select
                    value={selectedTodo.priority}
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
                </div>

                <div>
                  <label>Due Date</label>

                  <input
                    type="date"
                    value={
                      selectedTodo.dueDate
                        ? new Date(selectedTodo.dueDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(event) => {
                      setSelectedTodo({
                        ...selectedTodo,
                        dueDate: event.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="todoStatus">
                <label>Status</label>

                <select
                  value={selectedTodo.completed}
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
                <button className="todoSaveButton" onClick={saveTodo}>
                  💾 Save
                </button>

                <button className="todoDeleteButton" onClick={deleteTodo}>
                  🗑 Delete
                </button>
              </div>
            </>
          ) : (
            <div className="noTodoSelected">
              <p>Select a task to view and edit its details.</p>
            </div>
          )}
        </aside>

        {/* ================= AI SUGGESTIONS ================= */}

        <section className="todoaiSuggestion">
          <h2>🤖 AI Suggestions</h2>

          {aiSuggestions.length === 0 ? (
            <p className="noSuggestions">
              No suggestions right now. You're all caught up!
            </p>
          ) : (
            <ul>
              {aiSuggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <span>{suggestion.emoji}</span>
                  <strong>{suggestion.title}</strong>
                  <span>{suggestion.message}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
