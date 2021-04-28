import tw, { styled, css } from "twin.macro";

const List = styled.div(({ isDraggingOver }) => [
  tw`h-full`,
  isDraggingOver
    ? tw`bg-blue-400`
    : css`
        background-color: inherit;
      `,
]);

export default List;
