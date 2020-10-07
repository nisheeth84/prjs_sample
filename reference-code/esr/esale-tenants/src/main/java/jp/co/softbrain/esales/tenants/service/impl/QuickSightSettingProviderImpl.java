package jp.co.softbrain.esales.tenants.service.impl;

import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.util.StringUtils;
import com.google.common.collect.ImmutableList;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.AwsQuickSightConfigProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.QuickSightSettingProvider;
import jp.co.softbrain.esales.tenants.service.QuickSightSettingService;
import jp.co.softbrain.esales.tenants.service.dto.GetQuickSightSettingDTO;
import jp.co.softbrain.esales.tenants.service.dto.QuickSightSettingsDTO;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.SettingQuickSightResult;
import jp.co.softbrain.esales.tenants.tenant.client.config.TenantDatabaseConfigProperties;
import jp.co.softbrain.esales.tenants.tenant.util.ConnectionUtil;
import jp.co.softbrain.esales.tenants.tenant.util.TenantUtil;
import net.moznion.random.string.RandomStringGenerator;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.quicksight.QuickSightClient;
import software.amazon.awssdk.services.quicksight.model.CreateDataSourceRequest;
import software.amazon.awssdk.services.quicksight.model.CreateDataSourceResponse;
import software.amazon.awssdk.services.quicksight.model.CreateGroupRequest;
import software.amazon.awssdk.services.quicksight.model.CreateGroupResponse;
import software.amazon.awssdk.services.quicksight.model.CredentialPair;
import software.amazon.awssdk.services.quicksight.model.DataSourceCredentials;
import software.amazon.awssdk.services.quicksight.model.DataSourceParameters;
import software.amazon.awssdk.services.quicksight.model.DataSourceType;
import software.amazon.awssdk.services.quicksight.model.DeleteDataSourceRequest;
import software.amazon.awssdk.services.quicksight.model.DeleteGroupRequest;
import software.amazon.awssdk.services.quicksight.model.PostgreSqlParameters;
import software.amazon.awssdk.services.quicksight.model.QuickSightException;
import software.amazon.awssdk.services.quicksight.model.ResourcePermission;
import software.amazon.awssdk.services.quicksight.model.VpcConnectionProperties;

/**
 * Service implementation for {@link QuickSightSettingProvider}
 *
 * @author tongminhcuong
 */
@Service
public class QuickSightSettingProviderImpl extends AbstractTenantService implements QuickSightSettingProvider {

    private static final RandomStringGenerator RANDOM_STRING_GENERATOR = new RandomStringGenerator(new SecureRandom());

    private static final String PASSWORD_PATTERN = "[a-z0-9]{12}";

    private static final String FROM = " FROM ";

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private static final String ID_PREFIX_PATTERN = "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}";

    private static final List<String> DATASOURCE_ACTIONS = ImmutableList.of("quicksight:DescribeDataSource",
            "quicksight:DescribeDataSourcePermissions",
            "quicksight:PassDataSource",
            "quicksight:UpdateDataSource",
            "quicksight:DeleteDataSource",
            "quicksight:UpdateDataSourcePermissions");

    private static final String ANALYSIS_QUICK_SIGHT_DATABASE_NAME = "analysis_quicksight";

    private static final String USER_PROPERTY_NAME = "user";

    private static final String PASSWORD_PROPERTY_NAME = "password";

    private static final String DEFAULT_NAMESPACE = "default";

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private QuickSightClient quickSightClient;

    @Autowired
    private AwsQuickSightConfigProperties awsQuickSightConfigProperties;

    @Autowired
    private TenantDatabaseConfigProperties tenantDatabaseConfigProperties;

    @Autowired
    private QuickSightSettingService quickSightSettingService;

    @Autowired
    private ConnectionUtil connectionUtil;

    /**
     * Build {@link QuickSightClient} using for Group
     *
     * @return {@link QuickSightClient}
     */
    private QuickSightClient buildQuickSightClientForGroup() {
        Region region = Region.US_EAST_1;
        return QuickSightClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(region).build();
    }

