package jp.co.softbrain.esales.employees.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.util.CollectionUtils;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.repository.EmployeesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom;
import jp.co.softbrain.esales.employees.service.EmployeeSyncQuickSightService;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSyncQuickSightDTO;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Service implementation for {@link EmployeeSyncQuickSightService}
 *
 * @author tongminhcuong
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeeSyncQuickSightServiceImpl implements EmployeeSyncQuickSightService {

    private static final int EMPLOYEE_STATUS_DEFAULT = 0;
    private static final int REGISTER_ACTION = 1;
    private static final int DELETE_ACTION = 2;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private EmployeesRepositoryCustom employeesRepositoryCustom;

    @Autowired
    private EmployeesRepository employeesRepository;

    /**
     * @see EmployeeSyncQuickSightService#getEmployeesSyncQuickSight(List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeeSyncQuickSightDTO> getEmployeesSyncQuickSight(List<Long> employeeIds) {
        // 1. Find list of employees
        Long quickSightPackageId = applicationProperties.getQuickSightPackageId();

        List<EmployeeSyncQuickSightDTO> employeeSyncQuickSightList = employeesRepositoryCustom
                .findEmployeesSyncQuickSight(employeeIds, quickSightPackageId);

        // group by employee_id
        Map<Long, EmployeeSyncQuickSightDTO> employeeSyncQuickSightMap = employeeSyncQuickSightList.stream()
                .collect(Collectors.toMap(
                        /* keyMapper */
                        EmployeeSyncQuickSightDTO::getEmployeeId,
                        /* valueMapper */
                        employee -> {
                            List<Long> packageIds = new ArrayList<>();
                            packageIds.add(employee.getPackageId());
                            employee.setSummaryPackageId(packageIds);
                            return employee;
                        },
                        /* mergeFunction */
                        (emp1, emp2) -> {
                            if (!emp1.getSummaryPackageId().contains(emp2.getPackageId())) {
                                emp1.getSummaryPackageId().add(emp2.getPackageId());
                            }
                            return emp1;
                        }));

        // 2. Build response
        employeeSyncQuickSightMap.values()
                .forEach(employee -> {
                    Integer action = judgeQuickSightAction(employee);
                    employee.setAction(action);
                    employee.setIsAccountQuicksight(null); // json ignore
                    employee.setPackageId(null); // json ignore
                });

        return employeeSyncQuickSightMap.values().stream()
                .filter(employee -> employee.getAction() != null)
                .collect(Collectors.toList());
    }

    /**
     * @see EmployeeSyncQuickSightService#updateUserQuickSightStatus(List, Boolean)
     */
    @Override
    @Transactional
    public List<Long> updateUserQuickSightStatus(List<Long> employeeIds, Boolean isAccountQuicksight) {
        if (CollectionUtils.isNullOrEmpty(employeeIds)) {
            throw new CustomRestException("Param [employeeIds] is null.",
                    CommonUtils.putError("employees", Constants.RIQUIRED_CODE));
        }
        if (isAccountQuicksight == null) {
            throw new CustomRestException("Param [isAccountQuicksight] is null.",
                    CommonUtils.putError("employees", Constants.RIQUIRED_CODE));
        }
        employeesRepository.updateUserQuickSightStatus(employeeIds, isAccountQuicksight);
        return employeeIds;
    }

    /**
     * Judge action for response
     *
     * @param employee employee
     * @return action
     */
    private Integer judgeQuickSightAction(EmployeeSyncQuickSightDTO employee) {
        if (employee.getIsAccountQuicksight() == null || !employee.getIsAccountQuicksight()) {
            return REGISTER_ACTION;
        }
        if (employee.getEmployeeStatus() == EMPLOYEE_STATUS_DEFAULT) {
            if (!employee.getSummaryPackageId().contains(applicationProperties.getQuickSightPackageId())) {
                return DELETE_ACTION;
            } else {
                return null;
            }
        }
        return DELETE_ACTION;
    }
}
