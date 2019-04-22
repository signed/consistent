import { call } from './Client'

export const provideService = async () => {
  const result = await call('wupdidu');
  return 'api returned ' + result;
};
