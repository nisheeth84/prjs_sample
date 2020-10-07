package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Upload Response DTO
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class S3UploadResponse  extends BaseDTO{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4501211196738447493L;

    /**
     * file Name
     */
    private String fileName;

    /**
     * presigned URL
     */
    private String presignedURL;
}
