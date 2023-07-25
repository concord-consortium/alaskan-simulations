import React, { useEffect, useState } from "react";

interface IDraggableLocation {
  onDragMove: any,
  children: any,
}

export const DraggableWrapper: React.FC<IDraggableLocation> = (props) => {
  const { onDragMove, children } = props;
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
   };

  const handlePointerUp = (e: any) => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      onDragMove(e);
    }
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {children}
    </div>
  );
};
