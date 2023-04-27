import React from "react";

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

