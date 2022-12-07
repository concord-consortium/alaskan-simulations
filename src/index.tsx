import React from "react";
import ReactDOM from "react-dom";
import { App } from "./interactive/app";
import { setDefaultLanguage, setLanguageFiles  } from "./app/translation/translate";
import { config } from "./config";
import enUS from "./app/translation/lang/en-us.json";
import es from "./app/translation/lang/es.json";

import "./index.scss";

setLanguageFiles([
  {key: "en-US", contents: enUS}, // US English
  {key: "es",    contents: es},   // Spanish
]);
setDefaultLanguage(config.lang);

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
