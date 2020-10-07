package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response from API get-available-license
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAvailableLicenseResponse implements Serializable {

    private static final long serialVersionUID = -723731170754667723L;

    private Integer status;

    private AvailableLicensePackageDTO data;

    private List<GetAvailableLicenseErrorDTO> errors;
}
