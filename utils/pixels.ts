import { pixelsX, pixelsY } from '../services/env';

const xRange: number[] = Array(pixelsX).fill(0);
const yRange: number[] = Array(pixelsY).fill(0);
// * limited to two dimensions
export const pixelsRange = yRange.map((_, i) =>
  xRange.map((_, j) => xRange.length * i + j),
);
