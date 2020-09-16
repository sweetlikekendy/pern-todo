import React from "react";
import AutosizeInput from "react-input-autosize";
import tw, { styled, css } from "twin.macro";

// const Input = styled(AutosizeInput)(({ border, full, marginBottom }) => [
//     tw`rounded-md py-2 px-4`,
//     full ? tw`w-full` : tw``,
//     marginBottom && tw`mb-4`,
//     border && tw`border`,
// ]); ;

const Input = styled.input(({ border, full, marginBottom }) => [
  tw`rounded-md py-2 px-4`,
  full ? tw`w-full` : tw``,
  marginBottom && tw`mb-4`,
  border && tw`border`,
]);

// <AutosizeInput
//   name="form-field-name"
//   value={inputValue}
//   onChange={function (event) {
//     // event.target.value contains the new value
//   }}
// />;

export default Input;
