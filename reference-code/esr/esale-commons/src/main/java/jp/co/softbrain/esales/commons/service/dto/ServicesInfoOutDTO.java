package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for output of getServicesInfo API
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ServicesInfoOutDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4949976986200285161L;
    private Integer serviceId;
    private String serviceName;
    private Integer serviceType;
    private String iconPath;
    private String servicePath;
    private Integer lookupAvailableFlag;
    private Integer relationAvailableFlag;
}
