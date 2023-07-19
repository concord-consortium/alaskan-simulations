import React from "react";
import { config } from "../../config";
import { clsx } from "clsx";

import css from "./hands.scss";

const handToDegree = 10; // one hand image represents 10 degrees
const handAspectRatio = 96 / 80; // based on the hand image dimensions

type Orientation = "left" | "right";

interface IHandImagesProps {
  starViewHorizontalFov: number;
  angle: number;
  handSize: number;
  orientation: Orientation;
}

const HandImages: React.FC<IHandImagesProps> = ({ starViewHorizontalFov, angle, handSize, orientation }) => {
  // Hands are drawn in container that take 50% of the horizontal space. That's why we use starViewHorizontalFov * 0.5.
  const width = `${100 * angle / (starViewHorizontalFov * 0.5)}%`;
  const height = handAspectRatio * handSize;
  return (
    <div
      className={clsx(css.handImages, { [css.left]: orientation === "left" })}
      style={{ width, height, backgroundSize: handSize }}
    />
  );
};

interface IHandsProps {
  headingFromAssumedNorthStar?: number;
  degreeToPixel: number;
  starViewHorizontalFov: number;
}

export const Hands: React.FC<IHandsProps> = ({ headingFromAssumedNorthStar, degreeToPixel, starViewHorizontalFov }) => {
  if (headingFromAssumedNorthStar === undefined) {
    return null;
  }

  let handsAngleValue = headingFromAssumedNorthStar;
   // left is kinda arbitrary as it's difficult to say which hand is left or right, but it's just a matter of convention.
  let orientation: Orientation = "left";

  // When hands are meant to display range from 0 to 360, we use just one direction (left) and do not modify the angle.
  // When hands are meant to display range from 0 to 180, we need to modify the angle and use both directions.
  if (!config.hands360) {
    if (handsAngleValue > 180) {
      orientation = "right";
    }
    handsAngleValue = handsAngleValue > 180 ? 360 - handsAngleValue : handsAngleValue;
  }

  const overflowHandsAngle = Math.max(0, handsAngleValue - 360 + 0.5 * starViewHorizontalFov);
  const handSize = handToDegree * degreeToPixel;

  return (
    <>
      <div className={clsx(css.handsContainer, { [css.left]: orientation === "left" })}>
        <HandImages
          starViewHorizontalFov={starViewHorizontalFov}
          angle={handsAngleValue}
          handSize={handSize}
          orientation={orientation}
        />
      </div>
      <div className={clsx(css.handsOverflowContainer, { [css.left]: orientation === "left" })}>
        <HandImages
          starViewHorizontalFov={starViewHorizontalFov}
          angle={overflowHandsAngle}
          handSize={handSize}
          orientation={orientation}
        />
      </div>
    </>
  );
};
