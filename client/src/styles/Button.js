import tw, { styled, css, theme } from "twin.macro";

const Button = styled.button(({ full, marginBottom, isClose, isPrimary, isSecondary, disabled }) => [
  tw`rounded-md px-1 py-2 font-bold outline-none `,
  full && tw`w-full`,
  marginBottom && tw`mb-4 `,
  !disabled &&
    tw`hover:bg-green-600 focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring focus:ring-green-700 focus:ring-offset-2 `,
  isClose && tw`text-red-500 border border-red-500`,
  // css`
  //   padding: 0.5rem 1rem;
  //   font-weight: 700;
  //   color: red;
  //   border: 1px solid red;
  // `,

  isPrimary && tw`text-white bg-green-500`,
  isSecondary &&
    css`
      padding: 0.5rem 1rem;
      font-weight: 700;
      color: green;
      border: 1px solid green;
    `,
  disabled && tw`bg-green-400 cursor-not-allowed`,
]);

export default Button;
