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
public class PackagesTenantDTO implements Serializable {

    private static final long serialVersionUID = -8355558910644722226L;

    private Long mPackageId;

    private Long childId;
}