    /**
     * @see QuickSightSettingProvider#settingQuickSight(Long, String)
     */
    @Override
    public SettingQuickSightResult settingQuickSight(Long tenantId, String tenantName) {
        // create object to save result of setting quick sight
        SettingQuickSightResult settingQuickSightResult = new SettingQuickSightResult();
        settingQuickSightResult.setTenantName(tenantName);

        // 1. Create account (included password) in postgresql
        // build account
        String account = String.format("user_%s", tenantName);
        // build password
        String password = RANDOM_STRING_GENERATOR.generateByRegex(PASSWORD_PATTERN);

        // create account
        createDatabaseAccount(tenantName, account, password);
        settingQuickSightResult.setDatabaseAccount(account);

        // 2. Create Quick sight Group
        CreateGroupRequest createGroupRequest = CreateGroupRequest.builder()
                .awsAccountId(awsQuickSightConfigProperties.getAwsAccountId())
                .namespace(DEFAULT_NAMESPACE)
                .groupName(String.format("group_name_%s", tenantName))
                .build();

        CreateGroupResponse createGroupResponse;
        try {
            createGroupResponse = buildQuickSightClientForGroup().createGroup(createGroupRequest);
        } catch (QuickSightException | SdkClientException e) {
            log.error("Create group Quick sight failed. \nRequest = {}", createGroupRequest);
            // rollback
            rollback(settingQuickSightResult);
            throw new IllegalStateException(e.getMessage(), e);
        }
        // update group to settingQuickSightResult
        settingQuickSightResult.setCreateGroupResponse(createGroupResponse);

        // 3. Create datasource
        CreateDataSourceResponse createDataSourceResponse = createDataSource(tenantName, account,
                password, settingQuickSightResult);

        // 4. Save quick sight setting information
        QuickSightSettingsDTO quickSightSettingsDTO = new QuickSightSettingsDTO();
        quickSightSettingsDTO.setTenantId(tenantId);
        quickSightSettingsDTO.setPostgresqlAccount(account);
        quickSightSettingsDTO.setPostgresqlPassword(password);
        quickSightSettingsDTO.setNamespace(DEFAULT_NAMESPACE);
        quickSightSettingsDTO.setGroupName(createGroupResponse.group().groupName());
        quickSightSettingsDTO.setDatasourceArn(createDataSourceResponse.arn());
        quickSightSettingsDTO.setGroupArn(createGroupResponse.group().arn());
        quickSightSettingsDTO.setCreatedUser(getUserIdFromToken());
        quickSightSettingsDTO.setUpdatedUser(getUserIdFromToken());

        try {
            quickSightSettingService.save(quickSightSettingsDTO);
        } catch (Exception e) { // unexpected error
            // rollback
            rollback(settingQuickSightResult);
            throw new IllegalStateException(e.getMessage(), e);
        }

        return settingQuickSightResult;
    }

    /**
     * @see QuickSightSettingProvider#getQuickSightSetting(String)
     */
    @Override
    public GetQuickSightSettingDTO getQuickSightSetting(String tenantName) {
        if (StringUtils.isNullOrEmpty(tenantName)) {
            throw new CustomException(getMessage(Constants.REQUIRED_PARAMETER, "tenantName"),
                    "tenantName", Constants.REQUIRED_PARAMETER);
        }

        return quickSightSettingService.findQuickSightSettingByTenantName(tenantName)
                .orElseThrow(() -> new CustomException(getMessage(Constants.ITEM_NOT_EXIST, ConstantsTenants.TENANT_ITEM),
                        ConstantsTenants.TENANT_ITEM, Constants.ITEM_NOT_EXIST));
    }

    /**
     * Create database account and grant permission using for Quick sight
     *
     * @param tenantName The name of Tenant
     * @param account account
     * @param password password
     */
    private void createDatabaseAccount(String tenantName, String account, String password) {
        // make database url (include schema name) to connect
        String databaseUrl = connectionUtil.createDatabaseUrl(ANALYSIS_QUICK_SIGHT_DATABASE_NAME, tenantName);

        try (Connection databaseConnection = createConnection(databaseUrl)) {
            // initiate schemaStatement
            try (Statement databaseStatement = databaseConnection.createStatement()) {

                // build statement to create user: CREATE USER [username] WITH PASSWORD '[password]'
                StringBuilder createUserStatement = new StringBuilder()
                        .append("CREATE USER ")
                        .append(account)
                        .append(" WITH PASSWORD ")
                        .append("'").append(password).append("'");

                // build statement to grant permission: usage schema
                // GRANT USAGE ON SCHEMA [schema_name] TO [username]
                StringBuilder grantSchemaStatement = new StringBuilder()
                        .append("GRANT USAGE ON SCHEMA ")
                        .append(tenantName)
                        .append(" TO ")
                        .append(account);

                // build statement to grant permission: usage table
                // GRANT SELECT ON ALL TABLES IN SCHEMA [schema_name] TO [username]
                StringBuilder grantTableStatement = new StringBuilder()
                        .append("GRANT SELECT ON ALL TABLES IN SCHEMA ")
                        .append(tenantName)
                        .append(" TO ")
                        .append(account);

                // build statement to revoke permission on view
                // REVOKE SELECT ON [view_name] FROM [username]
                StringBuilder revokeViewStatement = new StringBuilder()
                        .append("REVOKE SELECT ON ")
                        .append(" v_employees_service, ")
                        .append(" v_business_cards_service, ")
                        .append(" v_products_service, ")
                        .append(" v_activities_service, ")
                        .append(" v_schedules_service, ")
                        .append(" v_tasks_service, ")
                        .append(" v_products_tradings_service, ")
                        .append(" v_customers_service ")
                        .append(FROM)
                        .append(account);

                // build statement to auto grant
                // ALTER DEFAULT PRIVILEGES IN SCHEMA [schema_name] GRANT SELECT ON TABLES TO [username]
                StringBuilder autoGrantStatement = new StringBuilder()
                        .append("ALTER DEFAULT PRIVILEGES IN SCHEMA ")
                        .append(tenantName)
                        .append(" GRANT SELECT ON TABLES TO ")
                        .append(account);

                // Set auto commit as false.
                databaseConnection.setAutoCommit(false);

                // execute
                databaseStatement.execute(createUserStatement.toString());
                databaseStatement.execute(grantSchemaStatement.toString());
                databaseStatement.execute(grantTableStatement.toString());
                databaseStatement.execute(revokeViewStatement.toString());
                databaseStatement.execute(autoGrantStatement.toString());

                // commit
                databaseConnection.commit();
            }
        } catch (SQLException e) {
            log.error("Create database account for Quick Sight failed. Tenant name = {}", tenantName);
            throw new IllegalStateException(e.getMessage(), e);
        }
    }

