import * as React from "react";
import { IRuntimeInitInteractive } from "@concord-consortium/lara-interactive-api";
import { IAuthoredState, IInteractiveState } from "../types";
import { App } from "../app/components/app";

interface Props {
  initMessage: IRuntimeInitInteractive<IInteractiveState, IAuthoredState>;
}

export const RuntimeComponent: React.FC<Props> = ({initMessage}) => {
  const interactiveState = initMessage.interactiveState;;
  const { authoredState } = initMessage;

  return (
      <App
        interactiveState={interactiveState}
        authoredState={authoredState}
      />
  );
};
