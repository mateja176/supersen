import qs from 'qs';
import { IPixel, Status } from '../models/pixels';
import { pixelsX, pixelsY } from './env';

const pixelsCount = pixelsX * pixelsY;

const adjustBrightness =
  (/** ranging between 0 and 1 */ alpha: number) => (channel: number) => {
    return Math.round((1 - alpha) * 255 + alpha * channel);
  };

export const mutatePixels = async ({
  ip,
  pixels,
}: {
  ip: string;
  pixels: IPixel[];
}): Promise<ReturnType<typeof Status['safeParse']>> => {
  const response = await fetch(
    ip.concat(
      qs.stringify(
        Object.fromEntries(
          pixels.map(({ color }, index) => {
            const { r, g, b, a } = color.toRgb();
            const adjustBrightness1 = adjustBrightness(a);
            const i = Math.floor(index / pixelsCount);
            const increment = i * pixelsCount;
            const input = index - increment;
            const j = Math.floor(input / pixelsX);
            const k = input % pixelsX;
            /** m * (n - j) - (m - i) */
            const mappedIndex =
              pixelsX * (pixelsY - k) - (pixelsX - j) + increment;
            const dividend = Math.floor(mappedIndex / pixelsX);
            const alternateIndex =
              dividend % 2 === 0
                ? mappedIndex
                : (dividend + 1) * pixelsX -
                  1 -
                  mappedIndex +
                  dividend * pixelsX;
            return [
              alternateIndex,
              JSON.stringify([
                adjustBrightness1(r),
                adjustBrightness1(g),
                adjustBrightness1(b),
              ]),
            ];
          }),
        ),
        { addQueryPrefix: true },
      ),
    ),
  );
  return Status.safeParse(await response.json());
};
