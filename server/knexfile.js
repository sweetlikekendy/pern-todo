require("dotenv").config({ path: "../.env" });

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/perntodo",
    migrations: {
      directory: "./data/migrations",
    },
    seeds: { directory: "./data/seeds" },
  },

  testing: {
    client: "pg",
    connection: "postgres://localhost/perntodo_testing",
    migrations: {
      directory: "./data/migrations",
    },
    seeds: { directory: "./data/seeds" },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: { directory: "./data/seeds" },
  },
};
