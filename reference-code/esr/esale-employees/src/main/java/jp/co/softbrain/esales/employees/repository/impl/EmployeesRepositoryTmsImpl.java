package jp.co.softbrain.esales.employees.repository.impl;

import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryTms;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TmsApi;
import jp.co.softbrain.esales.utils.CommonUtils;

@Repository
public class EmployeesRepositoryTmsImpl implements EmployeesRepositoryTms {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TmsApi tmsApi;

    public static final String TABLE_NAME = "employees";

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryTms#findAllWithEmployeeIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public String findAllWithEmployeeIds(List<Long> employeeIds, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        StringBuilder sql = new StringBuilder();
        sql.append(
                Constants.SELECT)
        .append(" employee_id ")
        .append(" , to_char( created_date, 'YYYY-MM-DD\"T\"HH24:MI:SS.US\"Z\"' ) AS created_date ")
        .append(" , created_user ")
        .append(" , to_char( updated_date, 'YYYY-MM-DD\"T\"HH24:MI:SS.US\"Z\"' ) AS updated_date ")
        .append(" , updated_user ")
        .append(" , cellphone_number")
        .append(" , email ")
        .append(" , employee_data :: TEXT ")
        .append(" , employee_name ")
        .append(" , employee_name_kana ")
        .append(" , employee_status ")
        .append(" , employee_surname ")
        .append(" , employee_surname_kana ")
        .append(" , format_date_id ")
        .append(" , is_account_quicksight ")
        .append(" , is_admin ")
        .append(" , is_display_first_screen ")
        .append(" , language_id ")
        .append(" , photo_file_name ")
        .append(" , photo_file_path ")
        .append(" , telephone_number ")
        .append(" , timezone_id ")
        .append(" , user_id ")
                .append(Constants.FROM)
        .append(concat(tenantId, TABLE_NAME))
                .append(Constants.WHERE)
        .append("  employee_id IN ? AND employee_status = ? ");

        JSONObject result = tmsApi.select(transID, sql.toString(), employeeIds, 0);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findAllWithEmployeeIds", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryTms#findStaffWithManagerId(java.lang.Long,
     *      java.lang.String)
     */
    @Override
    public String findStaffWithManagerId(Long employeeId, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" emp.employee_id ");
        sql.append(" , emp.employee_surname, emp.employee_name ");
        sql.append(" , emp.employee_surname_kana, emp.employee_name_kana ");
        sql.append(Constants.FROM).append(concat(tenantId, "Employees_Departments")).append(" empd ");
        sql.append(Constants.INNER_JOIN).append(concat(tenantId, TABLE_NAME));
        sql.append(" emp ON emp.employee_Id = empd.employee_Id ");
        sql.append(Constants.WHERE).append("  empd.manager_Id = ? ");

        JSONObject result = tmsApi.select(transID, sql.toString(), employeeId);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findStaffWithManagerId", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryTms#getEmployeeIdsCreatedRelation(java.lang.String, java.util.List, java.util.List)
     */
    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.repository.ServiceRelationRepositoryTms#getEmployeeIdsCreatedRelation(java.lang.String, java.util.List, java.util.List)
     */
    @Override
    public String getEmployeeIdsCreatedRelation(String transID, List<Long> newRecordIds,
            List<CustomFieldsInfoOutDTO> asList) {
        String schema = jwtTokenUtil.getTenantIdFromToken();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT employee_id ");
        sql.append("FROM ");
        sql.append(concat(schema, ConstantsEmployees.TABLE_NAME_EMPLOYEES));
        sql.append(" WHERE employee_id IN ? ");
        asList.forEach(field -> {
            if (!field.getIsDefault()) {
                sql.append("AND  employee_data ->> '" + field.getFieldName() + "' IS NOT NULL ");
                sql.append("AND employee_data ->> '" + field.getFieldName() + "' != '[]' ");
            } else {
                sql.append("AND " + field.getFieldName() + " IS NOT NULL ");
                sql.append("AND " + field.getFieldName() + " != '[]' ");
            }
        });
        JSONObject result = tmsApi.select(transID, sql.toString(), newRecordIds);
        String jsonResult = "";
        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
            return jsonResult;
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot get Employee Id", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.repository.ServiceRelationRepositoryTms#findOneEmployeeDTO(java.lang.String, java.lang.Long)
     */
    @Override
    public String findOneEmployeeDTO(String transID, Long employeeId) {
        String schema = jwtTokenUtil.getTenantIdFromToken();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT employee_id ")
        .append(" , to_char( created_date, 'YYYY-MM-DD\"T\"HH24:MI:SS.US\"Z\"' ) AS created_date ")
        .append(" , created_user ")
        .append(" , to_char( updated_date, 'YYYY-MM-DD\"T\"HH24:MI:SS.US\"Z\"' ) AS updated_date ")
        .append(" , updated_user ")
        .append(" , cellphone_number")
        .append(" , email ")
        .append(" , employee_data :: TEXT ")
        .append(" , employee_name ")
        .append(" , employee_name_kana ")
        .append(" , employee_status ")
        .append(" , employee_surname ")
        .append(" , employee_surname_kana ")
        .append(" , language_id ")
        .append(" , photo_file_name ")
        .append(" , photo_file_path ")
        .append(" , telephone_number ")
        .append(" , timezone_id ")
        .append(" , format_date_id ")
        .append(" , is_account_quicksight ")
        .append(" , is_admin ")
        .append(" , is_display_first_screen ")
        .append(" , user_id ")
        .append("FROM ")
        .append(concat(schema, ConstantsEmployees.TABLE_NAME_EMPLOYEES))
        .append(" WHERE employee_id = ?");
        JSONObject result = tmsApi.select(transID, sql.toString(), employeeId);
        String jsonResult = "";
        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
            return jsonResult;
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot get Employee Id", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }
    }
}
