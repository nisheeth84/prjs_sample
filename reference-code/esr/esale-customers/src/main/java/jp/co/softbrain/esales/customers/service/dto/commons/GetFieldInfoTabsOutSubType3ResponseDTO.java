package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Field Info Tabs
 * @author phamdongdong
 *
 */
@Data
@EqualsAndHashCode
public class GetFieldInfoTabsOutSubType3ResponseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 5129797645315187480L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldOrder
     */
    private Integer fieldOrder;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * fieldLabel
     */
    private String fieldLabel;
    
    /**
     * fieldType
     */
    private Integer fieldType;

    /**
     * list fieldItem
     */
    private List<GetFieldInfoTabsOutSubType1DTO> fieldItem;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

}
