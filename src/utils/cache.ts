import NodeCache from 'node-cache';

// Standard TTL of 1 hour (3600 seconds), check period every 10 minutes (600 seconds)
const appCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export const getCache = <T>(key: string): T | undefined => {
  return appCache.get<T>(key);
};

export const setCache = <T>(key: string, value: T, ttlInSeconds?: number): boolean => {
  if (ttlInSeconds) {
    return appCache.set<T>(key, value, ttlInSeconds);
  }
  return appCache.set<T>(key, value);
};

export const deleteCache = (key: string): number => {
  return appCache.del(key);
};

export const clearAllCache = (): void => {
  appCache.flushAll();
};

export default appCache;
