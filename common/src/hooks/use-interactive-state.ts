import { useCallback } from "react";
import { useInteractiveState } from "@concord-consortium/lara-interactive-api";
import { IInteractiveState } from "../../../plant-growth/src/types";

export const useSaveInteractiveState = () => {
  const { setInteractiveState } = useInteractiveState<IInteractiveState>();

  const saveInteractiveState = useCallback((updates: any) => {
    setInteractiveState((prevState) => {
      return {
        answerType: "interactive_state",
        ...prevState,
        ...updates
      };
    });
  }, [setInteractiveState]);

  return {
    saveInteractiveState
  };
};
