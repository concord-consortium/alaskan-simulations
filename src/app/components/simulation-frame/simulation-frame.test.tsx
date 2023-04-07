import React from "react";
import { render, screen } from "@testing-library/react";
import { SimulationFrame } from "./simulation-frame";

describe("SimulationFrame component", () => {
  it("renders simulation frame", () => {
    const readOnly = false;
    render(
      <SimulationFrame title="Sim Title" directions="Directions" t={(string) => readOnly ? <a href="">{string}</a> : string} />
    );
    expect(screen.getByTestId("simulation-frame")).toBeInTheDocument();
  });
});
