package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AvailableLicensePackageDTO
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableLicensePackageDTO implements Serializable {

    private static final long serialVersionUID = -213751547405806240L;

    private List<AvailableLicensePackage> packages;
}
