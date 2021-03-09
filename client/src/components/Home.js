import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import axios from "axios";

import Todolists from "./Todolists";
import { addTodolist } from "./Todolist";
import { TODOLISTS_URI, TODOS_URI } from "../endpoints";
import {
  CenterContainer,
  Container,
  CustomLink,
  Input,
  JustifyCenterHfullContainer,
  JustifyCenterContainer,
} from "../styles";

const Home = ({
  firstName,
  userId,
  isLoggedIn,
  jwt,
  fetching,
  setFetching,
  setPersistedData,
  stateData,
  setStateData,
}) => {
  const [newTodolist, setNewTodolist] = useState("");
  const { numOfTodolists, todolistOrder, todolists, todos } = stateData;

  const addTodolistOnKeyPress = (event) => {
    const { key } = event;

    if (key === "Enter") {
      addTodolist(jwt, userId, newTodolist, setNewTodolist);
      setNewTodolist("");
      setFetching(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        console.log(`fetching data`);
        // new stuff with react beautiful dnd and state
        await axios
          .get(TODOLISTS_URI(userId), {
            headers: {
              Authorization: jwt,
            },
          })
          .then(async (response) => {
            const { data } = response;
            console.log(data);
            await setPersistedData(data);
            await setStateData(data);
            // const { todolists } = data;
            // const promises = [];

            // Get all the todos in a todolist
            // // Push onto promises array
            // for (let i = 0; i < todolists.length; i++) {
            //   promises.push(
            //     axios.get(TODOS_URI(userId, todolists[i].id), {
            //       headers: {
            //         Authorization: jwt,
            //       },
            //     })
            //   );
            // }

            // // Execute the array of promises
            // await Promise.all(promises)
            //   .then(async (results) => {
            //     const tmpData = {
            //       numOfTodolists,
            //       todos: {},
            //       todolists: {},
            //       todolistOrder: [],
            //     };
            //     const tmpTodos = [];
            //     results.map(({ data }, i) => {
            //       const { todos, numOfTodos } = data;

            //       // Create an array with all the todos in there
            //       todos.map((todo) => {
            //         tmpTodos.push(todo);
            //       });
            //     });

            //     tmpTodos.map((todo, i) => {
            //       const { id, todolist_id, description, title, created_at, updated_at, first_name, last_name } = todo;
            //       if (todo.created_at === null) {
            //         return;
            //       }
            //       if (todo.created_at !== null) {
            //         tmpData.todos[`todo-${id}`] = {
            //           id,
            //           dndId: `todo-${id}`,
            //           todolistId: todolist_id,
            //           todolistTitle: title,
            //           content: description,
            //           createdAt: created_at,
            //           updatedAt: updated_at,
            //           firstName: first_name,
            //           lastName: last_name,
            //         };
            //       }
            //     });
            //     todolists.map((todolist, i) => {
            //       const { id, user_id, title, created_at, updated_at, first_name, last_name } = todolist;
            //       tmpData.todolists[`todolist-${id}`] = {
            //         id,
            //         dndId: `todolist-${id}`,
            //         userId: user_id,
            //         title,
            //         createdAt: created_at,
            //         updatedAt: updated_at,
            //         firstName: first_name,
            //         lastName: last_name,
            //         todoIds: [],
            //       };
            //       tmpData.todolistOrder.push(`todolist-${id}`);
            //     });

            //     const todoEntries = Object.entries(tmpData.todos);
            //     const todolistEntries = Object.entries(tmpData.todolists);

            //     // Set the todos ids to their respective todolists
            //     todolistEntries.map((todolistEntry, i) => {
            //       return todoEntries.map((todoEntry, j) => {
            //         // if there is a match
            //         if (todoEntry[1].todolistId === todolistEntry[1].id) {
            //           const todolistId = todolistEntry[1].id;
            //           tmpData.todolists[`todolist-${todolistId}`].todoIds.push(todoEntries[j][0]);
            //         }
            //       });
            //     });

            //     // set number of todolists
            //     tmpData[`numOfTodolists`] = Object.keys(tmpData.todolists).length;
            //     await setPersistedData(tmpData);
            //     await setStateData(tmpData);
            //   })
            //   .catch((error) => console.error(error.response.request));
          })
          .catch((error) => console.error(error.response.request));
      }
    };

    if (fetching) {
      fetchData();
      setFetching(false);
    }
  }, [fetching, setFetching]);

  return (
    <Container>
      {isLoggedIn ? (
        <JustifyCenterHfullContainer>
          <JustifyCenterContainer>
            <div className="my-8" style={{ minWidth: "30%" }}>
              <h2>Hello, {firstName}</h2>
              <p className="mb-4">
                You have {numOfTodolists}
                {numOfTodolists === 1 ? <span> todolist</span> : <span> todolists</span>}
              </p>
              <Input
                full
                border
                type="text"
                name="title"
                value={newTodolist}
                placeholder="Enter todolist title here"
                onChange={(e) => setNewTodolist(e.target.value)}
                onKeyPress={(e) => addTodolistOnKeyPress(e)}
              />
            </div>
          </JustifyCenterContainer>
          <Todolists
            todolistOrder={todolistOrder}
            todolists={todolists}
            todos={todos}
            jwt={jwt}
            userId={userId}
            setFetching={setFetching}
            stateData={stateData}
            setPersistedData={setPersistedData}
          />
        </JustifyCenterHfullContainer>
      ) : (
        <CenterContainer>
          <p>
            Not logged in. Click <CustomLink text="here" linkTo="/login" /> to login
          </p>
        </CenterContainer>
      )}
    </Container>
  );
};

Home.propTypes = {};

export default Home;
