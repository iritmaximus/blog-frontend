import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import { Blog } from "../Blog";


describe("Blogs", () => {
  it.todo("renders only title + author by default");
  it.todo("doesn't render url + likes by default");
  it.todo("renders likes + url after button is pressed");
  it.todo("if like is pressed twice, same handlerfunc is called twice");
  it.todo("form calls handlerfunc with correct data");
});
