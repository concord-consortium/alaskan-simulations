import NewTrial from "../assets/yupik-audio/new-trial.mp3";
import Controls from "../assets/yupik-audio/controls.mp3";
import Play from "../assets/yupik-audio/play.mp3";
import Time28Days from "../assets/yupik-audio/time-28-days.mp3";
import Day4 from "../assets/yupik-audio/day-4.mp3";
import Day8 from "../assets/yupik-audio/day-8.mp3";
import Day12 from "../assets/yupik-audio/day-12.mp3";
import Day24 from "../assets/yupik-audio/day-24.mp3";
import Day28 from "../assets/yupik-audio/day-28.mp3";
import Co2None from "../assets/yupik-audio/carbon-dioxide-none.mp3";
import Co2Low from "../assets/yupik-audio/carbon-dioxide-low.mp3";
import Co2High from "../assets/yupik-audio/carbon-dioxide-high.mp3";
import Co2 from "../assets/yupik-audio/carbon-dioxide.mp3";
import LightNone from "../assets/yupik-audio/light-none.mp3";
import LightLow from "../assets/yupik-audio/light-low.mp3";
import LightHigh from "../assets/yupik-audio/light-high.mp3";
import Light from "../assets/yupik-audio/light.mp3";
import WaterNone from "../assets/yupik-audio/water-none.mp3";
import WaterLow from "../assets/yupik-audio/water-low.mp3";
import WaterHigh from "../assets/yupik-audio/water-high.mp3";
import Water from "../assets/yupik-audio/water.mp3";
import Trial from "../assets/yupik-audio/trial.mp3";
import SugarCreated from "../assets/yupik-audio/sugar-created.mp3";
import SugarUsed from "../assets/yupik-audio/sugar-used.mp3";
import None from "../assets/yupik-audio/none.mp3";
import Low from "../assets/yupik-audio/low.mp3";
import High from "../assets/yupik-audio/high.mp3";
import DeleteTrial from "../assets/yupik-audio/delete-trial.mp3";
import Graphs_XAxisLabel from "../assets/yupik-audio/time-days.mp3";
import Graphs_Trial1 from "../assets/yupik-audio/trial-1-graphs.mp3";
import Graphs_Trial2 from "../assets/yupik-audio/trial-2-graphs.mp3";
import Graphs_Trial3 from "../assets/yupik-audio/trial-3-graphs.mp3";
import Graphs_Trial4 from "../assets/yupik-audio/trial-4-graphs.mp3";
import Graphs_Trial5 from "../assets/yupik-audio/trial-5-graphs.mp3";
import Graphs_Trial6 from "../assets/yupik-audio/trial-6-graphs.mp3";
import Graphs_Trial7 from "../assets/yupik-audio/trial-7-graphs.mp3";
import Graphs_Trial8 from "../assets/yupik-audio/trial-8-graphs.mp3";
import Graphs_Trial9 from "../assets/yupik-audio/trial-9-graphs.mp3";

interface ITranslation {
  string: string;
  mp3?: string;
}

