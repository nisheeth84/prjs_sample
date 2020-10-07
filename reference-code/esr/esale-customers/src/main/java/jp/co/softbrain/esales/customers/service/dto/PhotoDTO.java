package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * PhotoDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class PhotoDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6334803684415115601L;

    /**
     * fileName
     */
    private String fileName;

    /**
     * filePath
     */
    private String filePath;

}
