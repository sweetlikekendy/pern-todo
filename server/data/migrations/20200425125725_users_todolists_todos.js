exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("first_name");
      table.string("last_name");
      table.string("email");
      table.string("password");
      table.datetime("created_at");
      table.unique("id");
      table.unique("email");
    }),
    knex.schema.createTable("todolists", (table) => {
      table.increments("id").primary();
      table.string("title");
      table.datetime("created_at");
      table.integer("user_id").unsigned().references("users.id");
      table.unique("id");
    }),
    knex.schema.createTable("todos", (table) => {
      table.increments("id").primary();
      table.string("description");
      table.datetime("created_at");
      table.integer("todolist_id").unsigned().references("todolists.id");
      table.unique("id");
    }),
  ]);
};
exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("todos"),
    knex.schema.dropTable("todolists"),
    knex.schema.dropTable("users"),
  ]);
};
