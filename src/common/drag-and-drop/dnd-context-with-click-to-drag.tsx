import React, { useEffect, useState } from "react";
import {
  DndContext, DndContextProps, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { getBaseDraggableId, getDroppableId, getTargetDroppableId } from "./draggable";
import { ClickToDragContext } from "./click-to-drag-context";

// Dragging action will be activated after user moves the draggable for at least 5 pixels before releasing mouse button.
// Otherwise, DndContextPropsWithClickToDrag assumes that it was a click that initiates the click-click behavior.
const minDistanceForDragActivation = 5; // px

export type UnifiedDragEndEvent = {
  draggableId: string;
  droppableId?: string;
  targetDroppableId?: string;
};

export interface DndContextPropsWithClickToDrag extends DndContextProps {
  // This handler is called both at the end of the regular drag and drop and the click-click action. It provides
  // processed draggableId, droppableId, and targetDroppableId.
  // Client code can still use the regular drag and drop events, but this might require processing of the IDs similarly
  // to what DndContextWithClickToDrag is doing.
  onUnifiedDragEnd: (event: UnifiedDragEndEvent) => void;
}

// This component is a wrapper around @dnd-kit DndContext component that adds click-click behavior handling.
// Besides regular drag and drop functionality (either using mouse, touch or keyboard), user can also click on
// a draggable to select it, and then click on a droppable to move the the draggable element.
// This is an accessibility pattern for low mobility users.
// This component is also responsible for handling some of the common scenarios like embedding a draggable inside
// a droppable element (that requires saving custom data and dealing with raw and processed IDs).
export const DndContextWithClickToDrag: React.FC<DndContextPropsWithClickToDrag> = (props) => {
  const { children, onDragEnd, onUnifiedDragEnd, ...dndCtxProps } = props;

  // Draggable becomes selected at the beginning of the click-click interaction.
  const [ selectedDraggableId, setSelectedDraggableId ] = useState<string>();
  const [ selectedDroppableId, setSelectedDroppableId ] = useState<string>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // This constraint is necessary so that the draggable is selected when user clicks on it.
        distance: minDistanceForDragActivation
      }
    }),
    useSensor(KeyboardSensor, {})
  );

  useEffect(() => {

    const windowClickHandler = () => {
      // Cancel click-click action if user clicks anywhere on the page. Also, it stops the selection after user
      // clicks on a droppable. Window click handler is executed as the last one (event bubbling).
      setSelectedDraggableId(undefined);
      setSelectedDroppableId(undefined);

      if (selectedDraggableId && selectedDroppableId) {
        // This lets user remove the draggable by clicking anywhere on the page. Note that if user clicked on
        // other droppable, it's been handled and draggable is moved there already. This call will ensure that
        // selectedDroppableId becomes empty.
        onUnifiedDragEnd({
          // getBaseDraggableId will remove _INSIDE_<selectedDroppableId> from the raw ID if necessary.
          draggableId: getBaseDraggableId({ rawId: selectedDraggableId, droppableId: selectedDroppableId }),
          droppableId: selectedDroppableId,
          targetDroppableId: undefined
        });
      }
    };
    const windowKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace" || event.key === "Escape") {
        setSelectedDraggableId(undefined);
        setSelectedDroppableId(undefined);
      }
    };
    window.addEventListener("click", windowClickHandler);
    window.addEventListener("keydown", windowKeyDownHandler);
    return () => {
      window.removeEventListener("click", windowClickHandler);
      window.removeEventListener("keydown", windowKeyDownHandler);
    };
  }, [onUnifiedDragEnd, selectedDraggableId, selectedDroppableId]);

  const onDraggableClick = (draggableId: string, droppableId: string | undefined, event: React.MouseEvent) => {
    setSelectedDraggableId(draggableId);
    setSelectedDroppableId(droppableId);
    // Prevent executing window click handlers that would immediately clear the selection (see useEffect above).
    event.stopPropagation();
  };

  const onDroppableClick = (targetDroppableId: string) => {
    if (selectedDraggableId) {
      onUnifiedDragEnd({
        // getBaseDraggableId will remove _INSIDE_<selectedDroppableId> from the raw ID if necessary.
        draggableId: getBaseDraggableId({ rawId: selectedDraggableId, droppableId: selectedDroppableId }),
        droppableId: selectedDroppableId,
        targetDroppableId
      });
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    // Call raw onDragEnd if provided.
    onDragEnd?.(e);
    // And the "unified" version with processed IDs.
    const rawId = e.active.id;
    const droppableId = getDroppableId(e);
    props.onUnifiedDragEnd({
      draggableId: getBaseDraggableId({ rawId, droppableId }),
      droppableId,
      targetDroppableId: getTargetDroppableId(e)
    });
  };

  const selectedDraggableContextValue = {
    selectedDraggableId,
    selectedDroppableId,
    onDraggableClick,
    onDroppableClick
  };

  return (
    <DndContext {...dndCtxProps} sensors={sensors} onDragEnd={handleDragEnd}>
      <ClickToDragContext.Provider value={selectedDraggableContextValue}>
        { children }
      </ClickToDragContext.Provider>
    </DndContext>
  );
};
