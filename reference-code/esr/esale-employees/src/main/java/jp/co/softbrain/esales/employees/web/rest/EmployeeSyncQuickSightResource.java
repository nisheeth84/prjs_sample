package jp.co.softbrain.esales.employees.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeeSyncQuickSightService;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSyncQuickSightDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeesSyncQuickSightRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdateUserQuickSightStatusRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeesSyncQuickSightResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateUserQuickSightStatusResponse;

/**
 * Spring MVC RESTful Controller to handle for employee sync quick-sight
 *
 * @author tongminhcuong
 */
@RestController
@RequestMapping("/api")
public class EmployeeSyncQuickSightResource {

    @Autowired
    private EmployeeSyncQuickSightService employeeSyncQuickSightService;

    /**
     * Get list of employees that are synchronize quick-sight target
     *
     * @param request request
     * @return {@link GetEmployeesSyncQuickSightResponse}
     */
    @PostMapping(path = "/get-employees-sync-quick-sight", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeesSyncQuickSightResponse> getEmployeesSyncQuickSight(
            @RequestBody GetEmployeesSyncQuickSightRequest request) {

        List<EmployeeSyncQuickSightDTO> employees = employeeSyncQuickSightService
                .getEmployeesSyncQuickSight(request.getEmployeeIds());

        return ResponseEntity.ok(new GetEmployeesSyncQuickSightResponse(employees));
    }

    /**
     * Update QuickSight status for employees
     *
     * @param request request
     * @return {@link UpdateUserQuickSightStatusResponse}
     */
    @PutMapping(path = "/update-user-quick-sight-status", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateUserQuickSightStatusResponse> updateUserQuickSightStatus(
            @RequestBody UpdateUserQuickSightStatusRequest request) {

        List<Long> employeeIds = employeeSyncQuickSightService
                .updateUserQuickSightStatus(request.getEmployeeIds(), request.getIsAccountQuicksight());

        return ResponseEntity.ok(new UpdateUserQuickSightStatusResponse(employeeIds));
    }
}
