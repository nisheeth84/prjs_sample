/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetGroupSearchConditionInfoRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetGroupSearchConditionInfoResponse;

/**
 * Get group search condition info Controler
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class GetGroupSearchConditionInfoResource {

    @Autowired
    private EmployeesGroupSearchConditionsService employeesGroupSearchConditions;

    /**
     * Get group and department by employeeIds
     * 
     * @param employeeIds
     *            - list employeeId to get
     * @return data response
     */
    @PostMapping(path = "/get-group-search-condition-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetGroupSearchConditionInfoResponse> getGroupAndDepartmentByEmployeeIds(
            @RequestBody GetGroupSearchConditionInfoRequest req) {
        GetGroupSearchConditionInfoResponse response = employeesGroupSearchConditions
                .getGroupSearchConditionInfo(req.getGroupId());
        return ResponseEntity.ok(response);
    }
}
