import { applyURLParams } from "./common";

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
