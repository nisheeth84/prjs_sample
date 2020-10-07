package jp.co.softbrain.esales.tenants.service;

import java.io.File;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.MigrateDataResult;

/**
 * FlywayMigrationService
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface FlywayMigrationService {

    /**
     * Execute migrate data for a tenant
     *
     * @param databaseName databaseName name
     * @param schemaName schema name
     * @param sqlFileList List of sql file
     * @return {@link MigrateDataResult}
     */
    @Async
    CompletableFuture<MigrateDataResult> migrateData(String databaseName, String schemaName, List<File> sqlFileList);
}
