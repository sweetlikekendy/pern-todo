import tw, { styled, css, theme } from "twin.macro";

const Button = styled.button(({ isPrimary, isSecondary, isTertiary }) => [
  tw`mb-4 rounded-md w-full`,
  tw`hocus:(scale-105 text-yellow-400)`,
  isPrimary &&
    css`
      background-color: green;
      color: white;
      font-weight: 700;
      padding: 0.5rem 1rem;
    `,
  isSecondary &&
    css`
      border: 1px solid green;
      color: green;
      font-weight: 700;
      padding: 0.5rem 1rem;
    `,
]);

export default Button;
