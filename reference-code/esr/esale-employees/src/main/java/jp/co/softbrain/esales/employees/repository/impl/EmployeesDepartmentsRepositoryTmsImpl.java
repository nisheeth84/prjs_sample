package jp.co.softbrain.esales.employees.repository.impl;

import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepositoryTms;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TmsApi;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * TMS repository impl for EmployeesDepartments
 *
 * @author phamminhphu
 */
@Repository
public class EmployeesDepartmentsRepositoryTmsImpl implements EmployeesDepartmentsRepositoryTms {
    public static final String TABLE_NAME = "employees_departments";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TmsApi tmsApi;

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepositoryTms#findDepartmentWithEmployeeId(java.lang.Long,
     *      java.lang.String)
     */
    public String findDepartmentWithEmployeeId(Long employeeId, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" dep.department_id, dep.department_name, ");
        sql.append("pos.position_id , pos.position_name :: TEXT , pos.position_order ");
        sql.append(", emp.employee_id, emp.employee_surname, emp.employee_name");
        sql.append(Constants.FROM).append(concat(tenantId, TABLE_NAME)).append(" ed ");
        sql.append(Constants.LEFT_JOIN).append(concat(tenantId, "Departments"));
        sql.append(" dep ON dep.department_id = ed.department_id ");
        sql.append(Constants.LEFT_JOIN).append(concat(tenantId, "Positions "));
        sql.append(" pos ON pos.position_id = ed.position_id ");
        sql.append(Constants.LEFT_JOIN).append(concat(tenantId, "Employees"));
        sql.append(" emp ON emp.employee_id = ed.manager_id ");
        sql.append(Constants.WHERE).append(" ed.employee_id = ? ");
        sql.append(Constants.ORDER_BY).append(" pos.position_order ASC, dep.department_order");

        JSONObject result = tmsApi.select(transID, sql.toString(), employeeId);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findDepartmentWithEmployeeId",
                            Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepositoryTms#findEmployeeIdsWithDepartmentIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public String findEmployeeIdsWithDepartmentIds(List<Long> departmentIds, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" ed.employee_id ").append(Constants.AS)
                .append(ConstantsEmployees.EMPLOYEE_ID);
        sql.append(Constants.FROM).append(concat(tenantId, TABLE_NAME)).append(" ed ");
        sql.append(Constants.WHERE).append(" ed.department_Id IN ? ");

        JSONObject result = tmsApi.select(transID, sql.toString(), departmentIds);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findEmployeeIdsWithDepartmentIds",
                            Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepositoryTms#findManagerIdsWithEmployeeIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public String findManagerIdsWithEmployeeIds(List<Long> employeeIds, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" ed.manager_Id ").append(Constants.AS)
                .append(ConstantsEmployees.MANAGER_ID);
        sql.append(Constants.FROM).append(concat(tenantId, TABLE_NAME)).append(" ed ");
        sql.append(Constants.WHERE).append("ed.employee_Id IN ? ");

        JSONObject result = tmsApi.select(transID, sql.toString(), employeeIds);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findManagerIdsWithEmployeeIds",
                            Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepositoryTms#findEmployeeIdsWithManagerIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public String findEmployeeIdsWithManagerIds(List<Long> managerIds, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" ed.employee_Id ").append(Constants.AS)
                .append(ConstantsEmployees.EMPLOYEE_ID);
        sql.append(Constants.FROM).append(concat(tenantId, TABLE_NAME)).append(" ed ");
        sql.append(Constants.WHERE).append(" ed.manager_Id IN ?");

        JSONObject result = tmsApi.select(transID, sql.toString(), managerIds);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findEmployeeIdsWithManagerIds",
                            Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

}
