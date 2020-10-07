package jp.co.softbrain.esales.commons.repository.impl;

import jp.co.softbrain.esales.commons.repository.NotificationSettingRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingResultDTO;
import jp.co.softbrain.esales.commons.service.dto.GetSettingEmployeesResultDTO;

import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Notification Setting Repository Custom Impl
 *
 * @author DatDV
 */
@Repository
public class NotificationSettingRepositoryCustomImpl extends RepositoryCustomUtils implements NotificationSettingRepositoryCustom {

    /**
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.impl.NotificationSettingRepositoryCustomImpl
     * NotificationSettingRepositoryCustom#getNotificationSetting(java.
     * lang.Long , java.lang.Boolean)
     */
    @Override
    public List<GetNotificationSettingResultDTO> getNotificationSetting(Long employeeId, Boolean isNotification) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT nst.notification_type,");
        sql.append("     nst.notification_subtype,");
        sql.append("     nst.is_notification,");
        sql.append("     nst.notification_subtype_name,");
        sql.append("     notifs.notification_type_name,");
        sql.append("     motie.email, ");
        sql.append("     nts.notification_time, ");
        sql.append("     nts.employee_id ");
        sql.append("FROM notification_detail_setting nst ");
        sql.append("INNER JOIN notification_type_setting notifs ");
        sql.append("     ON notifs.employee_id = nst.employee_id ");
        sql.append("     AND notifs.notification_type = nst.notification_type ");
        sql.append("INNER JOIN notification_setting nts ");
        sql.append("     ON notifs.employee_id = nts.employee_id ");
        sql.append("INNER JOIN notification_email motie ");
        sql.append("     ON nts.employee_id = motie.employee_id ");
        sql.append("WHERE 1=1 ");
        if(employeeId != null){
            sql.append("AND nst.employee_id = :employeeId ");
        }
        if(isNotification != null){
            sql.append("AND nst.is_notification = :isNotification ");
        }
        Map<String , Object> parameters = new HashMap<>();
        if(employeeId != null){
            parameters.put("employeeId" , employeeId);
        }
        if(isNotification != null){
            parameters.put("isNotification" , isNotification);
        }
        return this.getResultList(sql.toString() , "GetNotificationSettingResult" , parameters);
    }

    /**
     * @see NotificationSettingRepositoryCustom#getNotificationSettingDefault(Boolean)
     */
    @Override
    public List<GetNotificationSettingResultDTO> getNotificationSettingDefault(Boolean isNotification) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("     nst.notification_type,");
        sql.append("     nst.notification_subtype,");
        sql.append("     nst.is_notification,");
        sql.append("     nst.notification_subtype_name,");
        sql.append("     notifs.notification_type_name,");
        sql.append("     null AS email, ");
        sql.append("     null AS notification_time, ");
        sql.append("     null AS employee_id ");
        sql.append("FROM notification_detail_setting nst ");
        sql.append("INNER JOIN notification_type_setting notifs ");
        sql.append("     ON notifs.employee_id = nst.employee_id ");
        sql.append("     AND notifs.notification_type = nst.notification_type ");
        sql.append("WHERE nst.employee_id = :employeeId ");
        if(isNotification != null){
            sql.append("AND nst.is_notification = :isNotification ");
        }
        Map<String , Object> parameters = new HashMap<>();
        parameters.put("employeeId" , 0);
        if(isNotification != null){
            parameters.put("isNotification" , isNotification);
        }
        return this.getResultList(sql.toString() , "GetNotificationSettingResult" , parameters);
    }
    
    /**
     * @see NotificationSettingRepositoryCustom#getSettingEmployees(List,
     *      Integer)
     */
    @Override
    public List<GetSettingEmployeesResultDTO> getSettingEmployees(List<Long> employeeIds, Integer settingTime) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("     nds.employee_id,");
        sql.append("     nds.notification_type,");
        sql.append("     nds.notification_subtype,");
        sql.append("     nds.is_notification,");
        sql.append("     nds.notification_subtype_name,");
        sql.append("     nts.notification_type_name,");
        sql.append("     ne.email,");
        sql.append("     ns.notification_time ");
        sql.append("FROM notification_detail_setting nds ");
        sql.append("INNER JOIN notification_setting ns ");
        sql.append("     ON ns.employee_id = nds.employee_id ");
        sql.append("INNER JOIN notification_email ne ");
        sql.append("     ON ne.employee_id = ns.employee_id ");
        sql.append("INNER JOIN notification_type_setting nts ");
        sql.append("     ON nts.employee_id = nds.employee_id ");
        sql.append("     AND  nts.notification_type = nds.notification_type ");
        sql.append("WHERE ns.notification_time = :settingTime ");
        sql.append("     AND nts.notification_type = 9 ");
        if (!CollectionUtils.isEmpty(employeeIds)) {
            sql.append(" AND nds.employee_id IN (:employeeIds )");
        }
        Map<String, Object> parameters = new HashMap<>();
        if (!CollectionUtils.isEmpty(employeeIds)) {
            parameters.put("employeeIds", employeeIds);
        }

        parameters.put("settingTime", settingTime);

        return this.getResultList(sql.toString(), "getSettingEmployeesResult", parameters);
    }
}
