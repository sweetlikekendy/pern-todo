const knex = require("./index");

module.exports = {
  getOne: function (id) {
    return knex("todolists").where("id", id).first();
  },
};
