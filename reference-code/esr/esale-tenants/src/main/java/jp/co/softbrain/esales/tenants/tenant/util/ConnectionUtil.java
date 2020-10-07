package jp.co.softbrain.esales.tenants.tenant.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

import org.flywaydb.core.api.configuration.ClassicConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.tenant.client.config.TenantDatabaseConfigProperties;

/**
 * Utility methods for connect DB.
 *
 * @author nguyenvietloi
 */
@Component
public class ConnectionUtil {

    private static final String DEFAULT_FLYWAY_SCHEMA_VERSION_TABLE = "schema_version";

    @Autowired
    private TenantDatabaseConfigProperties tenantDatabaseConfigProperties;

    /**
     * Create connection to local DB
     *
     * @param databaseName The name of DB
     * @return {@link Connection}
     * @throws SQLException if cannot connect to DB.
     */
    public Connection createConnection(String databaseName) throws SQLException {
        String databaseUrl = createDatabaseUrl(databaseName);
        Properties props = new Properties();
        props.setProperty("user", tenantDatabaseConfigProperties.getUsername());
        props.setProperty("password", tenantDatabaseConfigProperties.getPassword());
        return DriverManager.getConnection(databaseUrl, props);
    }

    /**
     * Building database url
     *
     * @param databaseName The name of DB
     * @return Url
     */
    public String createDatabaseUrl(String databaseName) {
        String dbUrl = tenantDatabaseConfigProperties.getMasterUrl();
        return dbUrl.replace(Constants.MICRO_SERVICE_TENANTS, databaseName);
    }

    /**
     * Building database url with schema name
     *
     * @param dataBaseName dataBaseName
     * @param schemaName schemaName
     * @return Url
     */
    public String createDatabaseUrl(String dataBaseName, String schemaName) {
        String dbUrl = tenantDatabaseConfigProperties.getMasterUrl();
        return String.format("jdbc:postgresql://%s:%s/%s?currentSchema=%s&stringtype=unspecified",
                TenantUtil.extractHostFromDatabaseUrl(dbUrl),
                TenantUtil.extractPortFromDatabaseUrl(dbUrl),
                dataBaseName,
                schemaName);
    }

    /**
     * Create flyway configuration
     *
     * @param location location
     * @param databaseUrl databaseUrl
     * @return {@link ClassicConfiguration}
     */
    public ClassicConfiguration createFlywayConfig(String location, String databaseUrl) {
        ClassicConfiguration config = new ClassicConfiguration();
        config.setLocationsAsStrings("filesystem:" + location);
        config.setDataSource(databaseUrl,
                tenantDatabaseConfigProperties.getUsername(), tenantDatabaseConfigProperties.getPassword());
        config.setTable(DEFAULT_FLYWAY_SCHEMA_VERSION_TABLE);

        return config;
    }
}
