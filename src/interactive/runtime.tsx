import * as React from "react";
// const { useEffect, useState} = React;
import { IRuntimeInitInteractive, useInteractiveState } from "@concord-consortium/lara-interactive-api";
import { IAuthoredState, IInteractiveState } from "../types";
import { App } from "../app/components/app";

interface Props {
  initMessage: IRuntimeInitInteractive<IInteractiveState, IAuthoredState>;
}

export const RuntimeComponent: React.FC<Props> = ({initMessage}) => {
  const { interactiveState, setInteractiveState } = useInteractiveState<IInteractiveState>();
  const { authoredState } = initMessage;
  return (
      <App
        interactiveState={interactiveState}
        setInteractiveState={setInteractiveState}
        authoredState={authoredState}
      />
  );
};
