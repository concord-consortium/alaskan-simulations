import * as React from "react";
import { getInteractiveState, IRuntimeInitInteractive, useInteractiveState } from "@concord-consortium/lara-interactive-api";
import { IAuthoredState, IInteractiveState } from "../types";
import { App } from "../app/components/app";

interface Props {
  initMessage: IRuntimeInitInteractive<IInteractiveState, IAuthoredState>;
}

export const RuntimeComponent: React.FC<Props> = ({initMessage}) => {
  const { setInteractiveState } = useInteractiveState<IInteractiveState>();
  const interactiveState = getInteractiveState<IInteractiveState>();
  const { authoredState } = initMessage;

  return (
      <App
        interactiveState={interactiveState}
        setInteractiveState={setInteractiveState}
        authoredState={authoredState}
      />
  );
};
