import React from "react";
import { Button } from "../button";

import css from "./snapshot.scss";

interface IProps {
  buttonLabel: string;
}

export const Snapshot: React.FC<IProps> = ({ buttonLabel }) => {
  return (
    <div className={css.snapshot}>
      <Button className={css.snapshotButton}>{buttonLabel}</Button>
    </div>
  );
};
