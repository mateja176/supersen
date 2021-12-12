import tinycolor, { ColorFormats } from 'tinycolor2';
import { z } from 'zod';

export const Int = z.number().int().min(1);

export const ColorTuple = z.tuple([
  z.number().int().min(0).max(360),
  z.number().min(0).max(1),
  z.number().min(0).max(1),
]);

export type Color = tinycolor.Instance;

export interface IPixel {
  color: Color;
  selected: boolean;
}

export const Status = z.object({ status: z.number().int().min(0).max(1) });

export type WithChannel =
  | Pick<ColorFormats.RGBA, 'r'>
  | Pick<ColorFormats.RGBA, 'g'>
  | Pick<ColorFormats.RGBA, 'b'>
  | Pick<ColorFormats.RGBA, 'a'>;

export interface ColorWithOriginalInput extends tinycolor.Instance {
  _originalInput: Partial<ColorFormats.HSV>;
}
