package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * AttachedFileDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class AttachedFileDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1082848395886887876L;

    /**
     * fileName
     */
    private String fileName;

    /**
     * filePath
     */
    private String filePath;

}
