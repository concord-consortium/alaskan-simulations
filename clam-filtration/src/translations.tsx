import { TranslationDict } from "common";
import NewTrial from "./assets/yugtun-audio/new-trial.mp3";
import Controls from "./assets/yugtun-audio/controls.mp3";
import Play from "./assets/yugtun-audio/play.mp3";
import Day0 from "./assets/yugtun-audio/day-0.mp3";
import Day4 from "./assets/yugtun-audio/day-4.mp3";
import Day8 from "./assets/yugtun-audio/day-8.mp3";
import Day12 from "./assets/yugtun-audio/day-12.mp3";
import Day16 from "./assets/yugtun-audio/day-16.mp3";
import Co2 from "./assets/yugtun-audio/carbon-dioxide.mp3";
import Light from "./assets/yugtun-audio/light.mp3";
import Water from "./assets/yugtun-audio/water.mp3";
import Full from "./assets/yugtun-audio/full.mp3";
import Some from "./assets/yugtun-audio/some.mp3";
import None from "./assets/yugtun-audio/none.mp3";
import TrialsData from "./assets/yugtun-audio/trials-data.mp3";
import Trial from "./assets/yugtun-audio/trial.mp3";
import SugarCreated from "./assets/yugtun-audio/sugar-created.mp3";
import Low from "./assets/yugtun-audio/low.mp3";
import Medium from "./assets/yugtun-audio/medium.mp3";
import High from "./assets/yugtun-audio/high.mp3";
import DeleteTrial from "./assets/yugtun-audio/delete-trial.mp3";
import Graphs_XAxisLabel from "./assets/yugtun-audio/time-days.mp3";
import Graphs_Trial1 from "./assets/yugtun-audio/trial-1-graphs.mp3";
import Graphs_Trial2 from "./assets/yugtun-audio/trial-2-graphs.mp3";
import Graphs_Trial3 from "./assets/yugtun-audio/trial-3-graphs.mp3";
import Graphs_Trial4 from "./assets/yugtun-audio/trial-4-graphs.mp3";
import Graphs_Trial5 from "./assets/yugtun-audio/trial-5-graphs.mp3";
import Graphs_Trial6 from "./assets/yugtun-audio/trial-6-graphs.mp3";
import Graphs_Trial7 from "./assets/yugtun-audio/trial-7-graphs.mp3";
import Graphs_Trial8 from "./assets/yugtun-audio/trial-8-graphs.mp3";
import Graphs_Trial9 from "./assets/yugtun-audio/trial-9-graphs.mp3";

import InstructionsPart1 from "./assets/yugtun-audio/instructions-intro.mp3";
import InstructionsPart2 from "./assets/yugtun-audio/instructions-running.mp3";
import InstructionsPart3 from "./assets/yugtun-audio/instructions-analyzing.mp3";

import PlayButton from "./assets/snapshots-directions/instructions-play-button@3x.png";
import NewTrialButton from "./assets/snapshots-directions/instructions-new-trial-button@3x.png";

// TODO update audio files when ready

const instructionsPart1_text = `This model can help you discover how the number of clams in the coastal environment affects the
clarity and health of the water. Conduct some experiment trials and analyze the recorded data to find a pattern for how
filtration by the population of clams changes plant and animal life and the quality of the water over the summer season.`;

const instructionsPart2_text = `Choose a starting level of Algae and Number of Clams per square meter using the “Controls”.
 Press “Play” ![play button](${PlayButton}) and watch the view of the coastal sea bottom change over five months from May to September.
 Press “New” ![new trial button](${NewTrialButton}) to start a new trial. The graphs and table records the data for each trial.`;

const instructionsPart3_text = `To help you find a pattern in the data, you can review each trail by clicking on different rows in
the data table and using the “Month” slider to move back and forth in the summer season. Click on the different rows in the table
to look back at different trials.`;

