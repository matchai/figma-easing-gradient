import { isShape } from "./utils";
import {
  getFillIndexWithGradient,
  easeGradient,
  applyColors
} from "./gradient";

const selection = figma.currentPage.selection;
let node = <GeometryMixin>selection[0];

if (selection.length !== 1 || !isShape(node)) {
  figma.notify("Please select a shape with a gradient");
  figma.closePlugin();
}

let fillIndex = getFillIndexWithGradient(node);
if (fillIndex === null) {
  figma.notify("Please select a shape with a gradient");
  figma.closePlugin();
}

const fill = node.fills[fillIndex];
console.log("Fill:", fill);

const newColors = easeGradient(fill, 15);
console.log("New colors:", newColors);

applyColors(node, fillIndex, newColors);
figma.closePlugin();
