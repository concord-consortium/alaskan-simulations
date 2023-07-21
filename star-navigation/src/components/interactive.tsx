import React, { useEffect } from "react";
import { useInitMessage, setSupportedFeatures } from "@concord-consortium/lara-interactive-api";
import { App } from "./app";
import { IInteractiveState } from "../types";

export const Interactive: React.FC = () => {
  const initMessage = useInitMessage<IInteractiveState>();

  useEffect(() => {
    if (initMessage) {
      setSupportedFeatures({
        authoredState: false,
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
