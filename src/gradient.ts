import chroma, { Color } from "chroma-js";
import bezierEasing from "bezier-easing";
import { clone, isGradient } from "./utils";
import { BezierCurve, FigmaColor } from "./types";

const easeMap: { [key: string]: BezierCurve } = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1]
};

export function getFillIndexWithGradient(node: GeometryMixin): number | null {
  // We can be assured that node.fills is not a symbol, since it is only a symbol
  // when it is "mixed", which is not possible when only one node is selected.
  const nodeFills = node.fills as readonly Paint[];
  const fillIndex = nodeFills.findIndex(isGradient);

  return fillIndex !== undefined ? fillIndex : null;
}

export function applyColors(
  node: GeometryMixin,
  fillIndex: number,
  colors: FigmaColor[]
): void {
  const tempFill = clone(node.fills);
  tempFill[fillIndex].gradientStops = colors;
  node.fills = tempFill;
}

export function easeGradient(
  fill: GradientPaint,
  colorSteps: number
): FigmaColor[] {
  const firstStop = fill.gradientStops[0];
  const lastStop = fill.gradientStops[fill.gradientStops.length - 1];
  const firstColor = chromaFromColorStop(firstStop);
  const lastColor = chromaFromColorStop(lastStop);

  const scale = chroma.scale([firstColor, lastColor]);
  const bezierCurve = easeMap["ease-in-out"];
  console.log("Bezier curve:", bezierCurve);
  const easing = bezierEasing(...bezierCurve);

  const stepSize = 1 / colorSteps;
  const curvePositions = [];
  for (let i = 0; i <= colorSteps; i++) {
    curvePositions.push(i * stepSize);
  }
  console.log("Curve positions:", curvePositions);

  return curvePositions.map(position => {
    const [r, g, b, a] = scale(easing(position)).gl();
    return {
      color: { r, g, b, a },
      position
    };
  });
}

function chromaFromColorStop(stop: ColorStop): Color {
  return chroma.gl(stop.color.r, stop.color.g, stop.color.b, stop.color.a);
}