export const translations: Record<string, ITranslation> = {
  "CREDITS.HEADER": { string: "Credits"},
  "INSTRUCTIONS.HEADER": { string: "Activity Instructions"},

  "BUTTON.NEW": {string: "New"},
  "BUTTON.TRIAL": { string: "Trial", mp3: NewTrial},
  "BUTTON.PLAY": { string: "Play", mp3: Play},

  "SIMULATION.TITLE": { string: "Plant Growth" },

  "TIME.0_DAYS": { string: "Time: 0 days"},
  "TIME.4_DAYS": { string: "Time: 4 days"},
  "TIME.12_DAYS": { string: "Time: 8 days"},
  "TIME.16_DAYS": { string: "Time: 12 days"},
  "TIME.20_DAYS": { string: "Time: 16 days"},
  "TIME.24_DAYS": { string: "Time: 20 days"},
  "TIME.28_DAYS": { string: "Time: 28 days", mp3: Time28Days},

  "DAY_0": { string: `Time: 0 days`},
  "DAY_4": { string: `Time: 4 days`, mp3: Day4},
  "DAY_8": { string: `Time: 8 days`, mp3: Day8},
  "DAY_12": { string: `Time: 12 days`, mp3: Day12},
  "DAY_16": { string: `Time: 16 days`},
  "DAY_20": { string: `Time: 20 days`},
  "DAY_24": { string: `Time: 24 days`, mp3: Day24},
  "DAY_28": { string: `Time: 28 days`, mp3: Day28},

  "X_TICK_0": { string: `0`},
  "X_TICK_4": { string: `4`, mp3: Day4},
  "X_TICK_8": { string: `8`, mp3: Day8},
  "X_TICK_12": { string: `12`, mp3: Day12},
  "X_TICK_16": { string: `16`},
  "X_TICK_20": { string: `20`},
  "X_TICK_24": { string: `24`, mp3: Day24},
  "X_TICK_28": { string: `28`, mp3: Day28},

  "SETUP_TERRARIUM": { string: "Controls", mp3: Controls },

  "CO2_AMOUNT.NONE": { string: "None", mp3: Co2None},
  "CO2_AMOUNT.SOME": { string: "Some", mp3: Co2Low},
  "CO2_AMOUNT.FULL": { string: "Full", mp3: Co2High},
  "CO2": { string: "CO2", mp3: Co2},

  "LIGHT_AMOUNT.NONE": { string: "None", mp3: LightNone},
  "LIGHT_AMOUNT.SOME": { string: "Some", mp3: LightLow},
  "LIGHT_AMOUNT.FULL": { string: "Full", mp3: LightHigh},
  "LIGHT": { string: "Light", mp3: Light },

  "WATER_AMOUNT.NONE": { string: "None", mp3: WaterNone},
  "WATER_AMOUNT.SOME": { string: "Some", mp3: WaterLow},
  "WATER_AMOUNT.FULL": { string: "Full", mp3: WaterHigh},
  "WATER": { string: "Water", mp3: Water},

  "AMOUNT.NONE": { string: "None"},
  "AMOUNT.SOME": { string: "Some"},
  "AMOUNT.FULL": { string: "Full"},
  "AMOUNT.NO": { string: "no"},

  "OUTPUT.SUGAR_CREATED": {string: "Sugar Created", mp3: SugarCreated},
  "OUTPUT.SUGAR_USED": {string: "Sugar Used", mp3: SugarUsed},

  "OUTPUT.NONE": { string: "None", mp3: None},
  "OUTPUT.LOW": { string: "Low", mp3: Low},
  "OUTPUT.MEDIUM": { string: "Medium"},
  "OUTPUT.HIGH": { string: "High", mp3: High},

  "TERRARIUM": { string: "Terrarium"},

  "TABLE.TITLE": {string: "Trials: Data"},
  "TABLE.HEADER_TRIAL": {string: "Trial", mp3: Trial},
  "TABLE.HEADER_LIGHT": {string: "Light", mp3: Light},
  "TABLE.HEADER_WATER": {string: "Water", mp3: Water},
  "TABLE.HEADER_CO2": {string: "CO2", mp3: Co2},
  "TABLE.HEADER_OUTPUT.SUGAR_CREATED": {string: "Sugar Created", mp3: SugarCreated},
  "TABLE.HEADER_OUTPUT.SUGAR_USED": {string: "Sugar Used", mp3: SugarUsed},

  "TABLE.DELETE_TRIAL": { string: "Delete trial", mp3: DeleteTrial},

  "GRAPHS.X_AXIS_LABEL": {string: "Time (Days)", mp3: Graphs_XAxisLabel},
  "GRAPHS.TRIAL_1": { string: "Trial 1 Graphs", mp3: Graphs_Trial1},
  "GRAPHS.TRIAL_2": { string: "Trial 2 Graphs", mp3: Graphs_Trial2},
  "GRAPHS.TRIAL_3": { string: "Trial 3 Graphs", mp3: Graphs_Trial3},
  "GRAPHS.TRIAL_4": { string: "Trial 4 Graphs", mp3: Graphs_Trial4},
  "GRAPHS.TRIAL_5": { string: "Trial 5 Graphs", mp3: Graphs_Trial5},
  "GRAPHS.TRIAL_6": { string: "Trial 6 Graphs", mp3: Graphs_Trial6},
  "GRAPHS.TRIAL_7": { string: "Trial 7 Graphs", mp3: Graphs_Trial7},
  "GRAPHS.TRIAL_8": { string: "Trial 8 Graphs", mp3: Graphs_Trial8},
  "GRAPHS.TRIAL_9": { string: "Trial 9 Graphs", mp3: Graphs_Trial9}
};
