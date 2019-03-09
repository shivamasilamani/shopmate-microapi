const cache = require('memory-cache');
const log = require('../config/log.config');

module.exports = {
  isExistInCache: (key) => {
    if (cache[key]) {
      return true;
    }
    return false;
  },
  addToCache: (key, value) => {
    if (!cache.get(key)) {
      cache[key] = value;
      log.info(`payload for url ${key} added to cache`);
    }
  },
  getFromCache: key => cache[key],
  clearCache: () => {
    // Clear cache if the cache size exceeds 50 MB
    // Just to make sure that we are not breaking the server by flooding the memory
    if (cache.memsize() > 50000000) {
      cache.clear();
      log.info('Cache cleared');
    }
  },
};
