package jp.co.softbrain.esales.employees.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetSelectedOrganizationInfoRequest;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoOutDTO;

/**
 * SelectedOrganizationInfoQuery class process GraphQL Query
 * 
 * @author chungochai
 *
 */
@RestController
@RequestMapping("/api")
public class GetSelectedOrganizationInfoResource {

    @Autowired
    private EmployeesCommonService employeesCommonService;

    /**
     * method get Info Selected Organization
     * 
     * @param employeeId   data need for get data
     * @param departmentId data need for get data
     * @param groupId      data need for get data
     * @return Info Selected Organization
     */
    @PostMapping(path = "/get-selected-organization-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SelectedOrganizationInfoOutDTO> getSelectedOrganizationInfo(
            @RequestBody GetSelectedOrganizationInfoRequest req) {
        List<Long> employeeId = req.getEmployeeId();
        List<Long> departmentId = req.getDepartmentId();
        List<Long> groupId = req.getGroupId();
        return ResponseEntity
                .ok(employeesCommonService.getSelectedOrganizationInfo(employeeId, departmentId, groupId, null));
    }
}
