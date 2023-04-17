import $ from "jquery";

// Mouse position in pixels.
export function mousePos(event: any, targetElement: HTMLElement) {
  const $targetElement = $(targetElement);
  const parentX = $targetElement.offset()?.left || 0;
  const parentY = $targetElement.offset()?.top || 0;
  return {x: event.pageX - parentX, y: event.pageY - parentY};
}

// Normalized mouse position [-1, 1].
export function mousePosNormalized(event: any, targetElement: HTMLElement) {
  const pos = mousePos(event, targetElement);
  const $targetElement = $(targetElement);
  const parentWidth = $targetElement.width() || 1;
  const parentHeight = $targetElement.height() || 1;
  pos.x =  (pos.x / parentWidth) * 2 - 1;
  pos.y = -(pos.y / parentHeight) * 2 + 1;
  return pos;
}

// Accepts hash like with rgb values and positions between [0, 1], e.g.:
// {
//   0.1: [120, 120, 120],
//   0.5: [255, 50, 50],
//   0.8: [0, 255, 255]
// }
// Returns a function that accepts value between [0, 1] and returns interpolated color (rgb string).
type RGBTriple = [number, number, number];
export function colorInterpolation(colors: Record<number, RGBTriple>) {
  const sortedPositions = Object.keys(colors).map(v => parseFloat(v)).sort();
  function rgbToString(rgb: RGBTriple) {
    return "rgb(" + rgb.join(", ") + ")";
  }
  return function(t: number) {
    let i = 0;
    while (t > sortedPositions[i] && i < sortedPositions.length) {
      i++;
    }
    if (t === sortedPositions[i]) return rgbToString(colors[sortedPositions[i]]);
    const leftIdx = i - 1 >= 0 ? i - 1 : sortedPositions.length - 1;
    const rightIdx = i < sortedPositions.length ? i : 0;
    const leftPos = sortedPositions[leftIdx];
    let rightPos = sortedPositions[rightIdx];
    const leftColor = colors[leftPos];
    const rightColor = colors[rightPos];
    // Special case when t value is between the last and first position.
    if (leftPos > rightPos) {
      rightPos += 1;
    }
    if (t < leftPos) {
      t += 1;
    }
    const ratio = (t - leftPos) / (rightPos - leftPos);
    const result = [];
    for (let j = 0; j < 3; j++) {
      const left = leftColor[j];
      const right = rightColor[j];
      result.push(Math.round(left < right ? left + (right - left) * ratio : left - (left - right) * ratio));
    }
    return rgbToString(result as RGBTriple);
  };
}
export default function getURLParam(name: string, defaultValue = null) {
  const url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return defaultValue;
  if (!results[2]) return true;
  const value = decodeURIComponent(results[2].replace(/\+/g, " "));
  if (value === "false") return false;
  return value;
}
