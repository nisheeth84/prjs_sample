package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for query findPackagesTenant.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicesPackagesDTO implements Serializable {

    private static final long serialVersionUID = -8355558910644733336L;

    private Long mPackageId;

    private String packageName;

    private Long childId;

    private Long mServiceId;

    private String serviceName;

    private String microServiceName;
}
