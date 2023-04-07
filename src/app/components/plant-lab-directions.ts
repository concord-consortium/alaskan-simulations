

import PlayButton from "../assets/snapshots-directions/instructions-play-button@3x.png";
import EnglishNewTrialButton from "../assets/snapshots-directions/instructions-new-trial-button@3x.png";
import BarChartButton from "../assets/snapshots-directions/instructions-bar-chart-button@3x.png";
import GreenBarChartButton from "../assets/snapshots-directions/instructions-bar-chart-button-green@3x.png";
import OrangeBarChartButton from "../assets/snapshots-directions/instructions-bar-chart-button-orange@3x.png";

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

export const plantLabDirections = () => {
  return englishMarkdown;
};
