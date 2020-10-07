package com.viettel.aio.config;

import java.util.concurrent.ConcurrentHashMap;

public class CacheManager {

    private long TTL_DEFAULT = 1800000;

    public <T> void saveDomainDataCache(Long id, T domainData, ConcurrentHashMap<Long, DomainDataCache<T>> cacheHashMap, long ttl) {
        T result = this.getDomainDataCache(id, cacheHashMap);
        if (result == null) {
            cacheHashMap.put(id, new DomainDataCache<T>(domainData, ttl));
        }
    }

    public <T> void saveDomainDataCache(Long id, T domainData, ConcurrentHashMap<Long, DomainDataCache<T>> cacheHashMap) {
        this.saveDomainDataCache(id, domainData, cacheHashMap, TTL_DEFAULT);
    }

    public <T> T getDomainDataCache(Long id, ConcurrentHashMap<Long, DomainDataCache<T>> cacheHashMap) {
        T result = null;
        if (cacheHashMap.containsKey(id)) {
            DomainDataCache<T> cache = cacheHashMap.get(id);
            if (cache.getCreatedTime() + cache.getTtl() > System.currentTimeMillis()) {
                result = cacheHashMap.get(id).domainData;
            } else {
                cacheHashMap.remove(id);
            }
        }
        return result;
    }
}
