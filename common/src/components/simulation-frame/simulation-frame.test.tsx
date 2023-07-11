import React from "react";
import { render, screen } from "@testing-library/react";
import { SimulationFrame } from "./simulation-frame";

describe("SimulationFrame component", () => {
  it("renders simulation frame", () => {
    render(
      <SimulationFrame directions="Directions" />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
  });
});
