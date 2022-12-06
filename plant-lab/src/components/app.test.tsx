import React from "react";
import { render, screen } from "@testing-library/react";
import { t } from "common";
import { App } from "./app";

describe("App component", () => {
  it("renders simulation frame and title", () => {
    render(
      <App />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
    expect(screen.getByTestId("simulation-frame")).toHaveTextContent(t("SIMULATION.TITLE"));
  });
});
