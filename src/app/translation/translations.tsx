interface ITranslation {
  string: string,
  mp3?: string
}

export const translations: Record<string, ITranslation> = {
  "CREDITS.HEADER": { string: "Credits"},
  "INSTRUCTIONS.HEADER": { string: "Activity Instructions"},

  "BUTTON.NEW": {string: "New"},
  "BUTTON.TRIAL": { string: "Trial", mp3: "../yupik-audio/new-trial.mp3"},
  "BUTTON.PLAY": { string: "Play", mp3: "../yupik-audio/play.mp3"},

  "SIMULATION.TITLE": { string: "Plant Growth" },

  "TIME.0_DAYS": { string: "Time: 0 days"},
  "TIME.4_DAYS": { string: "Time: 4 days"},
  "TIME.12_DAYS": { string: "Time: 8 days"},
  "TIME.16_DAYS": { string: "Time: 12 days"},
  "TIME.20_DAYS": { string: "Time: 16 days"},
  "TIME.24_DAYS": { string: "Time: 20 days"},
  "TIME.28_DAYS": { string: "Time: 28 days", mp3: "../yupik-audio/time-28-days.mp3"},

  "DAY_0": { string: "Day 0"},
  "DAY_4": { string: "Day 4", mp3: "../yupik-audio/day-4.mp3"},
  "DAY_8": { string: "Day 8", mp3: "../yupik-audio/day-8.mp3"},
  "DAY_12": { string: "Day 12", mp3: "../yupik-audio/day-12.mp3"},
  "DAY_16": { string: "Day 16"},
  "DAY_20": { string: "Day 20"},
  "DAY_24": { string: "Day 24", mp3: "../yupik-audio/day-24.mp3"},
  "DAY_28": { string: "Day 28", mp3: "../yupik-audio/day-28.mp3"},

  "SETUP_TERRARIUM": { string: "Controls" },

  "CO2_AMOUNT.NONE": { string: "None", mp3: "../yupik-audio/carbon-dioxide-none.mp3"},
  "CO2_AMOUNT.SOME": { string: "Some", mp3: "../yupik-audio/carbon-dioxide-low.mp3"},
  "CO2_AMOUNT.FULL": { string: "Full", mp3: "../yupik-audio/carbon-dioxide-high.mp3"},
  "CO2": { string: "CO2", mp3: "../yupik-audio/carbon-dioxide.mp3"},

  "LIGHT_AMOUNT.NONE": { string: "None", mp3: "../yupik-audio/light-none.mp3"},
  "LIGHT_AMOUNT.SOME": { string: "Some", mp3: "../yupik-audio/light-low.mp3"},
  "LIGHT_AMOUNT.FULL": { string: "Full", mp3: "../yupik-audio/light-high.mp3"},
  "LIGHT": { string: "Light", mp3: "../yupik-audio/light.mp3"},

  "WATER_AMOUNT.NONE": { string: "None", mp3: "../yupik-audio/water-none.mp3"},
  "WATER_AMOUNT.SOME": { string: "Some", mp3: "../yupik-audio/water-low.mp3"},
  "WATER_AMOUNT.FULL": { string: "Full", mp3: "../yupik-audio/water-high.mp3"},
  "WATER": { string: "Water", mp3: "../yupik-audio/water.mp3"},

  "AMOUNT.NONE": { string: "None"},
  "AMOUNT.SOME": { string: "Some"},
  "AMOUNT.FULL": { string: "Full"},
  "AMOUNT.NO": { string: "no"},

  "TRIAL": {string: "Trial", mp3: "../yupik-audio/trial.mp3"},
  "OUTPUT.SUGAR_CREATED": {string: "Sugar Created", mp3: "../yupik-audio/sugar-created.mp3"},
  "OUTPUT.SUGAR_USED": {string: "Sugar Used", mp3: "../yupik-audio/sugar-used.mp3"},

  "OUTPUT.NONE": { string: "Low", mp3: "../yupik-audio/none.mp3"},
  "OUTPUT.LOW": { string: "Low", mp3: "../yupik-audio/low.mp3"},
  "OUTPUT.MEDIUM": { string: "Medium"},
  "OUTPUT.HIGH": { string: "High", mp3: "../yupik-audio/high.mp3"},

  "TERRARIUM": { string: "Terrarium"},

  "TABLE.TITLE": {string: "Trials: Data"},
  "TABLE.DELETE_TRIAL": { string: "Delete trial", mp3: "../yupik-audio/delete-trial.mp3"},

  "GRAPHS.TRIAL_1": { string: "Trial 1 Graphs", mp3: "../yupik-audio/trial-1-graphs.mp3"},
  "GRAPHS.TRIAL_2": { string: "Trial 2 Graphs", mp3: "../yupik-audio/trial-2-graphs.mp3"},
  "GRAPHS.TRIAL_3": { string: "Trial 3 Graphs", mp3: "../yupik-audio/trial-3-graphs.mp3"},
  "GRAPHS.TRIAL_4": { string: "Trial 4 Graphs", mp3: "../yupik-audio/trial-4-graphs.mp3"},
  "GRAPHS.TRIAL_5": { string: "Trial 5 Graphs", mp3: "../yupik-audio/trial-5-graphs.mp3"},
  "GRAPHS.TRIAL_6": { string: "Trial 6 Graphs", mp3: "../yupik-audio/trial-6-graphs.mp3"},
  "GRAPHS.TRIAL_7": { string: "Trial 7 Graphs", mp3: "../yupik-audio/trial-7-graphs.mp3"},
  "GRAPHS.TRIAL_8": { string: "Trial 8 Graphs", mp3: "../yupik-audio/trial-8-graphs.mp3"},
  "GRAPHS.TRIAL_9": { string: "Trial 9 Graphs", mp3: "../yupik-audio/trial-9-graphs.mp3"}
};
