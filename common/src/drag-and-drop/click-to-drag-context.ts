import { createContext, MouseEvent } from "react";

interface IClickToDragContext {
  selectedDraggableId?: string;
  selectedDroppableId?: string;
  dragPreviewPosition?: {x: number; y: number};
  onDraggableClick: (draggableId: string, droppableId: string | undefined, event: MouseEvent) => void;
  onDroppableClick: (droppableId: string) => void;
}

export const ClickToDragContext = createContext<IClickToDragContext>({
  onDraggableClick: () => { /* noop */ },
  onDroppableClick: () => { /* noop */ }
});
