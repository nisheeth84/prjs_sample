/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author phamminhphu
 *
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType7DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8872538000406452756L;

    /**
     * photoFileName
     */
    private String fileName;

    /**
     * photoFilePath
     */
    private String filePath;

}
