import React, { useEffect } from "react";
import { useInitMessage, setSupportedFeatures } from "@concord-consortium/lara-interactive-api";
import { IAuthoredState, IInteractiveState } from "../../types";
import { App } from "../app";

interface Props { }

export const InteractiveApp = (props: Props) => {
  const initMessage = useInitMessage<IInteractiveState, IAuthoredState>();

  useEffect(() => {
    if (initMessage) {
      setSupportedFeatures({
        authoredState: true,
        interactiveState: true
      });
    }
  }, [initMessage]);
  
  switch (initMessage?.mode || "runtime") {
    case "runtime":
      return <App />;
    case "authoring":
      return <>This interactive does not provide authoring interface</>;
    case "report":
      return <App readOnly={true} />;
    default:
      return <>Error: unknown or unsupported mode: {initMessage?.mode}</>;
  }
};
