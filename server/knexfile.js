require("dotenv").config({ path: "../.env" });

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/perntodo",
    migrations: {
      directory: __dirname + "/data/migrations",
    },
    seeds: { directory: __dirname + "/data/seeds" },
  },

  testing: {
    client: "pg",
    connection: "postgres://localhost/perntodo_testing",
    migrations: {
      directory: __dirname + "/data/migrations",
    },
    seeds: { directory: __dirname + "/data/seeds" },
  },

  production: {
    client: "pg",
    connection: {
      database: process.env.DATABASE_URL,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: __dirname + "/data/migrations",
    },
    seeds: { directory: __dirname + "/data/seeds" },
    ssl: true,
  },
};
