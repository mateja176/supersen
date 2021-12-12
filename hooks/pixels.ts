import React from 'react';
import tinycolor, { ColorFormats } from 'tinycolor2';
import {
  Color,
  ColorWithOriginalInput,
  IPixel,
  WithChannel,
} from '../models/pixels';
import { initialPixels } from '../utils/pixels';

export interface PixelsStore {
  pixels: IPixel[];
  currentColor: Color | null;
  selectRange: (startIndex: number, stopIndex: number) => void;
  setSelected: React.Dispatch<boolean>;
  invertSelection: () => void;
  setPixels: React.Dispatch<React.SetStateAction<IPixel[]>>;
  setColor: React.Dispatch<Color>;
  setChannel: React.Dispatch<WithChannel>;
  /** 0-360 */
  setHue: React.Dispatch<ColorFormats.HSV['h']>;
  /** percentages */
  setSaturationAndLightnessChange: React.Dispatch<
    [ColorFormats.HSV['s'], ColorFormats.HSV['v']]
  >;
}
const usePixels = (): PixelsStore => {
  const [pixels, setPixels] = React.useState(initialPixels);

  const currentColor = React.useMemo(() => {
    return pixels.find(({ selected }) => selected)?.color ?? null;
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
  const invertSelection: PixelsStore['invertSelection'] =
    React.useCallback(() => {
      setPixels((pixels1) =>
        pixels1.map((pixel) => {
          return {
            ...pixel,
            selected: !pixel.selected,
          };
        }),
      );
    }, []);

  const setColor: PixelsStore['setColor'] = React.useCallback(
    (color: Color) => {
      setPixels((pixels) => {
        return pixels.map((pixel) => {
          return pixel.selected ? { ...pixel, color } : pixel;
        });
      });
    },
    [],
  );

  const setChannel: PixelsStore['setChannel'] = React.useCallback(
    (withChannel) => {
      return setPixels((pixels) => {
        return pixels.map((pixel) => {
          const rgbColor = pixel.color.toRgb();
          const color = tinycolor({ ...rgbColor, ...withChannel });
          return pixel.selected ? { ...pixel, color } : pixel;
        });
      });
    },
    [],
  );

  const setHue: PixelsStore['setHue'] = React.useCallback((h) => {
    return setPixels((pixels) => {
      return pixels.map((pixel) => {
        const hsvColor = pixel.color.toHsv();
        const color = tinycolor({ ...hsvColor, h });
        return pixel.selected ? { ...pixel, color } : pixel;
      });
    });
  }, []);
  const setSaturationAndLightnessChange: PixelsStore['setSaturationAndLightnessChange'] =
    React.useCallback(([s, v]) => {
      return setPixels((pixels) => {
        return pixels.map((pixel) => {
          const hsvColor = pixel.color.toHsv();
          const color = tinycolor({
            h:
              (pixel.color as ColorWithOriginalInput)._originalInput.h ??
              hsvColor.h,
            s,
            v,
          });
          return pixel.selected ? { ...pixel, color } : pixel;
        });
      });
    }, []);

  return {
    pixels,
    currentColor,
    selectRange,
    setSelected,
    invertSelection,
    setPixels,
    setColor,
    setChannel,
    setHue,
    setSaturationAndLightnessChange,
  };
};

export default usePixels;
