import React from 'react';
import { Color, IPixel, WithChannel } from '../models/pixels';
import { initialPixels } from '../utils/pixels';

export interface PixelsContext {
  pixels: IPixel[];
  currentColor: Color | null;
  setSelected: (indexes: number[]) => void;
  setPixels: React.Dispatch<React.SetStateAction<IPixel[]>>;
  setColor: (color: Color) => void;
  setChannel: (withChannel: WithChannel) => void;
}
const usePixels = (): PixelsContext => {
  const [pixels, setPixels] = React.useState(initialPixels);

  const currentColor = React.useMemo(() => {
    return pixels.find(({ selected }) => selected) ?? null;
  }, [pixels]);

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

  const setColor: PixelsContext['setColor'] = React.useCallback(
    (color: Color) => {
      setPixels((pixels) => {
        return pixels.map((pixel) => {
          return pixel.selected ? { ...pixel, ...color } : pixel;
        });
      });
    },
    [],
  );

  const setChannel: PixelsContext['setChannel'] = React.useCallback(
    (withChannel) => {
      return setPixels((pixels) => {
        return pixels.map((pixel) => {
          return pixel.selected ? { ...pixel, ...withChannel } : pixel;
        });
      });
    },
    [],
  );

  return {
    pixels,
    currentColor,
    setSelected,
    setPixels,
    setColor,
    setChannel,
  };
};

export default usePixels;
