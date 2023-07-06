// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Device } = initSchema(schema);

export {
  Device
};