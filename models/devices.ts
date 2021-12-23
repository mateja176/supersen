import { z } from 'zod';

export const CredentialsSchema = z.object({
  ssid: z.string().min(1).max(15),
  password: z.string().min(1).max(15),
});
export type Credentials = z.infer<typeof CredentialsSchema>;
export const initialCredentials: Credentials = {
  ssid: '',
  password: '',
};

const ipSegmentPattern = '(\\d|[1-9]\\d|1\\d\\d|2[1-4]\\d|25[0-5])';
const ipPattern = new RegExp(
  `^${ipSegmentPattern}\\.${ipSegmentPattern}\\.${ipSegmentPattern}\\.${ipSegmentPattern}$`,
);
export const WithIPSchema = z.object({
  ip: z.string().regex(ipPattern, 'Must be a valid IPv4'),
});
export type WithIP = z.infer<typeof WithIPSchema>;
