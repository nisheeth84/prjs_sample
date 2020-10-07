package jp.co.softbrain.esales.commons.repository;

import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingResultDTO;
import jp.co.softbrain.esales.commons.service.dto.GetSettingEmployeesResultDTO;

import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Notification Setting Repository Custom
 *
 * @author DatDV
 *
 */
@Repository
public interface NotificationSettingRepositoryCustom {
    /**
     * get Notification Setting
     *
     * @param employeeId : employeeId for getNotificationSetting
     * @param isNotification : isNotification for getNotificationSetting
     * @return List GetNotificationSettingResultDTO : List DTO out of API getNotificationSetting
     */
    List<GetNotificationSettingResultDTO> getNotificationSetting(Long employeeId , Boolean isNotification);

    /**
     * get Notification Setting default
     *
     * @param isNotification : isNotification for getNotificationSetting
     * @return List GetNotificationSettingResultDTO : List DTO out of API getNotificationSetting
     */
    List<GetNotificationSettingResultDTO> getNotificationSettingDefault(Boolean isNotification);
	
	 /**
     * Get all setting employees in Database
     * 
     * @param employeeIds List of employee Id
     * @param settingTime Time to start sending mail
     * @return {@link GetSettingEmployeesResultDTO}
     */
    List<GetSettingEmployeesResultDTO> getSettingEmployees(List<Long> employeeIds, Integer settingTime);
}
