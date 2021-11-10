import { z } from 'zod';

export const Api = z.string().url();
