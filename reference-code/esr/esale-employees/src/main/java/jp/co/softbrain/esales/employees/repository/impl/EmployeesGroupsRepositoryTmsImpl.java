package jp.co.softbrain.esales.employees.repository.impl;

import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryTms;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TmsApi;
import jp.co.softbrain.esales.utils.CommonUtils;

@Repository
@XRayEnabled
public class EmployeesGroupsRepositoryTmsImpl implements EmployeesGroupsRepositoryTms {
    private static final String EMPLOYEES_GROUP_MEMBERS = "Employees_Group_Members";
    private static final String EMPLOYEES_GROUPS = "Employees_Groups";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TmsApi tmsApi;

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryTms#findGroupWithEmployeeId(java.lang.Long,
     *      java.lang.String)
     */
    @Override
    public String findGroupWithEmployeeId(Long employeeId, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" empg.group_id, empg.group_name ");
        sql.append(Constants.FROM).append(concat(tenantId, EMPLOYEES_GROUP_MEMBERS)).append(" egm ");
        sql.append(
                Constants.INNER_JOIN)
                .append(concat(tenantId, EMPLOYEES_GROUPS))
                .append(" empg ON empg.group_id = egm.group_id");
        sql.append(Constants.WHERE).append(" egm.employee_id = ? ");

        JSONObject result = tmsApi.select(transID, sql.toString(), employeeId);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findGroupWithEmployeeId", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryTms#findEmployeeIdsWithGroupIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public String findEmployeeIdsWithGroupIds(List<Long> groupIds, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" eg.employee_Id ");
        sql.append(Constants.FROM).append(concat(tenantId, EMPLOYEES_GROUP_MEMBERS));
        sql.append(Constants.WHERE).append(" eg.group_Id IN ?");

        JSONObject result = tmsApi.select(transID, sql.toString(), groupIds);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findEmployeeIdsWithGroupIds", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

}
