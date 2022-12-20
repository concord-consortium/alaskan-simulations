import React, { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import rehypeRaw from "rehype-raw"; // used to allow for raw html in the instructional markdown

import { Dialog } from "./dialog";
import { t } from "../../translation/translate";
import Logo from "../../assets/concord.png";
import HeaderTitle from "../../assets/HeaderTitle.png";

import DirectionsButton from "../../assets/directions-button.svg";
import { Credits } from "./credits";

import css from "./simulation-frame.scss";

interface IProps {
  title: string;
  directions: string | ReactNode;
}

export const simulationFrameHeaderId = "simulationFrameHeader";

export const SimulationFrame: React.FC<IProps> = ({ title, directions, children }) => {
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
    <div className={css.simulationFrame} data-testid="simulation-frame">
      <div id={simulationFrameHeaderId} className={css.header}>
        <div><img className={css.logo} src={Logo}/></div>
        <div><img className={css.title} src={HeaderTitle}/></div>
        <div className={css.buttons}>
          <button className={clsx({ [css.active]: showCredits })} onClick={toggleCredits}>{t("CREDITS.HEADER")}</button>
          <button className={clsx({ [css.active]: showDirections })} onClick={toggleDirections}><DirectionsButton /></button>
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
