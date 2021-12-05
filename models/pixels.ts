import { ColorFormats } from 'tinycolor2';
import { z } from 'zod';

export const Int = z.number().int().min(1);

export const Channel = z.number().int().min(0).max(255);

export const ColorTuple = z.tuple([Channel, Channel, Channel]);

export type Color = ColorFormats.RGBA;

export interface IPixel extends Color {
  selected: boolean;
}

export const Status = z.object({ status: z.number().int().min(0).max(1) });
