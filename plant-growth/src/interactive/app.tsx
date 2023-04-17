import * as React from "react";
const { useEffect } = React;
// import ResizeObserver from "resize-observer-polyfill";

import { useInitMessage, setSupportedFeatures } from "@concord-consortium/lara-interactive-api";
import { AuthoringComponent } from "./authoring";
import { ReportComponent } from "./report";
import { RuntimeComponent } from "./runtime";
import { IAuthoredState, IInteractiveState } from "../types";

interface Props {}

export const App = (props:Props) => {
  const initMessage = useInitMessage<IInteractiveState, IAuthoredState>();

  useEffect(() => {
    if (initMessage) {
      setSupportedFeatures({
        authoredState: true,
        interactiveState: true
      });
    }
  }, [initMessage]);

  if (!initMessage) {
    return (
      <div className="centered">
        <div className="progress">
          Loading...
        </div>
      </div>
    );
  }

  switch (initMessage.mode) {
    case "authoring":
      return <AuthoringComponent initMessage={initMessage} />;
    case "report":
      return <ReportComponent initMessage={initMessage} />;
    case "runtime":
      return <RuntimeComponent initMessage={initMessage} />;
    default:
      return <>Error: unknown or unsupported mode: {initMessage.mode}</>;
  }
};
