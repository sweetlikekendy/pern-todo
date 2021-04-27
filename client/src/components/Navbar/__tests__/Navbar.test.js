import * as React from "react";
import { cleanup, render } from "@testing-library/react";

import Navbar from "../Navbar";

afterEach(cleanup);

describe("Button", () => {
  it(`renders the navbar`, () => {
    const classNameText = "testing";

    const { getByText } = render(<Navbar className="testing" />);

    const navbarClassName = getByText(classNameText);

    expect(navbarClassName).toBeTruthy();
  });
});
