import React, { useState } from "react";
import AutosizeInput from "react-input-autosize";
import tw, { styled, css } from "twin.macro";
import { editTodo } from "../components/Todo";

// const Input = styled(AutosizeInput)(({ border, full, marginBottom }) => [
//     tw`rounded-md py-2 px-4`,
//     full ? tw`w-full` : tw``,
//     marginBottom && tw`mb-4`,
//     border && tw`border`,
// ]); ;

const Input = styled.input(({ border, full, marginBottom }) => [
  tw`rounded-md py-2 px-4 focus:shadow-2xl`,
  full ? tw`w-full` : tw``,
  marginBottom && tw`mb-4`,
  border && tw`border border-gray-300`,
]);

// const Input = ({
//   isTodoInput,
//   type,
//   name,
//   jwt,
//   userId,
//   todolistId,
//   todoId,
//   content,
//   setFetching,
// }) => {
//   const [newTodo, setNewTodo] = useState(content);

//   const editTodoOnKeyPress = (event) => {
//     const { key } = event;

//     if (key === "Enter") {
//       editTodo(jwt, userId, todolistId, todoId, newTodo);
//       setFetching(true);
//     }
//   };

//   return (
//     <StyledInput
//       type={type}
//       name={name}
//       value={newTodo}
//       onChange={(e) => setNewTodo(e.target.value)}
//       onKeyPress={(e) => editTodoOnKeyPress(e)}
//     />
//   );
// };

// <AutosizeInput
//   name="form-field-name"
//   value={inputValue}
//   onChange={function (event) {
//     // event.target.value contains the new value
//   }}
// />;

export default Input;
