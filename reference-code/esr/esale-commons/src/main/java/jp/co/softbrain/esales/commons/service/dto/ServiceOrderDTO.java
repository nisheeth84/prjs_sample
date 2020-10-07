package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * ServiceOrderDTO
 *
 * @author ThaiVV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ServiceOrderDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8706546371768856146L;

    /**
     * menuServiceOrderId
     */
    private Long menuServiceOrderId;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * serviceId
     */
    private Long serviceId;

    /**
     * serviceName
     */
    private String serviceName;

    /**
     * serviceOrder
     */
    private Integer serviceOrder;
}
