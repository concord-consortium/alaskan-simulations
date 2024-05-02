import * as React from "react";
import { IRuntimeInitInteractive } from "@concord-consortium/lara-interactive-api";
import { IAuthoredState, IInteractiveState } from "../../types";
import { App } from "../app";

interface Props {
  initMessage: IRuntimeInitInteractive<IInteractiveState, IAuthoredState>;
}

export const RuntimeComponent: React.FC<Props> = ({ initMessage }) => {
  const interactiveState = initMessage.interactiveState;

  return (
    <App
      interactiveState={interactiveState}
    />
  );
};
