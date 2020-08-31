import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Todo } from "../Todo";

import { deleteTodolist, editTodolist } from "./crud";
import { addTodo } from "../Todo";

const TodolistContainer = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: white;
  box-shadow: ${(props) =>
    props.isDragging ? "10px 10px 50px -8px rgba(0, 0, 0, 0.32)" : "none"};
`;

const Title = styled.h3`
  padding: 8px;
`;

const List = styled.div`
  padding: 8px;
  background-color: ${(props) =>
    props.isDraggingOver ? "skyblue" : "inherit"};
`;

const Button = styled.button`
  padding: 8px;
  margin: 8px;
`;

const Todolist = ({ index, jwt, todolist, todos, setFetching }) => {
  const [newTodo, setNewTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolist.title);
  const [showInput, setShowInput] = useState(false);

  const userId = todolist.userId;
  const todolistId = todolist.id;

  const showEditTodolist = () => {
    setShowInput(true);
  };

  const hideEditTodolist = () => {
    setShowInput(false);
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
          <Title>
            <Button
              onClick={() => {
                deleteTodolist(jwt, userId, todolistId);
                setFetching(true);
              }}
            >
              X
            </Button>
            {todolist.title}
            {showInput ? (
              <label>
                <input
                  type="text"
                  name="todo"
                  value={newTodolist}
                  onChange={(e) => {
                    setNewTodolist(e.target.value);
                    setFetching(true);
                  }}
                />
              </label>
            ) : (
              ""
            )}
            {showInput ? (
              <div>
                <Button
                  onClick={() => {
                    editTodolist(jwt, userId, todolistId, newTodolist);
                    setNewTodolist("");
                    hideEditTodolist();
                    setFetching(true);
                  }}
                >
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    hideEditTodolist();
                  }}
                >
                  Close
                </Button>
              </div>
            ) : (
              <Button onClick={() => showEditTodolist()}>Edit Title</Button>
            )}{" "}
            | {todos.length} todos
          </Title>
          <label>
            <input
              type="text"
              name="todo"
              value={newTodo}
              placeholder="Enter todo here"
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </label>
          <Button
            onClick={() => {
              if (newTodo) {
                addTodo(jwt, userId, todolistId, newTodo);
                setNewTodo("");
                setFetching(true);
              }
            }}
          >
            Add new todo
          </Button>
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
