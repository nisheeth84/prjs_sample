package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.ServicesInfo}
 * entity.
 *
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ServicesInfoDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -7295550306128528971L;

    private Integer serviceId;

    private String serviceName;

    private Integer serviceType;

    private Integer serviceOrder;

    private Boolean isAvailable;
    
    private String iconPath;
    
    private String servicePath;
    
    private Integer lookupAvailableFlag;
    
    private Integer relationAvailableFlag;
}
