import * as React from "react";
import { IAuthoringInitInteractive, useAuthoredState } from "@concord-consortium/lara-interactive-api";
import { IAuthoredState } from "../types";

interface Props {
  initMessage: IAuthoringInitInteractive<IAuthoredState>;
}


export const AuthoringComponent: React.FC<Props> = ({initMessage}) => {
  // const { authoredState, setAuthoredState } = useAuthoredState<IAuthoredState>();

  return (
    <div className="padded">
    </div>
  );
};
