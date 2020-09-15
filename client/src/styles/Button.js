import tw, { styled, css, theme } from "twin.macro";

const Button = styled.button(
  ({ full, noMargin, isClose, isPrimary, isSecondary, isTertiary }) => [
    tw`rounded-md`,
    full ? tw`w-full` : tw``,
    noMargin ? tw`` : tw`mb-4 `,
    tw`hocus:(scale-105 text-yellow-400)`,
    isClose &&
      css`
        padding: 0.5rem 1rem;
        font-weight: 700;
        color: red;
        border: 1px solid red;
      `,

    isPrimary &&
      css`
        padding: 0.5rem 1rem;
        font-weight: 700;
        color: white;
        background-color: green;
      `,
    isSecondary &&
      css`
        padding: 0.5rem 1rem;
        font-weight: 700;
        color: green;
        border: 1px solid green;
      `,
  ]
);

export default Button;
