package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CustomerPhotoDTO for intergrateCustomer
 * 
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CustomerPhotoDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5825783435539695361L;

    /**
     * fileName in customer
     */
    private String photoFileName;

    /**
     * filePath in customer
     */
    private String photoFilePath;

    /**
     * fileUrl
     */
    private String fileUrl;

}
