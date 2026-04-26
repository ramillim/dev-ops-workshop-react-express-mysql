// simple node web server that displays hello world
// optimized for Docker image

const express = require("express");
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const morgan = require("morgan");
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const database = require("./database");

// Appi
const app = express();

app.use(morgan("common"));
app.use(express.json());

// Initialize database table
database.schema.hasTable('todos').then(exists => {
  if (!exists) {
    return database.schema.createTable('todos', table => {
      table.increments('id').primary();
      table.string('task').notNullable();
      table.boolean('completed').defaultTo(false);
    });
  }
});

app.get("/todos", function(req, res, next) {
  database('todos').select('*')
    .then(todos => res.json(todos))
    .catch(next);
});

app.post("/todos", function(req, res, next) {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }
  database('todos').insert({ task })
    .then(([id]) => res.status(201).json({ id, task, completed: false }))
    .catch(next);
});

app.put("/todos/:id", function(req, res, next) {
  const { id } = req.params;
  const { task, completed } = req.body;
  database('todos').where({ id }).update({ task, completed })
    .then(count => {
      if (count === 0) return res.status(404).end();
      res.json({ id, task, completed });
    })
    .catch(next);
});

app.delete("/todos/:id", function(req, res, next) {
  const { id } = req.params;
  database('todos').where({ id }).del()
    .then(count => {
      if (count === 0) return res.status(404).end();
      res.status(204).end();
    })
    .catch(next);
});

app.get("/", function(req, res, next) {
  database.raw('select VERSION() version')
    .then(([rows, columns]) => rows[0])
    .then((row) => res.json({ message: `Hello from MySQL ${row.version}` }))
    .catch(next);
});

app.get("/healthz", function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});

module.exports = app;
