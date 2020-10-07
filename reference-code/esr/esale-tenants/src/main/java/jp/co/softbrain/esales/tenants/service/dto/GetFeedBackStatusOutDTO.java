package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetFeedBackStatusOutDTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -8387571463906629951L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * tenantName
     */
    private String tenantName;
}
