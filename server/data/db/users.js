const knex = require("./index");

module.exports = {
  getOne: function (id) {
    return knex("users").where("id", id).first();
  },
};
