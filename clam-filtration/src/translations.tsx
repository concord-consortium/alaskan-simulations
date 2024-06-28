import { TranslationDict } from "common";
import Algae from "./assets/yugtun-audio/Algae.mp3";
import ClamFiltration from "./assets/yugtun-audio/ClamFiltration.mp3";
import Controls from "./assets/yugtun-audio/Controls.mp3";
import DeleteTrial from "./assets/yugtun-audio/DeleteTrial.mp3";
import Five from "./assets/yugtun-audio/Five.mp3";
import High from "./assets/yugtun-audio/High.mp3";
import Low from "./assets/yugtun-audio/Low.mp3";
import Medium from "./assets/yugtun-audio/Medium.mp3";
import Month from "./assets/yugtun-audio/Month.mp3";
import MonthAugust from "./assets/yugtun-audio/MonthAugust.mp3";
import MonthJuly from "./assets/yugtun-audio/MonthJuly.mp3";
import MonthJune from "./assets/yugtun-audio/MonthJune.mp3";
import MonthMay from "./assets/yugtun-audio/MonthMay.mp3";
import MonthSeptember from "./assets/yugtun-audio/MonthSeptember.mp3";
import NewTrial from "./assets/yugtun-audio/new-trial.mp3"
import Nitrate from "./assets/yugtun-audio/Nitrate.mp3";
import None from "./assets/yugtun-audio/none.mp3";
import NoOfClams from "./assets/yugtun-audio/NoOfClams.mp3";
import NumberOfClams from "./assets/yugtun-audio/NumberOfClams.mp3";
import One from "./assets/yugtun-audio/One.mp3";
import Play from "./assets/yugtun-audio/Play.mp3";
import Ten from "./assets/yugtun-audio/Ten.mp3";
import Trial from "./assets/yugtun-audio/Trial.mp3";
import TrialResults from "./assets/yugtun-audio/TrialResults.mp3";
import Turbidity from "./assets/yugtun-audio/Turbidity.mp3";
import WaterTemp from "./assets/yugtun-audio/WaterTemp.mp3";
import Graphs_Trial1 from "./assets/yugtun-audio/trial-1-graphs.mp3";
import Graphs_Trial2 from "./assets/yugtun-audio/trial-2-graphs.mp3";
import Graphs_Trial3 from "./assets/yugtun-audio/trial-3-graphs.mp3";
import Graphs_Trial4 from "./assets/yugtun-audio/trial-4-graphs.mp3";
import Graphs_Trial5 from "./assets/yugtun-audio/trial-5-graphs.mp3";
import Graphs_Trial6 from "./assets/yugtun-audio/trial-6-graphs.mp3";
import Graphs_Trial7 from "./assets/yugtun-audio/trial-7-graphs.mp3";
import Graphs_Trial8 from "./assets/yugtun-audio/trial-8-graphs.mp3";
import Graphs_Trial9 from "./assets/yugtun-audio/trial-9-graphs.mp3";

