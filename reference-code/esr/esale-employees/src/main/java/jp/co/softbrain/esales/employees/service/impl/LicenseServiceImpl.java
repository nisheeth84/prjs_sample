package jp.co.softbrain.esales.employees.service.impl;

import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepository;
import jp.co.softbrain.esales.employees.service.LicenseService;
import jp.co.softbrain.esales.employees.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.tenants.AvailableLicensePackage;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.vm.response.CheckInvalidLicenseResponse;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LicenseServiceImpl implements LicenseService {

    private static final String GET_AVAILABLE_LICENSE = "/public/api/get-available-license";

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmployeesPackagesRepository employeesPackagesRepository;

    @Override
    public CheckInvalidLicenseResponse checkInvalidLicense(String tenantName) {
        if (StringUtils.isEmpty(tenantName)) {
            tenantName = jwtTokenUtil.getTenantIdFromToken();
        }
        ContractSiteResponseDTO contractSiteResponseDTO = restOperationUtils.executeCallApi(
            Constants.PathEnum.TENANTS,
            GET_AVAILABLE_LICENSE + String.format("?%s=%s", "tenantName", URLEncoder.encode(tenantName, Charset.defaultCharset())),
            HttpMethod.GET,
            null,
            ContractSiteResponseDTO.class,
            null,
            tenantName
        );

        if (contractSiteResponseDTO.getErrors() != null && !contractSiteResponseDTO.getErrors().isEmpty()){
            List<Map<String, Object>> errorList = contractSiteResponseDTO.getErrors()
                .stream()
                .map(x -> Map.of(x.getErrorCode(), (Object) x.getErrorMessage()))
                .collect(Collectors.toList());
            throw new CustomRestException(errorList.get(0));
        }

        ContractSiteResponseDTO.GetAvailableLicenseResponse data = contractSiteResponseDTO.getData();
        if (data == null || data.getPackages() == null || data.getPackages().isEmpty()) {
            log.error("AvailableLicenseResponse is invalid");
            throw new CustomRestException("AvailableLicenseResponse is invalid", List.of());
        }
        Map<Long, String> availablePackageNames = data.getPackages().stream().collect(Collectors.toMap(
            AvailableLicensePackage::getPackageId,
            AvailableLicensePackage::getPackageName
        ));

        Map<Long, Integer> availableLicenses = data.getPackages().stream().collect(Collectors.toMap(
            AvailableLicensePackage::getPackageId,
            AvailableLicensePackage::getAvailablePackageNumber
        ));

        List<EmployeesPackageSumIdsDTO> usedPackageNumbers = employeesPackagesRepository.getSumEmployeePackage();
        Map<Long, Long> usedLicenses = usedPackageNumbers.stream().collect(Collectors
                .toMap(EmployeesPackageSumIdsDTO::getPackageId, EmployeesPackageSumIdsDTO::getCountPackageId));

        boolean isInvalidLicense = false;
        List<CheckInvalidLicenseResponse.PackageUsage> packageUsages = new ArrayList<>();
        for (Entry<Long, Long> licensePackage : usedLicenses.entrySet()) {
            Long usedPackageNumber = licensePackage.getValue();
            Integer availablePackageNumber = availableLicenses.getOrDefault(licensePackage.getKey(), 0);
            if (!isInvalidLicense && availablePackageNumber < usedPackageNumber) {
                isInvalidLicense = true;
            }
            CheckInvalidLicenseResponse.PackageUsage packageUsage = new CheckInvalidLicenseResponse.PackageUsage(
                    licensePackage.getKey(), availablePackageNames.get(licensePackage.getKey()), availablePackageNumber,
                    usedPackageNumber);
            packageUsages.add(packageUsage);
        }

        return new CheckInvalidLicenseResponse(packageUsages, isInvalidLicense);
    }
}
