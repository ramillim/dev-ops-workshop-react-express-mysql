import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

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
      body: JSON.stringify({ task }),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setTask("");
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
          <button type="submit" style={{ fontSize: "20px", padding: "10px" }}>
            Add
          </button>
        </form>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ margin: "10px 0" }}>
              <span
                onClick={() => toggleTodo(todo)}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {todo.task}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
