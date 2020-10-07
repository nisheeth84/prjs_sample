package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

/**
 * Request DTO for API upload files to s3
 *
 * @author tongminhcuong
 */
@Data
public class UploadFilesToS3Request implements Serializable {

    private static final long serialVersionUID = 8045566707080559236L;

    private String bucketName;

    private String folderPath;

    private List<MultipartFile> files;
}
