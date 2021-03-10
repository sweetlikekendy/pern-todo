import React, { useState } from "react";
import PropTypes from "prop-types";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Todo } from "../Todo";

import { deleteTodolist, editTodolist } from "./crud";
import { addTodo } from "../Todo";

import { Button, Input, List, TodolistContainer } from "../../styles";

const Todolist = ({ index, jwt, todolist, todos, setFetching }) => {
  const [newTodo, setNewTodo] = useState("");
  // console.log(todolist);
  const [newTodolist, setNewTodolist] = useState(todolist.title);

  const { id: todolistId, user_id } = todolist;

  const editTodolistOnKeyPress = (event) => {
    const { key } = event;

    if (key === "Enter") {
      editTodolist(jwt, user_id, todolistId, newTodolist);
      setFetching(true);
    }
  };

  const addTodoOnKeyPress = (event) => {
    const { key } = event;

    if (key === "Enter") {
      addTodo(jwt, user_id, todolistId, newTodo);
      setNewTodo("");
      setFetching(true);
    }
  };

  return (
    <Draggable draggableId={todolist.dndId} index={index}>
      {(provided, snapshot) => (
        <TodolistContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div className="flex mb-4">
            <Button
              isClose
              onClick={() => {
                deleteTodolist(jwt, user_id, todolistId);
                setFetching(true);
              }}
            >
              X
            </Button>
            <Input
              type="text"
              name="todo"
              value={newTodolist}
              onChange={(e) => {
                setNewTodolist(e.target.value);
              }}
              onKeyPress={(e) => editTodolistOnKeyPress(e)}
            />
          </div>
          <p className="mb-4">{todos.length} todos</p>
          <Input
            full
            border
            marginBottom
            type="text"
            name="todo"
            value={newTodo}
            placeholder="Enter todo here"
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => addTodoOnKeyPress(e)}
          />
          <Droppable droppableId={todolist.dndId} type="todo">
            {(provided, snapshot) => (
              <List ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                {todos.map((todo, i) => (
                  <Todo
                    key={todo.id}
                    jwt={jwt}
                    todo={todo}
                    userId={user_id}
                    todolistId={todolistId}
                    index={i}
                    setFetching={setFetching}
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </TodolistContainer>
      )}
    </Draggable>
  );
};

Todolist.propTypes = {};

export default Todolist;
