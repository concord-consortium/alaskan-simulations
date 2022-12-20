import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./app";
import { t } from "../translation/translate";
import { setInteractiveState } from "@concord-consortium/lara-interactive-api";

describe("App component", () => {
  it("renders simulation frame and title", () => {
    render(
      <App
        interactiveState={null}
        authoredState={null}
        setInteractiveState={setInteractiveState}
      />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
    expect(screen.getByTestId("simulation-frame")).toHaveTextContent(t("SIMULATION.TITLE"));
  });
});
