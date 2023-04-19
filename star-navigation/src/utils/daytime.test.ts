import { daytimeOpacity, sunriseSunset } from "./daytime";

describe("daytime utils", () => {
  it("has a sunriseSunset constant", () => {
    expect(sunriseSunset).toStrictEqual([
      {"sunrise": 7.383333333333334, "sunset": 17.233333333333334},
      {"sunrise": 6.966666666666667, "sunset": 17.8},
      {"sunrise": 7.316666666666666, "sunset": 19.266666666666666},
      {"sunrise": 6.55, "sunset": 19.75},
      {"sunrise": 5.966666666666667, "sunset": 20.2},
      {"sunrise": 5.766666666666667, "sunset": 20.55},
      {"sunrise": 5.983333333333333, "sunset": 20.5},
      {"sunrise": 6.4, "sunset": 20.016666666666666},
      {"sunrise": 6.85, "sunset": 19.266666666666666},
      {"sunrise": 7.283333333333333, "sunset": 18.516666666666666},
      {"sunrise": 6.816666666666666, "sunset": 16.95},
      {"sunrise": 7.283333333333333, "sunset": 16.85}
    ]);
  });

  it("calculates daytime opacity", () => {
    const D = 0;  // dark
    const T = 0.5; // twilight
    const L = 1;  // light
    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
    const results = [
      [D, D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, T, D, D, D, D, D, D],  // 1
      [D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, T, D, D, D, D, D, D],  // 2
      [D, D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, L, T, D, D, D, D],  // 3
      [D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, L, L, T, D, D, D, D],  // 4
      [D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, L, L, L, L, T, D, D, D],  // 5
      [D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, L, L, L, L, T, D, D, D],  // 6
      [D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, L, L, L, L, T, D, D, D],  // 7
      [D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, L, L, L, T, D, D, D],  // 8
      [D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, L, L, T, D, D, D, D],  // 9
      [D, D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, L, T, D, D, D, D, D],  // 10
      [D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, L, T, D, D, D, D, D, D, D],  // 11
      [D, D, D, D, D, D, D, T, L, L, L, L, L, L, L, L, T, D, D, D, D, D, D, D],  // 12
    ];

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(month => {
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].forEach(timeOfDay => {
        expect(daytimeOpacity({month, timeOfDay})).toBe(results[month - 1][timeOfDay]);
      });
    });
  });
});
