import tw, { styled, css, theme } from "twin.macro";

const Form = styled.form(() => [
  tw``,
  css`
    input {
      ${tw`mb-4 border py-2 px-4 rounded-md w-full`}
    }
  `,
]);

export default Form;
