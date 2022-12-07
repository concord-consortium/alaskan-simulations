import enUS from "./lang/en-us.json";
import es from "./lang/es.json";

const commonLanguageFiles: Record<string, LanguageFileContents> = {
  "en-US": enUS,
  es
};

type LanguageFileContents = Record<string, string>;
interface ILanguageFile {
  key: string;
  contents: LanguageFileContents;
}
type LanguageFiles = ILanguageFile[];

let translations: Record<string, LanguageFileContents> = {};
let requestedDefaultLanguage: string | undefined = undefined;
let languageFiles: LanguageFiles = [];

// returns baseLANG from baseLANG-REGION if REGION exists
// this will, for example, convert en-US to en
const getBaseLanguage = (langKey: any) => {
  return langKey.split("-")[0];
};

// Get the HTML DOM lang property of the root element of the document
const getPageLanguage = () => {
  const pageLang = document.documentElement.lang;
  return pageLang && (pageLang !== "unknown") ? pageLang : undefined;
};

// Get the first valid language specified by the browser
const getFirstBrowserLanguage = () => {
  const nav: any = window.navigator;
  // userLanguage and browserLanguage are non standard but required for IE support
  const languages = [...nav.languages, nav.language, nav.userLanguage, nav.browserLanguage];
  return languages.find((browserLang) => browserLang);
};

const getSafeDefaultLanguage = (defaultLanguage: string | undefined) => {
  // Client code can set default language (or rely on browser locale if `undefined` is provided).
  // The logic below tries to ensure translations for selected language are available. It fallbacks to "en" if not.
  const currentLang = defaultLanguage ? defaultLanguage : (getPageLanguage() || getFirstBrowserLanguage());
  const baseLang = getBaseLanguage(currentLang || "");
  return currentLang && translations[currentLang]
          ? currentLang
          : baseLang && translations[baseLang]
            ? baseLang
            : "en";
};

export const setDefaultLanguage = (_requestedDefaultLanguage: string | undefined) => {
  requestedDefaultLanguage = _requestedDefaultLanguage;
  defaultLang = getSafeDefaultLanguage(requestedDefaultLanguage);
};

export const getDefaultLanguage = () => defaultLang;

export const setLanguageFiles = (_languageFiles: LanguageFiles) => {
  languageFiles = _languageFiles;

  translations = {};
  languageFiles.forEach((langFile: ILanguageFile) => {
    const sharedContents = commonLanguageFiles[langFile.key] || {};
    const combinedContents = {...sharedContents, ...langFile.contents};
    translations[langFile.key] = combinedContents;
    // accept full key with region code or just the language code
    const bLang = getBaseLanguage(langFile.key);
    if (bLang && !translations[bLang]) {
      translations[bLang] = combinedContents;
    }
  });

  // Default language needs to be updated, as new translations could make `requestedDefaultLanguage` be a valid choice.
  defaultLang = getSafeDefaultLanguage(requestedDefaultLanguage);
};

// Initially rely on browser settings. Simulation will provide its custom setting based on the URL param.
let defaultLang = getSafeDefaultLanguage(requestedDefaultLanguage);
const varRegExp = /%\{\s*([^}\s]*)\s*\}/g;

interface ITranslateOptions {
  lang?: string;
  count?: number;
  vars?: Record<string, string>;
}

export function t (key: string, options?: ITranslateOptions) {
  const lang = options?.lang || defaultLang;
  const vars = options?.vars || {};
  const count = options?.count || 1;
  const keyWithCount = count === 1 ? key : `${key}_PLURAL`;
  const translation = translations?.[lang]?.[keyWithCount] || translations?.[lang]?.[key] || key;
  return translation.replace(varRegExp, (match: string, langKey: string) => {
    if (Object.prototype.hasOwnProperty.call(vars, langKey)) {
      return vars[langKey];
    } else {
      return `'** UNKNOWN KEY: ${langKey} **`;
    }
  });
}
