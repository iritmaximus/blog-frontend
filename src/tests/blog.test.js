import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Blog } from "../components/Blog";



describe("Blog", () => {
  beforeEach(() => {
    const blog = {
      title: "Somewhere over the rainbow",
      author: "I don't know lol",
      url: "someurlprob.org",
      likes: 10,
      user: "not important atm"
    };
    const user = {
      token: "not important atm",
      username: "pöpö123",
      name: "Pöp",
    };
    const blogs = [blog];
    const setBlogs = jest.fn();
    const updateBlogs = jest.fn();
    render(<Blog user={user} blog={blog} updateBlogs={updateBlogs} blogs={blogs} setBlogs={setBlogs} />);
  });

  it("renders only title + author by default", async () => {
    const element = screen.getByText("Somewhere over the rainbow", { exact: false });
    expect(element).toBeDefined();
  });
  it("doesn't render url + likes by default", () => {
    const element = screen.getByText("someurlprob.org", { exact: false });
    expect(element).toHaveStyle("display: none");
  });
  it("renders likes + url after button is pressed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const element = screen.getByText("someurlprob.org", { exact: false });
    expect(element).not.toHaveStyle("display: none");
  });
  it("if like is pressed twice, the likes increase by 2", async () => {
    const token = fetch("/api/login", {
      method: "POST",
      body: {
        "username": "hi"
      }
    });

    const user = userEvent.setup();
    const button = screen.getByText("like");
    await user.click(button);
    await user.click(button);
    const element = screen.getByText("likes", { exact: false });

    expect(element).toContain(12);
  });
  it.todo("form calls handlerfunc with correct data");
});
