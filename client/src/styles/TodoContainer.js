import tw, { styled, css } from "twin.macro";

const TodoContainer = styled.div(({ isDragging }) => [
  tw`flex p-4`,
  isDragging ? tw`bg-green-400` : tw`bg-white`,
]);

export default TodoContainer;
