import { useTranslation } from "common";
import React from "react";

export const ClamFiltrationDirections = () => {
  const { t } = useTranslation();
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

