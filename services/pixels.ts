import qs from 'qs';
import { z } from 'zod';
import { Channel, Color, Status } from '../models/pixels';
import { api } from './env';

const adjustBrightness =
  (alpha: Color['a']) => (channel: z.infer<typeof Channel>) => {
    return Math.round((1 - alpha) * 255 + alpha * channel);
  };

export const setPixels = async (
  colors: Color[],
): Promise<ReturnType<typeof Status['safeParse']>> => {
  const response = await fetch(
    api.concat(
      qs.stringify(
        colors.map(({ r, g, b, a }) => {
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
