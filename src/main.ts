import { isShape, isGradient } from "./utils";
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

if (getFillIndexWithGradient(node) === null) {
  figma.notify("Please select a shape with a gradient");
  figma.closePlugin();
}

let fills = node.fills as readonly Paint[];

fills.forEach((fill, fillIndex) => {
  if (isGradient(fill)) {
    console.log("Fill:", fill);

    const newColors = easeGradient(fill, 15);
    console.log("New colors:", newColors);

    applyColors(node, fillIndex, newColors);
  }

  if (fillIndex >= fills.length - 1) {
    figma.closePlugin();
  }
});
