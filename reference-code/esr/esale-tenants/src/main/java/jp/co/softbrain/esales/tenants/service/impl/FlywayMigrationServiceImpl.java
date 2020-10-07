package jp.co.softbrain.esales.tenants.service.impl;

import java.io.File;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.flywaydb.core.api.configuration.ClassicConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jp.co.softbrain.esales.tenants.service.FlywayMigrationService;
import jp.co.softbrain.esales.tenants.service.dto.MigrateDataResult;
import jp.co.softbrain.esales.tenants.tenant.util.ConnectionUtil;

/**
 * Service implementation for {@link FlywayMigrationService}
 *
 * @author tongminhcuong
 */
@Service
public class FlywayMigrationServiceImpl implements FlywayMigrationService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ConnectionUtil connectionUtil;

    /**
     * @see FlywayMigrationService#migrateData(String, String, List)
     */
    @Override
    public CompletableFuture<MigrateDataResult> migrateData(String databaseName,
            String schemaName, List<File> sqlFileList) {

        try {
            String databaseUrl = connectionUtil.createDatabaseUrl(databaseName, schemaName);
            String flywayLocation = sqlFileList.get(0).getParent();
            ClassicConfiguration config = connectionUtil.createFlywayConfig(flywayLocation, databaseUrl);
            // ignore initiate version
            config.setIgnoreMissingMigrations(true);

            Flyway flyway = new Flyway(config);
            flyway.migrate();
            return CompletableFuture.completedFuture(new MigrateDataResult(schemaName, null));
        } catch (FlywayException e) {
            log.error("Flyway migration failed. Micro service: {}, Tenant name : {}", databaseName, schemaName);
            return CompletableFuture.completedFuture(new MigrateDataResult(schemaName, e.getMessage()));
        }
    }
}
