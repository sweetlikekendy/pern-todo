import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Todo } from "../Todo";

import { deleteTodolist, editTodolist } from "./crud";
import { addTodo } from "../Todo";

import { Button, Input, TodolistContainer } from "../../styles";

// const TodolistContainer = styled.div`
//   margin: 8px;
//   padding: 1.25rem;
//   border: 1px solid lightgrey;
//   border-radius: 2px;
//   background-color: white;
//   box-shadow: ${(props) =>
//     props.isDragging ? "10px 10px 50px -8px rgba(0, 0, 0, 0.32)" : "none"};
// `;

const List = styled.div`
  width: auto;
  padding: 8px;
  background-color: ${(props) =>
    props.isDraggingOver ? "skyblue" : "inherit"};
`;

const Todolist = ({ index, jwt, todolist, todos, setFetching }) => {
  const [newTodo, setNewTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolist.title);

  const userId = todolist.userId;
  const todolistId = todolist.id;

  const editTodolistOnKeyPress = (event) => {
    const { key } = event;

    if (key === "Enter") {
      editTodolist(jwt, userId, todolistId, newTodolist);
      setFetching(true);
    }
  };
  const addTodoOnKeyPress = (event) => {
    const { key } = event;

    if (key === "Enter") {
      addTodo(jwt, userId, todolistId, newTodo);
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
          <div className="flex">
            <Button
              isClose
              onClick={() => {
                deleteTodolist(jwt, userId, todolistId);
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
            type="text"
            name="todo"
            value={newTodo}
            placeholder="Enter todo here"
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => addTodoOnKeyPress(e)}
          />
          <Droppable droppableId={todolist.dndId} type="todo">
            {(provided, snapshot) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {todos.map((todo, i) => (
                  <Todo
                    key={todo.id}
                    jwt={jwt}
                    todo={todo}
                    userId={userId}
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
