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
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.iterable.S3Objects;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.util.StringUtils;
import com.google.common.io.ByteSource;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.AwsTemplateProperties;
import jp.co.softbrain.esales.tenants.repository.TenantsRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.FlywayMigrationService;
import jp.co.softbrain.esales.tenants.service.MigrateDataService;
import jp.co.softbrain.esales.tenants.service.dto.MigrateDataResult;
import jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils;
import jp.co.softbrain.esales.tenants.util.SettingEnvironmentUtil;

/**
 * Service implementation for {@link MigrateDataService}
 *
 * @author tongminhcuong
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MigrateDataServiceImpl extends AbstractTenantService implements MigrateDataService {

    private static final String SQL_FILE_SUFFIX = ".sql";

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private TenantsRepository tenantsRepository;

    @Autowired
    private FlywayMigrationService flywayMigrationService;

    @Autowired
    private SettingEnvironmentUtil settingEnvironmentUtil;

    @Autowired
    private AwsTemplateProperties awsTemplateProperties;

    /**
     * @see MigrateDataService#migrateData(String)
     */
    @Override
    public List<MigrateDataResult> migrateData(String microServiceName) {
        // 1. Validate parameter
        if (StringUtils.isNullOrEmpty(microServiceName)) {
            throw new CustomException(getMessage(Constants.REQUIRED_PARAMETER, "microServiceName"),
                    "microServiceName", Constants.REQUIRED_PARAMETER);
        }

        // 2. Get Schema target
        List<String> summarySchemaList = tenantsRepository.findAllTenantName();

        // 3. Download script file from S3
        // create local temporary file to save dump file from S3
        Path tempFolder = createTempFolder(microServiceName);
        List<File> tempFileList = createScriptTempFile(tempFolder, microServiceName);

        if (tempFileList.isEmpty()) {
            // delete temporary folder
            deleteTemporaryFiles(tempFolder, tempFileList);
            // return error
            List<MigrateDataResult> migrateDataResultList = new ArrayList<>();
            migrateDataResultList.add(new MigrateDataResult("Do not exist script files from S3", null));
            return migrateDataResultList;
        }

        // 4. Execute flyway migrate to update Database
        @SuppressWarnings("unchecked")
        CompletableFuture<MigrateDataResult>[] completableFutureJobs = summarySchemaList.stream()
                .map(schemaName -> flywayMigrationService.migrateData(microServiceName, schemaName, tempFileList))
                .toArray(CompletableFuture[]::new);

        List<MigrateDataResult> migrateDataResultList = settingEnvironmentUtil.runJobWithMultipleThread(completableFutureJobs);

        // delete temporary file
        deleteTemporaryFiles(tempFolder, tempFileList);

        return migrateDataResultList;
    }

    /**
     * Create temporary folder to save s3 file
     *
     * @param microServiceName Name of microservice
     * @return {@link Path}
     */
    private Path createTempFolder(String microServiceName) {
        String tempFolderPrefix = String.format("%s_", microServiceName);
        try {
            return Files.createTempDirectory(tempFolderPrefix);
        } catch (IOException e) {
            log.error("Cannot create temporary folder to save s3 file.");
            throw new CustomException(e.getLocalizedMessage(), "download-s3-script", Constants.INTERRUPT_API);
        }
    }

    /**
     * Download file from S3 and save to specified folder
     *
     * @param folder temporary folder
     * @param microServiceName Name of mirco service
     * @return List of {@link File}
     */
    private List<File> createScriptTempFile(Path folder, String microServiceName) {
        String[] s3KeyInfo = S3PathUtils.extractS3Path(awsTemplateProperties.getMigrationDataPath());
        String bucketName = s3KeyInfo[BUCKET_NAME_INDEX];
        String s3FolderPath = s3KeyInfo[S3_KEY_INDEX] + microServiceName;

        List<File> tempFileList = new ArrayList<>();

        try {
            S3Objects s3ObjectSummaries = S3Objects.withPrefix(s3Client, bucketName, s3FolderPath);
            for (S3ObjectSummary s3Object : s3ObjectSummaries) {
                if (!s3Object.getKey().endsWith(SQL_FILE_SUFFIX)) {
                    continue;
                }
                String fileName = s3Object.getKey()
                        .substring(s3Object.getKey().lastIndexOf('/'));
                File tempFile = new File(folder.toString() + fileName);

                try (BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {
                    loadContentFileFromS3(bucketName, s3Object.getKey())
                            .forEach(line -> {
                                try {
                                    bufferedWriter.write(line + System.lineSeparator());
                                } catch (IOException e) {
                                    throw new IllegalStateException(e.getMessage());
                                }
                            });
                }

                tempFileList.add(tempFile);
            }
        } catch (AmazonS3Exception | IllegalStateException | IOException e) {
            log.error("Cannot download file from S3.");
            deleteTemporaryFiles(folder, tempFileList);
            throw new CustomException(e.getLocalizedMessage(), "download-s3-script", Constants.INTERRUPT_API);
        }

        return tempFileList;
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
     * Delete temporary file
     *
     * @param folder temporary folder
     * @param tempFileList list of temporary file
     */
    private void deleteTemporaryFiles(Path folder, List<File> tempFileList) {
        // delete all temporary file
        tempFileList.forEach(FileUtils::deleteQuietly);
        try {
            Files.delete(folder);
        } catch (IOException exception) {
            log.error(exception.getMessage());
        }
    }
}
