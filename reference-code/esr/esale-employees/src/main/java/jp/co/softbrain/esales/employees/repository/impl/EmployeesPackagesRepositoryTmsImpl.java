package jp.co.softbrain.esales.employees.repository.impl;

import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepositoryTms;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TmsApi;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Repository for EmployeesPackages
 *
 * @author phamminhphu
 */
@Repository
public class EmployeesPackagesRepositoryTmsImpl implements EmployeesPackagesRepositoryTms {
    private static final String TABLE_NAME = "employees_packages";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TmsApi tmsApi;

    @Override
    public String findEmployeesPackagesIdsByEmployeeIds(List<Long> employeeIds, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        String sql = Constants.SELECT + " ep." + ConstantsEmployees.EMPLOYEES_PACKAGES_ID
                + Constants.FROM + concat(tenantId,
                        TABLE_NAME)
                + " ep "
                + Constants.WHERE
                + " ep.employee_id IN ? ";

        JSONObject result = tmsApi.select(transID, sql, employeeIds);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot findEmployeesPackagesIdsByEmployeeIds",
                            Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepositoryTms#deleteEmployeePackageByEmployeeId(java.lang.Long,
     *      java.lang.String)
     */
    @Override
    public boolean deleteEmployeePackageByEmployeeId(Long employeeId, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        StringBuilder sql = new StringBuilder();
        sql.append(Constants.DELETE).append(Constants.FROM).append(concat(tenantId, TABLE_NAME));
        sql.append(" ep ").append(Constants.WHERE).append(" ep.employee_id = ? ");

        JSONObject result = tmsApi.execute(transID, sql.toString(), employeeId);
        boolean response = isSuccess(result);
        if (!response) {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot deleteEmployeePackageByEmployeeId",
                            Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepositoryTms#getSumEmployeePackageByIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public String getSumEmployeePackageByIds(List<Long> employeePackageIds, String transID) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();

        StringBuilder sql = new StringBuilder();
        sql.append(Constants.SELECT).append(" ep.package_Id , COUNT(ep.package_Id) AS countPackageId ");
        sql.append(Constants.FROM).append(concat(tenantId, TABLE_NAME)).append(" ep ");
        sql.append(Constants.GROUP_BY).append(" ep.package_Id ");

        JSONObject result = tmsApi.select(transID, sql.toString(), employeePackageIds);
        String jsonResult = "";

        if (isSuccess(result)) {
            jsonResult = result.optString(Constants.TMS.RESULTS);
        } else {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot getSumEmployeePackageByIds", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }

        return jsonResult;
    }

}
