import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./app";

jest.mock("../horizon-view/components/horizon-view-wrapper", () => ({
  HorizonViewWrapper: () => null
}));

describe("App component", () => {
  it("renders simulation frame and title", () => {
    render(
      <App />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
  });
});
