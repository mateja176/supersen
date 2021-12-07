import React from 'react';
import { Color, IPixel, WithChannel } from '../models/pixels';
import { initialPixels } from '../utils/pixels';

export interface PixelsStore {
  pixels: IPixel[];
  currentColor: Color | null;
  selectRange: (startIndex: number, stopIndex: number) => void;
  setSelected: (selected: boolean) => void;
  setPixels: React.Dispatch<React.SetStateAction<IPixel[]>>;
  setColor: (color: Color) => void;
  setChannel: (withChannel: WithChannel) => void;
}
const usePixels = (): PixelsStore => {
  const [pixels, setPixels] = React.useState(initialPixels);

  const currentColor = React.useMemo(() => {
    return pixels.find(({ selected }) => selected) ?? null;
  }, [pixels]);

  const selectRange: PixelsStore['selectRange'] = React.useCallback(
    (startIndex, stopIndex) => {
      setPixels((pixels1) =>
        pixels1.map((pixel, i) =>
          i >= startIndex && i <= stopIndex
            ? {
                ...pixel,
                selected: true,
              }
            : pixel,
        ),
      );
    },
    [],
  );
  const setSelected: PixelsStore['setSelected'] = React.useCallback(
    (selected) => {
      setPixels((pixels1) =>
        pixels1.map((pixel) => ({
          ...pixel,
          selected,
        })),
      );
    },
    [],
  );

  const setColor: PixelsStore['setColor'] = React.useCallback(
    (color: Color) => {
      setPixels((pixels) => {
        return pixels.map((pixel) => {
          return pixel.selected ? { ...pixel, ...color } : pixel;
        });
      });
    },
    [],
  );

  const setChannel: PixelsStore['setChannel'] = React.useCallback(
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
    selectRange,
    setSelected,
    setPixels,
    setColor,
    setChannel,
  };
};

export default usePixels;
