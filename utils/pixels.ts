import tinycolor from 'tinycolor2';
import { Color, IPixel } from '../models/pixels';
import { boards, color, pixelsX, pixelsY } from '../services/env';

const [h, s, v] = color;

export const initialColor: Color = tinycolor({
  h,
  s,
  v,
});
export const initialPixel: IPixel = {
  color: initialColor,
  selected: false,
};
export const initialPixels: IPixel[] = Array(boards * pixelsX * pixelsY).fill(
  initialPixel,
);
