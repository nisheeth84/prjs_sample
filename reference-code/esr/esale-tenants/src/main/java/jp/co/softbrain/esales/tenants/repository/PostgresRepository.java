package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.ReceiveCustomersBusinessDTO;

import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;

/**
 * Repository for the Postgres.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface PostgresRepository {

    /**
     * Get used storage by schema.
     *
     * @param databaseName name of micro service.
     * @param schemaName name of tenant
     * @return used storage.
     * @throws SQLException if cannot connect to Postgres.
     */
    Long getUsedStorageBySchema(String databaseName, String schemaName) throws SQLException;
    
    /**
     * get List Customers Business by schema.
     *
     * @param databaseName name of micro service.
     * @param schemaName name of tenant
     * @return used storage.
     * @throws SQLException if cannot connect to PostgreSQL.
     */
    List<ReceiveCustomersBusinessDTO> getListCustomersBusiness(String databaseName, String schemaName, String customerBusinessName) throws SQLException;
}
