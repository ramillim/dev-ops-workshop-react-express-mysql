import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(console.error);
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!task) return;
    fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, due_date: dueDate || null }),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setTask("");
        setDueDate("");
      })
      .catch(console.error);
  };

  const toggleTodo = (todo) => {
    fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
      })
      .catch(console.error);
  };

  const deleteTodo = (id) => {
    fetch(`/api/todos/${id}`, { method: "DELETE" })
      .then(() => {
        setTodos(todos.filter((t) => t.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trivial TODO List</h1>
        <form onSubmit={addTodo}>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task"
            style={{ fontSize: "20px", padding: "10px" }}
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ fontSize: "20px", padding: "10px", marginLeft: "10px" }}
          />
          <button type="submit" style={{ fontSize: "20px", padding: "10px", marginLeft: "10px" }}>
            Add
          </button>
        </form>
        <table style={{ marginTop: "20px", borderCollapse: "collapse", width: "80%", fontSize: "18px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #61dafb" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Task</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Due Date</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Completed At</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id} style={{ borderBottom: "1px solid #444" }}>
                <td
                  style={{
                    padding: "10px",
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.task}
                </td>
                <td style={{ padding: "10px" }}>
                  {todo.completed ? (
                    <span style={{ color: "#4caf50" }}>Completed</span>
                  ) : (
                    <span style={{ color: "#ff9800" }}>In Progress</span>
                  )}
                </td>
                <td style={{ padding: "10px" }}>
                  {todo.due_date ? new Date(todo.due_date).toLocaleString() : "-"}
                </td>
                <td style={{ padding: "10px" }}>
                  {todo.completed_at ? new Date(todo.completed_at).toLocaleString() : "-"}
                </td>
                <td style={{ padding: "10px" }}>
                  {!todo.completed && (
                    <button
                      onClick={() => toggleTodo(todo)}
                      style={{ marginRight: "10px" }}
                    >
                      Complete
                    </button>
                  )}
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
