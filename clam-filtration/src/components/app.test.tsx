import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./app";

describe("App component", () => {
  it("renders simulation frame and title", () => {
    render(
      <App />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
  });
});
