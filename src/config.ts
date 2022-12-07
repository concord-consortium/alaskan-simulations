import { parse } from "query-string";

const isJSON = (value: any) => {
  if (typeof value !== "string") {
    return false;
  }
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

// This helper takes any configuration object and looks for matching URL parameters to update values in the resulting
// configuration.
export const applyURLParams = (baseConfig: any) => {
  const finalConfig: any = {...baseConfig};
  const parsedQuery = parse(location.search, {
    arrayFormat: "comma", // ?foo=1,2,3 => {foo: [1,2,3]}
    parseBooleans: true, // ?foo=true => {foo: true}
    parseNumbers: true // ?foo=123 => {foo: 123}
  });
  // Populate `urlConfig` with values read from URL.
  Object.keys(baseConfig).forEach((key) => {
    const urlValue: any = parsedQuery[key];
    // Note that query-string will parse "?foo" as {foo: null} and "?foo=" as {foo: ""}. This kind of params
    // is often used as on/off flags, so they're all assumed to be a `true` value.
    if (urlValue === true || urlValue === null || urlValue === "") {
      finalConfig[key] = true;
    } else if (isJSON(urlValue)) {
      finalConfig[key] = JSON.parse(urlValue);
    } else if (urlValue !== undefined) {
      finalConfig[key] = urlValue;
    }
  });
  return finalConfig;
};

// Simulation configuration that can be overwritten using URL parameters.
export interface IConfig {
  // `undefined` (based on browser local setting) or ISO 639-1 Language Code
  // for the given language (i.e., `es` for Spanish or `de` for German).
  lang: string | undefined;
}

const defaultConfig: IConfig = {
  lang: undefined,
};

// Config is cached when module is loaded. That's fine, as URL parameters will not change in normal situation.
export const config: IConfig = applyURLParams(defaultConfig);
