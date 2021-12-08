import tinycolor from 'tinycolor2';
import { Color, IPixel } from '../models/pixels';
import { color, pixelsX, pixelsY } from '../services/env';

const xRange: number[] = Array(pixelsX).fill(0);
const yRange: number[] = Array(pixelsY).fill(0);
export const pixelsRange = yRange.flatMap((_, i) =>
  xRange.map((_, j) => xRange.length * i + j),
);

const [r, g, b, a] = color;

export const initialColor: Color = tinycolor({
  r,
  g,
  b,
  a,
});
export const initialPixel: IPixel = {
  color: initialColor,
  selected: false,
};
export const initialPixels: IPixel[] = Array(pixelsRange.length).fill(
  initialPixel,
);
