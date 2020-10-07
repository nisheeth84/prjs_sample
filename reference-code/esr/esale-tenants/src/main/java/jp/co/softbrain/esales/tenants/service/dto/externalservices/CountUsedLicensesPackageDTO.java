package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CountUsedLicensesPackageDTO
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CountUsedLicensesPackageDTO implements Serializable {

    private static final long serialVersionUID = -3656134868757746550L;

    /**
     * packageId
     */
    private Long packageId;

    /**
     * usedPackages
     */
    private Long usedPackages;
}
