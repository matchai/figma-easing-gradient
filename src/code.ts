const chroma = require("chroma-js");
const bezierEasing = require("bezier-easing");

interface Color {
  color: { r: number, g: number, b: number, a: number };
  position: number;
}

const easeMap = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1]
};

function main(): void {
  const selection = figma.currentPage.selection;
  // console.log(selection)
  if (selection.length !== 1 || !isShape(selection[0])) {
    figma.notify("Please select a shape with a gradient");
    figma.closePlugin();
  }

  let node = <GeometryMixin>selection[0];
  const fillIndex = getFillIndexWithGradient(node);
  if (fillIndex === null) {
    figma.notify("Please select a shape with a gradient");
    figma.closePlugin();
  }

  const fill = node.fills[fillIndex];
  if (fill.gradientStops.length !== 2) {
    figma.notify("Please ensure that the shape's gradient has two colors");
    figma.closePlugin();
  }

  // console.log(fill);

  const newColors = easeGradient(fill, 15);
  // console.log(newColors);

  applyColors(node, fillIndex, newColors);

  figma.closePlugin();
}

main();

function applyColors(node: GeometryMixin, fillIndex: number, colors: Color[]) {
  const tempFill = clone(node.fills);
  tempFill[fillIndex].gradientStops = colors;
  node.fills = tempFill
}

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

function easeGradient(fill: GradientPaint, colorSteps: number): Color[] {
  const colors = fill.gradientStops.map(stop => stop.color);
  const scale = chroma.scale(colors);

  const bezierCurve = easeMap.ease;
  const easing = bezierEasing(...bezierCurve);

  const stepSize = 1 / colorSteps;
  const curvePositions = [];
  for (let i = 0; i <= colorSteps; i++) {
    curvePositions.push(i * stepSize);
  }

  // console.log(curvePositions)
  return curvePositions.map(position => {
    const [r, g, b, a] = scale(easing(position)).rgba();
    return {
      color: { r, g, b, a },
      position
    };
  });
}

function getFillIndexWithGradient(node: GeometryMixin): number | null {
  if (!isShape(node)) return null;
  
  // We can be assured that node.fills is not a symbol, since it is only a symbol
  // when it is "mixed", which is not possible when only one node is selected.
  const nodeFills = node.fills as readonly Paint[];
  const fillIndex = nodeFills.findIndex(isGradient);

  return fillIndex !== undefined ? fillIndex : null;
}

function isShape(node: any): node is GeometryMixin {
  return (node as GeometryMixin).fills !== undefined;
}

function isGradient(paint: any): paint is GradientPaint {
  return (paint as GradientPaint).gradientStops !== undefined;
}
