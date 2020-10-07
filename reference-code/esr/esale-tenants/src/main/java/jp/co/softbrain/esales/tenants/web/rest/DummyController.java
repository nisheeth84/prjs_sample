package jp.co.softbrain.esales.tenants.web.rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.google.common.collect.ImmutableMap;

import jp.co.softbrain.esales.tenants.web.rest.vm.request.UploadFilesToS3Request;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;

/**
 * Spring MVC RESTful Controller to handle upload files to S3
 *
 * @author tongminhcuong
 */
@Slf4j
@RestController
@RequestMapping("/public/api")
public class DummyController {

    private static final String MESSAGE_KEY = "message";

    private static final String SUCCESS_KEY = "Success";

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private CognitoIdentityProviderClient mIdentityProvider;

    /**
     * Upload files to S3
     *
     * @param request request
     * @return The message
     */
    @PostMapping(path = "/upload-files-to-s3", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> uploadFiles(@ModelAttribute UploadFilesToS3Request request) {
        List<MultipartFile> files = request.getFiles();

        String bucketName = request.getBucketName();
        String folderPath = request.getFolderPath();

        Path tempFolder = null;
        List<File> tempFileList = new ArrayList<>();
        try {
            tempFolder = Files.createTempDirectory("upload-s3_");
            for (MultipartFile file : files) {
                File tempFile = new File(String.format("%s/%s", tempFolder.toString(), file.getOriginalFilename()));

                try (FileOutputStream out = new FileOutputStream(tempFile)) {
                    out.write(file.getBytes());
                }

                tempFileList.add(tempFile);

                String s3FileKey = folderPath + file.getOriginalFilename();
                PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileKey, tempFile);
                putObjectRequest.setMetadata(new ObjectMetadata());
                s3Client.putObject(putObjectRequest);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ImmutableMap.of(MESSAGE_KEY, e.getMessage()));
        } finally {
            tempFileList.forEach(FileUtils::deleteQuietly);
            try {
                if (tempFolder != null) {
                    Files.delete(tempFolder);
                }
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }

        return ResponseEntity.ok(ImmutableMap.of(MESSAGE_KEY, SUCCESS_KEY));
    }

    /**
     * Download files to S3
     */
    @GetMapping(path = "/download-files-from-s3", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public @ResponseBody byte[] downloadFiles(@RequestParam("bucketName") String bucketName,
            @RequestParam("s3FileKey") String s3FileKey) throws IOException {

        try {
            return IOUtils.toByteArray(s3Client.getObject(new GetObjectRequest(bucketName, s3FileKey))
                    .getObjectContent());
        } catch (SdkClientException | AmazonServiceException e) {
            log.error(e.getMessage(), e);
            return new byte[] {};
        }
    }

    /**
     * Update attribute of account cognito
     *
     * @param request request
     * @return message after updated
     */
    @PostMapping(path = "/update-user-cognito-attributes", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateCognitoAccount(
            @RequestBody UpdateCognitoAttributeRequest request) {
        // get user
        AdminGetUserRequest userRequest = AdminGetUserRequest.builder()
                .username(request.getEmail())
                .userPoolId(request.getUserPoolId())
                .build();
        AdminGetUserResponse user = mIdentityProvider.adminGetUser(userRequest);

        List<AttributeType> userAttributes = request.getAttributes().entrySet().stream()
                .map(e -> AttributeType.builder()
                        .name(e.getKey()).value(e.getValue()).build())
                .collect(Collectors.toList());

        AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder()
                .username(user.username())
                .userPoolId(request.getUserPoolId())
                .userAttributes(userAttributes)
                .build();

        try {
            // update attributes
            mIdentityProvider.adminUpdateUserAttributes(updateRequest);
        } catch (SdkClientException | AwsServiceException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ImmutableMap.of(MESSAGE_KEY, e.getMessage()));
        }

        return ResponseEntity.ok(ImmutableMap.of(MESSAGE_KEY, SUCCESS_KEY));
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    static class UpdateCognitoAttributeRequest {

        private String userPoolId;

        private String email;

        private Map<String, String> attributes;
    }
}
