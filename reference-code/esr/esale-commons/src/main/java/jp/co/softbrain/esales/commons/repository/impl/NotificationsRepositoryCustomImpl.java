package jp.co.softbrain.esales.commons.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.repository.NotificationsRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsResultDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;

/**
 * Notifications Repository Custom Impl
 *
 * @author DatDV
 */
@Repository
public class NotificationsRepositoryCustomImpl extends RepositoryCustomUtils implements NotificationsRepositoryCustom {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public List<GetNotificationsResultDTO> getNotifications(Long employeeId, Long limit, String textSearch,
            List<Long> notificationType, List<Long> notificationSubtype) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("     nta.employee_id, ");
        sql.append("     nta.created_notification_date, ");
        sql.append("     nta.confirm_notification_date, ");
        sql.append("     ntinf.notification_id, ");
        sql.append("     ntinf.message, ");
        sql.append("     ntinf.icon, ");
        sql.append("     ntinf.timeline_id, ");
        sql.append("     ntinf.activity_id, ");
        sql.append("     ntinf.customer_id, ");
        sql.append("     ntinf.business_card_id, ");
        sql.append("     ntinf.schedule_id, ");
        sql.append("     ntinf.task_id, ");
        sql.append("     ntinf.milestone_id, ");
        sql.append("     ntinf.import_id, ");
        sql.append("     ntinf.notification_sender, ");
        sql.append("     nta.updated_date ");
        sql.append("FROM notification_information ntinf ");
        sql.append("INNER JOIN notification_address nta ");
        sql.append("    ON ntinf.notification_id = nta.notification_id ");
        sql.append("WHERE 1=1 ");
        if (employeeId != null) {
            sql.append("AND nta.employee_id = :employeeId ");
            parameters.put("employeeId", employeeId);
        }
        if (!notificationType.isEmpty()) {
            sql.append("AND ntinf.notification_type IN (:notificationType) ");
            parameters.put("notificationType", notificationType);
        }
        if (!notificationSubtype.isEmpty()) {
            sql.append("AND ntinf.notification_subtype IN (:notificationSubtype) ");
            parameters.put("notificationSubtype", notificationSubtype);
        }
        if (textSearch != null && !textSearch.equals("")) {
            String search = "%" + escapeSql(textSearch) + "%";
            sql.append("AND ntinf.message ->> '");
            sql.append(jwtTokenUtil.getLanguageCodeFromToken());
            sql.append("' ");
            sql.append(" LIKE  :textSearch ");
            parameters.put("textSearch", search);
        }
        sql.append("ORDER BY nta.confirm_notification_date DESC , ");
        sql.append("nta.created_notification_date DESC ");
        if (limit == null) {
            limit = 50l;
        }
        sql.append("LIMIT :limit");
        parameters.put("limit", limit);
        return this.getResultList(sql.toString(), "GetNotificationResult", parameters);
    }

    private static String escapeSql(String input) {
        return input.trim().replace("/", "\\/").replace("_", "\\_").replace("%", "\\%");
    }

    @Override
    public Long countNotifications(Long employeeId) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT COUNT(*) ");
        sql.append("FROM notification_address nta ");
        sql.append("    nta.employee_id = :employeeId ");
        sql.append("AND nta.confirm_notification_date IS NULL ");
        parameters.put("employeeId", employeeId);
        return Long.parseLong(this.getSingleResult(sql.toString(), parameters));
    }

}
