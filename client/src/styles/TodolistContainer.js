import tw, { styled, css } from "twin.macro";

const TodolistContainer = styled.div(({ isDragging }) => [
  tw`m-2 p-5 border border border-gray-300 rounded-md bg-white`,
  isDragging && tw`shadow-md`,
]);

export default TodolistContainer;
