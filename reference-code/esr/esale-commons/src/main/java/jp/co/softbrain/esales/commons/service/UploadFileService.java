package jp.co.softbrain.esales.commons.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.S3UploadResponse;

/**
 * Service Interface for Upload File
 */
@XRayEnabled
public interface UploadFileService {
    
    /**
     * copyFileToS3 : copyFileToS3
     * 
     * @param fileName : file name
     * @param fileExtension : file extension
     * @param content : content
     * @return String : url file
     */
    public String copyFileToS3(String fileName, String fileExtension, String content);

    /**
     * uploadFileToS3 : Upload file to S3 Amz Cloud
     * 
     * @param part
     * @param importBelong
     * @return
     * @throws IOException
     */
    S3UploadResponse uploadFileToS3(MultipartFile part, Integer importBelong) throws IOException;
}
