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
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.configuration.ClassicConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.InvocationType;
import com.amazonaws.services.lambda.model.InvokeRequest;
import com.amazonaws.services.lambda.model.InvokeResult;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.util.CollectionUtils;
import com.google.common.io.ByteSource;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.AwsLambdaProperties;
import jp.co.softbrain.esales.tenants.config.AwsTemplateProperties;
import jp.co.softbrain.esales.tenants.domain.MTemplates;
import jp.co.softbrain.esales.tenants.repository.MTemplatesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.MasterTemplateService;
import jp.co.softbrain.esales.tenants.service.dto.IndustryDTO;
import jp.co.softbrain.esales.tenants.service.dto.MTemplateIndustryDTO;
import jp.co.softbrain.esales.tenants.service.dto.MTemplatesDTO;
import jp.co.softbrain.esales.tenants.service.dto.TemplateMicroServiceDTO;
import jp.co.softbrain.esales.tenants.service.mapper.MTemplatesMapper;
import jp.co.softbrain.esales.tenants.tenant.client.config.TenantDatabaseConfigProperties;
import jp.co.softbrain.esales.tenants.tenant.util.ConnectionUtil;
import jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils;
import jp.co.softbrain.esales.tenants.tenant.util.TenantUtil;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;

/**
 * Service implementation for managing {@link MTemplates}.
 *
 * @author nguyenvietloi
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MasterTemplateServiceImpl extends AbstractTenantService implements MasterTemplateService {

    private final Logger log = LoggerFactory.getLogger(MasterTemplateServiceImpl.class);

    private static final AWSLambda lambda = AWSLambdaClientBuilder.defaultClient();

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private AwsLambdaProperties awsLambdaProperties;

    @Autowired
    private AwsTemplateProperties awsTemplateProperties;

    @Autowired
    private TenantDatabaseConfigProperties tenantDatabaseConfigProperties;

    @Autowired
    private CommonService commonService;

    @Autowired
    private MTemplatesRepository mTemplatesRepository;

    @Autowired
    private MTemplatesMapper mTemplatesMapper;

    @Autowired
    private ConnectionUtil connectionUtil;

    /**
     * @see MasterTemplateService#updateMasterTemplates(String,List)
     */
    @Override
    @Transactional
    public String updateMasterTemplates(String industryTypeName, List<String> microServiceNames) {
        // 1. validate industry
        IndustryDTO industry = commonService.getIndustry(industryTypeName);
        if (industry == null) {
            throw new CustomException(getMessage(Constants.ITEM_NOT_EXIST, industryTypeName),
                "industryTypeName", Constants.ITEM_NOT_EXIST);
        }

        // 2. get list micro services
        List<TemplateMicroServiceDTO> templateMicroServices =
            mTemplatesRepository.getTemplateMicroServices(industry.getMIndustryId(), microServiceNames);

        // validate database result
        validateMatchingMicroServiceNames(microServiceNames, templateMicroServices);

        // 3. dump master data
        String[] s3KeyInfo = S3PathUtils.extractS3Path(awsTemplateProperties.getDbPath());
        String bucketName = s3KeyInfo[BUCKET_NAME_INDEX];
        String s3Path = s3KeyInfo[S3_KEY_INDEX] + industry.getIndustryTypeName();
        Map<Long, String> fileNameSuccess = dumpMasterTemplateToS3(templateMicroServices, industry, bucketName, s3Path);

        if (fileNameSuccess.size() < templateMicroServices.size()) {
            // 5. roll back file success
            rollbackFileS3(fileNameSuccess, bucketName,s3Path, "dump_master_template_to_s3");
        }

        // 4. update master template
        templateMicroServices.forEach(template -> {
            Long templateId = template.getMTemplateId();
            try {
                updateTemplate(templateId, template.getUpdatedDate(), fileNameSuccess.get(templateId));
            } catch (DataIntegrityViolationException | CustomException e) {
                // 5. roll back file success
                rollbackFileS3(fileNameSuccess, bucketName, s3Path, "update_master_template");
            }
        });

        return getMessage(Constants.UPDATED);
    }

    /**

     * @see MasterTemplateService#rollbackMasterTemplates(String, List)
     */
    @Override
    @Transactional
    public String rollbackMasterTemplates(String industryTypeName, List<String> microServiceNames) {
        // 1. validate industry
        IndustryDTO industry = commonService.getIndustry(industryTypeName);
        if (industry == null) {
            throw new CustomException(getMessage(Constants.ITEM_NOT_EXIST, industryTypeName),
                "industryTypeName", Constants.ITEM_NOT_EXIST);
        }

        // 2. get list micro services
        List<TemplateMicroServiceDTO> templateMicroServices =
            mTemplatesRepository.getTemplateMicroServices(industry.getMIndustryId(), microServiceNames);

        // validate database result
        validateMatchingMicroServiceNames(microServiceNames, templateMicroServices);

        // 3. Download file dump from S3
        String[] s3KeyInfo = S3PathUtils.extractS3Path(awsTemplateProperties.getDbPath());
        String bucketName = s3KeyInfo[BUCKET_NAME_INDEX];
        String s3Path = s3KeyInfo[S3_KEY_INDEX] + industry.getIndustryTypeName();

        Path tempFolder = null;
        try {
            tempFolder = Files.createTempDirectory(industryTypeName);
            loadS3andWriteFileSQL(tempFolder, templateMicroServices, industry.getSchemaName(), bucketName, s3Path);
        } catch (AmazonS3Exception | SQLException | IOException e) {
            log.error("Cannot create database. Error message: {}", e.getMessage());
            throw new CustomException(getMessage(Constants.INTERRUPT_API), "download_file",
                Constants.INTERRUPT_API);
        } finally {
            try {
                if (tempFolder != null) {
                    Files.delete(tempFolder);
                }
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }

        return getMessage(Constants.UPDATED);
    }

    /**
     * @see MasterTemplateService#getListTemplates()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<MTemplateIndustryDTO> getListTemplates() {
        return mTemplatesRepository.getListTemplates();
    }


    /**
     * Validate matching between param microServiceNames and microServiceNames from db.
     *
     * @param microServiceNames services ids from param
     * @param templateMicroServices micro services from db
     */
    private void validateMatchingMicroServiceNames(List<String> microServiceNames, List<TemplateMicroServiceDTO> templateMicroServices) {
        if (templateMicroServices.isEmpty()) {
            throw new CustomException(getMessage(Constants.ITEM_NOT_EXIST, "サービスID_" + microServiceNames),
                "microServiceNames", Constants.ITEM_NOT_EXIST);
        }

        if (!CollectionUtils.isNullOrEmpty(microServiceNames)) {
            microServiceNames = microServiceNames.stream().distinct().collect(Collectors.toList());

            if (templateMicroServices.size() < microServiceNames.size()) {
                List<String> microServiceNamesFormDB = templateMicroServices.stream()
                    .map(TemplateMicroServiceDTO::getMicroServiceName)
                    .collect(Collectors.toList());
                List<String> serviceIdsNotExist = microServiceNames.stream()
                    .filter(name -> !microServiceNamesFormDB.contains(name))
                    .collect(Collectors.toList());
                throw new CustomException(getMessage(Constants.ITEM_NOT_EXIST, "サービスID_" + serviceIdsNotExist),
                    "microServiceNames", Constants.ITEM_NOT_EXIST);
            }
        }
    }

    /**
     * Dump master template to s3
     *
     * @param templateMicroServices list {@link TemplateMicroServiceDTO}
     * @param industry {@link IndustryDTO}
     * @param bucketName bucketName
     * @param s3Path s3 path
     * @return map of templateId and file name dump success
     */
    private Map<Long, String> dumpMasterTemplateToS3(List<TemplateMicroServiceDTO> templateMicroServices,
        IndustryDTO industry, String bucketName, String s3Path) {
        Map<Long, String> fileNameSuccess = new HashMap<>();
        Long timestamp = Instant.now().toEpochMilli();
        for (TemplateMicroServiceDTO template : templateMicroServices) {
            String microServiceName = template.getMicroServiceName();
            String fileName = String.format("m_%s_%d.sql", microServiceName, timestamp);

            String result = callFunctionPgDump(microServiceName, industry.getSchemaName(), bucketName, s3Path, fileName);
            if (result.contains("\"errorType\":\"Error\"")) {
                log.error(result);
                return fileNameSuccess;
            }
            fileNameSuccess.put(template.getMTemplateId(), fileName);
        }
        return fileNameSuccess;
    }

    /**
     * call lambda function pg_dump
     *
     * @param databaseName name of database
     * @param schemaName name of schema
     * @param bucketName bucketName
     * @param s3Patch s3 path
     * @param fileName name of file dump
     * @return string result.
     */
    private String callFunctionPgDump(String databaseName, String schemaName,
            String bucketName, String s3Patch, String fileName) {
        // 3.1 create params
        Map<String, String> dumpItems = new HashMap<>();
        dumpItems.put("PGHOST", TenantUtil.extractHostFromDatabaseUrl(tenantDatabaseConfigProperties.getMasterUrl()));
        dumpItems.put("PGUSER", tenantDatabaseConfigProperties.getUsername());
        dumpItems.put("PGPASSWORD", tenantDatabaseConfigProperties.getPassword());
        dumpItems.put("PGDATABASE", databaseName);
        dumpItems.put("PGDUMP_ARGS", "--no-owner --schema " + schemaName);
        dumpItems.put("S3_BUCKET", bucketName);
        dumpItems.put("S3_PATH", s3Patch);
        dumpItems.put("FILE_NAME", fileName);

        // 3.2 call lambda function
        InvokeRequest invokeRequest = new InvokeRequest()
            .withFunctionName(awsLambdaProperties.getPgdump())
            .withPayload(new JSONObject(dumpItems).toString());
        invokeRequest.setInvocationType(InvocationType.RequestResponse);

        InvokeResult invokeResult = lambda.invoke(invokeRequest);
        return new String(invokeResult.getPayload().array(), StandardCharsets.UTF_8);
    }

    /**
     * Update template.
     *
     * @param mTemplateId mTemplateId
     * @param updatedDate update date
     * @param fileName file name
     */
    private void updateTemplate(Long mTemplateId, Instant updatedDate, String fileName) {
        mTemplatesRepository.findById(mTemplateId)
            .filter(template -> template.getUpdatedDate().equals(updatedDate))
            .ifPresentOrElse(template -> {
                MTemplatesDTO updateTemplate = mTemplatesMapper.toDto(template);
                updateTemplate.setFileName(fileName);
                updateTemplate.setUpdatedUser(getUserIdFromToken());
                mTemplatesRepository.save(mTemplatesMapper.toEntity(updateTemplate));
            }, () -> {
                throw new CustomException(getMessage(Constants.EXCLUSIVE_CODE), "update_master_template",
                    Constants.EXCLUSIVE_CODE);
            });
    }


    /**
     * Rollback file on S3
     *
     * @param filesRollback list files rollback
     * @param bucketName name of bucket
     * @param s3Path s3 path
     * @param item item error
     */
    private void rollbackFileS3(Map<Long, String> filesRollback, String bucketName, String s3Path, String item) {
        filesRollback.values()
            .forEach(fileName -> S3CloudStorageClient.deleteObject(bucketName, s3Path + "/" + fileName));
        throw new CustomException(getMessage(Constants.INTERRUPT_API), item, Constants.INTERRUPT_API);
    }

    /**
     * Load file from S3 and write to temp folder
     *
     * @param tempFolder folder temp. Delete after complete
     * @param templateServices template services
     * @param schemaName name of schema
     * @param bucketName name of bucket
     * @param s3Path s3 path
     * @throws IOException if an I/O error occurs or tempFolder/fileName does not exist
     * @throws SQLException if cannot connect to DB.
     */
    private void loadS3andWriteFileSQL(Path tempFolder, List<TemplateMicroServiceDTO> templateServices,
                String schemaName, String bucketName, String s3Path) throws IOException, SQLException {
        ClassicConfiguration config = new ClassicConfiguration();
        for (TemplateMicroServiceDTO template : templateServices) {
            File tempFile = null;
            try {
                // create local temporary file to save dump file from S3
                tempFile = Files.createTempFile(tempFolder, "V001__", ".sql").toFile();

                // get template file from S3 and save to local temporary file
                try (BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {
                    for (String line : loadContentFileFromS3(bucketName, s3Path + "/" + template.getFileName())) {
                        bufferedWriter.write(line + System.lineSeparator());
                    }
                }

                // drop schema
                String databaseName = template.getMicroServiceName();
                dropSchema(databaseName, schemaName);

                // create database by Flyway
                String databaseUrl = connectionUtil.createDatabaseUrl(databaseName);
                executeFlywayDB(config, databaseUrl, tempFile.getParent());
            } finally {
                FileUtils.deleteQuietly(tempFile);
            }
        }
    }

    /**
     * Drop schema
     *
     * @param databaseName name of database
     * @param schemaName name of schema
     * @throws SQLException if cannot connect to DB.
     */
    private void dropSchema(String databaseName, String schemaName) throws SQLException {
        try (Connection databaseConnection = connectionUtil.createConnection(databaseName)) {
            try (Statement databaseStatement = databaseConnection.createStatement()) {
                StringBuilder dropSchemaSql = new StringBuilder()
                    .append("DROP SCHEMA IF EXISTS ")
                    .append(schemaName)
                    .append(" CASCADE");
                databaseStatement.execute(dropSchemaSql.toString());
            }
        }
    }

    /**
     * Execute flyway
     *
     * @param config {@link ClassicConfiguration}
     * @param databaseUrl database url
     * @param filePath file path
     */
    private void executeFlywayDB(ClassicConfiguration config, String databaseUrl, String filePath) {
        config.setLocationsAsStrings("filesystem:" + filePath);
        config.setDataSource(databaseUrl, tenantDatabaseConfigProperties.getUsername(),
            tenantDatabaseConfigProperties.getPassword());
        Flyway flyway = new Flyway(config);
        flyway.clean();
        flyway.migrate();
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
                return s3Client.getObject(new GetObjectRequest(bucketName, s3FileKey)).getObjectContent();
            }
        }.asCharSource(StandardCharsets.UTF_8).readLines();
    }
}