export const translations: TranslationDict = {
  "CREDITS.HEADER": { string: "Credits"},
  "INSTRUCTIONS.HEADER": { string: "Clam Filtration Experiments" },

  "BUTTON.NEW": {string: "New"},
  "BUTTON.TRIAL": { string: "Trial", mp3: new Audio(NewTrial)},
  "BUTTON.PLAY": { string: "Play", mp3: new Audio (Play)},

  "SIMULATION.TITLE": { string: "Clam Filtration" },

  "MONTH_1": { string: `May`, mp3: new Audio(Day0)},
  "MONTH_2": { string: `Jun`, mp3: new Audio(Day4)},
  "MONTH_3": { string: `Jul`, mp3: new Audio(Day8)},
  "MONTH_4": { string: `Aug`, mp3: new Audio(Day12)},
  "MONTH_5": { string: `Sep`, mp3: new Audio(Day16)},

  "SETUP_CLAM_SIM": { string: "Controls", mp3: new Audio(Controls)},

  "AMOUNT.HIGH": { string: "High", mp3: new Audio(Full)},
  "AMOUNT.MEDIUM": { string: "Med.", mp3: new Audio(Some)},
  "AMOUNT.LOW": { string: "Low", mp3: new Audio(None)},
  "AMOUNT.10": { string: "10", mp3: new Audio(Full)},
  "AMOUNT.5": { string: "5", mp3: new Audio(Some)},
  "AMOUNT.1": { string: "1", mp3: new Audio(None)},
  "SLIDER_TITLE.ALGAE": { string: "Algae", mp3: new Audio(Light )},
  "SLIDER_TITLE.NUM_CLAMS": {string: "Number \n of Clams", mp3: new Audio(Water)},

  "TIME_SLIDER_LABEL.MONTH": {string: "Month: "},

  "OUTPUT.NONE": { string: "None", mp3: new Audio(None)},
  "OUTPUT.LOW": { string: "Low", mp3: new Audio(Low)},
  "OUTPUT.MEDIUM": { string: "Med.", mp3: new Audio(Medium)},
  "OUTPUT.HIGH": { string: "High", mp3: new Audio(High)},

  "CLAM": { string: "Clam"},
  "WATER_TEMP": {string: "Water Temp: "},

  "TABLE.TITLE": {string: "Trial Results", mp3: new Audio(TrialsData)},
  "TABLE.HEADER_TRIAL": {string: "Trial", mp3: new Audio(Trial)},
  "TABLE.HEADER_CLAMS": {string: "# of Clams", mp3: new Audio(Light)},
  "TABLE.HEADER_ALGAE": {string: "Algae", mp3: new Audio(Water)},
  "TABLE.HEADER_OUTPUT.NITRATE": {string: "Nitrate", mp3: new Audio(Co2)},
  "TABLE.HEADER_OUTPUT.TURBIDITY": {string: "Turbidity", mp3: new Audio(SugarCreated)},

  "TABLE.DELETE_TRIAL": { string: "Delete trial", mp3: new Audio(DeleteTrial)},

  "GRAPHS.X_AXIS_LABEL": {string: "Month", mp3: new Audio(Graphs_XAxisLabel)},
  "GRAPHS.TRIAL_1": { string: "Trial 1 Graphs", mp3: new Audio(Graphs_Trial1)},
  "GRAPHS.TRIAL_2": { string: "Trial 2 Graphs", mp3: new Audio(Graphs_Trial2)},
  "GRAPHS.TRIAL_3": { string: "Trial 3 Graphs", mp3: new Audio(Graphs_Trial3)},
  "GRAPHS.TRIAL_4": { string: "Trial 4 Graphs", mp3: new Audio(Graphs_Trial4)},
  "GRAPHS.TRIAL_5": { string: "Trial 5 Graphs", mp3: new Audio(Graphs_Trial5)},
  "GRAPHS.TRIAL_6": { string: "Trial 6 Graphs", mp3: new Audio(Graphs_Trial6)},
  "GRAPHS.TRIAL_7": { string: "Trial 7 Graphs", mp3: new Audio(Graphs_Trial7)},
  "GRAPHS.TRIAL_8": { string: "Trial 8 Graphs", mp3: new Audio(Graphs_Trial8)},
  "GRAPHS.TRIAL_9": { string: "Trial 9 Graphs", mp3: new Audio(Graphs_Trial9)},
  "GRAPHS.LABEL.ALGAE": {string: "Algae", mp3: new Audio(Light)},
  "GRAPHS.LABEL.NITRATE": {string: "Nitrate", mp3: new Audio(Light)},
  "GRAPHS.LABEL.TURBIDITY": {string: "Turbidity", mp3: new Audio(Light)},

  "INSTRUCTIONS.PART_1": {string: instructionsPart1_text, mp3: new Audio(InstructionsPart1)},
  "INSTRUCTIONS.PART_2_HEADER": {string: `# Running a trial`},
  "INSTRUCTIONS.PART_2": {string: instructionsPart2_text, mp3: new Audio(InstructionsPart2)},
  "INSTRUCTIONS.PART_3_HEADER": {string: `# Analyzing trials`},
  "INSTRUCTIONS.PART_3": {string: instructionsPart3_text, mp3: new Audio(InstructionsPart3)},
};
