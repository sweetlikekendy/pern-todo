import tw, { styled, css } from "twin.macro";

const Input = styled.input(({ full, noMargin }) => [
  tw`rounded-md border py-2 px-4`,
  full ? tw`w-full` : tw``,
  noMargin ? tw`` : tw`mb-4 `,
]);

export default Input;
