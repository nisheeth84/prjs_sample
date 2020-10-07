package jp.co.softbrain.esales.employees.service.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * check invalid license
 */
@Data
public class CheckInvalidLicenseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8691614760320114905L;

    private List<InvalidLicensePackageDTO> packages;
    private Boolean isInvalidLicense;
}