    /**
     * Create data source for quick sight
     *
     * @param tenantName The name of Tenant target
     * @param account The database account user
     * @param password The database password
     * @param settingQuickSightResult settingQuickSightResult
     * @return {@link CreateDataSourceResponse}
     */
    private CreateDataSourceResponse createDataSource(String tenantName, String account, String password,
            SettingQuickSightResult settingQuickSightResult) {
        // build request
        String tenantMasterDatabaseUrl = tenantDatabaseConfigProperties.getMasterUrl();

        CreateDataSourceRequest createDataSourceRequest = CreateDataSourceRequest.builder()
                .awsAccountId(awsQuickSightConfigProperties.getAwsAccountId())
                .dataSourceId(makeRandomId())
                .name(String.format("ds_%s", tenantName))
                .type(DataSourceType.POSTGRESQL)
                .dataSourceParameters(DataSourceParameters.builder()
                        .postgreSqlParameters(PostgreSqlParameters.builder()
                                .database(ANALYSIS_QUICK_SIGHT_DATABASE_NAME)
                                .host(TenantUtil.extractHostFromDatabaseUrl(tenantMasterDatabaseUrl))
                                .port(TenantUtil.extractPortFromDatabaseUrl(tenantMasterDatabaseUrl))
                                .build())
                        .build())
                .credentials(DataSourceCredentials.builder()
                        .credentialPair(CredentialPair.builder()
                                .username(account)
                                .password(password)
                                .build())
                        .build())
                .permissions(ResourcePermission.builder()
                        .actions(DATASOURCE_ACTIONS)
                        .principal(awsQuickSightConfigProperties.getAwsAdminArn())
                        .build())
                .vpcConnectionProperties(VpcConnectionProperties.builder()
                        .vpcConnectionArn(awsQuickSightConfigProperties.getVpcDatabaseConnection())
                        .build())
                .build();

        // call API
        CreateDataSourceResponse createDataSourceResponse;
        try {
            createDataSourceResponse = quickSightClient.createDataSource(createDataSourceRequest);

            // update account to settingQuickSightResult
            settingQuickSightResult.setCreateDataSourceResponse(createDataSourceResponse);
        } catch (QuickSightException | SdkClientException e) {
            log.error("Create datasource Quick sight failed. \nRequest = {}", createDataSourceRequest);
            // rollback
            rollback(settingQuickSightResult);
            throw new IllegalStateException(e.getMessage(), e);
        }
        return createDataSourceResponse;
    }

    /**
     * Rollback when error occurred
     *
     * @param result {@link SettingQuickSightResult}
     */
    private void rollback(SettingQuickSightResult result) {
        log.info("\n\n\t===============\n\tROLLBACK DATABASE ACCOUNT\n\t===============\n\n");
        if (result.getDatabaseAccount() != null) {
            revokeDatabaseAccount(result.getTenantName(), result.getDatabaseAccount());
        }

        log.info("\n\n\t===============\n\tROLLBACK DATASOURCE\n\t===============\n\n");
        if (result.getCreateDataSourceResponse() != null) {
            deleteDataSource(result.getCreateDataSourceResponse());
        }

        log.info("\n\n\t===============\n\tROLLBACK GROUP\n\t===============\n\n");
        if (result.getCreateGroupResponse() != null) {
            deleteGroup(result.getCreateGroupResponse());
        }
    }

