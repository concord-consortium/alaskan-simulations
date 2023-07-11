import { useCallback } from "react";
import { useInteractiveState } from "@concord-consortium/lara-interactive-api";

export const useSaveInteractiveState = () => {
  const { setInteractiveState } = useInteractiveState<any>();

  const saveInteractiveState = useCallback((updates: any) => {
    setInteractiveState((prevState: any) => {
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
