import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "@emotion/styled";
import { Droppable } from "react-beautiful-dnd";
import { Todo } from "../Todo";

import { SINGLE_TODOLIST_URI, SINGLE_TODO_URI } from "../../endpoints";

import { addTodolist, deleteTodolist, editTodolist } from "./crud";
import { addTodo } from "../Todo";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const List = styled.div`
  padding: 8px;
  background-color: ${(props) => (props.isDraggingOver ? "skyblue" : "white")};
`;

const Button = styled.button`
  padding: 8px;
  margin: 8px;
`;

const Todolist = ({
  todolist,
  todos,
  jwt,
  setFetching,
  reordering,
  setReordering,
  fetchData,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolist.title);
  const [showInput, setShowInput] = useState(false);

  const userId = todolist.userId;
  const todolistId = todolist.id;

  const showEditTodolist = () => {
    setShowInput(true);
  };

  useEffect(() => {
    if (reordering) {
      fetchData();
      setReordering(false);
    }
  }, [reordering]);

  return (
    <Container>
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
                if (newTodolist) {
                  setNewTodolist(e.target.value);
                  setFetching(true);
                }
              }}
            />
          </label>
        ) : (
          ""
        )}
        {showInput ? (
          <Button
            onClick={() => {
              editTodolist(jwt, userId, todolistId, newTodolist);
              setNewTodolist("");
              setShowInput(false);
              setFetching(true);
            }}
          >
            Submit
          </Button>
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
      <Droppable droppableId={todolist.dndId}>
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
    </Container>
  );
};

Todolist.propTypes = {};

export default Todolist;
