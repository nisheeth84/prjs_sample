package jp.co.softbrain.esales.tenants.repository;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Spring Data repository for other service.
 */
@Repository
@XRayEnabled
public interface OtherServiceRepositoryCustom {

    /**
     * Drop schema by name in database
     * 
     * @param microServiceName name of database 
     * @param schemaName name of schema need drop
     * @throws exception if SQL run fail
     */
    void dropSchema(String microServiceName, String schemaName) throws SQLException;

    /**
     * get list table by name of micro service and tenant name
     * 
     * @param microServiceName name of database 
     * @param schemaName name of schema need drop
     * @throws exception if SQL run fail
     */
    List<String> getListTablesInDatabase(String microServiceName, String schemaName)
            throws SQLException;

    /**
     * truncate Table Data Sample by name in database
     * 
     * @param microServiceName name of database 
     * @param schemaName name of schema need drop
     * @param tableNames name of table will truncate
     * @throws exception if SQL run fail
     */
    void truncateTableData(String microServiceName, String schemaName, List<String> tableNames)
            throws SQLException;
}
