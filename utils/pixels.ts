import { range } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { pixels } from '../services/env';

export const pixelsRange = range(0, pixels - 1);