import PlayButton from "./assets/snapshots-directions/instructions-play-button@3x.png";
import NewTrialButton from "./assets/snapshots-directions/instructions-new-trial-button@3x.png";

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
  "CREDITS.HEADER": { string: "Credits" },
  "INSTRUCTIONS.HEADER": { string: "Clam Filtration Experiments" },

  "BUTTON.NEW": {string: "New"},
  "BUTTON.TRIAL": { string: "Trial", mp3: new Audio(NewTrial)},
  "BUTTON.PLAY": { string: "Play", mp3: new Audio (Play)},

  "SIMULATION.TITLE": { string: "Clam Filtration", mp3: new Audio(ClamFiltration)},

  "MONTH_1": { string: `Month: May`, mp3: new Audio(MonthMay)},
  "MONTH_2": { string: `Month: June`, mp3: new Audio(MonthJune)},
  "MONTH_3": { string: `Month: July`, mp3: new Audio(MonthJuly)},
  "MONTH_4": { string: `Month: August`, mp3: new Audio(MonthAugust)},
  "MONTH_5": { string: `Month: September`, mp3: new Audio(MonthSeptember)},

  "GRAPHS_MONTH_1": { string: `May`, mp3: new Audio(MonthMay)},
  "GRAPHS_MONTH_2": { string: `Jun`, mp3: new Audio(MonthJune)},
  "GRAPHS_MONTH_3": { string: `Jul`, mp3: new Audio(MonthJuly)},
  "GRAPHS_MONTH_4": { string: `Aug`, mp3: new Audio(MonthAugust)},
  "GRAPHS_MONTH_5": { string: `Sep`, mp3: new Audio(MonthSeptember)},

  "SETUP_CLAM_SIM": { string: "Controls", mp3: new Audio(Controls)},

  "AMOUNT.HIGH": { string: "High", mp3: new Audio(High)},
  "AMOUNT.MEDIUM": { string: "Med.", mp3: new Audio(Medium)},
  "AMOUNT.LOW": { string: "Low", mp3: new Audio(Low)},
  "AMOUNT.10": { string: "10", mp3: new Audio(Ten)},
  "AMOUNT.5": { string: "5", mp3: new Audio(Five)},
  "AMOUNT.1": { string: "1", mp3: new Audio(One)},
  "SLIDER_TITLE.ALGAE": { string: "Algae", mp3: new Audio(Algae)},
  "SLIDER_TITLE.NUM_CLAMS": {string: "Number \n of Clams", mp3: new Audio(NoOfClams)},

  "TIME_SLIDER_LABEL.MONTH": {string: "Month: "},

  "OUTPUT.NONE": { string: "None", mp3: new Audio(None)},
  "OUTPUT.LOW": { string: "Low", mp3: new Audio(Low)},
  "OUTPUT.MEDIUM": { string: "Med.", mp3: new Audio(Medium)},
  "OUTPUT.HIGH": { string: "High", mp3: new Audio(High)},

  "CLAM": { string: "Clam"},
  "WATER_TEMP": {string: "Water Temp:", mp3: new Audio(WaterTemp)},

  "TABLE.TITLE": {string: "Trial Results", mp3: new Audio(TrialResults)},
  "TABLE.HEADER_TRIAL": {string: "Trial", mp3: new Audio(Trial)},
  "TABLE.HEADER_CLAMS": {string: "# of Clams", mp3: new Audio(NumberOfClams)},
  "TABLE.HEADER_ALGAE": {string: "Algae", mp3: new Audio(Algae)},
  "TABLE.HEADER_OUTPUT.NITRATE": {string: "Nitrate", mp3: new Audio(Nitrate)},
  "TABLE.HEADER_OUTPUT.TURBIDITY": {string: "Turbidity", mp3: new Audio(Turbidity)},

  "TABLE.DELETE_TRIAL": { string: "Delete trial", mp3: new Audio(DeleteTrial)},

  "GRAPHS.X_AXIS_LABEL": {string: "Month", mp3: new Audio(Month)},
  "GRAPHS.TRIAL_1": { string: "Trial 1 Graphs", mp3: new Audio(Graphs_Trial1)},
  "GRAPHS.TRIAL_2": { string: "Trial 2 Graphs", mp3: new Audio(Graphs_Trial2)},
  "GRAPHS.TRIAL_3": { string: "Trial 3 Graphs", mp3: new Audio(Graphs_Trial3)},
  "GRAPHS.TRIAL_4": { string: "Trial 4 Graphs", mp3: new Audio(Graphs_Trial4)},
  "GRAPHS.TRIAL_5": { string: "Trial 5 Graphs", mp3: new Audio(Graphs_Trial5)},
  "GRAPHS.TRIAL_6": { string: "Trial 6 Graphs", mp3: new Audio(Graphs_Trial6)},
  "GRAPHS.TRIAL_7": { string: "Trial 7 Graphs", mp3: new Audio(Graphs_Trial7)},
  "GRAPHS.TRIAL_8": { string: "Trial 8 Graphs", mp3: new Audio(Graphs_Trial8)},
  "GRAPHS.TRIAL_9": { string: "Trial 9 Graphs", mp3: new Audio(Graphs_Trial9)},

  "GRAPHS.LABEL.ALGAE": {string: "Algae", mp3: new Audio(Algae)},
  "GRAPHS.LABEL.NITRATE": {string: "Nitrate", mp3: new Audio(Nitrate)},
  "GRAPHS.LABEL.TURBIDITY": {string: "Turbidity", mp3: new Audio(Turbidity)},

  "INSTRUCTIONS.PART_1": {string: instructionsPart1_text},
  "INSTRUCTIONS.PART_2_HEADER": {string: `# Running a trial`},
  "INSTRUCTIONS.PART_2": {string: instructionsPart2_text},
  "INSTRUCTIONS.PART_3_HEADER": {string: `# Analyzing trials`},
  "INSTRUCTIONS.PART_3": {string: instructionsPart3_text},
};
