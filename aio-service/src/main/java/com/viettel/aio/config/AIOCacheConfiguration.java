package com.viettel.aio.config;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class AIOCacheConfiguration extends CachingConfigurerSupport {
//
//    @Bean
//    @Override
//    public CacheManager cacheManager() {
//        EhCacheManagerFactoryBean cmfb = new EhCacheManagerFactoryBean();
//        cmfb.setConfigLocation(new ClassPathResource("ehcache.xml"));
//        cmfb.setShared(true);
//        return new EhCacheCacheManager(cmfb.getObject());
//    }
}
