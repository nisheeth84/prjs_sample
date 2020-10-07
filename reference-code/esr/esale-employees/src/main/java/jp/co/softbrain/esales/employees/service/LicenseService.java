package jp.co.softbrain.esales.employees.service;

import jp.co.softbrain.esales.employees.web.rest.vm.response.CheckInvalidLicenseResponse;

public interface LicenseService {

    CheckInvalidLicenseResponse checkInvalidLicense(String tenantName);

}
