interface ITranslation {
  string: string,
  mp3?: string
}

export const translations: Record<string, ITranslation> = {
  "TABLE.TITLE": {string: "Trials: Data", mp3: "../yupik-audio/controls.mp3"},
  "TABLE.DELETE_TRIAL": { string: "Delete trial", mp3: "../yupik-audio/controls.mp3"},
  "BUTTON.NEW": { string: "New" },
  "BUTTON.TRIAL": { string: "Trial", mp3: "../yupik-audio/controls.mp3"},
  "BUTTON.PLAY": { string: "Play", mp3: "../yupik-audio/controls.mp3"},
  "CREDITS.HEADER": { string: "Credits", mp3: "../yupik-audio/controls.mp3"},
  "INSTRUCTIONS.HEADER": { string: "Activity Instructions", mp3: "../yupik-audio/controls.mp3"},
  "SIMULATION.TITLE": { string: "Plant Growth", mp3: "../yupik-audio/controls.mp3"},
  "SIMULATION.TIME": { string: "Time: %{days} days", mp3: "../yupik-audio/controls.mp3"},
  "TIME.0_DAYS": { string: "Time: 0 days", mp3: "../yupik-audio/controls.mp3"},
  "TIME.4_DAYS": { string: "Time: 4 days", mp3: "../yupik-audio/controls.mp3"},
  "TIME.12_DAYS": { string: "Time: 8 days", mp3: "../yupik-audio/controls.mp3"},
  "TIME.16_DAYS": { string: "Time: 12 days", mp3: "../yupik-audio/controls.mp3"},
  "TIME.20_DAYS": { string: "Time: 16 days", mp3: "../yupik-audio/controls.mp3"},
  "TIME.24_DAYS": { string: "Time: 20 days", mp3: "../yupik-audio/controls.mp3"},
  "TIME.28_DAYS": { string: "Time: 28 days", mp3: "../yupik-audio/controls.mp3"},
  "AMOUNT.NONE": { string: "None", mp3: "../yupik-audio/controls.mp3"},
  "AMOUNT.SOME": { string: "Some", mp3: "../yupik-audio/controls.mp3"},
  "AMOUNT.FULL": { string: "Full", mp3: "../yupik-audio/controls.mp3"},
  "AMOUNT.NO": { string: "no", mp3: "../yupik-audio/controls.mp3"},
  "OUTPUT.LOW": { string: "Low", mp3: "../yupik-audio/controls.mp3"},
  "OUTPUT.MEDIUM": { string: "Medium", mp3: "../yupik-audio/controls.mp3"},
  "OUTPUT.HIGH": { string: "High", mp3: "../yupik-audio/controls.mp3"},
  "TERRARIUM": { string: "Terrarium", mp3: "../yupik-audio/controls.mp3"},
  "SETUP_TERRARIUM": { string: "Controls", mp3: "../yupik-audio/controls.mp3"},
  "GRAPH.TITLE.DAYS": { string: "Days", mp3: "../yupik-audio/controls.mp3"}
}
