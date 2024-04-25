import { TOutput } from "../types";

export type TCaseOutputData = Array<{ month: string, output: Record<TOutput, number> }>;
type TOutputData = Record<string, TCaseOutputData>;
type TTextLevelRange = {
  [key: string]: {
    low: number,
    medium: number,
    high: number
  }
};

export const outputData: TOutputData = {
  Low1: [ {month: "May",
            output:{algae: 15, nitrate: 27, turbidity: 15}},
          {month: "June",
            output:{algae: 35, nitrate: 32, turbidity: 35}},
          {month: "July",
            output:{algae: 50, nitrate: 35, turbidity: 40}},
          {month: "August",
            output:{algae: 60, nitrate: 40, turbidity: 40}},
          {month: "September",
            output:{algae: 80, nitrate: 45, turbidity: 80}},
        ],
  Low5: [ {month: "May",
            output:{algae: 15, nitrate: 27, turbidity: 15}},
          {month: "June",
            output:{algae: 18, nitrate: 28, turbidity: 18}},
          {month: "July",
            output:{algae: 18, nitrate: 27, turbidity: 18}},
          {month: "August",
            output:{algae: 18, nitrate: 26, turbidity: 18}},
          {month: "September",
            output:{algae: 15, nitrate: 27, turbidity: 15}},
        ],
  Low10: [ {month: "May",
              output:{algae: 15, nitrate: 27, turbidity: 15}},
            {month: "June",
              output:{algae: 11, nitrate: 22, turbidity: 11}},
            {month: "July",
              output:{algae: 10, nitrate: 18, turbidity: 10}},
            {month: "August",
              output:{algae: 8, nitrate: 12, turbidity: 8}},
            {month: "September",
              output:{algae: 5, nitrate: 5, turbidity: 5}},
          ],
  Medium1: [ {month: "May",
                output:{algae: 45, nitrate: 27, turbidity: 45}},
              {month: "June",
                output:{algae: 55, nitrate: 30, turbidity: 55}},
              {month: "July",
                output:{algae: 65, nitrate: 35, turbidity: 65}},
              {month: "August",
                output:{algae: 80, nitrate: 40, turbidity: 80}},
              {month: "September",
                output:{algae: 90, nitrate: 50, turbidity: 90}},
            ],
  Medium5: [ {month: "May",
                output:{algae: 45, nitrate: 27, turbidity: 45}},
              {month: "June",
                output:{algae: 45, nitrate: 32, turbidity: 45}},
              {month: "July",
                output:{algae: 45, nitrate: 33, turbidity: 45}},
              {month: "August",
                output:{algae: 45, nitrate: 32, turbidity: 45}},
              {month: "September",
                output:{algae: 45, nitrate: 30, turbidity: 45}},
            ],
  Medium10: [ {month: "May",
                    output:{algae: 45, nitrate: 27, turbidity: 45}},
                  {month: "June",
                    output:{algae: 35, nitrate: 25, turbidity: 35}},
                  {month: "July",
                    output:{algae: 30, nitrate: 18, turbidity: 30}},
                  {month: "August",
                    output:{algae: 25, nitrate: 12, turbidity: 25}},
                  {month: "September",
                    output:{algae: 15, nitrate: 10, turbidity: 15}},
                ],
  High1: [ {month: "May",
                output:{algae: 80, nitrate: 27, turbidity: 80}},
              {month: "June",
                output:{algae: 90, nitrate: 34, turbidity: 90}},
              {month: "July",
                output:{algae: 95, nitrate: 44, turbidity: 95}},
              {month: "August",
                output:{algae: 98, nitrate: 50, turbidity: 98}},
              {month: "September",
                output:{algae: 100, nitrate: 55, turbidity: 100}},
            ],
  High5: [ {month: "May",
              output:{algae: 80, nitrate: 27, turbidity: 80}},
            {month: "June",
              output:{algae: 75, nitrate: 25, turbidity: 85}},
            {month: "July",
              output:{algae: 70, nitrate: 23, turbidity: 70}},
            {month: "August",
              output:{algae: 65, nitrate: 20, turbidity: 65}},
            {month: "September",
              output:{algae: 60, nitrate: 18, turbidity: 60}},
          ],
  High10: [ {month: "May",
              output:{algae: 80, nitrate: 27, turbidity: 80}},
            {month: "June",
              output:{algae: 75, nitrate: 25, turbidity: 75}},
            {month: "July",
              output:{algae: 65, nitrate: 22, turbidity: 65}},
            {month: "August",
              output:{algae: 55, nitrate: 20, turbidity: 55}},
            {month: "September",
              output:{algae: 50, nitrate: 15, turbidity: 50}},
          ],
};

const textLevelRangeDict: TTextLevelRange
          = { algae: {low: 30, medium: 60, high: 100},
              nitrate: {low: 20, medium: 35, high: 55},
              turbidity: {low: 30, medium: 60, high: 100}
            };

export const getTextRange = (caseName: string, element: TOutput) => {
  // returns Low, Medium, High based on September outputData and textLevelRangeDict
  const finalOutput = outputData[caseName][4].output[element];
  const range = textLevelRangeDict[element];
  if (finalOutput < range.low) return "Low";
  if (finalOutput < range.medium) return "Medium";
  else return "High";
};

export const algaeLevelText = ["Low", "Medium", "High"];
export const clamDensities = [1, 5, 10];
export const clamDensitiesToShow = [1, 5, 8];
