package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * FeedbackStatusOpenDTO
 * 
 * @author DatDV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FeedbackStatusOpenDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6163268946088003981L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * tenantName
     */
    private String tenantName;
}
