
import React from "react";

export const TBD = ({height, width, fontSize}: {height?: number, width?: number, fontSize?: any}) => {
  return (
    <div style={{height, width, display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: fontSize || "2em"}}>
      TBD
    </div>
  );
};
