package jp.co.softbrain.esales.commons.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jp.co.softbrain.esales.commons.repository.AccessLogRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.FilterConditionsDTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsInDTO;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;
import jp.co.softbrain.esales.commons.service.dto.ResultExportDataAccessLogsDTO;
import jp.co.softbrain.esales.commons.service.dto.ResultGetDataAccessLogsDTO;

/**
 * Access Log Repository Custom Impl
 *
 * @author DatDV
 */
@Repository
public class AccessLogRepositoryCustomImpl extends RepositoryCustomUtils implements AccessLogRepositoryCustom {

    private static final String FROM_TABLE = "FROM access_log acl ";

    private static final String WHERE = "WHERE 1=1 ";

    private static final String SELECT_TABLE = "SELECT ";

    private static final String DATEFROM_KEY = "dateFrom";

    private static final String DATETO_KEY = "dateTo";

    private static final String SEARCH_LOCAL_KEY = "searchLocal";

    private static final String ACCESS_LOGS_DATETIME = "     acl.content ->> 'date_time' AS date_time, ";

    private static final String ACL = "acl.content ->>";

    private static final String AND = "AND";
    
    private static final String LIKE_QUERY = "AND ((acl.content ->> 'additional_information' LIKE :searchLocal)) ";

    /**
     * get Header Access Logs
     *
     * @return java.util.List<java.lang.String>
     */
    @Override
    public List<String> getHeaderAccessLogs() {
        StringBuilder sql = new StringBuilder();
        sql.append(SELECT_TABLE);
        sql.append("     DISTINCT(jsonb_object_keys(acl.\"content\")) ");
        sql.append(FROM_TABLE);
        sql.append(WHERE);
        sql.append("ORDER BY jsonb_object_keys(acl.\"content\") ASC");
        return this.getResultList(sql.toString());
    }

    /**
     * getAccessLogs
     *
     * @param accessLog : date from in api get access logs
     * @return List<ResultGetDataAccessLogsDTO> : lits DTO out of API get access
     *         logs
     */
    @Override
    public List<ResultGetDataAccessLogsDTO> getAccessLogs(GetAccessLogsInDTO accessLog) {
        StringBuilder sql = new StringBuilder();
        Map<String, Object> parameter = new HashMap<>();
        sql.append(SELECT_TABLE);
        sql.append("     acl.access_log_id, ");
        sql.append(ACCESS_LOGS_DATETIME);
        sql.append("     acl.content ->> 'employee_id' AS employee_id, ");
        sql.append("     acl.content ->> 'account_name' AS account_name, ");
        sql.append("     acl.content ->> 'ip_address' AS ip_address, ");
        sql.append("     acl.content ->> 'event' AS event, ");
        sql.append("     acl.content ->> 'result' AS result, ");
        sql.append("     acl.content ->> 'error_information' AS error_information, ");
        sql.append("     acl.content ->> 'entity_id' AS entity_id, ");
        sql.append("     acl.content ->> 'additional_information' AS additional_information ");
        sql.append(FROM_TABLE);
        sql.append(WHERE);

        setSqlStringCast(accessLog, sql, parameter);
        if (accessLog.getFilterConditions() != null && !accessLog.getFilterConditions().isEmpty()) {
            conditionFilter(accessLog.getFilterConditions(), sql);
        }

        if (accessLog.getOrderBy() != null && !accessLog.getOrderBy().isEmpty()) {
            sql.append("ORDER BY ");
            int i = 0;
            for (OrderByDTO order : accessLog.getOrderBy()) {
                String key = "" + ACL + " '" + order.getKey() + "'";
                if (i == 0) {
                    sql.append(key);
                    sql.append(" ");
                    sql.append(order.getValue());
                } else {
                    sql.append(", ");
                    sql.append(key);
                    sql.append(" ");
                    sql.append(order.getValue());
                }
                i++;
            }
        }

        if (accessLog.getLimit() != null) {
            sql.append(" LIMIT :limit ");
            parameter.put("limit", accessLog.getLimit());
        }
        if (accessLog.getOffset() != null) {
            sql.append(" OFFSET  :offset ");
            parameter.put("offset", accessLog.getOffset());
        }
        return this.getResultList(sql.toString(), "getResultListAccessLogs", parameter);
    }

