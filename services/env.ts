import {
  API,
  BOARDS,
  INITIAL_HSV,
  PIXELS_X,
  PIXELS_Y,
  SHOULD_ALTERNATE,
} from '@env';
import { Api } from '../models/env';
import { ColorTuple } from '../models/pixels';

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
const maybePixelsX = parseInt(PIXELS_X);
if (Number.isNaN(maybePixelsX)) {
  throw new Error('PIXELS_X must be an integer greater than 0');
}
export const pixelsX = maybePixelsX;
if (!PIXELS_Y) {
  throw new Error('PIXELS_Y is required');
}
const maybePixelsY = parseInt(PIXELS_Y);
if (Number.isNaN(maybePixelsY)) {
  throw new Error('PIXELS_Y must be an integer greater than 0');
}
export const pixelsY = maybePixelsY;
export const boards = (() => {
  if (BOARDS) {
    const maybeBoards = parseInt(BOARDS);
    if (Number.isNaN(maybeBoards)) {
      throw new Error('BOARDS must be an integer');
    } else {
      return maybeBoards;
    }
  } else {
    return 1;
  }
})();
export const shouldAlternate = !!SHOULD_ALTERNATE;

if (!INITIAL_HSV) {
  throw new Error('INITIAL_HSV is required');
}
const maybeColor = ColorTuple.safeParse(JSON.parse(INITIAL_HSV));
if (!maybeColor.success) {
  throw new Error('INITIAL_HSV must be of type [number, number, number]');
}
export const color = maybeColor.data;
