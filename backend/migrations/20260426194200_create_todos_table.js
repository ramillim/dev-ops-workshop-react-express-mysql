/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('todos', function(table) {
    table.increments('id').primary();
    table.string('task').notNullable();
    table.boolean('completed').defaultTo(false);
    table.timestamp('completed_at').nullable();
    table.timestamp('due_date').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('todos');
};
