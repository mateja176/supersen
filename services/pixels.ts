import qs from 'qs';
import { IPixel, Status } from '../models/pixels';
import { api } from './env';

const adjustBrightness =
  (/** ranging between 0 and 1 */ alpha: number) => (channel: number) => {
    return Math.round((1 - alpha) * 255 + alpha * channel);
  };

export const setPixels = async (
  colors: IPixel[],
): Promise<ReturnType<typeof Status['safeParse']>> => {
  const response = await fetch(
    api.concat(
      qs.stringify(
        colors.map(({ color }) => {
          const { r, g, b, a } = color.toRgb();
          const adjustBrightness$ = adjustBrightness(a);
          return JSON.stringify([
            adjustBrightness$(r),
            adjustBrightness$(g),
            adjustBrightness$(b),
          ]);
        }),
        { addQueryPrefix: true },
      ),
    ),
  );
  return Status.safeParse(await response.json());
};
