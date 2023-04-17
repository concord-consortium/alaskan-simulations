import React from "react";
import { render, screen } from "@testing-library/react";
import { t } from "common";
import { App } from "./app";

jest.mock("../orbit-view/components/orbit-view-wrapper", () => ({
  OrbitViewWrapper: () => null
}));
jest.mock("../horizon-view/components/horizon-view-wrapper", () => ({
  HorizonViewWrapper: () => null
}));

describe("App component", () => {
  it("renders simulation frame and title", () => {
    render(
      <App />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
    expect(screen.getByTestId("simulation-frame")).toHaveTextContent(t("SIMULATION.TITLE"));
  });
});
