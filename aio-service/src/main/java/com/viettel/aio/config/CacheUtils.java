package com.viettel.aio.config;

import com.viettel.aio.business.AIOCollaboratorBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class CacheUtils {

    private Logger logger = LoggerFactory.getLogger(AIOCollaboratorBusinessImpl.class);

    @Autowired
    public CacheUtils(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    private CacheManager cacheManager;

    public final String REPO_END_CONTRACT_RQ = "end_contract_rq_repo";

    public <T> void saveCacheObject(String cacheName, String key, T obj) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            logger.info("cache repo not found!");
            return;
        }

        cache.put(key, obj);
    }

    @SuppressWarnings("unchecked")
    public <T> T getCacheObject(String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        Cache.ValueWrapper valueWrapper = cache.get(key);
        if (valueWrapper != null) {
            Class type = ((T) new Object()).getClass();
            if (type.isAssignableFrom(valueWrapper.get().getClass())) {
                return (T) valueWrapper.get();
            }
        }

        logger.info("cache obj not found");
        return null;
    }

    public String createKey(String... params) {
        return StringUtils.join(params, "_");
    }
}
