package jp.co.softbrain.esales.uaa.tenant.client.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import lombok.Data;

/**
 * Tenant database configuration properties which are read from the
 * application.yml file
 */
@Configuration
@ConfigurationProperties("multitenant.app.tenant.datasource")
@Data
public class TenantDatabaseConfigProperties {

    @Autowired
    private Environment env;

    /** database master url */
    private String masterUrl;

    /** database slave url */
    private String slaveUrl;

    /** database username */
    private String username;

    /** database password */
    private String password;

    /** database driver */
    private String driverClassName;

    // Following are for setting the Hikari Connection Pool properties. Spring
    // Boot uses Hikari CP by default.

    /**
     * Maximum number of milliseconds that a client will wait for a connection from
     * the pool. If this time is exceeded without a connection becoming available, a
     * SQLException will be thrown from javax.sql.DataSource.getConnection().
     */
    private long connectionTimeout;

    /**
     * The property controls the maximum size that the pool is allowed to reach,
     * including both idle and in-use connections. Basically this value will
     * determine the maximum number of actual connections to the database backend.
     * When the pool reaches this size, and no idle connections are available, calls
     * to getConnection() will block for up to connectionTimeout milliseconds before
     * timing out.
     */
    private int maxPoolSize;

    /**
     * This property controls the maximum amount of time (in milliseconds) that a
     * connection is allowed to sit idle in the pool. Whether a connection is
     * retired as idle or not is subject to a maximum variation of +30 seconds, and
     * average variation of +15 seconds. A connection will never be retired as idle
     * before this timeout. A value of 0 means that idle connections are never
     * removed from the pool.
     */
    private long idleTimeout;

    /**
     * The property controls the minimum number of idle connections that HikariCP
     * tries to maintain in the pool, including both idle and in-use connections. If
     * the idle connections dip below this value, HikariCP will make a best effort
     * to restore them quickly and efficiently.
     */
    private int minIdle;

    /**
     * The name for the master database connection pool
     */
    private String poolName;

    /**
     * auto-commit behavior of connections in the pool.
     */
    private boolean autoCommit;

    /**
     * This property controls the maximum lifetime of a connection in the pool. When
     * a connection reaches thistimeout, even if recently used, it will be retired
     * from the pool. An in-use connection will never beretired, only when it is
     * idle will it be removed.
     * Specified by: setMaxLifetime(...) in HikariConfigMXBean.
     * Parameters:maxLifetimeMs the maximum connection lifetime in milliseconds
     */
    private long maxLifetime;

    /**
     * This property controls the amount of time that a connection can be out of the
     * pool before a message islogged indicating a possible connection leak. A value
     * of 0 means leak detection is disabled.
     */
    private long leakDetectionThreshold = 0;

    public void initEnv() {
        this.masterUrl = env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_MASTERURL", this.masterUrl);
        this.slaveUrl = env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_SLAVEURL", this.slaveUrl);
        this.username = env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_USERNAME", this.username);
        this.password = env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_PASSWORD", this.password);
        this.driverClassName = env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_DRIVERCLASSNAME",
                this.driverClassName);
        this.connectionTimeout = Long.valueOf(env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_CONNECTIONTIMEOUT",
                String.valueOf(this.connectionTimeout)));
        this.maxPoolSize = Integer.valueOf(
                env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_MAXPOOLSIZE", String.valueOf(this.maxPoolSize)));
        this.idleTimeout = Long.valueOf(
                env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_IDLETIMEOUT", String.valueOf(this.idleTimeout)));
        this.minIdle = Integer
                .valueOf(env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_MINIDLE", String.valueOf(this.minIdle)));
        this.poolName = env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_POOLNAME", this.poolName);
        this.autoCommit = Boolean.valueOf(
                env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_AUTOCOMMIT", String.valueOf(this.autoCommit)));
        this.maxLifetime = Long.valueOf(
                env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_MAXLIFETIME", String.valueOf(this.maxLifetime)));
        this.leakDetectionThreshold = Long
                .valueOf(env.getProperty("MULTITENANT_APP_TENANT_DATASOURCE_LEAK_DETECTION_THRESHOLD",
                        String.valueOf(this.leakDetectionThreshold)));
    }
}
