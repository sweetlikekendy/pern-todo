import tw, { styled, css } from "twin.macro";

const Input = styled.input(({ border, full, marginBottom }) => [
  tw`rounded-md py-2 px-4 focus:shadow-2xl`,
  full ? tw`w-full` : tw``,
  marginBottom && tw`mb-4`,
  border && tw`border border-gray-300`,
]);

export default Input;
