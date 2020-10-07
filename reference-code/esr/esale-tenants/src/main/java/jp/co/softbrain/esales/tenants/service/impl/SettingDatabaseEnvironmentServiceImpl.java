package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils.BUCKET_NAME_INDEX;
import static jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils.S3_KEY_INDEX;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

import org.apache.commons.io.FileUtils;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.flywaydb.core.api.configuration.ClassicConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.google.common.collect.ImmutableList;
import com.google.common.io.ByteSource;

import jp.co.softbrain.esales.tenants.config.AwsTemplateProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.service.SettingDatabaseEnvironmentService;
import jp.co.softbrain.esales.tenants.service.dto.MTemplateInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateSchemaResult;
import jp.co.softbrain.esales.tenants.tenant.client.config.TenantDatabaseConfigProperties;
import jp.co.softbrain.esales.tenants.tenant.util.ConnectionUtil;
import jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils;

/**
 * Utility methods for initiate database
 *
 * @author tongminhcuong
 */
@Service
public class SettingDatabaseEnvironmentServiceImpl implements SettingDatabaseEnvironmentService {

    private static final List<String> DATABASE_SERVER_LIST = ImmutableList.of(
            ConstantsTenants.EMPLOYEE_SERVICE_NAME,
            ConstantsTenants.SCHEDULE_SERVICE_NAME,
            ConstantsTenants.PRODUCT_SERVICE_NAME,
            ConstantsTenants.CUSTOMERS_SERVICE_NAME,
            ConstantsTenants.BUSINESSCARDS_SERVICE_NAME,
            ConstantsTenants.ACTIVITIES_SERVICE_NAME,
            ConstantsTenants.TIMELINES_SERVICE_NAME,
            ConstantsTenants.SALES_SERVICE_NAME,
            ConstantsTenants.COMMONS_SERVICE_NAME,
            ConstantsTenants.ANALYSIS_SERVICE_NAME,
            ConstantsTenants.EXTERNALS_SERVICE_NAME,
            "tenant");

    private static final String USER_PROPERTY_NAME = "user";

    private static final String PASSWORD_PROPERTY_NAME = "password";

    private static final String SQL_FILE_SUFFIX = ".sql";

    private static final String INIT_FLYWAY_FILE_FORMAT = "V0_0__init_%s_";

    private final Logger log = LoggerFactory.getLogger(SettingDatabaseEnvironmentServiceImpl.class);

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private TenantDatabaseConfigProperties tenantDatabaseConfigProperties;

    @Autowired
    private ConnectionUtil connectionUtil;

    @Autowired
    private AwsTemplateProperties awsTemplateProperties;

