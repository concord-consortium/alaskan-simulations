import { useContext } from "react";
import { ClickToDragContext } from "./click-to-drag-context";

// This hook should be used by Draggable component that want to support click-click behavior.
// rawDraggableId is an ID that possibly includes _INSIDE_<droppableId> suffix.
export const useClickToDragDraggable = (rawDraggableId: string, droppableId?: string) => {
  const { selectedDraggableId, onDraggableClick } = useContext(ClickToDragContext);
  return { selectedDraggableId, onClick: onDraggableClick.bind(null, rawDraggableId, droppableId) };
};

// This hook should be used by components that implement Droppable behavior and want to support click-click behavior.
export const useClickToDragDroppable = (droppableId: string) => {
  const { onDroppableClick, selectedDraggableId } = useContext(ClickToDragContext);
  return { onClick: onDroppableClick.bind(null, droppableId), anyDraggableSelected: !!selectedDraggableId };
};
