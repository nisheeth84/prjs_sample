package jp.co.softbrain.esales.tenants.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.MTemplateInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateSchemaResult;

/**
 * Setting database environment
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface SettingDatabaseEnvironmentService {

    /**
     * Create schema and initiate data for database
     *
     * @param industryTypeName
     * @param databaseName The name of database target, that like micro service name
     * @param schemaName The name of schema that will be create, that like tenant name
     * @param masterTemplate DDL and DML statements
     * @param masterSchemaName The name of master schema
     * @return {@link CreateSchemaResult} ~ (true if success, otherwise return false)
     */
    @Async
    CompletableFuture<CreateSchemaResult> initiateDatabase(String industryTypeName, String databaseName,
            String schemaName, MTemplateInfoDTO masterTemplate, String masterSchemaName);

    /**
     * Rollback database
     *
     * @param createSchemaResult {@link CreateSchemaResult}
     * @return message after drop
     */
    @Async
    CompletableFuture<String> dropSchema(CreateSchemaResult createSchemaResult);
}
