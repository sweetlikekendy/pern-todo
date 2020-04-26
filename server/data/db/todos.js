const knex = require("./index");

module.exports = {
  getOne: function (id) {
    return knex("todos").where("id", id).first();
  },
};
