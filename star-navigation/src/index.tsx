import React from "react";
import { createRoot } from "react-dom/client";
import { Interactive } from "./components/interactive";
import "./index.scss";

const container = document.getElementById("app");

if (container) {
  const root = createRoot(container);
  root.render(<Interactive />);
}
