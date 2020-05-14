exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("users", (table) => {
      table.dropColumn("token");
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
