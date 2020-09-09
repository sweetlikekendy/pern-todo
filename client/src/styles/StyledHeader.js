import tw, { styled, css, theme } from "twin.macro";

const StyledHeader = styled.header(() => [
  tw`p-4 bg-red-100`,
  css`
    nav a {
      ${tw`m-1 uppercase `}
    }
  `,
]);

export default StyledHeader;
