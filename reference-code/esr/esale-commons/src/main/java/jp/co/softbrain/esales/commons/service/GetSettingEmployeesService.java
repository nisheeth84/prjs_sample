package jp.co.softbrain.esales.commons.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.employees.GetSettingEmployeeDataDTO;

/**
 * Service Interface for managing get setting employees
 */
@XRayEnabled
public interface GetSettingEmployeesService {

    /**
     * Get notification settings schedule, task, Milestone
     * @param employeeIds List of employee Id
     * @param settingTime Time to start sending mail
     * @return {@link GetSettingEmployeeDataDTO}
     */
    List<GetSettingEmployeeDataDTO> getSettingEmployees(List<Long> employeeIds, Integer settingTime);
}
