package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Master Stands In DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class MasterStandsInDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1231232131231312321L;

    /**
     * masterStandId
     */
    private Long masterStandId;

    /**
     * masterStandName
     */
    private String masterStandName;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * displayOrder
     */
    private Integer displayOrder;
    
    /**
     * updatedDate
     */
    private Instant updatedDate;

}
