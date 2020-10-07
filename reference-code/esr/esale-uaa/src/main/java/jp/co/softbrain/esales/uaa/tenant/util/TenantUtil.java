package jp.co.softbrain.esales.uaa.tenant.util;

import java.util.Map;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.springframework.core.env.Environment;

import com.zaxxer.hikari.HikariDataSource;

import jp.co.softbrain.esales.uaa.config.ConstantsUaa;
import jp.co.softbrain.esales.uaa.config.DbType;
import jp.co.softbrain.esales.uaa.tenant.client.config.TenantDatabaseConfigProperties;

public class TenantUtil {
    private TenantUtil() {
        // do nothing
    }

    private static final Map<String, String> REDISSON_PROPERTIES_MAP = Map.of(
            "HIBERNATE_CACHE_REDISSON_ENTITY_EVICTION_MAX_ENTRIES",
            "hibernate.cache.redisson.entity.eviction.max_entries",
            "HIBERNATE_CACHE_REDISSON_ENTITY_EXPIRATION_TIME_TO_LIVE",
            "hibernate.cache.redisson.entity.expiration.time_to_live",
            "HIBERNATE_CACHE_REDISSON_ENTITY_EXPIRATION_MAX_IDLE_TIME",
            "hibernate.cache.redisson.entity.expiration.max_idle_time",
            "HIBERNATE_CACHE_REDISSON_QUERY_EVICTION_MAX_ENTRIES",
            "hibernate.cache.redisson.query.eviction.max_entries",
            "HIBERNATE_CACHE_REDISSON_QUERY_EXPIRATION_TIME_TO_LIVE",
            "hibernate.cache.redisson.query.expiration.time_to_live",
            "HIBERNATE_CACHE_REDISSON_QUERY_EXPIRATION_MAX_IDLE_TIME",
            "hibernate.cache.redisson.query.expiration.max_idle_time");

    /**
     * The properties for configuring the JPA provider Hibernate.
     *
     * @return
     */
    public static Properties hibernateProperties(Environment env) {
        Properties properties = new Properties();
        properties.put(org.hibernate.cfg.Environment.DIALECT,
                "io.github.jhipster.domain.util.FixedPostgreSQL95Dialect");
        properties.put(org.hibernate.cfg.Environment.SHOW_SQL, true);
        properties.put(org.hibernate.cfg.Environment.FORMAT_SQL, true);
        properties.put(org.hibernate.cfg.Environment.HBM2DDL_AUTO, "none");

        properties.put(org.hibernate.cfg.Environment.USE_NEW_ID_GENERATOR_MAPPINGS, true);
        properties.put(org.hibernate.cfg.Environment.CONNECTION_PROVIDER_DISABLES_AUTOCOMMIT, true);
        properties.put(org.hibernate.cfg.Environment.USE_SECOND_LEVEL_CACHE, true);
        properties.put(org.hibernate.cfg.Environment.USE_QUERY_CACHE, true);
        properties.put(org.hibernate.cfg.Environment.GENERATE_STATISTICS, false);
        properties.put(org.hibernate.cfg.Environment.CACHE_REGION_FACTORY,
                org.redisson.hibernate.RedissonRegionFactory.class.getName());
        properties.put("hibernate.cache.redisson.config", "config/redisson.yml");
        REDISSON_PROPERTIES_MAP.forEach((key, value) -> setRedissonProperty(env, properties, key));

        return properties;
    }

    private static void setRedissonProperty(Environment env, Properties properties, String property) {
        if (StringUtils.isNotEmpty(env.getProperty(property))) {
            properties.put(REDISSON_PROPERTIES_MAP.get(property), env.getProperty(property));
        }
    }

    /**
     * Creates the tenant datasource bean which is required for creating the entity
     * manager factory bean <br/>
     * <br/>
     * Note that using names for beans is not mandatory but it is a good practice to
     * ensure that the intended beans are being used where required.
     *
     * @return
     */
    public static HikariDataSource getTenantDataSource(TenantDatabaseConfigProperties tenantDatabaseConfigProperties,
            DbType dbtype) {

        tenantDatabaseConfigProperties.initEnv();

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(tenantDatabaseConfigProperties.getMasterUrl());
        ds.setUsername(tenantDatabaseConfigProperties.getUsername());
        ds.setPassword(tenantDatabaseConfigProperties.getPassword());
        ds.setDriverClassName(tenantDatabaseConfigProperties.getDriverClassName());
        ds.setPoolName(ConstantsUaa.SERVICE_NAME + "-" + dbtype + "-"
                + tenantDatabaseConfigProperties.getPoolName());

        // HikariCP settings
        // Maximum number of actual connection in the pool
        ds.setMaximumPoolSize(tenantDatabaseConfigProperties.getMaxPoolSize());

        // Minimum number of idle connections in the pool
        ds.setMinimumIdle(tenantDatabaseConfigProperties.getMinIdle());

        // Maximum waiting time for a connection from the pool
        ds.setConnectionTimeout(tenantDatabaseConfigProperties.getConnectionTimeout());

        // Maximum time that a connection is allowed to sit idle in the pool
        ds.setIdleTimeout(tenantDatabaseConfigProperties.getIdleTimeout());
        ds.setAutoCommit(tenantDatabaseConfigProperties.isAutoCommit());
        ds.setMaxLifetime(tenantDatabaseConfigProperties.getMaxLifetime());
        ds.setLeakDetectionThreshold(tenantDatabaseConfigProperties.getLeakDetectionThreshold());

        return ds;
    }
}
