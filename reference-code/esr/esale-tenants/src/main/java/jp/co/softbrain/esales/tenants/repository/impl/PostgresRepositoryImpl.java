package jp.co.softbrain.esales.tenants.repository.impl;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.tenants.repository.PostgresRepository;
import jp.co.softbrain.esales.tenants.service.dto.ReceiveCustomersBusinessDTO;
import jp.co.softbrain.esales.tenants.tenant.util.ConnectionUtil;

/**
 * Implement repository for the Postgres.
 *
 * @author nguyenvietloi
 */
@Repository
public class PostgresRepositoryImpl implements PostgresRepository {

    @Autowired
    private ConnectionUtil connectionUtil;

    /**
     * @see PostgresRepository#getUsedStorageBySchema(String, String)
     */
    @Override
    public Long getUsedStorageBySchema(String databaseName, String schemaName) throws SQLException {
        try (Connection connection = connectionUtil.createConnection(databaseName)) {
            try (Statement statement = connection.createStatement()) {
                String pgSizePretty = "pg_size_pretty(sum(pg_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename))))";
                StringBuilder sqlBuilder = new StringBuilder()
                    .append(" SELECT split_part(").append(pgSizePretty).append(", ' ', 1)::bigint ").append("*")
                    .append("   case split_part(").append(pgSizePretty).append(", ' ', 2)")
                    .append("       when 'bytes' then 1")
                    .append("       when 'kB' then 1024")
                    .append("       when 'MB' then 1048576") // 1024*1024
                    .append("       when 'GB' then 1073741824") // 1024*1024*1024
                    .append("       when 'TB' then 1099511627776::bigint") // 1024*1024*1024*1024
                    .append("   end as pg_size ")
                    .append("FROM pg_tables ")
                    .append("WHERE schemaname = '").append(schemaName).append("'");

                try (ResultSet result = statement.executeQuery(sqlBuilder.toString())) {
                    if (result.next()) {
                        return result.getLong("pg_size");
                    }
                }
            }
        }
        return null;
    }

    /**
     * @see PostgresRepository#getListCustomersBusiness(String, String, String)
     */
    @Override
    public List<ReceiveCustomersBusinessDTO> getListCustomersBusiness(String databaseName, String schemaName,
            String customerBusinessName) throws SQLException {

        List<ReceiveCustomersBusinessDTO> businessDTOs = new ArrayList<>();
        try (Connection connection = connectionUtil.createConnection(databaseName)) {
            try (Statement statement = connection.createStatement()) {
                StringBuilder sqlBuilder = new StringBuilder()
                .append(" SELECT cs.customer_business_id, ")
                .append("        cs.customer_business_name, ")
                .append("        cs.customer_business_parent ")
                .append(" FROM ").append(schemaName).append(".customers_business cs ")
                .append(" WHERE cs.customer_business_name IN (").append(customerBusinessName).append(") ");

                try (ResultSet result = statement.executeQuery(sqlBuilder.toString())) {
                    while (result.next()) {
                        ReceiveCustomersBusinessDTO businessDTO = new ReceiveCustomersBusinessDTO();
                        businessDTO.setCustomerBusinessId(result.getLong("customer_business_id"));
                        businessDTO.setCustomerBusinessName(result.getString("customer_business_name"));
                        businessDTO.setCustomerBusinessParent(result.getLong("customer_business_parent"));
                        businessDTOs.add(businessDTO);
                    }

                    return businessDTOs;
                }
            }
        }
    }
}