    /**
     * Revoke database account and grant permission using for Quick sight
     *
     * @param tenantName The name of Tenant
     * @param account account
     */
    private void revokeDatabaseAccount(String tenantName, String account) {
        // make database url (include schema name) to connect
        String databaseUrl = connectionUtil.createDatabaseUrl(ANALYSIS_QUICK_SIGHT_DATABASE_NAME, tenantName);

        try (Connection databaseConnection = createConnection(databaseUrl)) {
            // initiate schemaStatement
            try (Statement databaseStatement = databaseConnection.createStatement()) {

                // build statement to revoke auto grant
                // ALTER DEFAULT PRIVILEGES IN SCHEMA [schema_name] REVOKE SELECT ON TABLES FROM [username]
                StringBuilder revokeAutoGrantStatement = new StringBuilder()
                        .append("ALTER DEFAULT PRIVILEGES IN SCHEMA ")
                        .append(tenantName)
                        .append(" REVOKE SELECT ON TABLES FROM ")
                        .append(account);

                // build statement to revoke usage table permission
                // REVOKE ALL ON ALL TABLES IN SCHEMA [schema_name] FROM [username]
                StringBuilder revokeTableStatement = new StringBuilder()
                        .append("REVOKE ALL ON ALL TABLES IN SCHEMA ")
                        .append(tenantName)
                        .append(FROM)
                        .append(account);

                // build statement to revoke usage schema permission
                // REVOKE ALL ON SCHEMA [schema_name] FROM [username]
                StringBuilder revokeSchemaStatement = new StringBuilder()
                        .append("REVOKE ALL ON SCHEMA ")
                        .append(tenantName)
                        .append(FROM)
                        .append(account);

                // build statement to revoke usage database permission
                // REVOKE ALL ON DATABASE database FROM [username]
                StringBuilder revokeDatabaseStatement = new StringBuilder()
                        .append("REVOKE ALL ON DATABASE ")
                        .append(ANALYSIS_QUICK_SIGHT_DATABASE_NAME)
                        .append(FROM)
                        .append(account);

                // build statement to drop account: DROP USER [username]
                StringBuilder dropUserStatement = new StringBuilder()
                        .append("DROP USER ")
                        .append(account);

                // Set auto commit as false.
                databaseConnection.setAutoCommit(false);
                // execute
                databaseStatement.execute(revokeAutoGrantStatement.toString());
                databaseStatement.execute(revokeTableStatement.toString());
                databaseStatement.execute(revokeSchemaStatement.toString());
                databaseStatement.execute(revokeDatabaseStatement.toString());
                databaseStatement.execute(dropUserStatement.toString());
                // commit
                databaseConnection.commit();
            }
        } catch (SQLException e) {
            log.error("Revoke database account for Quick Sight failed. Tenant name = {}", tenantName);
        }
    }

    /**
     * Delete datasource for rollback
     *
     * @param createDataSourceResponse Result of create datasource process
     */
    private void deleteDataSource(CreateDataSourceResponse createDataSourceResponse) {
        DeleteDataSourceRequest deleteDataSourceRequest = DeleteDataSourceRequest.builder()
                .awsAccountId(awsQuickSightConfigProperties.getAwsAccountId())
                .dataSourceId(createDataSourceResponse.dataSourceId())
                .build();

        try {
            quickSightClient.deleteDataSource(deleteDataSourceRequest);
        } catch (QuickSightException | SdkClientException e) {
            log.error("Delete datasource Quick sight failed. \nRequest = {}", deleteDataSourceRequest);

            throw new IllegalStateException(e.getMessage(), e);
        }
    }

    /**
     * Delete group for rollback
     *
     * @param createGroupResponse Result of create Group process
     */
    private void deleteGroup(CreateGroupResponse createGroupResponse) {
        DeleteGroupRequest deleteGroupRequest = DeleteGroupRequest.builder()
                .awsAccountId(awsQuickSightConfigProperties.getAwsAccountId())
                .groupName(createGroupResponse.group().groupName())
                .namespace(DEFAULT_NAMESPACE)
                .build();

        try {
            buildQuickSightClientForGroup().deleteGroup(deleteGroupRequest);
        } catch (QuickSightException | SdkClientException e) {
            log.error("Delete group Quick sight failed. \nRequest = {}", deleteGroupRequest);

            throw new IllegalStateException(e.getMessage(), e);
        }
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
     * Random id value with format xxxxxxxx-xxxx-xxxx-xxxx-yyyyMMddHHmmss
     *
     * @return id
     */
    private String makeRandomId() {
        String quickSightDataSourceIdPrefix = RANDOM_STRING_GENERATOR.generateByRegex(ID_PREFIX_PATTERN);
        String quickSightDataSourceIdSuffix = LocalDateTime.now().format(DATE_TIME_FORMATTER);
        return String.format("%s-%s", quickSightDataSourceIdPrefix, quickSightDataSourceIdSuffix);
    }
}
