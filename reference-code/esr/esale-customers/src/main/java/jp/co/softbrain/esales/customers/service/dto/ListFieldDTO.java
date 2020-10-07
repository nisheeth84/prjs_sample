package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutSubType18DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class ListFieldDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2295863204492388682L;

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
    private String fieldType;

    /**
     * fieldItem
     */
    private List<FieldItemDTO> fieldItem;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
