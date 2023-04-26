import React from "react";
import PlayButton from "../assets/snapshots-directions/instructions-play-button@3x.png";
import NewTrialButton from "../assets/snapshots-directions/instructions-new-trial-button@3x.png";

interface IDirections {
  t: (string: string, markdown?: boolean) => string | JSX.Element
}

export const PlantGrowthDirections = (props: IDirections) => {
  const {t} = props;
  const useMarkdown = true;
  return (
    <div>
      {t("INSTRUCTIONS.PART_1", useMarkdown)}
      {t("INSTRUCTIONS.PART_2_HEADER", useMarkdown)}
      {t("INSTRUCTIONS.PART_2", useMarkdown)}
      {t("INSTRUCTIONS.PART_3_HEADER", useMarkdown)}
      {t("INSTRUCTIONS.PART_3", useMarkdown)}
    </div>
  );
};

