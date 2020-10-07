package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * FieldObject class
 * 
 * @author nguyenvanchien3
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class GetImportInitInfoSubType2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3487144610048430352L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldName
     */
    private String fieldName;
    
    /**
     * fieldLabel
     */
    private String fieldLabel;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
