package com.viettel.aio.config;

import java.util.List;

public class DomainDataCache<T> {

    public DomainDataCache(T domainData, long ttl) {
        this.domainData = domainData;
        this.ttl = ttl;
        this.createdTime = System.currentTimeMillis();
    }

    public DomainDataCache(T domainData) {
        this.domainData = domainData;
        this.createdTime = System.currentTimeMillis();
    }

    public T domainData;
    private long createdTime;
    private long ttl;

    public T getDomainData() {
        return domainData;
    }

    public void setDomainData(T domainData) {
        this.domainData = domainData;
    }

    public long getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(long createdTime) {
        this.createdTime = createdTime;
    }

    public long getTtl() {
        return ttl;
    }

    public void setTtl(long ttl) {
        this.ttl = ttl;
    }
}
