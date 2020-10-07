package jp.co.softbrain.esales.commons.tenant.client.config;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.hibernate.HibernateException;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.hibernate.service.UnknownUnwrapTypeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestClientException;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.GetTenantByConditionRequest;
import jp.co.softbrain.esales.utils.dto.GetTenantByConditionResponse;

@Configuration
public class ServiceMultiTenantConnectionProvider implements MultiTenantConnectionProvider {

    private static final long serialVersionUID = -2562592741634048460L;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * cache tenant
     */
    private Map<String, Boolean> tenantMap = new HashMap<>();

    @Override
    public Connection getAnyConnection() throws SQLException {
        return dataSource.getConnection();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        final Connection connection = getAnyConnection();
        try (Statement statement = connection.createStatement()) {
            if (!tenantIdentifier.matches(Constants.TENANT_FORMAT) || !checkTenant(tenantIdentifier)) {
                connection.close();
                throw new CustomException("Tenant invalid");
            }

            statement.execute("SET search_path TO " + tenantIdentifier);
            log.info("Switch tenant schema [{}]", tenantIdentifier);
        } catch (SQLException e) {
            connection.close();
            throw new HibernateException(
                    "Could not alter JDBC connection to specified schema [" + tenantIdentifier + "]", e);
        }
        return connection;
    }

    /**
     * check tenant existed
     *
     * @param tenantId
     */
    private boolean checkTenant(String tenantId) {
        if (tenantMap.get(tenantId) == null) {
            // Call api get-tenant-by-condition
            GetTenantByConditionRequest request = new GetTenantByConditionRequest();
            request.setTenantName(tenantId);
            try {
                GetTenantByConditionResponse responseTenant = restOperationUtils.executeCallPublicApi(
                        Constants.PathEnum.TENANTS, Constants.URL_API_GET_TENANT, HttpMethod.POST, request,
                        GetTenantByConditionResponse.class, Constants.TENANTS_SERVICE);
                if (responseTenant == null || responseTenant.getTenants() == null
                        || responseTenant.getTenants().isEmpty()) {
                    return false;
                } else {
                    tenantMap.put(tenantId, true);
                }
            } catch (RestClientException ex) {
                log.error(ex.getLocalizedMessage());
                return false;
            }
        }
        return true;
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return true;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public boolean isUnwrappableAs(Class unwrapType) {
        return DataSource.class.isAssignableFrom(unwrapType)
                || MultiTenantConnectionProvider.class.isAssignableFrom(unwrapType);
    }

    @Override
    @SuppressWarnings({ "unchecked" })
    public <T> T unwrap(Class<T> unwrapType) {
        if (MultiTenantConnectionProvider.class.isAssignableFrom(unwrapType)) {
            return (T) this;
        } else if (DataSource.class.isAssignableFrom(unwrapType)) {
            return (T) dataSource;
        } else {
            throw new UnknownUnwrapTypeException(unwrapType);
        }
    }
}
