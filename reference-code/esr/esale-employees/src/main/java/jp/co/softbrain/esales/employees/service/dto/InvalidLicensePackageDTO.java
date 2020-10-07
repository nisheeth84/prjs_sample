package jp.co.softbrain.esales.employees.service.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * CheckInvalidLicensePackageDTO
 */
@Data
public class InvalidLicensePackageDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1250656055655131708L;

    /**
     * packageId
     */
    private Long packageId;

    /**
     * packageName
     */
    private String packageName;

    /**
     * availablePackageNumber
     */
    private Integer availablePackageNumber;

    /**
     * usedPackageNumber
     */
    private Long usedPackageNumber;
}
