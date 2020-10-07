package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.util.CollectionUtils;
import com.google.common.collect.ImmutableList;

import jp.co.softbrain.esales.commons.repository.NotificationSettingRepositoryCustom;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.GetSettingEmployeesService;
import jp.co.softbrain.esales.commons.service.dto.GetEmployeesByIdsRequest;
import jp.co.softbrain.esales.commons.service.dto.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.commons.service.dto.GetSettingEmployeesResultDTO;
import jp.co.softbrain.esales.commons.service.dto.employees.EmployeeInfoDTO;
import jp.co.softbrain.esales.commons.service.dto.employees.GetSettingEmployeeDataDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Service Impl for API get setting employees
 *
 * @author lehuuhoa
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class GetSettingEmployeesServiceImpl implements GetSettingEmployeesService {

    private static final String VALIDATE_FAIL = "Param [settingTime] is null.";

    private static final String PARAM_SETTING_TIME = "settingTime";
    private static final String API_NAME_GET_EMPLOYEES_BY_IDS = "get-employees-by-ids";

    private static final int SCHEDULE_NOTIFICATION_TYPE = 1;
    private static final int TASK_NOTIFICATION_TYPE = 2;
    private static final int MILESTONE_NOTIFICATION_TYPE = 3;

    private static final List<Integer> EMPLOYEE_NOTIFICATION_TYPES = ImmutableList.of(
            SCHEDULE_NOTIFICATION_TYPE,
            TASK_NOTIFICATION_TYPE,
            MILESTONE_NOTIFICATION_TYPE);

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private NotificationSettingRepositoryCustom notificationSettingRepository;

    /**
     * @see GetSettingEmployeesService#getSettingEmployees(List, Integer)
     */
    @Override
    public List<GetSettingEmployeeDataDTO> getSettingEmployees(List<Long> employeeIds, Integer settingTime) {
        // 1. Validate parameters require
        if (settingTime == null) {
            throw new CustomException(VALIDATE_FAIL, PARAM_SETTING_TIME, Constants.RIQUIRED_CODE);
        }

        try {
            // Get employee setting information
            List<GetSettingEmployeesResultDTO> empSettingList = notificationSettingRepository
                    .getSettingEmployees(employeeIds, settingTime);

            List<Long> settingEmpIdList = empSettingList.stream()
                    .map(GetSettingEmployeesResultDTO::getEmployeeId)
                    .distinct()
                    .collect(Collectors.toList());

            // Get employee information
            List<EmployeeInfoDTO> employeeInfoDTOs = getEmployeesByIds(settingEmpIdList);

            // response API
            List<GetSettingEmployeeDataDTO> settingEmployeeDataDTOs = new ArrayList<>();
            for (EmployeeInfoDTO employeeInfoDTO : employeeInfoDTOs) {
                GetSettingEmployeeDataDTO settingEmployeeDataDTO = new GetSettingEmployeeDataDTO();
                settingEmployeeDataDTO.setEmployeeId(employeeInfoDTO.getEmployeeId());
                settingEmployeeDataDTO.setEmployeeName(employeeInfoDTO.getEmployeeName());

                settingEmployeeDataDTO.setLanguageCode(employeeInfoDTO.getLanguage().getLanguageCode());

                // notification_subtype = 1, 2, 3
                List<GetSettingEmployeesResultDTO> noticeResult = empSettingList.stream()
                        .filter(empSetting -> employeeInfoDTO.getEmployeeId().equals(empSetting.getEmployeeId()))
                        .filter(empSetting -> EMPLOYEE_NOTIFICATION_TYPES
                                .contains(empSetting.getNotificationSubtype().intValue()))
                        .collect(Collectors.toList());

                if (!noticeResult.isEmpty()) {
                    for (GetSettingEmployeesResultDTO employeesResultDTO : noticeResult) {
                        Long notificationType = employeesResultDTO.getNotificationSubtype();
                        if (notificationType == SCHEDULE_NOTIFICATION_TYPE) {
                            settingEmployeeDataDTO.setIsNoticeSchedule(employeesResultDTO.getIsNotification());
                        } else if (notificationType == TASK_NOTIFICATION_TYPE) {
                            settingEmployeeDataDTO.setIsNoticeTask(employeesResultDTO.getIsNotification());
                        } else if (notificationType == MILESTONE_NOTIFICATION_TYPE) {
                            settingEmployeeDataDTO.setIsNoticeMilestone(employeesResultDTO.getIsNotification());
                        }
                    }
                    settingEmployeeDataDTO.setMail(noticeResult.get(0).getEmail());
                    settingEmployeeDataDTOs.add(settingEmployeeDataDTO);
                }
            }

            return settingEmployeeDataDTOs;

        } catch (Exception e) {
            throw new CustomException(e.getMessage());
        }
    }

    /**
     * Call service get employees by id
     *
     * @param employeeIds List employee id
     * @return List {@link EmployeeInfoDTO}
     */
    private List<EmployeeInfoDTO> getEmployeesByIds(List<Long> employeeIds) {
        if (CollectionUtils.isNullOrEmpty(employeeIds)) {
            return new ArrayList<>();
        }
        try {
            GetEmployeesByIdsRequest getEmployeesByIdsRequest = new GetEmployeesByIdsRequest(employeeIds);
            GetEmployeesByIdsResponse response = restOperationUtils.executeCallApi(
                    Constants.PathEnum.EMPLOYEES,
                    API_NAME_GET_EMPLOYEES_BY_IDS,
                    HttpMethod.POST,
                    getEmployeesByIdsRequest,
                    GetEmployeesByIdsResponse.class,
                    SecurityUtils.getTokenValue().orElse(null),
                    jwtTokenUtil.getTenantIdFromToken());

            return response.getEmployees();
        } catch (IllegalStateException e) {
            throw new CustomException(e.getMessage());
        }
    }
}
