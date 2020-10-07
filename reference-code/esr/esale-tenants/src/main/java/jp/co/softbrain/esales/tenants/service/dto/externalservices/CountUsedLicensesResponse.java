package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Out DTO class for API Count Used Licenses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CountUsedLicensesResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8099023622629950012L;

    /**
     * packages
     */
    private List<CountUsedLicensesPackageDTO> packages;

}
