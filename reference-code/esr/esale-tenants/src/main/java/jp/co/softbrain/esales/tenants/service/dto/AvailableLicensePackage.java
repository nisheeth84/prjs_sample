package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * AvailableLicensePackage DTO
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class AvailableLicensePackage implements Serializable {

    private static final long serialVersionUID = 2508409620279599959L;

    /**
     * The id of Package
     */
    private Long packageId;

    /**
     * The name of Package
     */
    private String packageName;

    /**
     * Number of license
     */
    private Integer availablePackageNumber;
}
