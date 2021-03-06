// Helper functions to query data from postgres with knex
import knex from "../index";

/**
 * Get one todo by todo ID
 *
 * @param {number} todoId Todo's ID
 * @return {object} Knex object containing todo data
 */
const getOne = (todoId) => {
  return knex("todos").where("id", todoId).first();
};

/**
 * Get all todos in a todolist by todolist ID
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {object} Knex object containing all the todos in a todolist
 */
const getAll = (userId, todolistId) => {
  return knex
    .select(
      // "first_name",
      // "last_name",
      "todos.todolist_id",
      "todos.id",
      "todos.created_at",
      "todos.updated_at",
      // "title",
      "description",
      "isComplete"
    )
    .from("users")
    .leftJoin("todolists", "users.id", "=", "todolists.user_id")
    .leftJoin("todos", "todolists.id", "=", "todos.todolist_id")
    .where("todolists.user_id", userId)
    .where("todolists.id", todolistId)
    .orderBy("todos.created_at", "desc");
};

/**
 * Delete a todo by the todo ID
 *
 * @param {number} todoId Todo's ID
 * @return {object} Knex object confirming delete
 */
const deleteOne = (todoId) => {
  return knex("todos").where("id", todoId).first().del().returning("*");
};

/**
 * Delete multiple todos by the todo ID
 *
 * @param {array} todoIds Todo's ID
 * @return {object} Knex object confirming delete
 */
const deleteMany = (todoIds) => {
  return knex("todos").whereIn("id", todoIds).del().returning("*");
};

/**
 * Create a todo in a todolist by todolist ID
 *
 * @param {string} description Todo description
 * @param {object} createdAt Date todo was created at
 * @param {number} todolistId Todolist's ID
 * @return {object} Knex object containing new todo created
 */
const createOne = (description, createdAt, todolistId) => {
  return knex("todos")
    .insert([
      {
        description,
        created_at: createdAt,
        todolist_id: todolistId,
        isComplete: false,
      },
    ])
    .returning("*");
};

/**
 * Update a todo description
 *
 * @param {number} todoId Todo's ID
 * @param {string} description Todo description
 * @param {object} updatedAt Date todo was updated at
 * @return {object} Knex object containing updated todo
 */
const updateOne = (options) => {
  const {
    todolist_id: todolistId,
    todo_id: todoId,
    description,
    newTodolistId,
    isComplete,
    options: { updateTodoDescription, toggleTodoCompletion },
  } = options;

  const updatedAt = new Date();

  if (updateTodoDescription && !newTodolistId) {
    return knex("todos")
      .where("id", todoId)
      .first()
      .update({
        description,
        updated_at: updatedAt,
      })
      .returning("*");
  }
  if (updateTodoDescription && newTodolistId) {
    return knex("todos")
      .where("id", todoId)
      .first()
      .update({
        description,
        todolist_id: newTodolistId,
        updated_at: updatedAt,
      })
      .returning("*");
  }

  if (toggleTodoCompletion) {
    return knex("todos")
      .where("id", todoId)
      .first()
      .update({
        isComplete: !isComplete,
        updated_at: updatedAt,
      })
      .returning("*");
  }
};

// abstract transactional batch update
const updateMany = async (collection, isComplete) => {
  const updatedAt = new Date();

  const trx = await knex.transaction();

  try {
    const queries = collection.map(async (todoId) =>
      trx("todos").where("id", todoId).update({ isComplete, updated_at: updatedAt }).returning("*")
    );

    const results = await Promise.all(queries);

    const arrayOfObjectsResults = results.map((result) => result[0]);

    trx.commit();
    return arrayOfObjectsResults;
  } catch (error) {
    console.error(error);
    trx.rollback();
    throw error;
  }
};

export const todosRoutes = {
  getOne,
  getAll,
  deleteOne,
  deleteMany,
  createOne,
  updateOne,
  updateMany,
};
