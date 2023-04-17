import * as React from "react";
import { IReportInitInteractive } from "@concord-consortium/lara-interactive-api";
import { IInteractiveState, IAuthoredState } from "../types";
import { App } from "../app/components/app";

import css from "./report.scss";

interface Props {
  initMessage: IReportInitInteractive<IInteractiveState, IAuthoredState>;
}

export const ReportComponent: React.FC<Props> = ({initMessage}) => {
  const { interactiveState, authoredState} = initMessage;
  return (
    <div className={css.report}>
      <App
        interactiveState={interactiveState}
        authoredState={authoredState}
        readOnly={true}
      />
    </div>
  );
};