    /**
     * conditionFilter : filter with condition
     * 
     * @param filterConditions : list filter conditions
     * @param sql : sql query
     */
    private void conditionFilter(List<FilterConditionsDTO> filterConditions, StringBuilder sql) {
        for (FilterConditionsDTO filter : filterConditions) {
            if (filter.getFieldName().equals("employee_id") || filter.getFieldName().equals("entity_id")) {
                JsonElement jelement = new JsonParser().parse(filter.getFieldValue());
                JsonObject jobject = jelement.getAsJsonObject();
                String from = jobject.get("from").getAsString();
                String to = jobject.get("to").getAsString();
                String key = "" + ACL + " '" + filter.getFieldName() + "' AS INTEGER)";
                if (!StringUtils.isBlank(from)) {
                    sql.append(" " + AND + " ");
                    sql.append("CAST(");
                    sql.append(key);
                    sql.append(" >= ");
                    sql.append(from);
                }
                if (!StringUtils.isBlank(to)) {
                    sql.append(" " + AND + " ");
                    sql.append("CAST(");
                    sql.append(key);
                    sql.append(" <= ");
                    sql.append(to);
                }
            } else {
                String key = "" + ACL + " '" + filter.getFieldName() + "'";
                String value = "'" + filter.getFieldValue() + "'";
                sql.append(" " + AND + " ");
                sql.append(key);
                sql.append(" = ");
                sql.append(value);
                sql.append(" ");
            }
        }
    }

    /**
     * setSqlStringCast
     *
     * @param accessLog
     * @param sql
     * @param parameter
     */
    private void setSqlStringCast(GetAccessLogsInDTO accessLog, StringBuilder sql, Map<String, Object> parameter) {
        if (!StringUtils.isEmpty(accessLog.getDateFrom()) || !StringUtils.isEmpty(accessLog.getDateTo())) {
            sql.append("AND (");
        }
        if (!StringUtils.isEmpty(accessLog.getDateFrom())) {
            sql.append(" CAST(acl.content ->> 'date_time' AS date) >= :dateFrom ");
            parameter.put(DATEFROM_KEY, accessLog.getDateFrom());
        }
        if (!StringUtils.isEmpty(accessLog.getDateFrom()) && !StringUtils.isEmpty(accessLog.getDateTo())) {
            sql.append("AND");
        }
        if (!StringUtils.isEmpty(accessLog.getDateTo())) {
            sql.append(" CAST(acl.content ->> 'date_time' AS date) <= :dateTo ");
            parameter.put(DATETO_KEY, accessLog.getDateTo());
        }
        if (!StringUtils.isEmpty(accessLog.getDateFrom()) || !StringUtils.isEmpty(accessLog.getDateTo())) {
            sql.append(") ");
        }
        if (!StringUtils.isEmpty(accessLog.getSearchLocal())) {
            sql.append(LIKE_QUERY);
            parameter.put(SEARCH_LOCAL_KEY, accessLog.getSearchLocal());
        }
        if (accessLog.getIsDefaultSort() != null && accessLog.getIsDefaultSort().equals(false)) {
            for (int i = 0; i < accessLog.getOrderBy().size(); i++) {
                sql.append(LIKE_QUERY);
                parameter.put(SEARCH_LOCAL_KEY, accessLog.getSearchLocal());
            }
        }
    }

    /**
     * export access logs
     *
     * @param dateFrom : date from in api export access logs
     * @param dateTo : date to in api export access logs
     * @param searchLocal : search local in api export access logs
     * @param filterConditions : list DTO filter of API export access logs
     * @param orderBy : list DTO sort of API export access logs
     * @return List<ResultExportDataAccessLogsDTO> : list DTO out of API get
     *         access logs
     */
    @Override
    public List<ResultExportDataAccessLogsDTO> exportAccessLogs(String dateFrom, String dateTo, String searchLocal,
            List<FilterConditionsDTO> filterConditions, List<OrderByDTO> orderBy) {
        StringBuilder sql = new StringBuilder();
        Map<String, Object> parameter = new HashMap<>();
        sql.append(SELECT_TABLE);
        sql.append("     acl.content ->> 'event' AS event, ");
        sql.append("     acl.content ->> 'ip_address'   AS ip_address, ");
        sql.append(ACCESS_LOGS_DATETIME);
        sql.append("     acl.content ->> 'entity_id' AS entity_id, ");
        sql.append("     acl.content ->> 'result' AS result, ");
        sql.append("     acl.content ->> 'additional_information' AS additional_information, ");
        sql.append("     acl.content ->> 'error_information' AS error_information, ");
        sql.append("     acl.content ->> 'account_name' AS account_name ");
        sql.append(FROM_TABLE);
        sql.append(WHERE);

        setParamCast(dateFrom, dateTo, searchLocal, sql, parameter);

        if (filterConditions != null && !filterConditions.isEmpty()) {
            for (FilterConditionsDTO filter : filterConditions) {
                String key = "acl.content ->> '" + filter.getFieldName() + "'";
                String value = "'" + filter.getFieldValue() + "'";
                sql.append(" " + AND + " ");
                sql.append(key);
                sql.append(" = ");
                sql.append(value);
                sql.append(" ");
            }
        }

        if (orderBy != null && !orderBy.isEmpty()) {
            sql.append("ORDER BY ");
            int i = 0;
            for (OrderByDTO order : orderBy) {
                String key = "acl.content ->> '" + order.getKey() + "'";
                if (i == 0) {
                    sql.append(key);
                    sql.append(" ");
                    sql.append(order.getValue());
                } else {
                    sql.append(", ");
                    sql.append(key);
                    sql.append(" ");
                    sql.append(order.getValue());
                }
                i++;
            }
        }
        return this.getResultList(sql.toString(), "getResultListExportAccessLogs", parameter);
    }

