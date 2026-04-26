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
        <h1>TODO List</h1>
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
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ margin: "10px 0", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    flexGrow: 1,
                    marginRight: "20px"
                  }}
                >
                  {todo.task}
                </span>
                <div style={{ fontSize: "14px", marginRight: "20px" }}>
                  {todo.due_date && (
                    <div>Due: {new Date(todo.due_date).toLocaleString()}</div>
                  )}
                  {todo.completed_at && (
                    <div>Completed: {new Date(todo.completed_at).toLocaleString()}</div>
                  )}
                </div>
                {!todo.completed && (
                  <button
                    onClick={() => toggleTodo(todo)}
                    style={{ marginRight: "10px" }}
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
