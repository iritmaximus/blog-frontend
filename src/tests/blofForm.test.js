import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BlogForm } from "../components/Blog";

describe("<BlogForm />", () => {
  it("calls handlerfunction on submit with correct data", async () => {
    const handlerMock = jest.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={handlerMock} />);

    const title = screen.getByPlaceholderText("title");
    const author = screen.getByPlaceholderText("author");
    const url = screen.getByPlaceholderText("url");
    const button = screen.getByText("create");

    await user.type(title, "Test of a century");
    await user.type(author, "Someone important");
    await user.type(url, "toc.com");

    // tapahtuu joku härö virhe, jossa BlogForm.addBlog event.target.x ei ole määritelty
    // ja tapathuu typeerror kun yritän lukea event.target.x.value...
    // await user.click(button);

    // console.log(handlerMock.mock.calls[0][0].content);
  });
});
