package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Import Mapping Class
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class GetImportInitInfoSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4465604791121461008L;

    /**
     * importMappingId
     */
    private Long importMappingId;

    /**
     * importMappingName
     */
    private String importMappingName;

}
