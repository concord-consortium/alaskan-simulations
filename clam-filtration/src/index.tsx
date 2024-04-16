import React from "react";
import { createRoot } from "react-dom/client";
import { InteractiveApp } from "./components/interactive/interactive-app";
import Shutterbug from "shutterbug";
import "./index.scss";

Shutterbug.enable("#app");

const container = document.getElementById("app");

if (container) {
  const root = createRoot(container);
  root.render(<InteractiveApp />);
}
