import {getDefaultLanguage} from "common";

import EnglishNewTrialButton from "../../../common/src/assets/snapshots-directions/instructions-new-trial-button@3x.png";
import SpanishNewTrialButton from "../../../common/src/assets/snapshots-directions/instructions-new-trial-button-es@3x.png";

import CheckButton from "../assets/instructions-check-button@3x.png";

import EnglishTiltViewButton from "../assets/instructions-tilt-view-button@3x.png";
import EnglishRotateViewButton from "../assets/instructions-rotate-view-button@3x.png";

import SpanishTiltViewButton from "../assets/instructions-tilt-view-button-es@3x.png";
import SpanishRotateViewButton from "../assets/instructions-rotate-view-button-es@3x.png";

const englishMarkdown = `
# Changing views

In the upper windows, you can “Tilt view” ![tilt view button](${EnglishTiltViewButton}) to see the model of the Earth,
Sun, and stars from the top or the side. You can “Rotate view” ![rotate view button](${EnglishRotateViewButton}) to change
your view of the entire system. You can also select “Show constellation lines” or “Show daylight.”

# Running a trial

First, choose a Month in the bottom window. Note how the Earth’s position changes in the Space View.
Use the “Time” slider to rotate the Earth on its axis over a 24-hour period. The white arrow in
Space View shows which way you are looking out at the sky in Earth View.

# Predict a constellation

Move the time slider to 12 am (Midnight) to show the night sky at that time. Try to identify the constellation
that is in the center of your Earth View, and choose this from the Constellation list in the bottom window.
Tap “Check” ![check button](${CheckButton}) to check your attempt. The results appear in the table.
If your attempt is incorrect, you can choose a different constellation.
When you want to try a different month, tap “New” ![new trial button](${EnglishNewTrialButton}) to start a new trial.
`;

const spanishMarkdown = `
# Cambiar las vistas

En las ventanas superiores, puedes “Inclinar la vista” ![tilt view button](${SpanishTiltViewButton})
para ver el modelo de la Tierra, el Sol y las estrellas desde la parte superior o lateral. Puedes
“Rotar la vista” ![rotate view button](${SpanishRotateViewButton}) para cambiar tu vista de todo el
sistema. También puedes seleccionar “Mostrar líneas de constelaciones” o “Mostrar luz del día”.

# Ejecutar una prueba

Primero, elige un Mes en la ventana inferior. Observa cómo cambia la posición de la Tierra en la
Vista espacial. Use el control deslizante “Tiempo” para rotar la Tierra sobre su eje durante un
período de 24 horas. La flecha blanca en Vista espacial muestra de qué manera miras el cielo en
la Vista terrestre.

# Predecir una constelación

Mueve el control deslizante de tiempo a las 12 a. m. para mostrar el cielo nocturno a esa hora.
Intenta identificar la constelación que se encuentra en el centro de tu Vista terrestre y selecciónala
de la Lista de constelaciones en la ventana inferior. Toque “Comprobar” ![check button](${CheckButton})
para comprobar tu prueba. Los resultados aparecen en la tabla. Si tu prueba es incorrecta, puedes elegir
una constelación diferente. Cuando desees probar un mes diferente, toque “Nueva” ![new trial button](${SpanishNewTrialButton})
para comenzar una nueva prueba.
`;

export const skyModelerDirections = () => {
  switch (getDefaultLanguage()) {
    case "es":
      return spanishMarkdown;
    default:
      return englishMarkdown;
  }
};




