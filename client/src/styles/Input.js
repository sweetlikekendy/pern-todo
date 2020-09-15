import tw, { styled, css } from "twin.macro";

const Input = styled.input(({ border, full, marginBottom }) => [
  tw`rounded-md py-2 px-4`,
  full ? tw`w-full` : tw``,
  marginBottom && tw`mb-4`,
  border && tw`border`,
]);

export default Input;
