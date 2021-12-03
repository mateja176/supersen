import React from 'react';
import { RGBColor } from 'react-color';
import { Color } from '../models/pixels';
import { color } from '../services/env';
import { pixelsRange } from '../utils/pixels';

export interface IPixel extends Color {
  selected: boolean;
}

const [r, g, b] = color;

const minimalAlpha = 0.01;
const initialAlpha = 1;
const initialColor: IPixel = {
  r,
  g,
  b,
  a: initialAlpha,
  selected: false,
};
const initialPixels: IPixel[] = pixelsRange.flatMap((xRange) =>
  xRange.map(() => initialColor),
);

const rgbColorToColor = ({ r, g, b, a = initialAlpha }: RGBColor) => ({
  r,
  g,
  b,
  a: a || minimalAlpha,
});
export interface PixelsContext {
  pixels: IPixel[];
  setSelected: (indexes: number[]) => void;
  toggleSelected: (index: number) => void;
  setRgbColor: (rgbColor: RGBColor) => void;
}
const usePixels = (): PixelsContext => {
  const [pixels, setPixels] = React.useState(initialPixels);

  const setSelected: PixelsContext['setSelected'] = React.useCallback(
    (indexes) => {
      setPixels((pixels1) =>
        pixels1.map((pixel, i) => ({
          ...pixel,
          selected: indexes.includes(i),
        })),
      );
    },
    [],
  );
  const toggleSelected: PixelsContext['toggleSelected'] = React.useCallback(
    (index) => {
      setPixels((pixels1) =>
        pixels1.map((pixel, i) =>
          i === index ? { ...pixel, selected: !pixel.selected } : pixel,
        ),
      );
    },
    [],
  );

  const setRgbColor: PixelsContext['setRgbColor'] = React.useCallback(
    (rgbColor: RGBColor) => {
      setPixels((pixels) => {
        return pixels.map((pixel) =>
          pixel.selected ? { ...pixel, ...rgbColorToColor(rgbColor) } : pixel,
        );
      });
    },
    [],
  );

  return { pixels, setSelected, toggleSelected, setRgbColor };
};

export default usePixels;
