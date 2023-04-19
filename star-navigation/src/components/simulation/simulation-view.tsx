import React, { useState } from "react";
import clsx from "clsx";
import { getDefaultLanguage, Button, t } from "common";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { OrbitViewWrapper } from "../../orbit-view/components/orbit-view-wrapper";
import { HorizonViewWrapper } from "../../horizon-view/components/horizon-view-wrapper";
import { IModelInputState } from "../../types";
import { timeToAMPM } from "../../utils/sim-utils";
import { daytimeOpacity } from "../../utils/daytime";

import RotateIcon from "../../assets/rotate-icon.svg";
import EllipsisTopDownViewIcon from "../../assets/ellipse-topdown-view-icon.svg";
import EllipsisSideViewIcon from "../../assets/ellipse-side-view-icon.svg";
import CheckedIcon from "../../assets/check-box-checked.svg";
import UncheckedIcon from "../../assets/check-box-unchecked.svg";

import css from "./simulation-view.scss";

interface IProps {
  epochTime: number;
  observerLat: number;
  observerLon: number;
  inputState: IModelInputState;
}

export const SimulationView: React.FC<IProps> = ({ inputState, epochTime, observerLat, observerLon }) => {
  // this is a bit of a hack to center the left label due to the longer space view label in Spanish
  const lang = getDefaultLanguage();

  // the cameraRotation is an ever increasing integer - an update to this value causes the
  // OrbitView to rotate the y-axis of the camera a set angle in radians (PI/2 = 90 degrees)
  const [cameraRotation, setCameraRotation] = useState(0);
  const handleRotateCamera = () => setCameraRotation(prev => prev + 1);

  const [tiltCamera, setTiltCamera] = useState(true);
  const handleTiltCamera = () => setTiltCamera(prev => !prev);

  const [showConstellations, setShowConstellations] = useState(false);
  const toggleShowConstellations = () => setShowConstellations(prev => !prev);

  const [showDaylight, setShowDaylight] = useState(true);
  const toggleShowDaylight = () => setShowDaylight(prev => !prev);

  const [hoverConstellationCheckbox, setHoverConstellationCheckbox] = useState(false);
  const handleMouseOverConstellationCheckbox = () => setHoverConstellationCheckbox(true);
  const handleMouseOutConstellationCheckbox = () => setHoverConstellationCheckbox(false);

  const [hoverDaylightCheckbox, setHoverDaylightCheckbox] = useState(false);
  const handleMouseOverDaylightCheckbox = () => setHoverDaylightCheckbox(true);
  const handleMouseOutDaylightCheckbox = () => setHoverDaylightCheckbox(false);

  return (
    <div className={css.simulationView}>
      <div className={css.labels}>
        <div className={css.spaceView}>
          <div className={clsx(css.label, css.blue)}>{t("LABEL.SPACE_VIEW")}</div>
        </div>
        <div className={css.time}>
          <div className={clsx(css.label, css[lang])}>{timeToAMPM(inputState.timeOfDay, lang)}</div>
        </div>
        <div className={clsx(css.constellation, css[lang])}>
          <div className={clsx(css.label, css.blue)}>{t("LABEL.PREDICTED_CONSTELLATION")}:</div>
          <div className={clsx(css.label)}>{t(inputState.predictedConstellation || "")}</div>
        </div>
        <div className={css.earthView}>
          <div className={clsx(css.label, css.blue)}>{t("LABEL.EARTH_VIEW")}</div>
        </div>
      </div>
      <div className={css.orbitView}>
        <OrbitViewWrapper
          epochTime={epochTime}
          observerLat={observerLat}
          observerLon={observerLon}
          cameraRotation={cameraRotation}
          showConstellations={showConstellations}
          showDaylight={showDaylight}
          tiltCamera={tiltCamera}
        />
      </div>
      <div className={css.horizonView}>
        <HorizonViewWrapper
          epochTime={epochTime}
          lat={observerLat}
          long={observerLon}
          showConstellations={showConstellations}
          daylightOpacity={showDaylight ? daytimeOpacity(inputState) : 0}
        />
      </div>
      <div className={css.bottomControls}>
        <div className={css.buttons}>
          <Button
            height={35}
            horizontal={true}
            icon={tiltCamera ? <EllipsisSideViewIcon /> : <EllipsisTopDownViewIcon />}
            innerLabel={t("BUTTON.TILT_VIEW")}
            onClick={handleTiltCamera}
          />
          <Button
            height={35}
            horizontal={true}
            icon={<RotateIcon />}
            innerLabel={t("BUTTON.ROTATE_VIEW")}
            onClick={handleRotateCamera}
          />
        </div>
        <div className={clsx(css.checkboxes, css[lang])}>
          <div>
            <FormControlLabel
              control={<Checkbox className={clsx({[css.checkboxHover]: hoverConstellationCheckbox})} disableRipple={true} checked={showConstellations || hoverConstellationCheckbox} onClick={toggleShowConstellations} checkedIcon={<CheckedIcon />} icon={<UncheckedIcon />} />}
              label={t("LABEL.SHOW_CONSTELLATION_LINES")}
              onMouseOver={handleMouseOverConstellationCheckbox}
              onMouseOut={handleMouseOutConstellationCheckbox}
            />
            <FormControlLabel
              control={<Checkbox  className={clsx({[css.checkboxHover]: hoverDaylightCheckbox})} disableRipple={true} checked={showDaylight || hoverDaylightCheckbox} onClick={toggleShowDaylight} checkedIcon={<CheckedIcon />} icon={<UncheckedIcon />} />}
              label={t("LABEL.SHOW_DAYLIGHT")}
              onMouseOver={handleMouseOverDaylightCheckbox}
              onMouseOut={handleMouseOutDaylightCheckbox}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
