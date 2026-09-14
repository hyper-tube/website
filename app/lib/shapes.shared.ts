const round = (value: number) => Math.round(value * 100) / 100;

export function scallopPath(center: number, radius: number, bumps: number, depth: number): string {
  const points = Array.from({ length: 180 }, (_, index) => {
    const angle = (index / 180) * Math.PI * 2;
    const distance = radius + depth * Math.cos(bumps * angle);
    const x = round(center + distance * Math.cos(angle));
    const y = round(center + distance * Math.sin(angle));

    return `${x},${y}`;
  });

  return `M${points.join('L')}Z`;
}

export function areaPath(values: readonly number[], width: number, height: number): string {
  const outline = curvePath(
    values.map((value) => value * 2 - 1),
    width,
    height,
  );

  return `M0,${height}L${outline.slice(1)}L${width},${height}Z`;
}

export function curvePath(values: readonly number[], width: number, height: number): string {
  const step = width / (values.length - 1);
  const y = (value: number) => round(height / 2 - (value * height) / 2);

  return values.reduce((path, value, index) => {
    if (index === 0) return `M0,${y(value)}`;

    const previousX = round((index - 1) * step);
    const x = round(index * step);
    const middle = round((previousX + x) / 2);

    return `${path}C${middle},${y(values[index - 1])} ${middle},${y(value)} ${x},${y(value)}`;
  }, '');
}
