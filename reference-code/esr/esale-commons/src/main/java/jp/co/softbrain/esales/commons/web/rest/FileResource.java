package jp.co.softbrain.esales.commons.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jp.co.softbrain.esales.commons.config.ApplicationProperties;
import jp.co.softbrain.esales.commons.service.dto.DeleteFilesOutDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UploadFilesRequest;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;

/**
 * FilesMutation class process GraphQL Mutation
 */
@RestController
@RequestMapping("/api")
public class FileResource {

    private static final String SERVICE_NAME = "serviceName";
    private static final String FILE_INFOS = "fileInfos";
    private static final String FILE_NOT_EXIST = "File not exist";
    private static final String DELETE_FILE_FAILED = "delete file failed";

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Upload file, request input graphql with form-data (Content-Type:
     * multipart/form-data)
     * serviceName: String
     * files: upload file 1
     * files: upload file 2
     *
     * @param request request data
     * @return list of file name on S3
     */
    @PostMapping(path = "/upload-files", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<String> uploadFiles(@RequestBody UploadFilesRequest request) {
        // validate required
        if (StringUtils.isEmpty(request.getServiceName())) {
            throw new CustomException("Service name is empty", SERVICE_NAME, Constants.RIQUIRED_CODE);
        }
        if (request.getFiles() == null || request.getFiles().isEmpty()) {
            throw new CustomException("No files uploaded", FILE_INFOS, Constants.RIQUIRED_CODE);
        }
        long totalSize = 0;
        for (MultipartFile part : request.getFiles()) {
            if (StringUtils.isNotEmpty(part.getOriginalFilename())) {
                totalSize += part.getSize();
            }
        }
        // Check the total file size
        if (totalSize > Constants.FILE_SIZE_MAX) {
            throw new CustomException("Total file size is too large", FILE_INFOS, Constants.FILE_OVER_SIZE);
        }

        List<String> filePaths = new ArrayList<>();
        S3CloudStorageClient
                .uploadFiles(jwtTokenUtil.getEmployeeIdFromToken(), TenantContextHolder.getTenant(),
                        applicationProperties.getUploadBucket(), request.getServiceName(), request.getFiles())
                .forEach((k, v) -> filePaths.add(v));
        return filePaths;
    }

    @PostMapping(path = "/upload-files-import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> uploadImportFiles(@ModelAttribute UploadFilesRequest request) {
        if (StringUtils.isEmpty(request.getServiceName())) {
            throw new CustomException("Service name is empty", SERVICE_NAME, Constants.RIQUIRED_CODE);
        }
        if (request.getFiles() == null || request.getFiles().isEmpty()) {
            throw new CustomException("No files uploaded", FILE_INFOS, Constants.RIQUIRED_CODE);
        }
        long totalSize = 0;
        for (MultipartFile part : request.getFiles()) {
            if (StringUtils.isNotEmpty(part.getOriginalFilename())) {
                totalSize += part.getSize();
            }
        }
        // Check the total file size
        if (totalSize > Constants.FILE_SIZE_MAX) {
            throw new CustomException("Total file size is too large", FILE_INFOS, Constants.FILE_OVER_SIZE);
        }

        List<String> filePaths = new ArrayList<>();
        S3CloudStorageClient
            .uploadFiles(request.getEmployeeId(), TenantContextHolder.getTenant(),
                applicationProperties.getUploadBucket(), request.getServiceName(), request.getFiles())
            .forEach((k, v) -> filePaths.add(v));
        return ResponseEntity.ok(filePaths);
    }

    /**
     * Delete files to S3
     *
     * @param filePaths file paths delete
     * @return file paths delete
     */
    public DeleteFilesOutDTO deleteFiles(List<String> filePaths) {

        // 1. Validate parameters
        if (filePaths == null || filePaths.isEmpty()) {
            throw new CustomException("Validate parameters", "Parameters error", Constants.RIQUIRED_CODE);
        }

        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        String bucketName = applicationProperties.getUploadBucket();
        List<Map<String, Object>> errorList = new ArrayList<>();
        // 2. Check exist file
        IntStream.range(0, filePaths.size()).forEach(index -> {
            try {
                if (S3CloudStorageClient.getObject(bucketName,
                        String.format("%s/%s", tenantId, filePaths.get(index))) == null) {
                    Map<String, Object> mapError = new HashMap<>();
                    mapError.put(Constants.ROW_ID, index);
                    mapError.put(Constants.ERROR_ITEM, filePaths.get(index));
                    mapError.put(Constants.ERROR_CODE, Constants.FILE_NOT_EXIST);
                    errorList.add(mapError);
                }
            } catch (IOException e) {
                Map<String, Object> mapError = new HashMap<>();
                mapError.put(Constants.ROW_ID, index);
                mapError.put(Constants.ERROR_ITEM, filePaths.get(index));
                mapError.put(Constants.ERROR_CODE, Constants.FILE_NOT_EXIST);
                errorList.add(mapError);
            }
        });

        if (!errorList.isEmpty()) {
            throw new CustomException(FILE_NOT_EXIST, errorList);
        }

        // 3. Delete file
        for (String filePath : filePaths) {
            if (!S3CloudStorageClient.deleteObject(bucketName, String.format("%s/%s", tenantId, filePath))) {
                throw new CustomException(DELETE_FILE_FAILED, filePath, Constants.FILE_DELETE_FAILED);
            }
        }

        DeleteFilesOutDTO deleteFilesOutDTO = new DeleteFilesOutDTO();
        deleteFilesOutDTO.getDeletedFileInfos().addAll(filePaths);
        return deleteFilesOutDTO;
    }
}