    /**
     * @see SettingDatabaseEnvironmentService#initiateDatabase(String, String, String, MTemplateInfoDTO, String)
     */
    @Override
    public CompletableFuture<CreateSchemaResult> initiateDatabase(String industryTypeName, String databaseName,
            String schemaName, MTemplateInfoDTO masterTemplate, String masterSchemaName) {

        String[] s3KeyInfo = S3PathUtils.extractS3Path(awsTemplateProperties.getDbPath());
        String bucketName = s3KeyInfo[BUCKET_NAME_INDEX];
        String s3FileKey = String.format("%s%s/%s", s3KeyInfo[S3_KEY_INDEX], industryTypeName, masterTemplate.getFileName());

        String databaseUrl = connectionUtil.createDatabaseUrl(databaseName);

        File tempFile = null;
        Path tempFolder = null;
        try {
            // create foreign server and user mapping
            createForeignServer(databaseName);

            // create local temporary file to save dump file from S3
            String tempFolderPrefix = String.format("%s_%s_", industryTypeName, databaseName);
            tempFolder = Files.createTempDirectory(tempFolderPrefix);

            String tempFilePrefix = String.format(INIT_FLYWAY_FILE_FORMAT, schemaName);
            tempFile = Files.createTempFile(tempFolder, tempFilePrefix, SQL_FILE_SUFFIX).toFile();

            // get template file from S3 and save to local temporary file
            try (BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {
                loadContentFileFromS3(bucketName, s3FileKey)
                        .forEach(line -> {
                            try {
                                bufferedWriter.write(line.replaceAll(masterSchemaName, schemaName) + System.lineSeparator());
                            } catch (IOException e) {
                                throw new IllegalStateException(e.getMessage());
                            }
                        });
            }

            // create database by Flyway
            String flywayLocation = tempFile.getParent();
            ClassicConfiguration config = connectionUtil.createFlywayConfig(flywayLocation, databaseUrl);

            Flyway flyway = new Flyway(config);
            flyway.clean();
            flyway.migrate();
        } catch (AmazonS3Exception | IllegalStateException | SQLException | FlywayException | IOException e) {
            log.error("Cannot create database. Micro service name: {}, tenant name: {}. Error message: {}",
                    databaseName, schemaName, e.getMessage());
            return CompletableFuture.completedFuture(new CreateSchemaResult(databaseUrl, schemaName, false));
        } finally {
            FileUtils.deleteQuietly(tempFile);
            try {
                if (tempFolder != null) {
                    Files.delete(tempFolder);
                }
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }
        log.info("\n\n\t===============\n\tCREATED DATABASE {}\n\t===============\n\n", databaseUrl);
        return CompletableFuture.completedFuture(new CreateSchemaResult(databaseUrl, schemaName, true));
    }

    /**
     * @see SettingDatabaseEnvironmentService#dropSchema(CreateSchemaResult)
     */
    @Override
    public CompletableFuture<String> dropSchema(CreateSchemaResult createSchemaResult) {
        String databaseUrl = createSchemaResult.getDatabaseUrl();

        try (Connection databaseConnection = createConnection(databaseUrl)) {
            // initiate schemaStatement
            try (Statement databaseStatement = databaseConnection.createStatement()) {

                // execute create schema with schema_name = schemaName
                StringBuilder dropSchemaSql = new StringBuilder()
                        .append("DROP SCHEMA IF EXISTS ")
                        .append(createSchemaResult.getSchemaName())
                        .append(" CASCADE");

                databaseStatement.execute(dropSchemaSql.toString());
            }
        } catch (SQLException e) {
            log.error("Cannot drop schema. schema name: {}. Error message: {}",
                    createSchemaResult.getSchemaName(), e.getMessage());

            String messageResult = "CANNOT DROP SCHEMA " + databaseUrl;
            return CompletableFuture.completedFuture(messageResult);
        }
        String messageResult = "DROPPED SCHEMA " + databaseUrl;
        return CompletableFuture.completedFuture(messageResult);
    }

    /**
     * Load content file from S3
     *
     * @param bucketName Name of bucket
     * @param s3FileKey path of file target
     * @return List of line content
     * @throws IOException if error occurred
     */
    private List<String> loadContentFileFromS3(String bucketName, String s3FileKey) throws IOException {
        return new ByteSource() {
            @Override
            public InputStream openStream() {
                return s3Client.getObject(new GetObjectRequest(bucketName, s3FileKey))
                        .getObjectContent();
            }
        }.asCharSource(StandardCharsets.UTF_8).readLines();
    }

    /**
     * Create connection to connect DB
     *
     * @param url DB url
     * @return Connection
     */
    private Connection createConnection(String url) throws SQLException {
        Properties props = new Properties();
        props.setProperty(USER_PROPERTY_NAME, tenantDatabaseConfigProperties.getUsername());
        props.setProperty(PASSWORD_PROPERTY_NAME, tenantDatabaseConfigProperties.getPassword());
        return DriverManager.getConnection(url, props);
    }

    /**
     * Create foreign server and user mapping
     *
     * @param targetDatabaseName database name
     * @throws SQLException SQLException
     */
    private void createForeignServer(String targetDatabaseName) throws SQLException {
        String databaseUrl = connectionUtil.createDatabaseUrl(targetDatabaseName);
        try (Connection databaseConnection = createConnection(databaseUrl)) {
            try (Statement databaseStatement = databaseConnection.createStatement()) {
                databaseConnection.setAutoCommit(false);

                databaseStatement.execute("CREATE EXTENSION IF NOT EXISTS postgres_fdw");
                // Create servers
                for (String otherDbName : DATABASE_SERVER_LIST) {
                    if (targetDatabaseName.equals(otherDbName)) {
                        continue;
                    }
                    String serverName = String.format("%s_dbrmd", otherDbName);
                    String userName = tenantDatabaseConfigProperties.getUsername();
                    String password = tenantDatabaseConfigProperties.getPassword();

                    String createServerStatement = String.format("CREATE SERVER IF NOT EXISTS %s "
                            + "FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname '%s')",
                            serverName, otherDbName);
                    String createUserMappingStatement = String.format("CREATE USER MAPPING IF NOT EXISTS "
                            + "FOR %s SERVER %s OPTIONS (user '%s', password '%s')", userName, serverName, userName, password);

                    databaseStatement.execute(createServerStatement);
                    databaseStatement.execute(createUserMappingStatement);
                }

                databaseConnection.commit();
            }
        }
    }
}
