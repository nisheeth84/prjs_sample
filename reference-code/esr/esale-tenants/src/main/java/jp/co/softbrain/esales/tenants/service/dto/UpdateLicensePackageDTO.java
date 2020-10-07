package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * UpdateLicensePackageDTO model
 *
 * @author tongminhcuong
 */
@Data
public class UpdateLicensePackageDTO implements Serializable {

    private static final long serialVersionUID = -3434922685025079817L;

    /**
     * Id of package
     */
    private Long packageId;

    /**
     * Number of available license
     */
    private Integer availablePackageNumber;
}
