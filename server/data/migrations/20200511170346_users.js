exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("users", (table) => {
      table.string("token");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table("users", (table) => {
      table.dropColumn("token");
    }),
  ]);
};
