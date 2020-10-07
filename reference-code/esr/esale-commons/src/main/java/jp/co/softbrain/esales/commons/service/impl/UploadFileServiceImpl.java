package jp.co.softbrain.esales.commons.service.impl;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.model.ObjectMetadata;

import jp.co.softbrain.esales.commons.config.ApplicationProperties;
import jp.co.softbrain.esales.commons.service.UploadFileService;
import jp.co.softbrain.esales.commons.service.dto.S3UploadResponse;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;

/**
 * Service Implementation for UploadFileService.
 */
@Service
public class UploadFileServiceImpl implements UploadFileService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private ApplicationProperties applicationProperties;

    @Value("${application.upload-bucket}")
    private String csvImportBucketName;

    private static final String COPY_FILE_ERROR = "Copy file error";

    /**
     * @see jp.co.softbrain.esales.commons.service.UploadFileService#copyFileToS3(String, String, String)
     */
    public String copyFileToS3(String fileName, String fileExtension, String content) {
        String bucketName = applicationProperties.getUploadBucket();
        String toDay = DateUtil.convertDateToString(new Date(), DateUtil.FORMAT_YYYYMMDDHHMMSSSSS);
        String keyName = String.format("%s/%s/%s_%s_%s.%s", jwtTokenUtil.getTenantIdFromToken(),
                FieldBelong.EMPLOYEE.name().toLowerCase(), jwtTokenUtil.getEmployeeIdFromToken(), fileName, toDay,
                fileExtension);

        if (!S3CloudStorageClient.putObject(bucketName, keyName,
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)))) {
            throw new CustomException(COPY_FILE_ERROR, COPY_FILE_ERROR, Constants.SAVE_FILE_TO_S3_FAILED);
        }
        return S3CloudStorageClient.generatePresignedURL(bucketName, keyName,
                applicationProperties.getExpiredSeconds());
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.UploadFileService#uploadFileToS3(MultipartFile,
     *      Integer)
     */
    public S3UploadResponse uploadFileToS3(MultipartFile part, Integer importBelong) throws IOException {
        String serviceName = FieldBelongEnum.getByValue(importBelong).getName();
        String submitedFileName = part.getOriginalFilename();
        String fileName = FilenameUtils.removeExtension(submitedFileName);
        String fileExtension = FilenameUtils.getExtension(submitedFileName);
        String toDay = DateUtil.convertDateToString(new Date(), DateUtil.FORMAT_YYYYMMDDHHMMSSSSS);
        String contentType = part.getContentType();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(part.getSize());
        metadata.setContentType(contentType);
        String keyName = String.format("%s_%s_%s.%s", serviceName, fileName, toDay, fileExtension);
        S3CloudStorageClient.putObjectWithResponse(csvImportBucketName, keyName, convert(part));
        String presignedUrl = S3CloudStorageClient.generatePresignedURL(csvImportBucketName, keyName,
                applicationProperties.getExpiredSeconds());
        return new S3UploadResponse(keyName, presignedUrl);
    }

    private File convert(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}
