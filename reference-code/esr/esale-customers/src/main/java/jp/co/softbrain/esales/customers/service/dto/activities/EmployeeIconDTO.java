package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * EmployeeIconDTO for createUpdate
 *
 * @author HaiCN
 *
 */
@Data
@EqualsAndHashCode
public class EmployeeIconDTO implements Serializable{

    private static final long serialVersionUID = -1983614948277697350L;
    
    /**
     * icon file name
     */
    private String fileName;
    
    /**
     * icon file path
     */
    private String filePath;

    /**
     * url of icon
     */
    private String fileUrl;
    
    /**
     * status if icon
     */
    private String status;
}