    /**
     * set Param Cast
     *
     * @param dateFrom
     * @param dateTo
     * @param searchLocal
     * @param sql
     * @param parameter
     */
    private void setParamCast(String dateFrom, String dateTo, String searchLocal, StringBuilder sql,
            Map<String, Object> parameter) {
        if (!StringUtils.isEmpty(dateFrom)) {
            sql.append("AND CAST(acl.content ->> 'date_time' AS date) >= :dateFrom ");
            parameter.put(DATEFROM_KEY, dateFrom);
        }
        if (!StringUtils.isEmpty(dateFrom) && !StringUtils.isEmpty(dateTo)) {
            sql.append("AND ");
        }
        if (!StringUtils.isEmpty(dateTo)) {
            sql.append("CAST(acl.content ->> 'date_time' AS date) <= :dateTo ");
            parameter.put(DATETO_KEY, dateTo);
        }
        if (!StringUtils.isEmpty(searchLocal)) {
            sql.append("AND (acl.\"content\" ->> 'account_name') LIKE :searchLocal ");
            sql.append("OR (acl.\"content\" ->> 'ip_address') LIKE :searchLocal ");
            sql.append("OR (acl.\"content\" ->> 'entity_id') LIKE :searchLocal ");
            parameter.put(SEARCH_LOCAL_KEY, searchLocal);
        }
    }

    /**
     * count access logs
     *
     * @param dateFrom : date form of API count access logs
     * @param dateTo : date to of API count access logs
     * @param searchLocal : search local of API count access logs
     * @return Long : param out of API count access logs
     */
    @Override
    public Long countAccessLogs(String dateFrom, String dateTo, String searchLocal,
            List<FilterConditionsDTO> filterConditions) {
        StringBuilder sql = new StringBuilder();
        Map<String, Object> parameter = new HashMap<>();
        sql.append("SELECT COUNT(1) ");
        sql.append(FROM_TABLE);
        sql.append(WHERE);
        if (!StringUtils.isEmpty(dateFrom) || !StringUtils.isEmpty(dateTo)) {
            sql.append("AND (");
        }
        if (!StringUtils.isEmpty(dateFrom)) {
            sql.append(" CAST(acl.content ->> 'date_time' AS date) >= :dateFrom ");
            parameter.put(DATEFROM_KEY, dateFrom);
        }
        if (!StringUtils.isEmpty(dateFrom) && !StringUtils.isEmpty(dateTo)) {
            sql.append("AND");
        }
        if (!StringUtils.isEmpty(dateTo)) {
            sql.append(" CAST(acl.content ->> 'date_time' AS date) <= :dateTo ");
            parameter.put(DATETO_KEY, dateTo);
        }
        if (!StringUtils.isEmpty(dateFrom) || !StringUtils.isEmpty(dateTo)) {
            sql.append(") ");
        }
        if (!StringUtils.isEmpty(searchLocal)) {
            sql.append(LIKE_QUERY);
            parameter.put(SEARCH_LOCAL_KEY, searchLocal);
        }

        if (filterConditions != null && !filterConditions.isEmpty()) {
            conditionFilter(filterConditions, sql);
        }
        Object count = this.getSingleResult(sql.toString(), parameter);
        return Long.parseLong(count.toString());
    }

}
