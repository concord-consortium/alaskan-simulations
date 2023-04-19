import React, { useEffect, useRef } from "react";
import { DragEndEvent, DragStartEvent, useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { useClickToDragDraggable } from "./hooks";

import css from "./draggable.scss";

// Returns ID of droppable / dropzone that the dragged element started from.
export const getDroppableId = (e: DragEndEvent | DragStartEvent) => e.active.data?.current?.droppableId;

// Returns ID of droppable / dropzone that the dragged element is over.
export const getTargetDroppableId = (e: DragEndEvent) => e.over?.id;

export const getInsideDroppableSuffix = (droppableId?: string) => droppableId ? `_INSIDE_${droppableId}` : "";

export const getBaseDraggableId = ({ rawId, droppableId }: { rawId: string, droppableId?: string }) => {
  return droppableId ? rawId.substring(0, rawId.length - getInsideDroppableSuffix(droppableId).length) : rawId;
};

interface IProps {
  id: string;
  label: string; // currently only aria-label, necessary for screen readers
  disabled?: boolean;
  // ID of the droppable / dropzone that the Draggable is currently in.
  droppableId?: string;
  // Optional element that is attached to cursor when user is dragging it around. It can be different than basic button
  // that initiates drag action. If not defined, children will be used for drag preview.
  DragPreview?: React.ReactNode;
  // When this option is set to true, dragging action will move the original button (it'll leave its initial position).
  // When it's set to false, the original element will stay in place and user will move a copy of the button
  // (or `DragPreview` if defined).
  hideButtonOnDrag?: boolean;
}

export const Draggable: React.FC<IProps> = (props) => {
  const { id, label, disabled, droppableId, DragPreview, hideButtonOnDrag, children } = props;
  // When draggable button is inside the droppable / dropzone, we need to use another ID.
  // Two Draggables can't share the same ID. If they do, they'll react together to user dragging (so users would
  // drag two buttons at the same time).
  // Dealing with buttons inside and outside the dropzone could be implemented by the client, but it's a common
  // pattern so we can implement it here and let clients reuse the same logic.
  const idWithDroppable = id + getInsideDroppableSuffix(droppableId);
  const { selectedDraggableId, onClick, dragPreviewPosition: clickToDragPrviewPos } = useClickToDragDraggable(idWithDroppable, droppableId);

  const isSelected = selectedDraggableId === idWithDroppable;

  const { isDragging, active, attributes, listeners, setNodeRef, transform } = useDraggable({
    id: idWithDroppable,
    data: {
      droppableId
    },
    disabled: disabled || !!selectedDraggableId,
  });

  const originalBtnRef = useRef<HTMLButtonElement>(null);
  const previewBtnRef = useRef<HTMLButtonElement>(null);

  // Set dnd-kit ref to the drag preview, as it can have different dimensions than the original button.
  // Otherwise, the collision detection algorithm could work incorrectly.
  useEffect(() => {
    // Make sure setNodeRef is called at least once after the DOM is rendered.
    setNodeRef(previewBtnRef.current);
  });

  // If click to drag is active, it'll attach the preview to the mouse cursor. It should be used instead of the
  // default transform property provided by useDraggable hook.
  const dragPreviewPosition = clickToDragPrviewPos || transform;

  const dragPreviewStyles: React.CSSProperties =  {
    // Basic transformation that is applied during dragging.
    transform: dragPreviewPosition ? `translate3d(${dragPreviewPosition.x}px, ${dragPreviewPosition.y}px, 0)` : undefined,
    // Keep the drag preview in the DOM with visibility = hidden. This ensures that all assets / images used
    // by the preview will be loaded when user starts to drag the button.
    visibility: isDragging || isSelected ? "visible" : "hidden",
    // This will center the drag preview in the middle of the original button, even if they have different sizes.
    top: ((originalBtnRef.current?.clientHeight ?? 0) - (previewBtnRef.current?.clientHeight ?? 0)) * 0.5,
    left: ((originalBtnRef.current?.clientWidth ?? 0) - (previewBtnRef.current?.clientWidth ?? 0)) * 0.5,
    // When click-to-drag is active, the drag preview will follow the pointer. Make sure it doesn't block mouse events.
    pointerEvents: clickToDragPrviewPos ? "none" : undefined
  };

  const hideOriginalButton = hideButtonOnDrag && isDragging;

  // Using `button` element is recommended for accessibility.
  return (
    <div className={clsx({ [css.draggable]: true, [css.disabled]: disabled })}>
      {
        // The original button that initiates drag action.
        <button
          ref={originalBtnRef}
          {...listeners}
          {...attributes}
          aria-label={label}
          disabled={disabled}
          // Do not allow to click-to-drag when dragging action is already active (eg via keyboard sensor).
          onClick={!disabled && !active ? onClick : undefined}
          style={{visibility: hideOriginalButton ? "hidden" : "visible"}}
        >
          { children }
        </button>
      }
      {
        // DragPreview or the original button copy that is being dragged by the user.
        <button
          ref={previewBtnRef}
          className={clsx({ [css.dragPreview]: true, [css.originalButtonVisible]: !hideOriginalButton })}
          style={dragPreviewStyles}
        >
          { DragPreview || children }
        </button>
      }
    </div>
  );
};
