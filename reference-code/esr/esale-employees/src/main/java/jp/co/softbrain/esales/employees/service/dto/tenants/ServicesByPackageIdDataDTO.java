package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for query get ServicesByPackageIds API
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicesByPackageIdDataDTO implements Serializable {

    private static final long serialVersionUID = 8448497858596710525L;

    private Long serviceId;

    private String serviceName;

    private String microServiceName;
}
