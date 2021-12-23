import { Credentials, WithIPSchema } from '../models/devices';
import { api } from './env';

export const mutateCredentials = async ({
  ssid,
  password,
}: // TODO send user id so that the device can register itself
Credentials): Promise<ReturnType<typeof WithIPSchema['safeParse']>> => {
  const response = await fetch(api, {
    method: 'POST',
    body: JSON.stringify({ ssid, password }),
  });

  return WithIPSchema.safeParse(await response.json());
};
