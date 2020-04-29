// file server.js
import express from "express";
import cors from "cors";
import pool from "./db";
import db from "./data/db";
import { usersControllers } from "./routes/users";
import { todolistsControllers } from "./routes/todolists";
import { todosControllers } from "./routes/todos";

const app = express();

const { usersRoutes, createOneUser } = usersControllers;
const { todolistsRoutes } = todolistsControllers;
const { todosRoutes } = todosControllers;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/register", createOneUser);
app.use("/api/users", usersRoutes);
app.use("/api/users", todolistsRoutes);
app.use("/api/users", todosRoutes);

// // USER ROUTES ---------------------------------------------------------------------
// // create a user
// app.post(`/users`, async (req, res) => {
//   try {
//     const { first_name, last_name, email, password } = req.body;
//     const newUser = await pool.query(
//       `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
//       [first_name, last_name, email, password]
//     );
//     res.json(newUser.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });
// // get all users
// app.get(`/users`, async (_req, res) => {
//   try {
//     const allUsers = await pool.query(`SELECT * FROM users`);
//     res.json(allUsers.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });
// // update user
// app.put(`/users/:user_id`, async (req, res) => {
//   try {
//     const { first_name, last_name, email, password } = req.body;
//     const { user_id } = req.params;

//     const updateUser = await pool.query(
//       `UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE user_id = $5`,
//       [first_name, last_name, email, password, user_id]
//     );
//     res.json(`Updating user`);
//   } catch (err) {
//     console.error(err.message);
//   }
// });
// // delete user account
// app.delete(`/users/:user_id`, async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const deleteUser = await pool.query(
//       `DELETE FROM users WHERE user_id = $1`,
//       [user_id]
//     );
//     res.json(`Deleting user`);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // TODOLISTS ROUTES -----------------------------------------------------------------
// // create a todo list for a user
// app.post(`/users/:user_id/todolists`, async (req, res) => {
//   try {
//     const { title } = req.body;
//     const { user_id } = req.params;
//     const newUser = await pool.query(
//       `INSERT INTO todolists (title, user_id) VALUES ($1, $2)`,
//       [title, user_id]
//     );
//     res.json(newUser.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });
// // get all todo lists for a user
// // return title and the todolists linked to it
// app.get(`/users/:user_id/todolists`, async (req, res) => {
//   const { user_id } = req.params;
//   try {
//     const allTodolists = await pool.query(
//       `SELECT title, todolists.todolist_id, description, todo.todo_id  FROM users
//       LEFT JOIN todolists ON users.user_id = todolists.user_id
//       LEFT JOIN todo ON todolists.todolist_id = todo.todolist_id
//       WHERE users.user_id = ($1)`,
//       [user_id]
//     );
//     const numOfTodolists = await pool.query(
//       `SELECT count(title) AS "Number of Todolists" FROM users
//       LEFT JOIN todolists ON users.user_id = todolists.user_id
//       LEFT JOIN todo ON todolists.todolist_id = todo.todolist_id
//       WHERE users.user_id = ($1)`,
//       [user_id]
//     );
//     res.json({
//       todolists: allTodolists.rows,
//       numOfTodolists: numOfTodolists.rows[0],
//     });
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // update a todolist
// app.put(`/users/:user_id/todolists/:todolist_id`, async (req, res) => {
//   const { user_id, todolist_id } = req.params;
//   const { title } = req.body;
//   try {
//     const updateTodolist = await pool.query(
//       `UPDATE todolists SET title = $1 WHERE todolist_id = $2`,
//       [title, todolist_id]
//     );
//     res.json(`Updating todolist`);
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// // delete a todolist
// app.delete(`/users/:user_id/todolists/:todolist_id`, async (req, res) => {
//   const { user_id, todolist_id } = req.params;
//   try {
//     const deleteTodolist = await pool.query(
//       `DELETE FROM todolists WHERE todolist_id = $1`,
//       [todolist_id]
//     );
//     res.json(`Deleting todolist`);
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// // TODO routes ----------------------------------------------------------------------
// // create a todo for a todo list
// app.post(`/users/:user_id/todolists/:todolist_id/todo`, async (req, res) => {
//   try {
//     const { description } = req.body;
//     const { user_id, todolist_id } = req.params;
//     const newTodo = await pool.query(
//       `INSERT INTO todo(description, todolist_id) VALUES($1, $2)`,
//       [description, todolist_id]
//     );
//     res.json(newTodo.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // get todos in a todolist
// app.get(`/users/:user_id/todolists/:todolist_id/todo`, async (req, res) => {
//   const { user_id, todolist_id } = req.params;
//   try {
//     const allTodos = await pool.query(
//       `SELECT description FROM todolists
//       JOIN todo ON todolists.todolist_id = todo.todolist_id
//       WHERE todo.todolist_id = ($1)`,
//       [todolist_id]
//     );
//     const numOfTodos = await pool.query(
//       `SELECT count(title) AS "Number of Todos" FROM todolists
//       JOIN todo ON todolists.todolist_id = todo.todolist_id
//       WHERE todo.todolist_id = ($1)`,
//       [todolist_id]
//     );
//     res.json({ allTodos: allTodos.rows, numOfTodos: numOfTodos.rows[0] });
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // update a todo
// app.put(
//   `/users/:user_id/todolists/:todolist_id/todo/:todo_id`,
//   async (req, res) => {
//     const { user_id, todolist_id, todo_id } = req.params;
//     const { description } = req.body;
//     try {
//       const updateTodo = await pool.query(
//         `UPDATE todo SET description = $1 WHERE todo_id = $2`,
//         [description, todo_id]
//       );
//       res.json(`Updating todo`);
//     } catch (err) {
//       console.log(err.message);
//     }
//   }
// );

// // delete a todo
// app.delete(
//   `/users/:user_id/todolists/:todolist_id/todo/:todo_id`,
//   async (req, res) => {
//     const { user_id, todolist_id, todo_id } = req.params;
//     try {
//       const deleteTodo = await pool.query(
//         `DELETE FROM todo WHERE todo_id = $1`,
//         [todo_id]
//       );
//       res.json(`Deleting todo`);
//     } catch (err) {
//       console.log(err.message);
//     }
//   }
// );

app.listen(5000, () => console.log(`Server running on port 5000!`));
