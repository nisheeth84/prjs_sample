package jp.co.softbrain.esales.employees.web.rest.vm;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepository;
import jp.co.softbrain.esales.employees.service.dto.CheckInvalidLicenseDTO;
import jp.co.softbrain.esales.employees.service.dto.CountUsedLicensesSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.InvalidLicensePackageDTO;
import jp.co.softbrain.esales.employees.service.dto.tenants.AvailableLicensePackage;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetAvailableLicenseResponse;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Rest API for Account
 */
@RestController
public class CheckInvalidLicenseResource {

    private static final String TENANT_NAME_PARAM = "tenantName";

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmployeesPackagesRepository employeesPackagesRepository;

    /**
     * API check invalid license
     *
     * @return
     */
    @PostMapping(path = "api/check-invalid-license")
    public ResponseEntity<CheckInvalidLicenseDTO> checkInvalidLicense() {
        CheckInvalidLicenseDTO checkInvalidLicenseDTO = new CheckInvalidLicenseDTO();

        // 2. get available license package
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        MultiValueMap<String, String> getAvailableLicenseParams = new LinkedMultiValueMap<>();
        getAvailableLicenseParams.add(TENANT_NAME_PARAM, tenantName);
        GetAvailableLicenseResponse getLicenseResponse = restOperationUtils.executeCallGetPublicApi(
            Constants.PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_AVAILABLE_LICENSE, getAvailableLicenseParams,
            tenantName, GetAvailableLicenseResponse.class);

        Map<Long, AvailableLicensePackage> mapAvailableLicensePackage = new HashMap<>();
        if (getLicenseResponse != null && getLicenseResponse.getData() != null
            && getLicenseResponse.getData().getPackages() != null) {
            mapAvailableLicensePackage = getLicenseResponse.getData().getPackages().stream()
                .collect(Collectors.toMap(AvailableLicensePackage::getPackageId, Function.identity()));
        }

        // 3. get used package
        List<CountUsedLicensesSubType1DTO> usedLicenses = employeesPackagesRepository.countUsedLicenses();

        // 4. check number valid license
        List<InvalidLicensePackageDTO> packages = new ArrayList<>();
        for (CountUsedLicensesSubType1DTO usedLicense : usedLicenses) {
            AvailableLicensePackage availableLicensePackage = mapAvailableLicensePackage.get(usedLicense.getPackageId());
            if (availableLicensePackage != null) {
                if (availableLicensePackage.getAvailablePackageNumber() >= usedLicense.getUsedPackages()) {
                    checkInvalidLicenseDTO.setIsInvalidLicense(true);
                    return ResponseEntity.ok(checkInvalidLicenseDTO);
                } else {
                    InvalidLicensePackageDTO invalidLicensePackageDTO = new InvalidLicensePackageDTO();
                    invalidLicensePackageDTO.setPackageId(availableLicensePackage.getPackageId());
                    invalidLicensePackageDTO.setPackageName(availableLicensePackage.getPackageName());
                    invalidLicensePackageDTO.setAvailablePackageNumber(availableLicensePackage.getAvailablePackageNumber());
                    invalidLicensePackageDTO.setUsedPackageNumber(usedLicense.getUsedPackages());

                    packages.add(invalidLicensePackageDTO);
                }
            } else {
                checkInvalidLicenseDTO.setIsInvalidLicense(true);
                return ResponseEntity.ok(checkInvalidLicenseDTO);
            }
        }
        checkInvalidLicenseDTO.setPackages(packages);
        checkInvalidLicenseDTO.setIsInvalidLicense(false);

        return ResponseEntity.ok(checkInvalidLicenseDTO);
    }
}
