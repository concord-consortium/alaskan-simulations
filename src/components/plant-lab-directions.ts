

import PlayButton from "../common/assets/snapshots-directions/instructions-play-button@3x.png";
import EnglishNewTrialButton from "../common/assets/snapshots-directions/instructions-new-trial-button@3x.png";
import SpanishNewTrialButton from "../common/assets/snapshots-directions/instructions-new-trial-button-es@3x.png";
import BarChartButton from "../common/assets/snapshots-directions/instructions-bar-chart-button@3x.png";
import GreenBarChartButton from "../common/assets/snapshots-directions/instructions-bar-chart-button-green@3x.png";
import OrangeBarChartButton from "../common/assets/snapshots-directions/instructions-bar-chart-button-orange@3x.png";
import { getDefaultLanguage } from "../common";

const englishMarkdown = `
# Running a trial

Set up the terrarium. Select whether you want to add soil, water, or both.
Choose the Amount of CO<sub>2</sub> in the Air sealed in the terrarium. Press “Play”
![play button](${PlayButton}) to see how well the plant grows over 28 days.
After a trial, you can use the “Time” slider to move back and forth in time for that
trial. Tap “New” ![new trial button](${EnglishNewTrialButton}) to start a new trial.

# Analyzing Trials: Data

When you run a trial, that trial will appear in the data table with an orange icon
![graph icon button](${OrangeBarChartButton}), and the data will appear in orange
on the graph. Tap the graph icon ![graph icon button](${BarChartButton}) for a row
to add another trial to the bar graph for comparison. That trial will appear in teal
![graph icon button](${GreenBarChartButton}) on the graph.

When you want to remove a trial from the bar graph, find the matching colored icon
in the data table. Tap the icon to remove that trial from the graph.

You can also select an entire row in the data table, then use the “Time” slider
to rewatch that trial.
`;

const spanishMarkdown = `
# Ejecutar una prueba

Prepara el terrario. Seleccione si deseas agregar tierra, agua o ambos. Elige la Cantidad
de CO<sub>2</sub> en el aire sellado en el terrario. Presiona “Reproducir” ![play button](${PlayButton})
para ver qué tan bien crece la planta durante 28 días. Después de una prueba, puedes usar
el control deslizante “Tiempo” para avanzar y retroceder en el tiempo para esa prueba.
Toque “Nueva” ![new trial button](${SpanishNewTrialButton}) para iniciar una nueva prueba.

# Análisis de pruebas: Datos

Cuando hagas una prueba, esa prueba aparecerá en la tabla de datos con un icono anaranjado ![graph icon](${OrangeBarChartButton}),
y los datos aparecerán anaranjados en la gráfica. Haz clic en el icono de gráfica ![graph icon button](${BarChartButton})
para que una fila añada otra prueba a la gráfica de barras para comparar. Esa prueba aparecerá en color azul verdoso
![graph icon button](${GreenBarChartButton}) en la gráfica.

Cuando desee eliminar una prueba del gráfico de barras, busque el icono de color correspondiente
en la tabla de datos. Toque el icono para eliminar esa prueba de la gráfica.

También puedes seleccionar una fila de la tabla de datos y luego usar el indicador de “Tiempo”
para volver a ver esa prueba.
`;

export const plantLabDirections = () => {
  switch (getDefaultLanguage()) {
    case "es":
      return spanishMarkdown;
    default:
      return englishMarkdown;
  }
};
