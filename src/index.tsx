import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/app";
import { setDefaultLanguage, setLanguageFiles  } from "./translation/translate";
import { config } from "./config";
import enUS from "./translation/lang/en-us.json";
import es from "./translation/lang/es.json";

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
