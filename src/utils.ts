export function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

export function isShape(node: any): node is GeometryMixin {
  return (node as GeometryMixin).fills !== undefined;
}

export function isGradient(paint: any): paint is GradientPaint {
  return (paint as GradientPaint).gradientStops !== undefined;
}
