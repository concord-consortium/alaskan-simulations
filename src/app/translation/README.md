# Localization

The `translation` module can be used to add text localization.

### How to use

#### Adding translation files

Translation JSON files are added to each simulation `src/translation/lang` folder. Add a translation JSON file for each
translated language and import the translation JSON files in `src/index.ts` using `setLanguageFiles`. Name the translation
JSON file using the ISO 639-1 Language Code for the given language (i.e., `fr.json` for French or `de.json` for German).
Add a key/value pair for each translated word or phrase. The key is used by the translation function and the value is
the actual translated text.

```
{
  "TEXT": "text",
  "INTRO.HELLO": "Hello World"
}
```

#### Setting the default language

The default language can be set using `setDefaultLanguage` function. If this function is never called, or its argument
is `undefined`, the `translate` function will try to guess the default language automatically.

It will first get the HTML DOM `lang` attribute of the root element of the document to determine
the current page language.  If no `lang` attribute is specified, then the `translate` function will get the first valid
language specified by the browser to determine the current page language.

#### Using the translate function

Import the `t` (short for `translate`) function found in `common`:
```
import { t } from "common";
```

Call the function using the translation key of the desired text:
```
console.log(t("INTRO.HELLO"));
```

Variables can be defined and specified in your translated text.  Use the format `%{VAR_NAME}` to add a variable to a key's value in the translation JSON file:
```
{
  "AGE": "I am %{userAge} years old"
}
```
Use the `vars` property of the `options` parameter to specify one or more variable values when calling the translation function:
```
console.log(t("AGE", { vars: { userAge: "25" } }));
```

Optionally, a language value can be specified when calling the `translate` function that will override the default
language. Use the `lang` property of the `options` parameter to specify a language when calling the `translate` function:
```
console.log(t("INTRO.HELLO", { lang: "es" }));
```
