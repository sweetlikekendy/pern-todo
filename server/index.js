// file server.js
import express from "express";
import cors from "cors";
import { usersControllers } from "./routes/users";
import { todolistsControllers } from "./routes/todolists";
import { todosControllers } from "./routes/todos";

const app = express();

const { usersRoutes, register, login } = usersControllers;
const { todolistsRoutes } = todolistsControllers;
const { todosRoutes } = todosControllers;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/register", register);
app.use("/login", login);
app.use("/api/users", usersRoutes, todolistsRoutes, todosRoutes);

app.listen(5000, () => console.log(`Server running on port 5000!`));
