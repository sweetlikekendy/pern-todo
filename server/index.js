// file server.js
import express from "express";
import cors from "cors";
import { usersControllers } from "./routes/users";
import { todolistsControllers } from "./routes/todolists";
import { todosControllers } from "./routes/todos";
import { resStatusPayload } from "./util/";

const { usersRoutes, register, login } = usersControllers;
const { todolistsRoutes } = todolistsControllers;
const { todosRoutes } = todosControllers;

const PORT = process.env.PORT || 5000;

// create express application
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: err });
};

// routes
// app.use("/", jsonErrorHandler);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/users", usersRoutes, todolistsRoutes, todosRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
