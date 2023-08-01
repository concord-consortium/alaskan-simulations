// Based on https://www.npmjs.com/package/svg-arc
// However, the package was old and not published correctly, so it was easier to copy and fix it here.

const point = (x: number, y: number, r: number, angle: number) => [
  (x + Math.sin(angle) * r).toFixed(2),
  (y - Math.cos(angle) * r).toFixed(2),
];

const full = (x: number, y: number, R: number, r: number) => {
  if (r <= 0) {
    return `M ${x - R} ${y} A ${R} ${R} 0 1 1 ${x + R} ${y} A ${R} ${R} 1 1 1 ${x - R} ${y} Z`;
  }
  return `M ${x - R} ${y} A ${R} ${R} 0 1 1 ${x + R} ${y} A ${R} ${R} 1 1 1 ${x - R} ${y} M ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} A ${r} ${r} 1 1 1 ${x - r} ${y} Z`;
};

const part = (x: number, y: number, R: number, r: number, start: number, end: number) => {
  const [s, e] = [(start / 360) * 2 * Math.PI, (end / 360) * 2 * Math.PI];
  const P = [
    point(x, y, r, s),
    point(x, y, R, s),
    point(x, y, R, e),
    point(x, y, r, e),
  ];
  const flag = e - s > Math.PI ? "1" : "0";
  return `M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} A ${R} ${R} 0 ${flag} 1 ${P[2][0]} ${P[2][1]} L ${P[3][0]} ${P[3][1]} A ${r} ${r}  0 ${flag} 0 ${P[0][0]} ${P[0][1]} Z`;
};

export const arc = (opts: { x: number, y: number, R: number, r: number, start: number, end: number }) => {
  const { x = 0, y = 0 } = opts;
  let {
    R = 0, r = 0, start, end,
  } = opts;

  [R, r] = [Math.max(R, r), Math.min(R, r)];
  if (R <= 0) return "";
  if (start !== +start || end !== +end) return full(x, y, R, r);
  if (Math.abs(start - end) < 0.000001) return "";
  if (Math.abs(start - end) % 360 < 0.000001) return full(x, y, R, r);

  [start, end] = [start % 360, end % 360];

  if (start > end) end += 360;
  return part(x, y, R, r, start, end);
};
