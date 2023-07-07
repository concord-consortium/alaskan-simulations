import React, { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import rehypeRaw from "rehype-raw"; // used to allow for raw html in the instructional markdown

import { Dialog } from "./dialog";
import { t } from "../..";
import Logo from "../../assets/logo.svg";
import DirectionsButton from "../../assets/directions-button.svg";
import DirectionsButtonLarger from "../../assets/directions-button-larger.svg";
import { Credits } from "./credits";

import css from "./simulation-frame.scss";

interface IProps {
  title: string;
  directions: string | ReactNode;
  largerStyle?: true;
}

export const simulationFrameHeaderId = "simulationFrameHeader";

export const SimulationFrame: React.FC<IProps> = ({ title, directions, children, largerStyle }) => {
  const [showCredits, setShowCredits] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const toggleCredits = () => {
    setShowCredits(old => !old);
    setShowDirections(false);
  };

  const toggleDirections = () => {
    setShowDirections(old => !old);
    setShowCredits(false);
  };

  return (
    <div className={clsx(css.simulationFrame, {[css.larger]: largerStyle})} data-testid="simulation-frame">
      <div id={simulationFrameHeaderId} className={`${css.header} ${largerStyle && css.larger}`}>
        <div className={css.title}>{title}</div>
        <div className={css.buttons}>
          <button className={clsx({ [css.active]: showCredits })} onClick={toggleCredits}>{t("CREDITS.HEADER")}</button>
          <button className={clsx({ [css.active]: showDirections, [css.larger]: largerStyle})} onClick={toggleDirections}>
            {largerStyle ? <DirectionsButtonLarger/> : <DirectionsButton/>}
          </button>
        </div>
      </div>
      <div className={css.content}>
        {children}
        {
          showCredits && <Credits onClose={toggleCredits} />
        }
        {showDirections &&
          <Dialog
            title={t("INSTRUCTIONS.HEADER")}
            onClose={toggleDirections} showCloseButton={true}
            trapFocus={true}
            addSeparator={true}
            className={css.instructions}
          >
            {typeof directions === "string" ? <ReactMarkdown rehypePlugins={[rehypeRaw]}>{directions}</ReactMarkdown> : directions}
          </Dialog>
        }
      </div>
    </div>
  );
};
