import React from "react";
import { render, screen } from "@testing-library/react";
import { SimulationFrame } from "./simulation-frame";

describe("SimulationFrame component", () => {
  it("renders simulation frame and title", () => {
    render(
      <SimulationFrame title="Sim Title" directions="Directions" />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
    expect(screen.getByTestId("simulation-frame")).toHaveTextContent("Sim Title");
  });
});
