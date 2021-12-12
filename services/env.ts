import { API, INITIAL_HSV, PIXELS_X, PIXELS_Y } from '@env';
import { Api } from '../models/env';
import { ColorTuple, Int } from '../models/pixels';

if (!API) {
  throw new Error('API is required');
}
const maybeApi = Api.safeParse(API);
if (!maybeApi.success) {
  throw new Error('API must be a valid http origin');
}
export const api = maybeApi.data;

if (!PIXELS_X) {
  throw new Error('PIXELS_X is required');
}
const maybePixelsX = Int.safeParse(parseInt(PIXELS_X));
if (!maybePixelsX.success) {
  throw new Error('PIXELS_X must be an integer greater than 0');
}
export const pixelsX = maybePixelsX.data;
if (!PIXELS_Y) {
  throw new Error('PIXELS_Y is required');
}
const maybePixelsY = Int.safeParse(parseInt(PIXELS_Y));
if (!maybePixelsY.success) {
  throw new Error('PIXELS_Y must be an integer greater than 0');
}
export const pixelsY = maybePixelsY.data;

if (!INITIAL_HSV) {
  throw new Error('INITIAL_HSV is required');
}
const maybeColor = ColorTuple.safeParse(JSON.parse(INITIAL_HSV));
if (!maybeColor.success) {
  throw new Error('INITIAL_HSV must be of type [number, number, number]');
}
export const color = maybeColor.data;
