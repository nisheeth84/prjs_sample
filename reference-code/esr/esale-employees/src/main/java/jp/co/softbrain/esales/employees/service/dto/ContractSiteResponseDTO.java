package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.tenants.AvailableLicensePackage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity of contract APIs
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContractSiteResponseDTO implements Serializable {

    private static final long serialVersionUID = -213128471858330838L;

    private int status;

    private GetAvailableLicenseResponse data;

    private List<ContractSiteErrorDataDTO> errors;

    @Data
    public static class GetAvailableLicenseResponse {
        private List<AvailableLicensePackage> packages;
    }
}
