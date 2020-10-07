package jp.co.softbrain.esales.employees.web.rest.vm.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckInvalidLicenseResponse implements Serializable {
    private static final long serialVersionUID = 1765695183266585477L;

    private List<PackageUsage> packages;

    private Boolean isInvalidLicense;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PackageUsage implements Serializable{
        private static final long serialVersionUID = 3148561397952169075L;
        private Long packageId;
        private String packageName;
        private Integer availablePackageNumber;
        private Long usedPackageNumber;
    }
}
