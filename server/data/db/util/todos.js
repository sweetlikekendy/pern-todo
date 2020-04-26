// Helper functions to query data from postgres with knex
const knex = require("../index");

module.exports = {
  getOne: function (id) {
    return knex("todos").where("id", id).first();
  },
};
