import { NumberPair } from './models';

export const scaleCoord = (
  coord: number,
  max: number,
  dimension: number,
): number => {
  /**
   * scaledCoord / max = coord / dimension
   */
  return Math.round((coord * max) / dimension);
};
export const scaleCoord2D = (
  [coord1, coord2]: NumberPair,
  [max1, max2]: NumberPair,
  [dimension1, dimension2]: NumberPair,
): NumberPair => {
  return [
    scaleCoord(coord1, max1, dimension1),
    scaleCoord(coord2, max2, dimension2),
  ];
};
export const descaleCoord = (
  scaledCoord: number,
  max: number,
  dimension: number,
): number => {
  return Math.round((scaledCoord * dimension) / max);
};
export const descaleCoord2D = (
  [coord1, coord2]: NumberPair,
  [max1, max2]: NumberPair,
  [dimension1, dimension2]: NumberPair,
): NumberPair => {
  return [
    descaleCoord(coord1, max1, dimension1),
    descaleCoord(coord2, max2, dimension2),
  ];
};

export const limitCoord = (
  coord: number,
  startCoord: number,
  dimension: number,
): number => {
  return Math.min(startCoord + dimension, Math.max(startCoord, coord));
};
