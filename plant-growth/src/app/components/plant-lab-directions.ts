

import PlayButton from "../assets/snapshots-directions/instructions-play-button@3x.png";
import NewTrialButton from "../assets/snapshots-directions/instructions-new-trial-button@3x.png";

const markDown = `
Experiment with a plant in a terrarium to see how much sugar it creates and uses
with different conditions of light, water, and CO<sub>2</sub>.

# Running a trial

Each trial starts with a seed planted in the soil. Choose the amount of light, water,
and CO<sub>2</sub> for each trial using the sliders in the “Controls” panel. Press “Play”
![play button](${PlayButton}) to see how these conditions affect the amount of sugar
the plant creates and uses. The Trials table records the trial conditions and results, and
the graph shows the amounts of sugar created and used by the plant every 4 days for each
28 day experiment. After a trial, you can use the “Time” slider to move back and forth
in time for that trial. Press “New” ![new trial button](${NewTrialButton}) to start a new trial.

# Analyzing trials

After you have collected several trials, compare the results of trials by clicking on
different trials in the table to see the graphs that go with that trial. How do the settings
of light, water, and CO<sub>2</sub> affect the plant's growth?

# Try recording your own data

Investigate how different conditions of light, water, and CO<sub>2</sub> affect the height
of the plant. Make your own data table to record the height of the plant every 4 days.
Run a trial, then use the “Time” slider to read the ruler and record the heights in your table.
Then you can use your data table to make a graph to show how the height of the plant
changes over time with different conditions.
`;

export const plantLabDirections = () => {
  return markDown;
};
