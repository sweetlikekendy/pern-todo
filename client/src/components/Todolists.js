import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { Todolist } from "./Todolist";
import { SINGLE_TODOLIST_URI, SINGLE_TODO_URI } from "../endpoints";

const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Todolists = ({
  todolistOrder,
  todolists,
  todos,
  stateData,
  setStateData,
  jwt,
  userId,
  setFetching,
  reordering,
  setReordering,
  fetchData,
}) => {
  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    // No destination
    if (!destination) {
      return;
    }

    // If dropped in the same place started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Moving todolists
    if (type === "todolist") {
      const newTodolistOrder = Array.from(todolistOrder);

      console.log("source index", source.index);
      console.log("destination index", destination.index);
      console.log("dragged item", draggableId);

      newTodolistOrder.splice(source.index, 1);
      newTodolistOrder.splice(destination.index, 0, draggableId);

      const newStateData = {
        ...stateData,
        todolistOrder: newTodolistOrder,
      };

      // I have to get the original todolists data
      const originalTodolistIds = Array.from(todolistOrder);
      const copyTodolistIds = Array.from(newStateData.todolistOrder);

      console.log("original todolists order", originalTodolistIds);
      console.log("new todolists order", copyTodolistIds);

      // empty array to keep track of which todo ids have shifted
      let shiftedTodolistIds = [];
      // empty array to keep track of original order of todo ids
      let oldTodolistIds = [];

      // if you're moving the todo down the list
      if (source.index < destination.index) {
        // The todo ids of all the todos that shifted after the move
        shiftedTodolistIds = copyTodolistIds.splice(
          source.index,
          destination.index + 1
        );
        console.log("todolist Ids that have been shifted", shiftedTodolistIds);
        // Get the original todo ids
        oldTodolistIds = originalTodolistIds.splice(
          source.index,
          destination.index + 1
        );
        console.log("Old todolist Ids", oldTodolistIds);
      }
      // Moving todo up the list
      else {
        // The todo ids of all the todos that shifted after the move
        shiftedTodolistIds = copyTodolistIds.splice(
          destination.index,
          source.index + 1
        );
        console.log("todolist Ids that have been shifted", shiftedTodolistIds);
        // Get the original todo ids
        oldTodolistIds = originalTodolistIds.splice(
          destination.index,
          source.index + 1
        );
        console.log("Old todolist Ids", oldTodolistIds);
      }

      // Convert todolist objects into an array
      const todolistsAsArray = Object.entries(newStateData.todolists);
      console.log("todolists as array", todolistsAsArray);
      const newTodolists = [];

      // Get the matching todos with the shifted todos
      oldTodolistIds.forEach((todo, i) => {
        todolistsAsArray.forEach((_element, j) => {
          if (todolistsAsArray[j][0].includes(todo)) {
            newTodolists.push({
              id: todolistsAsArray[j][1].id,
            });
          }
        });
      });
      console.log("new todolist ids", newTodolists);

      const copyNewTodolists = Array.from(newTodolists);
      //  Get the matching todos with the shifted todos
      shiftedTodolistIds.forEach((todolist, i) => {
        todolistsAsArray.forEach((element, j) => {
          if (todolistsAsArray[j][0].includes(todolist)) {
            copyNewTodolists[i] = {
              ...copyNewTodolists[i],
              userId: todolistsAsArray[j][1].userId,
              title: todolistsAsArray[j][1].title,
              createdAt: todolistsAsArray[j][1].createdAt,
              firstName: todolistsAsArray[j][1].firstName,
              lastName: todolistsAsArray[j][1].lastName,
              todoIds: todolistsAsArray[j][1].todoIds,
              updatedAt: todolistsAsArray[j][1].updatedAt,
            };
          }
        });
      });
      console.log("new todolists", copyNewTodolists);
      const promises = [];

      // Array to hold todolists with no todos
      let emptyTodolists = [];

      // Array to hold todolists with todos
      let notEmptyTodolists = [];

      // Find todolists with/without todos and push onto 2 previously declared arrays
      for (let todolist of copyNewTodolists) {
        if (todolist.todoIds.length === 0) {
          emptyTodolists.push(todolist);
        } else {
          notEmptyTodolists.push(todolist);
        }
      }

      // If todolist with todos is empty, that means all swapped todolists are empty.
      // Swap just the titles
      if (notEmptyTodolists.length === 0) {
        copyNewTodolists.forEach((todolist) => {
          const { userId, id, title } = todolist;
          promises.push(
            axios.put(
              SINGLE_TODOLIST_URI(userId, id),
              { title },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
        });
      }
      // If todolists with todos is not empty, that means some todolists have todos
      // Swap the titles and the todolist ids for the todos
      else {
        copyNewTodolists.forEach((todolist, i) => {
          const { userId, id, title, todoIds } = todolist;
          promises.push(
            axios.put(
              SINGLE_TODOLIST_URI(userId, id),
              { title },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
          if (todoIds.length !== 0) {
            // Convert todo objects into an array
            const todosAsArray = Object.entries(newStateData.todos);
            const newTodos = [];

            // Get the matching todos with the shifted todos
            todoIds.forEach((todo, j) => {
              todosAsArray.forEach((_element, k) => {
                if (todosAsArray[k][0].includes(todo)) {
                  newTodos.push(todosAsArray[k][1]);
                }
              });
            });
            copyNewTodolists[i] = {
              ...copyNewTodolists[i],
              todos: newTodos,
            };
            // Push axios put requests to promise array to all the todos with their new todolist ids

            if (copyNewTodolists[i].todos.length !== 0) {
              for (let j = 0; j < copyNewTodolists[i].todos.length; j++) {
                console.log(copyNewTodolists[i].todos[j]);
                promises.push(
                  axios.put(
                    SINGLE_TODO_URI(
                      userId,
                      copyNewTodolists[i].id,
                      copyNewTodolists[i].todos[j].id
                    ),
                    {
                      newTodolistId: copyNewTodolists[i].id,
                    },
                    {
                      headers: {
                        Authorization: jwt,
                      },
                    }
                  )
                );
              }
            }
          }
        });
      }

      // Execute the array of promises
      await Promise.all(promises)
        .then((results) => {
          console.log(results);
        })
        .catch((error) => console.error(error.response.request));

      setFetching(true);
      // setStateData(newStateData);
      // if one is empty, change the todolist IDs in the todos to the new one
      // if both have todos, change both todolist ids for the todos in the the todolists
    }

    // Moving todos
    if (type === "todo") {
      const todolist = todolists[source.droppableId];
      const newTodoIds = Array.from(todolist.todoIds);

      console.log("source index", source.index);
      console.log("destination index", destination.index);

      newTodoIds.splice(source.index, 1);
      newTodoIds.splice(destination.index, 0, draggableId);

      const newTodolist = {
        ...todolist,
        todoIds: newTodoIds,
      };

      const newStateData = {
        ...stateData,
        todolists: {
          ...stateData.todolists,
          [newTodolist.dndId]: newTodolist,
        },
      };

      // get the original todoIds for order
      // the todoId order for the put request will be the same as the original order
      // EX. todo-9, todo-8, todo-7, todo-6 ids
      // The after the swap you want the new todoIds, but their data only.
      // EX. todo-8 todo-7 todo-6 todo-9 data
      // put request will be the ids of original array with new swapped data
      // EX
      // | todo-9, todo-8, todo-7, todo-6 ids
      // | todo-8 todo-7 todo-6 todo-9 data

      // get the original todos order
      const originalTodoIds = Array.from(todolist.todoIds);
      // get the new todos order
      const copyTodoIds = Array.from(newTodoIds);

      console.log("original todo order", originalTodoIds);
      console.log("new todo order", copyTodoIds);

      // empty array to keep track of which todo ids have shifted
      let shiftedTodoIds = [];
      // empty array to keep track of original order of todo ids
      let oldTodoIds = [];

      // if you're moving the todo down the list
      if (source.index < destination.index) {
        // The todo ids of all the todos that shifted after the move
        shiftedTodoIds = copyTodoIds.splice(
          source.index,
          destination.index + 1
        );
        console.log("todoIds that have been shifted", shiftedTodoIds);
        // Get the original todo ids
        oldTodoIds = originalTodoIds.splice(
          source.index,
          destination.index + 1
        );
        console.log("Old todo Ids", oldTodoIds);
      }
      // Moving todo up the list
      else {
        // The todo ids of all the todos that shifted after the move
        shiftedTodoIds = copyTodoIds.splice(
          destination.index,
          source.index + 1
        );
        console.log("todoIds that have been shifted", shiftedTodoIds);
        // Get the original todo ids
        oldTodoIds = originalTodoIds.splice(
          destination.index,
          source.index + 1
        );
        console.log("Old todo Ids", oldTodoIds);
      }

      // Convert todo objects into an array
      const todosAsArray = Object.entries(newStateData.todos);
      console.log("todos as array", todosAsArray);
      const newTodos = [];

      // Get the matching todos with the shifted todos
      oldTodoIds.forEach((todo, i) => {
        todosAsArray.forEach((_element, j) => {
          if (todosAsArray[j][0].includes(todo)) {
            newTodos.push({ id: todosAsArray[j][1].id });
          }
        });
      });
      console.log("new todos", newTodos);

      const copyNewTodos = Array.from(newTodos);

      //  Get the matching todos with the shifted todos
      shiftedTodoIds.forEach((todo, i) => {
        todosAsArray.forEach((element, j) => {
          if (todosAsArray[j][0].includes(todo)) {
            copyNewTodos[i] = {
              ...copyNewTodos[i],
              content: todosAsArray[j][1].content,
              createdAt: todosAsArray[j][1].createdAt,
              firstName: todosAsArray[j][1].firstName,
              lastName: todosAsArray[j][1].lastName,
              todolistId: todosAsArray[j][1].todolistId,
              todolistTitle: todosAsArray[j][1].todolistTitle,
              updatedAt: todosAsArray[j][1].updatedAt,
            };
          }
        });
      });
      console.log("new todos", copyNewTodos);

      const promises = [];

      copyNewTodos.forEach((todo) => {
        const { todolistId, id, content } = todo;
        promises.push(
          axios.put(
            SINGLE_TODO_URI(userId, todolistId, id),
            { description: content },
            {
              headers: {
                Authorization: jwt,
              },
            }
          )
        );
      });

      // Execute the array of promises
      await Promise.all(promises)
        .then((results) => {
          console.log(results);
        })
        .catch((error) => console.error(error.response.request));

      setStateData(newStateData);
      // setFetching(true);
      // console.log(newStateData);
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {todolistOrder === undefined ? (
        <div>Loading ... </div>
      ) : (
        <Droppable
          droppableId="all-todolists"
          direction="horizontal"
          type="todolist"
        >
          {(provided) => (
            <FlexBox {...provided.droppableProps} ref={provided.innerRef}>
              {todolistOrder.map((todolistId, i) => {
                const todolist = todolists[todolistId];
                const tmpTodos = todolist.todoIds.map(
                  (todoId) => todos[todoId]
                );

                return (
                  <Todolist
                    key={todolist.id}
                    index={i}
                    jwt={jwt}
                    todolist={todolist}
                    todos={tmpTodos}
                    setFetching={setFetching}
                  />
                );
              })}
              {provided.placeholder}
            </FlexBox>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

Todolists.propTypes = {};

export default Todolists;
