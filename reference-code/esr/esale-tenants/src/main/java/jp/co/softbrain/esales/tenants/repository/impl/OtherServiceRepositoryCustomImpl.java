package jp.co.softbrain.esales.tenants.repository.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.repository.OtherServiceRepositoryCustom;
import jp.co.softbrain.esales.tenants.tenant.client.config.TenantDatabaseConfigProperties;

/**
 * Implement query for OtherServiceRepositoryCustom
 *
 * @author phamhoainam
 *
 */
@Repository
public class OtherServiceRepositoryCustomImpl implements OtherServiceRepositoryCustom {

    @Autowired
    private TenantDatabaseConfigProperties tenantDatabaseConfigProperties;

    /**
     * @see OtherServiceRepositoryCustom#dropSchema(String, String)
     */
    @Override
    public void dropSchema(String microServiceName, String schemaName) throws SQLException {
        String databaseUrl = buildDatabaseUrl(microServiceName);
        String sqlStatement = " DROP SCHEMA IF EXISTS " + "\"" + schemaName + "\"" + " CASCADE ;";
        try (
            Connection conn = DriverManager.getConnection(
                    databaseUrl,
                    tenantDatabaseConfigProperties.getUsername(),
                    tenantDatabaseConfigProperties.getPassword());
            Statement statement = conn.createStatement()
        ) {
            statement.execute(sqlStatement);
        } catch (Exception ex) {
            // Do Nothing
            throw new SQLException(ex.getMessage());
        }
    }

    /**
     * @see OtherServiceRepositoryCustom#getListTablesInDatabase(String, String)
     */
    @Override
    public List<String> getListTablesInDatabase(String microServiceName, String schemaName) throws SQLException {
        String databaseUrl = buildDatabaseUrl(microServiceName);
        StringBuilder sqlStatement = new StringBuilder();
        sqlStatement.append(" SELECT table_name FROM information_schema.tables ");
        sqlStatement.append(" WHERE table_schema = ? ");
        sqlStatement.append("     AND table_type = 'BASE TABLE' ");
        sqlStatement.append("     AND table_name NOT IN (");
        ConstantsTenants.LIST_CONFIG_TABLES.forEach(table -> sqlStatement.append("'").append(table).append("'").append(","));
        sqlStatement.deleteCharAt(sqlStatement.length() - 1);
        sqlStatement.append(")");
        try (
            Connection conn = DriverManager.getConnection(
                    databaseUrl,
                    tenantDatabaseConfigProperties.getUsername(),
                    tenantDatabaseConfigProperties.getPassword());
            PreparedStatement statement = conn.prepareStatement(sqlStatement.toString());
        ) {
            statement.setString(1, schemaName);
            try (ResultSet rs = statement.executeQuery()) {
                List<String> tableNames = new ArrayList<>();
                while (rs.next()) {
                    tableNames.add(rs.getString("table_name"));
                }
                return tableNames;
            }

        } catch (Exception ex) {
            // Do Nothing
            throw new SQLException(ex.getMessage());
        }
    }

    /**
     * @see OtherServiceRepositoryCustom#truncateTableData(String, String, List)
     */
    @Override
    public void truncateTableData(String microServiceName, String schemaName, List<String> tableNames)
            throws SQLException {
        String databaseUrl = buildDatabaseUrl(microServiceName);
        try (
            Connection conn = DriverManager.getConnection(
                    databaseUrl,
                    tenantDatabaseConfigProperties.getUsername(),
                    tenantDatabaseConfigProperties.getPassword());
        ) {
            conn.setSchema(schemaName);
            try (Statement statement = conn.createStatement();) {
                conn.setAutoCommit(false);
                for (String tableName : tableNames) {
                    String sqlStatement = " TRUNCATE " + "\"" + tableName + "\"" + " CASCADE ;";
                    statement.execute(sqlStatement);
                }
                conn.commit();
            }
        } catch (Exception ex) {
            // Do Nothing
            throw new SQLException(ex.getMessage());
        }

    }

    /**
     * Build url connect to database of other micro service by url of service tenants
     *
     * @param microServiceName name of micro service
     * @return url connect to other database
     */
    private String buildDatabaseUrl(String microServiceName) {
        String dbUrl = tenantDatabaseConfigProperties.getMasterUrl();
        return dbUrl.replace(Constants.MICRO_SERVICE_TENANTS, microServiceName);
    }
}
