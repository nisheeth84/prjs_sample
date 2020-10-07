package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * DTO for query get ServicesByPackageIds API
 *
 * @author lehuuhoa
 */
@Data
public class ServicesByPackageIdDataDTO implements Serializable {

    private static final long serialVersionUID = -8309245442736355574L;

    private Long serviceId;

    private String serviceName;

    private String microServiceName;
}
