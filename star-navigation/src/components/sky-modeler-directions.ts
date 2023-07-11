import {getDefaultLanguage} from "common";

const englishMarkdown = `
# Changing views
`;

const spanishMarkdown = `
# Cambiar las vistas
`;

export const skyModelerDirections = () => {
  switch (getDefaultLanguage()) {
    case "es":
      return spanishMarkdown;
    default:
      return englishMarkdown;
  }
};




