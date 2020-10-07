package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO for the Positions domain
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PositionsDTO extends BaseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1130715389218958387L;

    /**
     * positionId
     */
    private Long positionId;

    /**
     * The Name
     */
    private String positionName;

    /**
     * The use status
     */
    private Boolean isAvailable;

    /**
     * The display order
     */
    private Integer positionOrder;

}
