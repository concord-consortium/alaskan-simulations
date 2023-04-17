import React from "react";
import clsx from "clsx";

import { Constellation, IModelInputState } from "../types";

import Aquarius from "../assets/constellations/aquarius.svg";
import Aquila from "../assets/constellations/aquila.svg";
import Aries from "../assets/constellations/aries.svg";
import Cancer from "../assets/constellations/cancer.svg";
import Capricornus from "../assets/constellations/capricornus.svg";
import Gemini from "../assets/constellations/gemini.svg";
import Leo from "../assets/constellations/leo.svg";
import Libra from "../assets/constellations/libra.svg";
import Orion from "../assets/constellations/orion.svg";
import Pisces from "../assets/constellations/pisces.svg";
import Sagittarius from "../assets/constellations/sagittarius.svg";
import Scorpius from "../assets/constellations/scorpius.svg";
import Taurus from "../assets/constellations/taurus.svg";
import UrsaMajor from "../assets/constellations/ursa-major.svg";
import Virgo from "../assets/constellations/virgo.svg";

import Empty from "../assets/constellations/empty.svg";

import css from "./thumbnail.scss";

const thumnailMap = {
  [Constellation.Virgo]: <Virgo />,
  [Constellation.Libra]: <Libra />,
  [Constellation.Scorpius]: <Scorpius />,
  [Constellation.Aries]: <Aries />,
  [Constellation.Taurus]: <Taurus />,
  [Constellation.Gemini]: <Gemini />,
  [Constellation.Cancer]: <Cancer />,
  [Constellation.Leo]: <Leo />,
  [Constellation.Sagittarius]: <Sagittarius />,
  [Constellation.Capricornus]: <Capricornus />,
  [Constellation.Aquarius]: <Aquarius />,
  [Constellation.Pisces]: <Pisces />,
  [Constellation.Orion]: <Orion />,
  [Constellation.UrsaMajor]: <UrsaMajor />,
  [Constellation.Aquila]: <Aquila />,
};

interface IProps {
  inputState: IModelInputState;
  disabled?: boolean;
}

export const Thumbnail: React.FC<IProps> = ({ inputState, disabled }) => {
  const { predictedConstellation } = inputState;
  return (
    <div className={clsx(css.thumbnail, {[css.disabled]: disabled})}>
      {predictedConstellation ? thumnailMap[predictedConstellation] : <Empty />}
    </div>
  );
};
