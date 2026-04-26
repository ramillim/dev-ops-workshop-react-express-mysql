const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/server");
const database = require("../src/database");

chai.use(chaiHttp);
chai.should();

describe("Todos API", () => {
  before(async () => {
    // Ensure table exists
    const exists = await database.schema.hasTable('todos');
    if (!exists) {
      await database.schema.createTable('todos', table => {
        table.increments('id').primary();
        table.string('task').notNullable();
        table.boolean('completed').defaultTo(false);
        table.timestamp('completed_at').nullable();
        table.timestamp('due_date').nullable();
      });
    } else {
        // If it exists but we just updated it, we might need to add columns
        // but for a simple test let's just clear it
        await database('todos').truncate();
    }
  });

  it("should add a new todo with due_date", (done) => {
    const todo = {
      task: "Test task",
      due_date: "2026-05-01T10:00:00.000Z"
    };
    chai.request(app)
      .post("/todos")
      .send(todo)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('task').eql("Test task");
        res.body.should.have.property('due_date');
        done();
      });
  });

  it("should complete a todo and record completed_at", (done) => {
    database('todos').insert({ task: "Complete me" }).then(([id]) => {
      chai.request(app)
        .put(`/todos/${id}`)
        .send({ task: "Complete me", completed: true })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('completed').eql(1); // MySQL might return 1 for true
          res.body.should.have.property('completed_at').not.eql(null);
          done();
        });
    });
  });
});
