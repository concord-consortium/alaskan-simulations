import * as React from "react";
import { IReportInitInteractive } from "@concord-consortium/lara-interactive-api";
import { IInteractiveState, IAuthoredState } from "../types";
import { App } from "../app/components/app";

interface Props {
  initMessage: IReportInitInteractive<IInteractiveState, IAuthoredState>;
}

export const ReportComponent: React.FC<Props> = ({initMessage}) => {
  const { interactiveState, authoredState} = initMessage;
  return (
    <div className="report">
      <App
        interactiveState={interactiveState}
        authoredState={authoredState}
        setInteractiveState={() => console.log("hello")}
        readOnly={true}
      />
    </div>
  );
};
