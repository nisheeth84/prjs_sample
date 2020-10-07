package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomerLayoutPersonalRequestDTO
 */
@Data
@EqualsAndHashCode
public class CustomerLayoutPersonalRequestDTO implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7251520328133843796L;

    /**
     * extensionBelong
     */
    private Integer extensionBelong;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId;

}
