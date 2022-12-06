import { createContext, MouseEvent } from "react";

interface IClickToDragContext {
  selectedDraggableId?: string;
  selectedDroppableId?: string;
  onDraggableClick: (draggableId: string, droppableId: string | undefined, event: MouseEvent) => void;
  onDroppableClick: (droppableId: string) => void;
}

export const ClickToDragContext = createContext<IClickToDragContext>({
  onDraggableClick: () => { /* noop */ },
  onDroppableClick: () => { /* noop */ }
});
