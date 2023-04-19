import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DndContext, DndContextProps, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor, DragStartEvent } from "@dnd-kit/core";
import { getBaseDraggableId, getDroppableId, getTargetDroppableId } from "./draggable";
import { ClickToDragContext } from "./click-to-drag-context";

// Dragging action will be activated after user moves the draggable for at least 5 pixels before releasing mouse button.
// Otherwise, DndContextPropsWithClickToDrag assumes that it was a click that initiates the click-click behavior.
const minDistanceForDragActivation = 5; // px

export type UnifiedDragStartEvent = {
  draggableId: string;
  droppableId?: string;
  targetDroppableId?: string;
};

export type UnifiedDragEndEvent = {
  draggableId: string;
  droppableId?: string;
  targetDroppableId?: string;
};

export interface DndContextPropsWithClickToDrag extends DndContextProps {
  // These handlers are called both at the beginning and enf of the regular drag and drop and the click-click action.
  // They provide processed draggableId, droppableId, and targetDroppableId (only the end event).
  // Client code can still use the regular drag and drop events, but this might require processing of the IDs similarly
  // to what DndContextWithClickToDrag is doing.
  onUnifiedDragStart?: (event: UnifiedDragStartEvent) => void;
  onUnifiedDragEnd: (event: UnifiedDragEndEvent) => void;
}

// This component is a wrapper around @dnd-kit DndContext component that adds click-click behavior handling.
// Besides regular drag and drop functionality (either using mouse, touch or keyboard), user can also click on
// a draggable to select it, and then click on a droppable to move the the draggable element.
// This is an accessibility pattern for low mobility users.
// This component is also responsible for handling some of the common scenarios like embedding a draggable inside
// a droppable element (that requires saving custom data and dealing with raw and processed IDs).
export const DndContextWithClickToDrag: React.FC<DndContextPropsWithClickToDrag> = (props) => {
  const { children, onDragStart, onUnifiedDragStart, onDragEnd, onUnifiedDragEnd, ...dndCtxProps } = props;

  // Draggable becomes selected at the beginning of the click-click interaction.
  const [ selectedDraggableId, setSelectedDraggableId ] = useState<string>();
  const [ selectedDroppableId, setSelectedDroppableId ] = useState<string>();
  const [ dragPreviewPosition, setDragPreviewPosition ] = useState<{x: number, y: number} | undefined>();
  const dragPreviewInitialPosition  = useRef<{x: number, y: number} | undefined>();

  const clickToDragActive = !!selectedDraggableId;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // This constraint is necessary so that the draggable is selected when user clicks on it.
        distance: minDistanceForDragActivation
      }
    }),
    useSensor(KeyboardSensor, {})
  );

  const cancelClickToDrag = useCallback(() => {
    setSelectedDraggableId(undefined);
    setSelectedDroppableId(undefined);
    setDragPreviewPosition(undefined);
  }, []);

  useEffect(() => {
    const windowClickHandler = () => {
      // Cancel click-click action if user clicks anywhere on the page. Also, it stops the selection after user
      // clicks on a droppable. Window click handler is executed as the last one (event bubbling).
      cancelClickToDrag();

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
        cancelClickToDrag();
      }
    };
    const windowMouseMoveHandler = (e: MouseEvent) => {
      setDragPreviewPosition({
        x: e.screenX - (dragPreviewInitialPosition.current?.x || 0),
        y: e.screenY - (dragPreviewInitialPosition.current?.y || 0)
      });
    };

    if (clickToDragActive) {
      // Add handlers only when the click-to-click is active.
      window.addEventListener("click", windowClickHandler);
      window.addEventListener("keydown", windowKeyDownHandler);
      window.addEventListener("mousemove", windowMouseMoveHandler);
    }

    return () => {
      window.removeEventListener("click", windowClickHandler);
      window.removeEventListener("keydown", windowKeyDownHandler);
      window.removeEventListener("mousemove", windowMouseMoveHandler);
    };
  }, [onUnifiedDragEnd, selectedDraggableId, selectedDroppableId, clickToDragActive, cancelClickToDrag]);

  const onDraggableClick = (draggableId: string, droppableId: string | undefined, event: React.MouseEvent) => {
    if (clickToDragActive) {
      // This is unlikely, but possible. User might initiate the click-click action, but then active another
      // draggable using keyboard (focus + enter or spacebar is still recognized as click action).
      return;
    }

    dragPreviewInitialPosition.current = { x: event.screenX, y: event.screenY };

    setDragPreviewPosition(undefined);
    setSelectedDraggableId(draggableId);
    setSelectedDroppableId(droppableId);
    // Prevent executing window click handlers that would immediately clear the selection (see useEffect above).
    event.stopPropagation();

    onUnifiedDragStart?.({
      // getBaseDraggableId will remove _INSIDE_<selectedDroppableId> from the raw ID if necessary.
      draggableId: getBaseDraggableId({ rawId: draggableId, droppableId }),
      droppableId
    });
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
    setDragPreviewPosition(undefined);
  };

  const handleDragStart = (e: DragStartEvent) => {
    // Call raw onDragEnd if provided.
    onDragStart?.(e);
    // And the "unified" version with processed IDs.
    const rawId = e.active.id;
    const droppableId = getDroppableId(e);
    onUnifiedDragStart?.({
      draggableId: getBaseDraggableId({ rawId, droppableId }),
      droppableId
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    // Call raw onDragEnd if provided.
    onDragEnd?.(e);
    // And the "unified" version with processed IDs.
    const rawId = e.active.id;
    const droppableId = getDroppableId(e);
    onUnifiedDragEnd({
      draggableId: getBaseDraggableId({ rawId, droppableId }),
      droppableId,
      targetDroppableId: getTargetDroppableId(e)
    });
  };

  const selectedDraggableContextValue = {
    selectedDraggableId,
    selectedDroppableId,
    dragPreviewPosition,
    onDraggableClick,
    onDroppableClick
  };

  return (
    <DndContext {...dndCtxProps} sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <ClickToDragContext.Provider value={selectedDraggableContextValue}>
        { children }
      </ClickToDragContext.Provider>
    </DndContext>
  );
};
