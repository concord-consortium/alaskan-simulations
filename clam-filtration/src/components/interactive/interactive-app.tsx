import React, { useEffect } from "react";
import { useInitMessage, setSupportedFeatures } from "@concord-consortium/lara-interactive-api";
import { IInteractiveState } from "../../types";
import { App } from "../app";

interface Props { }

export const InteractiveApp = (props: Props) => {
  const initMessage = useInitMessage<IInteractiveState>();
  const interactiveStateRef = React.useRef<IInteractiveState | null>(null);
//TODO need to figure out how to load saved interactive state
  useEffect(() => {
    if (initMessage) {
      setSupportedFeatures({
        authoredState: false,
        interactiveState: true
      });
      interactiveStateRef.current =  null;

    }
  }, [initMessage]);

  switch (initMessage?.mode || "runtime") {
    case "runtime":
      return <App interactiveState={interactiveStateRef.current} />;
    case "authoring":
      return <>This interactive does not provide authoring interface</>;
    case "report":
      return <App interactiveState={interactiveStateRef.current} readOnly={true} />;
    default:
      return <>Error: unknown or unsupported mode: {initMessage?.mode}</>;
  }
};
