package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response Sub DTO for API createList
 *
 * @author Luu Van Tuan
 */
@Data
@EqualsAndHashCode
public class CreateMasterScenarioSubTypeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -874233791980149199L;

    /**
     * milestoneName
     */
    private String milestoneName;

    /**
     * displayOrder
     */
    private Integer displayOrder;

}
