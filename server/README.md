# README for server

## How to get database up and running with knex.js

### From scratch (WIP)

Set up your knexfile.js

```javascript
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
    connection: process.env.DB_URL,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: { directory: "./data/seeds" },
  },
};
```

### Updating database

Run `knex migrate:latest`. Then run `knex seed:run`
