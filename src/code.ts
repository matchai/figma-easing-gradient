function main(): void {
  const selection = figma.currentPage.selection;

  const fillWithGradient = getFillWithGradient(selection);
  if (fillWithGradient === null) {
    figma.notify("Please select a shape with a gradient");
    figma.closePlugin();
  }
  
  console.log(fillWithGradient);
  
  figma.closePlugin();
}

main();

function getFillWithGradient(selection: readonly SceneNode[]): GradientPaint | null {
  if (selection.length !== 1) return null;
  
  const node = selection[0];
  if (!isShape(node)) return null;

  // We can be assured that node.fills is not a symbol, since it is only a symbol
  // when it is "mixed", which is not possible when only one node is selected.
  const nodeFills = node.fills as readonly Paint[];
  const gradientFill = nodeFills.find(isGradient);

  return gradientFill || null;
}

function isShape(node: any): node is GeometryMixin {
  return (node as GeometryMixin).fills !== undefined;
}

function isGradient(paint: any): paint is GradientPaint {
  return (paint as GradientPaint).gradientStops !== undefined;
}

// function isShapeWithGradient(selection: SceneNode[]) {
//   return false;
// }

// figma.showUI(__html__)

// figma.ui.onmessage = msg => {
//   if (msg.type === 'gradientify') {
//     const selection = figma.currentPage.selection;



//     console.log(figma.currentPage.selection);
    
    // const selection = figma.currentPage.selection;
    // console.log(selection)

  //   if (selection instanceof )

  //   const nodes = []

  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle()
  //     rect.x = i * 150
  //     rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}]
  //     figma.currentPage.appendChild(rect)
  //     nodes.push(rect)
  //   }

  //   figma.currentPage.selection = nodes
  //   figma.viewport.scrollAndZoomIntoView(nodes)
  // }

  // figma.closePlugin()
  // }
// }
