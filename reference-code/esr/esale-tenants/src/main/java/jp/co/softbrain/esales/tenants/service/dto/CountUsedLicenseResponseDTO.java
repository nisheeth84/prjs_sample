package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Response DTO of API countUsedLicense
 *
 * @author tongminhcuong
 */
@Data
public class CountUsedLicenseResponseDTO implements Serializable {

    private static final long serialVersionUID = 2629757572427910435L;

    private List<CountLicensePackageDTO> packages;
}
