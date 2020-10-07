package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class CreateFeedBackStatusOutDTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 2506617553424239955L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * tenantName
     */
    private String tenantName;

}
