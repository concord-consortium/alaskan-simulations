import React, { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "../../hooks/use-translation";
import { clsx } from "clsx";
import rehypeRaw from "rehype-raw"; // used to allow for raw html in the instructional markdown
import { Dialog } from "./dialog";
import Logo from "../../assets/concord.png";
import HeaderTitle from "../../assets/HeaderTitle.png";
import { Switch } from "../controls/switch";
import DirectionsButton from "../../assets/directions-button.svg";
import { Credits } from "./credits";

import css from "./simulation-frame.scss";

interface IProps {
  directions: string | ReactNode;
  className?: string;
  titleImage?: string;
  children?: React.ReactNode;
}

export const simulationFrameHeaderId = "simulationFrameHeader";

export const SimulationFrame: React.FC<IProps> = ({ directions, className, titleImage, children }) => {
  const [showCredits, setShowCredits] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const { t, tStringOnly, readAloudMode, setReadAloudMode } = useTranslation();

  const handleSetReadAloud = () => {
    setReadAloudMode(!readAloudMode);
  };

  const toggleCredits = () => {
    setShowCredits(old => !old);
    setShowDirections(false);
  };

  const toggleDirections = () => {
    setShowDirections(old => !old);
    setShowCredits(false);
  };

  return (
    <div className={clsx(css.simulationFrame, className)} data-testid="simulation-frame">
      <div id={simulationFrameHeaderId} className={css.header}>
        <div className={clsx(css.buttons, css.left)}>
          <img className={css.logo} src={Logo}/>
          <button className={clsx({ [css.active]: showCredits })} onClick={toggleCredits}>{ tStringOnly("CREDITS.HEADER") }</button>
        </div>
        <div className={css.titleContainer}><img className={css.title} src={titleImage}/></div>
        <div className={clsx(css.buttons, css.right)}>
          <Switch
            checked={readAloudMode}
            label={"Read Aloud in Yugtun"}
            onChange={handleSetReadAloud}
          />
          <button className={clsx({ [css.active]: showDirections })} onClick={toggleDirections}>
            <DirectionsButton />
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
            {typeof directions === "string" ?
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{directions}</ReactMarkdown> : directions}
          </Dialog>
        }
      </div>
    </div>
  );
};
